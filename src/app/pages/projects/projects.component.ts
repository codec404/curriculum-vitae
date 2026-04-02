import { Component, AfterViewInit, inject, ChangeDetectionStrategy, ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectService } from '../../core/services/project.service';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ProjectCardComponent],
  template: `
    <section class="projects-section">
      <div class="section-container">

        <div class="section-header" data-reveal>
          <span class="section-label">// 03. projects</span>
          <h2 class="section-title">Things I've built</h2>
          <p class="section-sub">
            Systems that live in production, tools that solve real problems.
          </p>
        </div>

        <div class="projects-grid">
          @for (project of projects(); track project.id) {
            <app-project-card [project]="project"></app-project-card>
          }
        </div>

        <!-- Open source note -->
        <div class="oss-note" data-reveal>
          <p class="font-mono text-sm text-text-secondary">
            More on&nbsp;
            <a href="https://github.com/codec404" target="_blank" rel="noopener" class="text-cyan-400 hover-underline">
              GitHub ↗
            </a>
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .projects-section {
      padding: 8rem 0 6rem;
      min-height: 100vh;
    }
    .section-header { margin-bottom: 3.5rem; }
    .section-sub {
      font-size: 1rem;
      color: #8892a4;
      max-width: 500px;
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    @media (max-width: 600px) {
      .projects-grid { grid-template-columns: 1fr; }
    }
    .oss-note {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid #1a2235;
    }
    .hover-underline {
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s ease;
    }
    .hover-underline:hover { border-color: #22d3ee; }
  `],
})
export class ProjectsComponent implements AfterViewInit {
  private el = inject(ElementRef).nativeElement;
  private projectService = inject(ProjectService);
  readonly projects = this.projectService.projects;

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
