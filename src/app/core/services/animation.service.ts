import { Injectable, OnDestroy } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Injectable({ providedIn: 'root' })
export class AnimationService implements OnDestroy {
  private ctx: gsap.Context | null = null;

  createContext(scope: Element | string): gsap.Context {
    this.ctx = gsap.context(() => {}, scope);
    return this.ctx;
  }

  revealOnScroll(elements: NodeListOf<Element> | Element[]): void {
    elements.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  staggerReveal(parent: Element, childSelector: string, delay = 0): void {
    gsap.to(parent.querySelectorAll(childSelector), {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }

  pageEnter(container: Element): gsap.core.Timeline {
    return gsap
      .timeline()
      .fromTo(
        container,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
  }

  pageLeave(container: Element): gsap.core.Timeline {
    return gsap
      .timeline()
      .to(container, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }
}
