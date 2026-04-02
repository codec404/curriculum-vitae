import { Component, AfterViewInit, inject, ChangeDetectionStrategy, ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectService } from '../../core/services/project.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-work',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="work-section">
      <div class="section-container">

        <div class="section-header" data-reveal>
          <span class="section-label">// 02. work experience</span>
          <h2 class="section-title">Where I've worked</h2>
        </div>

        <div class="timeline">
          @for (exp of experiences(); track exp.company + exp.role; let i = $index) {
            <div class="timeline-item" [attr.data-index]="i">
              <div class="timeline-marker">
                <div class="marker-dot"></div>
                <div class="marker-line"></div>
              </div>

              <div class="exp-card" data-reveal>
                <div class="exp-header">
                  <div>
                    <h3 class="exp-company">{{ exp.company }}</h3>
                    <p class="exp-role font-mono">{{ exp.role }}</p>
                  </div>
                  <div class="exp-meta">
                    <span class="exp-period font-mono">{{ exp.period }}</span>
                    <span class="exp-location">{{ exp.location }}</span>
                  </div>
                </div>

                <ul class="exp-bullets">
                  @for (bullet of exp.bullets; track $index) {
                    <li class="bullet-item">
                      <span class="bullet-arrow font-mono text-cyan-400">▸</span>
                      <span [innerHTML]="bullet"></span>
                    </li>
                  }
                </ul>

                <div class="tech-row">
                  @for (tech of exp.tech; track tech) {
                    <span class="tech-pill font-mono">{{ tech }}</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .work-section {
      padding: 8rem 0 6rem;
      min-height: 100vh;
    }
    .section-header { margin-bottom: 4rem; }

    .timeline { display: flex; flex-direction: column; gap: 0; }

    .timeline-item {
      display: grid;
      grid-template-columns: 48px 1fr;
      gap: 1.5rem;
      position: relative;
    }

    .timeline-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 1.75rem;
    }
    .marker-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #22d3ee;
      border: 2px solid #080c12;
      box-shadow: 0 0 12px rgba(34,211,238,0.6);
      flex-shrink: 0;
      z-index: 1;
    }
    .marker-line {
      width: 1px;
      flex: 1;
      background: linear-gradient(to bottom, #22d3ee, #1a2235);
      margin-top: 6px;
      min-height: 40px;
    }
    .timeline-item:last-child .marker-line { display: none; }

    .exp-card {
      background: #0e1420;
      border: 1px solid #1a2235;
      border-radius: 14px;
      padding: 2rem;
      margin-bottom: 1.5rem;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .exp-card:hover {
      border-color: rgba(34,211,238,0.35);
      box-shadow: 0 10px 40px rgba(0,0,0,0.3), 0 0 20px rgba(34,211,238,0.05);
    }
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .exp-company {
      font-size: 1.25rem;
      font-weight: 700;
      color: #e8eaf0;
      margin-bottom: 0.2rem;
    }
    .exp-role {
      font-size: 0.8rem;
      color: #22d3ee;
    }
    .exp-meta { text-align: right; }
    .exp-period {
      display: block;
      font-size: 0.75rem;
      color: #8892a4;
      margin-bottom: 0.2rem;
    }
    .exp-location {
      font-size: 0.78rem;
      color: #4a5568;
    }
    .exp-bullets {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .bullet-item {
      display: flex;
      gap: 0.75rem;
      font-size: 0.9rem;
      color: #8892a4;
      line-height: 1.7;
      align-items: flex-start;
    }
    .bullet-arrow { flex-shrink: 0; margin-top: 0.05rem; }
    .tech-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding-top: 1rem;
      border-top: 1px solid #1a2235;
    }
    .tech-pill {
      font-size: 0.68rem;
      padding: 0.2rem 0.6rem;
      background: rgba(34,211,238,0.07);
      border: 1px solid rgba(34,211,238,0.18);
      color: #22d3ee;
      border-radius: 4px;
    }
  `],
})
export class WorkComponent implements AfterViewInit {
  private el = inject(ElementRef).nativeElement;
  private projectService = inject(ProjectService);
  readonly experiences = this.projectService.experiences;

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
