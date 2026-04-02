import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  signal,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import gsap from 'gsap';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav [class.scrolled]="scrolled()" class="navbar">
      <div class="nav-inner">
        <!-- Logo -->
        <a routerLink="/" class="logo font-mono">
          <span class="text-cyan-400">SG</span><span class="text-text-secondary">.</span>
        </a>

        <!-- Links -->
        <ul class="nav-links">
          @for (link of navLinks; track link.path) {
            <li>
              <a
                [routerLink]="link.path"
                [class.active]="activeRoute() === link.path"
                class="nav-link font-mono"
              >
                <span class="link-index text-cyan-400">0{{ $index + 1 }}.</span>
                {{ link.label }}
              </a>
            </li>
          }
        </ul>

        <!-- Resume CTA -->
        <a
          href="https://drive.google.com/file/d/1DvJQXy7lFUsb5WAbvLCKJ1uukLYV6428/view"
          target="_blank"
          rel="noopener"
          class="resume-btn font-mono"
        >
          Resume
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 1.5rem 2.5rem;
      transition: background 0.3s ease, padding 0.3s ease, backdrop-filter 0.3s ease;
    }
    .navbar.scrolled {
      background: rgba(8, 12, 18, 0.85);
      backdrop-filter: blur(16px);
      padding: 1rem 2.5rem;
      border-bottom: 1px solid rgba(26, 34, 53, 0.8);
    }
    .nav-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    .logo {
      font-size: 1.4rem;
      font-weight: 700;
      text-decoration: none;
      letter-spacing: -0.02em;
      margin-right: auto;
    }
    .nav-links {
      display: flex;
      gap: 0.25rem;
      list-style: none;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
      color: #8892a4;
      text-decoration: none;
      border-radius: 6px;
      transition: color 0.2s ease, background 0.2s ease;
    }
    .nav-link:hover, .nav-link.active {
      color: #22d3ee;
      background: rgba(34, 211, 238, 0.06);
    }
    .link-index { font-size: 0.7rem; opacity: 0.7; }
    .resume-btn {
      font-size: 0.78rem;
      padding: 0.45rem 1rem;
      border: 1px solid #22d3ee;
      color: #22d3ee;
      border-radius: 6px;
      text-decoration: none;
      transition: background 0.2s ease, color 0.2s ease;
    }
    .resume-btn:hover {
      background: rgba(34, 211, 238, 0.1);
    }
    @media (max-width: 768px) {
      .nav-links { display: none; }
    }
  `],
})
export class NavbarComponent implements OnInit, OnDestroy {
  scrolled = signal(false);
  activeRoute = signal('/');
  private sub!: Subscription;
  private router = inject(Router);

  navLinks = [
    { path: '/about', label: 'About' },
    { path: '/work', label: 'Work' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' },
  ];

  ngOnInit(): void {
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.activeRoute.set(e.urlAfterRedirects));

    gsap.fromTo(
      '.navbar',
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 }
    );
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 50);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
