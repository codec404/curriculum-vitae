import { Component, AfterViewInit, inject, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectService } from '../../core/services/project.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="contact-section">
      <div class="section-container">

        <div class="section-header" data-reveal>
          <span class="section-label">// 04. contact</span>
          <h2 class="section-title">Let's connect</h2>
          <p class="section-sub">
            Open to full-time opportunities, collaborations, and interesting conversations.
          </p>
        </div>

        <div class="contact-grid">

          <!-- Left: CP Profiles + socials -->
          <div class="left-col">

            <!-- CP Profiles -->
            <div data-reveal>
              <p class="col-label font-mono">// competitive programming</p>
              <div class="cp-grid">
                @for (profile of cpProfiles(); track profile.platform) {
                  <a
                    [href]="profile.url"
                    target="_blank"
                    rel="noopener"
                    class="cp-card"
                    [style.--accent]="profile.color"
                  >
                    <div class="cp-icon font-mono" [style.color]="profile.color">
                      {{ profile.icon }}
                    </div>
                    <div class="cp-info">
                      <p class="cp-platform">{{ profile.platform }}</p>
                      <p class="cp-handle font-mono">{{ profile.handle }}</p>
                      <div class="cp-stats">
                        <span class="cp-rating font-mono" [style.color]="profile.color">
                          {{ profile.rating }}
                        </span>
                        <span class="cp-rank" [style.color]="profile.color">{{ profile.rank }}</span>
                      </div>
                    </div>
                    <svg class="cp-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M7 17L17 7M17 7H7M17 7v10"/>
                    </svg>
                  </a>
                }
              </div>
            </div>

            <!-- Social links -->
            <div class="socials" data-reveal>
              <p class="col-label font-mono">// find me online</p>
              <div class="social-links">
                @for (social of socials; track social.label) {
                  <a [href]="social.url" target="_blank" rel="noopener" class="social-link">
                    <span class="social-icon" [innerHTML]="social.svg"></span>
                    <span class="font-mono text-sm">{{ social.label }}</span>
                    <svg class="ext-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M7 17L17 7M17 7H7M17 7v10"/>
                    </svg>
                  </a>
                }
              </div>
            </div>
          </div>

          <!-- Right: Contact form -->
          <div class="right-col" data-reveal>
            <div class="form-card">
              <p class="form-title font-mono">// send a message</p>
              <form class="contact-form" (ngSubmit)="onSubmit()" #contactForm="ngForm">
                <div class="field">
                  <label class="field-label font-mono">Name</label>
                  <input
                    type="text"
                    class="field-input font-mono"
                    placeholder="Your name"
                    [(ngModel)]="form.name"
                    name="name"
                    required
                  />
                </div>
                <div class="field">
                  <label class="field-label font-mono">Email</label>
                  <input
                    type="email"
                    class="field-input font-mono"
                    placeholder="your@email.com"
                    [(ngModel)]="form.email"
                    name="email"
                    required
                  />
                </div>
                <div class="field">
                  <label class="field-label font-mono">Message</label>
                  <textarea
                    class="field-input field-textarea font-mono"
                    placeholder="What's on your mind?"
                    [(ngModel)]="form.message"
                    name="message"
                    rows="5"
                    required
                  ></textarea>
                </div>
                <button type="submit" class="submit-btn font-mono" [disabled]="sending || sent">
                  @if (sending) {
                    <span class="spinner"></span>
                    <span>Sending…</span>
                  } @else if (sent) {
                    <span>Sent — check your inbox ✓</span>
                  } @else {
                    <span>Send message</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  }
                </button>
                @if (error) {
                  <p class="error-msg font-mono">Something went wrong — try emailing directly.</p>
                }
              </form>

              <div class="direct-email">
                <span class="text-text-muted text-sm">or email directly:</span>
                <a href="mailto:saptarshimemari072@gmail.com" class="email-link font-mono">
                  saptarshimemari072&#64;gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-section {
      padding: 8rem 0 6rem;
      min-height: 100vh;
    }
    .section-header { margin-bottom: 4rem; }
    .section-sub { font-size: 1rem; color: #8892a4; max-width: 460px; }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
    }
    @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }

    .col-label {
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      color: #4a5568;
      text-transform: uppercase;
      margin-bottom: 1rem;
      display: block;
    }

    /* CP Cards */
    .cp-grid { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2.5rem; }
    .cp-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #0e1420;
      border: 1px solid #1a2235;
      border-radius: 10px;
      padding: 1rem 1.25rem;
      text-decoration: none;
      transition: border-color 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease;
      position: relative;
      overflow: hidden;
    }
    .cp-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--accent, #22d3ee) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .cp-card:hover {
      border-color: var(--accent, #22d3ee);
      transform: translateX(4px);
      box-shadow: 0 4px 24px rgba(0,0,0,0.3);
    }
    .cp-card:hover::before { opacity: 0.04; }
    .cp-icon {
      font-size: 1rem;
      font-weight: 800;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.04);
      border-radius: 8px;
      flex-shrink: 0;
      position: relative;
    }
    .cp-info { flex: 1; position: relative; }
    .cp-platform { font-size: 0.9rem; font-weight: 600; color: #e8eaf0; margin-bottom: 0.1rem; }
    .cp-handle { font-size: 0.72rem; color: #8892a4; margin-bottom: 0.35rem; }
    .cp-stats { display: flex; align-items: center; gap: 0.75rem; }
    .cp-rating { font-size: 1rem; font-weight: 800; }
    .cp-rank { font-size: 0.72rem; font-weight: 600; opacity: 0.85; }
    .cp-arrow { color: #4a5568; position: relative; transition: color 0.2s, transform 0.2s; }
    .cp-card:hover .cp-arrow { color: #e8eaf0; transform: translate(2px, -2px); }

    /* Social links */
    .social-links { display: flex; flex-direction: column; gap: 0.5rem; }
    .social-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: #0e1420;
      border: 1px solid #1a2235;
      border-radius: 8px;
      text-decoration: none;
      color: #8892a4;
      font-size: 0.85rem;
      transition: color 0.2s, border-color 0.2s;
    }
    .social-link:hover { color: #22d3ee; border-color: rgba(34,211,238,0.3); }
    .ext-icon { margin-left: auto; opacity: 0.5; }

    /* Form */
    .form-card {
      background: #0e1420;
      border: 1px solid #1a2235;
      border-radius: 14px;
      padding: 2rem;
    }
    .form-title {
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      color: #22d3ee;
      text-transform: uppercase;
      margin-bottom: 1.75rem;
    }
    .contact-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .field { display: flex; flex-direction: column; gap: 0.5rem; }
    .field-label { font-size: 0.72rem; color: #8892a4; letter-spacing: 0.1em; text-transform: uppercase; }
    .field-input {
      background: rgba(255,255,255,0.03);
      border: 1px solid #1a2235;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: #e8eaf0;
      font-size: 0.85rem;
      outline: none;
      transition: border-color 0.2s ease;
      width: 100%;
    }
    .field-input::placeholder { color: #4a5568; }
    .field-input:focus { border-color: rgba(34,211,238,0.5); }
    .field-textarea { resize: vertical; min-height: 120px; }
    .submit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.85rem;
      background: #22d3ee;
      color: #080c12;
      font-size: 0.85rem;
      font-weight: 700;
      border: none;
      border-radius: 8px;
      cursor: none;
      transition: background 0.2s ease, box-shadow 0.2s ease;
      margin-top: 0.25rem;
    }
    .submit-btn:hover:not(:disabled) {
      background: #06b6d4;
      box-shadow: 0 0 30px rgba(34,211,238,0.3);
    }
    .submit-btn:disabled { opacity: 0.7; }
    .direct-email {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid #1a2235;
      flex-wrap: wrap;
    }
    .email-link {
      font-size: 0.8rem;
      color: #22d3ee;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s;
    }
    .email-link:hover { border-color: #22d3ee; }
    .spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(8,12,18,0.3);
      border-top-color: #080c12;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      flex-shrink: 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-msg {
      font-size: 0.72rem;
      color: #f87171;
      margin-top: 0.5rem;
      text-align: center;
    }
  `],
})
export class ContactComponent implements AfterViewInit {
  private el = inject(ElementRef).nativeElement;
  private projectService = inject(ProjectService);
  readonly cpProfiles = this.projectService.cpProfiles;

  form = { name: '', email: '', message: '' };
  sent = false;
  sending = false;
  error = false;

  private readonly FORMSPREE = 'https://formspree.io/f/xnjobnjz';
  private cdr = inject(ChangeDetectorRef);

  socials = [
    {
      label: 'saptarshimemari072@gmail.com',
      url: 'mailto:saptarshimemari072@gmail.com',
      svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/saptarshi-ghosh-nitdgp/',
      svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
    },
    {
      label: 'GitHub',
      url: 'https://github.com/codec404',
      svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`,
    },
  ];

  async onSubmit(): Promise<void> {
    this.sending = true;
    this.error = false;
    this.cdr.markForCheck();
    try {
      const res = await fetch(this.FORMSPREE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(this.form),
      });
      if (res.ok) {
        this.sent = true;
        this.form = { name: '', email: '', message: '' };
        setTimeout(() => { this.sent = false; this.cdr.markForCheck(); }, 5000);
      } else {
        this.error = true;
      }
    } catch {
      this.error = true;
    } finally {
      this.sending = false;
      this.cdr.markForCheck();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.el.querySelectorAll('[data-reveal]').forEach((el: Element) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      });
    }, 100);
  }
}
