import { Component, Input, ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';
import { MagneticBtnComponent } from '../magnetic-btn/magnetic-btn.component';

@Component({
  selector: 'app-project-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MagneticBtnComponent],
  template: `
    <article class="project-card" data-reveal>
      <div class="card-header">
        <div class="card-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="1.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div class="card-links">
          @if (project.links['github']) {
            <a [href]="project.links['github']" target="_blank" rel="noopener" class="icon-link" title="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          }
          @if (project.links['live']) {
            <a [href]="project.links['live']" target="_blank" rel="noopener" class="icon-link" title="Live">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          }
          @if (project.links['docs']) {
            <a [href]="project.links['docs']" target="_blank" rel="noopener" class="icon-link" title="Docs">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </a>
          }
        </div>
      </div>

      <h3 class="card-title">{{ project.title }}</h3>
      <p class="card-desc">{{ project.description }}</p>
      <p class="card-long-desc">{{ project.longDescription }}</p>

      <ul class="tech-list">
        @for (tech of project.tech; track tech) {
          <li class="tech-tag font-mono">{{ tech }}</li>
        }
      </ul>
    </article>
  `,
  styles: [`
    .project-card {
      background: #0e1420;
      border: 1px solid #1a2235;
      border-radius: 14px;
      padding: 2rem;
      transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .project-card:hover {
      border-color: rgba(34, 211, 238, 0.4);
      transform: translateY(-4px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(34,211,238,0.06);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }
    .card-icon { opacity: 0.8; }
    .card-links { display: flex; gap: 0.75rem; }
    .icon-link {
      color: #8892a4;
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .icon-link:hover { color: #22d3ee; }
    .card-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #e8eaf0;
    }
    .card-desc {
      font-size: 0.8rem;
      font-family: 'JetBrains Mono', monospace;
      color: #22d3ee;
      opacity: 0.8;
    }
    .card-long-desc {
      font-size: 0.9rem;
      color: #8892a4;
      line-height: 1.7;
      flex: 1;
    }
    .tech-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      list-style: none;
      margin-top: auto;
      padding-top: 0.5rem;
    }
    .tech-tag {
      font-size: 0.7rem;
      color: #22d3ee;
      background: rgba(34,211,238,0.08);
      border: 1px solid rgba(34,211,238,0.2);
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
    }
  `],
})
export class ProjectCardComponent {
  @Input() project!: Project;
}
