import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-text-reveal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  template: `
    <span #container class="text-reveal-wrap" [class]="className">
      @for (word of words; track $index) {
        <span class="word-wrap">
          <span class="word">{{ word }}&nbsp;</span>
        </span>
      }
    </span>
  `,
  styles: [`
    .text-reveal-wrap { display: inline; }
    .word-wrap {
      display: inline-block;
      overflow: hidden;
      vertical-align: bottom;
    }
    .word {
      display: inline-block;
      transform: translateY(110%);
    }
  `],
})
export class TextRevealComponent implements AfterViewInit {
  @ViewChild('container') containerRef!: ElementRef;
  @Input() text = '';
  @Input() className = '';
  @Input() delay = 0;
  @Input() stagger = 0.05;

  get words(): string[] {
    return this.text.split(' ');
  }

  ngAfterViewInit(): void {
    const wordEls = this.containerRef.nativeElement.querySelectorAll('.word');
    gsap.to(wordEls, {
      y: 0,
      duration: 0.8,
      stagger: this.stagger,
      delay: this.delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.containerRef.nativeElement,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });
  }
}
