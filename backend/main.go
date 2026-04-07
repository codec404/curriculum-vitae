package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"gopkg.in/yaml.v3"
)

// ── Config cache ──────────────────────────────────────────────────────────────

type cache struct {
	mu      sync.RWMutex
	content string // raw JSON string from Konfig config content
	version int64
}

func (c *cache) set(content string, version int64) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.content = content
	c.version = version
	log.Printf("cache updated — version %d", version)
}

func (c *cache) get() (string, int64) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.content, c.version
}

// ── Konfig client ─────────────────────────────────────────────────────────────

type konfigClient struct {
	endpoint   string // e.g. https://konfig.org.in
	service    string
	configName string
	token      string
	cache      *cache
}

// pull fetches the latest active config over HTTP and stores it in the cache.
func (k *konfigClient) pull() error {
	reqURL := fmt.Sprintf(
		"%s/api/public/services/%s/configs/%s/latest",
		k.endpoint, k.service, k.configName,
	)
	req, _ := http.NewRequest(http.MethodGet, reqURL, nil)
	req.Header.Set("Authorization", "Bearer "+k.token)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("pull request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("pull returned %d: %s", resp.StatusCode, body)
	}

	var result struct {
		Config struct {
			Content string `json:"content"`
			Version int64  `json:"version"`
		} `json:"config"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return fmt.Errorf("pull decode failed: %w", err)
	}

	k.cache.set(result.Config.Content, result.Config.Version)
	return nil
}

// watch opens a WebSocket to Konfig and updates the cache on every push.
// Reconnects automatically with exponential back-off.
func (k *konfigClient) watch() {
	backoff := []time.Duration{1, 2, 4, 8, 16, 30}
	attempt := 0

	wsEndpoint := strings.Replace(k.endpoint, "https://", "wss://", 1)
	wsEndpoint = strings.Replace(wsEndpoint, "http://", "ws://", 1)
	wsURL := fmt.Sprintf("%s/ws/sdk/subscribe/%s?instance_id=portfolio-backend", wsEndpoint, k.service)

	for {
		log.Printf("ws: connecting to %s", wsURL)
		conn, _, err := websocket.DefaultDialer.Dial(
			wsURL,
			http.Header{"Authorization": {"Bearer " + k.token}},
		)
		if err != nil {
			wait := backoff[min(attempt, len(backoff)-1)]
			log.Printf("ws: connect failed (%v), retry in %s", err, wait*time.Second)
			attempt++
			time.Sleep(wait * time.Second)
			continue
		}

		attempt = 0
		log.Printf("ws: connected")

		for {
			_, msg, err := conn.ReadMessage()
			if err != nil {
				log.Printf("ws: read error (%v), reconnecting", err)
				conn.Close()
				break
			}

			var update struct {
				UpdateType string `json:"update_type"`
				Config     *struct {
					Content string `json:"content"`
					Version int64  `json:"version"`
				} `json:"config"`
			}
			if err := json.Unmarshal(msg, &update); err != nil {
				continue
			}
			if update.UpdateType == "HEARTBEAT_ACK" || update.Config == nil {
				continue
			}
			k.cache.set(update.Config.Content, update.Config.Version)
		}
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// ── HTTP server ───────────────────────────────────────────────────────────────

func profileHandler(c *cache, allowedOrigin string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// CORS — allow the portfolio frontend origin
		origin := r.Header.Get("Origin")
		if allowedOrigin == "*" || strings.EqualFold(origin, allowedOrigin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		content, version := c.get()
		if content == "" {
			http.Error(w, `{"error":"config not yet loaded"}`, http.StatusServiceUnavailable)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("X-Config-Version", fmt.Sprintf("%d", version))

		// Config may be stored as YAML or JSON — normalise to JSON
		var parsed interface{}
		if err := yaml.Unmarshal([]byte(content), &parsed); err != nil {
			http.Error(w, `{"error":"failed to parse config"}`, http.StatusInternalServerError)
			return
		}
		if err := json.NewEncoder(w).Encode(parsed); err != nil {
			log.Printf("encode error: %v", err)
		}
	}
}

// ── Entry point ───────────────────────────────────────────────────────────────

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func main() {
	endpoint   := getEnv("KONFIG_ENDPOINT",    "https://konfig.org.in")
	service    := getEnv("KONFIG_SERVICE",     "portfolio")
	configName := getEnv("KONFIG_CONFIG_NAME", "cp-profiles")
	token      := getEnv("KONFIG_TOKEN",       "")
	port       := getEnv("PORT",               "8091")
	allowedOrigin := getEnv("ALLOWED_ORIGIN",  "*")

	if token == "" {
		log.Fatal("KONFIG_TOKEN env var is required")
	}

	c := &cache{}
	client := &konfigClient{
		endpoint:   endpoint,
		service:    service,
		configName: configName,
		token:      token,
		cache:      c,
	}

	// Pull once on startup so the first request is never a cache miss
	log.Printf("pulling initial config from %s ...", endpoint)
	if err := client.pull(); err != nil {
		log.Printf("warn: initial pull failed (%v) — will retry via WebSocket", err)
	}

	// Keep cache live via WebSocket in background
	go client.watch()

	// HTTP
	mux := http.NewServeMux()
	mux.Handle("/api/profile", profileHandler(c, allowedOrigin))
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		_, version := c.get()
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"status":"ok","config_version":%d}`, version)
	})

	addr := ":" + port
	log.Printf("portfolio backend listening on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("server error: %v", err)
	}

	// Parse the portfolio frontend URL for CORS
	if allowedOrigin != "*" {
		u, err := url.Parse(allowedOrigin)
		if err == nil {
			log.Printf("CORS: allowing origin %s://%s", u.Scheme, u.Host)
		}
	}
}
