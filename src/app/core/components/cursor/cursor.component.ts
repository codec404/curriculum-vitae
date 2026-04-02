import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  NgZone,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

@Component({
  selector: 'app-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #dot class="cursor-dot"></div>
    <div #ring class="cursor-ring"></div>
  `,
  styles: [`
    .cursor-dot {
      position: fixed;
      width: 6px;
      height: 6px;
      background: #22d3ee;
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      top: 0; left: 0;
      will-change: transform;
    }
    .cursor-ring {
      position: fixed;
      width: 32px;
      height: 32px;
      border: 1.5px solid rgba(34, 211, 238, 0.6);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99998;
      top: 0; left: 0;
      will-change: transform;
      transition: width 0.25s ease, height 0.25s ease,
                  border-color 0.25s ease, background 0.25s ease;
    }
    .cursor-ring.hover {
      width: 56px;
      height: 56px;
      border-color: rgba(34, 211, 238, 0.9);
      background: rgba(34, 211, 238, 0.06);
    }
    .cursor-ring.click {
      width: 20px;
      height: 20px;
      background: rgba(34, 211, 238, 0.3);
    }
  `],
})
export class CursorComponent implements OnInit, OnDestroy {
  @ViewChild('dot', { static: true }) dotRef!: ElementRef<HTMLDivElement>;
  @ViewChild('ring', { static: true }) ringRef!: ElementRef<HTMLDivElement>;

  private zone = inject(NgZone);

  private moveDotX!: (val: number) => void;
  private moveDotY!: (val: number) => void;
  private moveRingX!: (val: number) => void;
  private moveRingY!: (val: number) => void;

  // Keep bound refs so we can removeEventListener properly
  private onMove!: (e: MouseEvent) => void;
  private onDown!: () => void;
  private onUp!: () => void;

  ngOnInit(): void {
    const dot = this.dotRef.nativeElement;
    const ring = this.ringRef.nativeElement;

    this.moveDotX  = gsap.quickTo(dot,  'x', { duration: 0.06 }) as (val: number) => void;
    this.moveDotY  = gsap.quickTo(dot,  'y', { duration: 0.06 }) as (val: number) => void;
    this.moveRingX = gsap.quickTo(ring, 'x', { duration: 0.22, ease: 'power3.out' }) as (val: number) => void;
    this.moveRingY = gsap.quickTo(ring, 'y', { duration: 0.22, ease: 'power3.out' }) as (val: number) => void;

    gsap.set([dot, ring], { x: -100, y: -100 });

    this.onMove = (e: MouseEvent) => {
      this.moveDotX(e.clientX - 3);
      this.moveDotY(e.clientY - 3);
      this.moveRingX(e.clientX - 16);
      this.moveRingY(e.clientY - 16);
    };
    this.onDown = () => ring.classList.add('click');
    this.onUp   = () => ring.classList.remove('click');

    // All pointer events run outside Angular's zone — zero change detection
    // triggered by cursor movement or clicks
    this.zone.runOutsideAngular(() => {
      document.addEventListener('mousemove', this.onMove, { passive: true });
      document.addEventListener('mousedown', this.onDown);
      document.addEventListener('mouseup',   this.onUp);
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.onMove);
    document.removeEventListener('mousedown', this.onDown);
    document.removeEventListener('mouseup',   this.onUp);
  }
}
