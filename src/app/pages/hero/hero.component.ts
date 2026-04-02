import {
  Component,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  NgZone,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as THREE from 'three';
import gsap from 'gsap';
import { MagneticBtnComponent } from '../../shared/components/magnetic-btn/magnetic-btn.component';
import { HERO_STATS } from '../../data/portfolio.data';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule, MagneticBtnComponent],
  template: `
    <section class="hero">
      <!-- Three.js WebGL canvas -->
      <canvas #webgl class="webgl-canvas" aria-hidden="true"></canvas>

      <!-- Content -->
      <div class="hero-content">
        <div class="hero-inner">
          <p #greeting class="greeting font-mono">
            <span class="text-cyan-400">hello, world.</span>
            <span class="cursor-blink font-mono">_</span>
          </p>

          <h1 #name class="hero-name">
            Saptarshi<br />
            <span class="text-gradient">Ghosh</span>
          </h1>

          <p #role class="hero-role font-mono">
            Software Engineer
            <span class="sep text-text-muted"> / </span>
            Systems Builder
            <span class="sep text-text-muted"> / </span>
            Competitive Programmer
          </p>

          <p #bio class="hero-bio">
            I build distributed systems, wrestle with low-level abstractions,
            and occasionally rank in the top&nbsp;200 globally in competitive programming.
            Currently shaping developer tooling at&nbsp;
            <span class="text-cyan-400 font-mono">Zomato</span>.
          </p>

          <div #cta class="hero-ctas">
            <app-magnetic-btn>
              <a routerLink="/work" class="btn-primary font-mono">
                View my work
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </app-magnetic-btn>
            <app-magnetic-btn>
              <a routerLink="/contact" class="btn-ghost font-mono">Get in touch</a>
            </app-magnetic-btn>
          </div>

          <!-- Quick stats -->
          <div #stats class="hero-stats">
            @for (stat of quickStats; track stat.label) {
              <div class="stat">
                <span class="stat-value font-mono text-gradient">{{ stat.value }}</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div #scroll class="scroll-hint font-mono">
        <span>scroll</span>
        <div class="scroll-line"></div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      overflow: hidden;
    }
    .webgl-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0.55;
    }
    .hero-content {
      position: relative;
      z-index: 10;
      width: 100%;
      padding: 8rem 2rem 4rem;
    }
    .hero-inner {
      max-width: 1100px;
      margin: 0 auto;
    }
    .greeting {
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      color: #22d3ee;
      margin-bottom: 1.5rem;
      opacity: 0;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .cursor-blink {
      animation: blink 1s step-end infinite;
      color: #22d3ee;
    }
    @keyframes blink { 50% { opacity: 0; } }

    .hero-name {
      font-size: clamp(3.5rem, 9vw, 7.5rem);
      font-weight: 900;
      line-height: 1;
      letter-spacing: -0.03em;
      color: #e8eaf0;
      margin-bottom: 1.5rem;
      opacity: 0;
    }
    .hero-role {
      font-size: clamp(0.8rem, 1.5vw, 1rem);
      color: #8892a4;
      letter-spacing: 0.05em;
      margin-bottom: 2rem;
      opacity: 0;
    }
    .sep { margin: 0 0.5rem; }
    .hero-bio {
      font-size: clamp(0.95rem, 1.5vw, 1.1rem);
      color: #8892a4;
      line-height: 1.8;
      max-width: 540px;
      margin-bottom: 3rem;
      opacity: 0;
    }
    .hero-ctas {
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
      margin-bottom: 4rem;
      opacity: 0;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.85rem 2rem;
      background: #22d3ee;
      color: #080c12;
      font-size: 0.85rem;
      font-weight: 700;
      border-radius: 8px;
      text-decoration: none;
      letter-spacing: 0.02em;
      transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }
    .btn-primary:hover {
      background: #06b6d4;
      box-shadow: 0 0 30px rgba(34,211,238,0.35);
    }
    .btn-ghost {
      display: inline-flex;
      align-items: center;
      padding: 0.85rem 2rem;
      border: 1px solid rgba(34,211,238,0.4);
      color: #22d3ee;
      font-size: 0.85rem;
      border-radius: 8px;
      text-decoration: none;
      transition: background 0.2s ease, border-color 0.2s ease;
    }
    .btn-ghost:hover {
      background: rgba(34,211,238,0.08);
      border-color: #22d3ee;
    }
    .hero-stats {
      display: flex;
      gap: 3rem;
      flex-wrap: wrap;
      opacity: 0;
      padding-top: 1rem;
      border-top: 1px solid #1a2235;
    }
    .stat { display: flex; flex-direction: column; gap: 0.3rem; }
    .stat-value { font-size: 1.6rem; font-weight: 800; }
    .stat-label { font-size: 0.75rem; color: #8892a4; letter-spacing: 0.05em; }

    .scroll-hint {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: #4a5568;
      text-transform: uppercase;
      opacity: 0;
    }
    .scroll-line {
      width: 1px;
      height: 50px;
      background: linear-gradient(to bottom, #22d3ee, transparent);
      animation: scrollDown 1.8s ease-in-out infinite;
    }
    @keyframes scrollDown {
      0%, 100% { transform: scaleY(0); transform-origin: top; }
      50% { transform: scaleY(1); transform-origin: top; }
    }
  `],
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('webgl') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('greeting') greetingRef!: ElementRef;
  @ViewChild('name') nameRef!: ElementRef;
  @ViewChild('role') roleRef!: ElementRef;
  @ViewChild('bio') bioRef!: ElementRef;
  @ViewChild('cta') ctaRef!: ElementRef;
  @ViewChild('stats') statsRef!: ElementRef;
  @ViewChild('scroll') scrollRef!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private particles!: THREE.Points;
  private animId = 0;
  private mouse = new THREE.Vector2();
  private zone = inject(NgZone);
  private observer!: IntersectionObserver;

  readonly quickStats = HERO_STATS;

  ngAfterViewInit(): void {
    // Three.js render loop and mouse tracking run outside Angular's zone
    // so Zone.js doesn't trigger change detection on every RAF frame
    this.zone.runOutsideAngular(() => {
      this.initThree();
      window.addEventListener('mousemove', this.onMouseMove.bind(this));
    });
    this.animateEntrance();
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    // Lock to 1 — on retina screens devicePixelRatio=2 means 4× the pixels to shade per frame
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // Particle field — 1000 is enough for visual density without GPU pressure
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      // Mostly cyan, some violet
      const isCyan = Math.random() > 0.35;
      colors[i * 3] = isCyan ? 0.13 : 0.51;
      colors[i * 3 + 1] = isCyan ? 0.83 : 0.47;
      colors[i * 3 + 2] = isCyan ? 0.93 : 0.98;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);

    window.addEventListener('resize', this.onResize.bind(this));

    // Pause rendering when the hero section scrolls out of view
    this.observer = new IntersectionObserver(
      ([entry]) => { entry.isIntersecting ? this.renderLoop() : cancelAnimationFrame(this.animId); },
      { threshold: 0 }
    );
    this.observer.observe(canvas);
    this.renderLoop();
  }

  private renderLoop(): void {
    this.animId = requestAnimationFrame(() => this.renderLoop());
    this.particles.rotation.y += 0.0004;
    this.particles.rotation.x += 0.0001;
    this.particles.rotation.y += this.mouse.x * 0.00008;
    this.particles.rotation.x += this.mouse.y * 0.00008;
    this.renderer.render(this.scene, this.camera);
  }

  private onMouseMove(e: MouseEvent): void {
    this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  }

  private onResize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }

  private animateEntrance(): void {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(this.greetingRef.nativeElement, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .to(this.nameRef.nativeElement, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
      .to(this.roleRef.nativeElement, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .to(this.bioRef.nativeElement, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .to(this.ctaRef.nativeElement, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .to(this.statsRef.nativeElement, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      .to(this.scrollRef.nativeElement, { opacity: 1, duration: 0.8 }, '-=0.2');
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
    this.observer?.disconnect();
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('resize', this.onResize.bind(this));
    this.renderer?.dispose();
  }
}
