import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

@Component({
  selector: 'app-magnetic-btn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #wrap class="magnetic-wrap" [class]="wrapClass">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .magnetic-wrap {
      display: inline-block;
      transform-origin: center;
    }
  `],
})
export class MagneticBtnComponent implements AfterViewInit {
  @ViewChild('wrap') wrapRef!: ElementRef<HTMLDivElement>;
  @Input() strength = 0.35;
  @Input() wrapClass = '';

  private el!: HTMLDivElement;

  ngAfterViewInit(): void {
    this.el = this.wrapRef.nativeElement;
  }

  @HostListener('mousemove', ['$event'])
  onMove(e: MouseEvent): void {
    const rect = this.el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * this.strength;
    const dy = (e.clientY - cy) * this.strength;
    gsap.to(this.el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
  }

  @HostListener('mouseleave')
  onLeave(): void {
    gsap.to(this.el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  }
}
