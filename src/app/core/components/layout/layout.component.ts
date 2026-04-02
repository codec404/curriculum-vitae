import {
  Component,
  OnDestroy,
  AfterViewInit,
  inject,
  NgZone,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { NavbarComponent } from '../navbar/navbar.component';
import { CursorComponent } from '../cursor/cursor.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, CursorComponent],
  template: `
    <app-cursor></app-cursor>
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <div class="noise-grain" aria-hidden="true"></div>
  `,
  styles: [`
    main { min-height: 100vh; }
    .noise-grain {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9990;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      background-size: 180px;
    }
  `],
})
export class LayoutComponent implements AfterViewInit, OnDestroy {
  private lenis: Lenis | null = null;
  private routerSub!: Subscription;
  private router = inject(Router);
  private zone = inject(NgZone);
  // Store reference so we can remove the exact same function from the ticker
  private tickerCb = (time: number) => this.lenis?.raf(time * 1000);

  ngAfterViewInit(): void {
    // Run everything animation-related outside Angular's zone so Zone.js
    // does not trigger change detection on every RAF frame (60× per second).
    this.zone.runOutsideAngular(() => {
      this.lenis = new Lenis({
        lerp: 0.1,        // linear interpolation — more predictable than duration+easing on trackpads
        smoothWheel: true,
      });

      // Keep ScrollTrigger scroll positions in sync with Lenis
      this.lenis.on('scroll', ScrollTrigger.update);

      // Single shared driver — Lenis + GSAP on the same ticker
      gsap.ticker.add(this.tickerCb);
      gsap.ticker.lagSmoothing(0);
    });

    // Route change handling runs back inside zone (it's Angular router work)
    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.zone.runOutsideAngular(() => {
          this.lenis?.scrollTo(0, { immediate: true });
          ScrollTrigger.getAll().forEach((t) => t.kill());
        });
      });
  }

  ngOnDestroy(): void {
    gsap.ticker.remove(this.tickerCb);
    this.lenis?.destroy();
    this.routerSub?.unsubscribe();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }
}
