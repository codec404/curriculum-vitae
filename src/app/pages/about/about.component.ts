import { Component, AfterViewInit, ChangeDetectionStrategy, ElementRef, inject, computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectService } from '../../core/services/project.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="about-section">
      <div class="section-container">

        <!-- Header -->
        <div class="section-header" data-reveal>
          <span class="section-label">// 01. about</span>
          <h2 class="section-title">Who I am</h2>
        </div>

        <div class="about-grid">
          <!-- Bio -->
          <div class="bio-col" data-reveal>
            <p class="bio-text">
              I'm <strong class="text-cyan-400">Saptarshi Ghosh</strong>, a software engineer with a B.Tech in
              Electrical Engineering from <strong>NIT Durgapur</strong> (CGPA 8.88).
            </p>
            <p class="bio-text">
              I've spent my engineering career at the intersection of systems programming and distributed
              infrastructure — from NGFW tooling at <strong>Cisco</strong> to bot platform engineering at
              <strong>Zomato</strong>.
            </p>
            <p class="bio-text">
              Outside of work, competitive programming is my sport. I've reached
              <strong class="text-cyan-400">Round 3 of Meta Hacker Cup 2025</strong> (global rank 186),
              hold a <strong class="text-cyan-400">{{ leetcode()?.rank ?? 'Guardian' }}</strong> badge on LeetCode ({{ leetcode()?.rating ?? 2140 }}), and am
              a <strong class="text-cyan-400">{{ codeforces()?.rank ?? 'Specialist' }}</strong> on Codeforces ({{ codeforces()?.rating ?? 1583 }}).
            </p>

            <!-- Skills grid -->
            <div class="skills-section" data-reveal>
              <h3 class="skills-title font-mono">Tech I work with</h3>
              <div class="skills-grid">
                @for (group of skillGroups; track group.category) {
                  <div class="skill-group">
                    <span class="skill-cat font-mono">{{ group.category }}</span>
                    <div class="skill-pills">
                      @for (skill of group.items; track skill) {
                        <span class="skill-pill font-mono">{{ skill }}</span>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Education + Achievements -->
          <div class="right-col">
            <!-- Education card -->
            <div class="info-card" data-reveal>
              <div class="card-top">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="1.5">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
                <span class="font-mono text-xs text-text-secondary">Education</span>
              </div>
              <h3 class="info-title">NIT Durgapur</h3>
              <p class="info-sub font-mono">B.Tech · Electrical Engineering</p>
              <p class="info-detail">Dec 2021 – Jun 2025 · Durgapur, India</p>
              <div class="cgpa-badge font-mono">CGPA 8.88 / 10</div>
            </div>

            <!-- Achievements -->
            <div class="achievements-card" data-reveal>
              <div class="card-top">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="1.5">
                  <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
                <span class="font-mono text-xs text-text-secondary">Achievements</span>
              </div>
              @for (ach of achievements(); track ach.title) {
                <div class="ach-item">
                  <span class="ach-dot"></span>
                  <div>
                    <p class="ach-title">{{ ach.title }}</p>
                    <p class="ach-detail font-mono">{{ ach.detail }}</p>
                  </div>
                </div>
              }
            </div>

            <!-- RECursion -->
            <div class="info-card" data-reveal>
              <div class="card-top">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span class="font-mono text-xs text-text-secondary">Leadership</span>
              </div>
              <h3 class="info-title">RECursion, NIT Durgapur</h3>
              <p class="info-sub font-mono">Contest Head · Nov 2021 – Jun 2025</p>
              <p class="info-detail">
                Led programming contests for 100+ participants. Organized alumni mentorship and peer DSA workshops.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      padding: 8rem 0 6rem;
      min-height: 100vh;
    }
    .section-header { margin-bottom: 4rem; }
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
    }
    @media (max-width: 768px) {
      .about-grid { grid-template-columns: 1fr; }
    }
    .bio-text {
      font-size: 1rem;
      color: #8892a4;
      line-height: 1.85;
      margin-bottom: 1.25rem;
    }
    .bio-text strong { color: #e8eaf0; }
    .skills-section { margin-top: 2.5rem; }
    .skills-title {
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #22d3ee;
      margin-bottom: 1.25rem;
    }
    .skills-grid { display: flex; flex-direction: column; gap: 1rem; }
    .skill-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .skill-cat {
      font-size: 0.7rem;
      color: #4a5568;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .skill-pills { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .skill-pill {
      font-size: 0.72rem;
      padding: 0.25rem 0.7rem;
      background: rgba(34,211,238,0.06);
      border: 1px solid #1a2235;
      color: #e8eaf0;
      border-radius: 4px;
      transition: border-color 0.2s;
    }
    .skill-pill:hover { border-color: rgba(34,211,238,0.4); }

    .right-col { display: flex; flex-direction: column; gap: 1.25rem; }
    .info-card, .achievements-card {
      background: #0e1420;
      border: 1px solid #1a2235;
      border-radius: 12px;
      padding: 1.5rem;
      transition: border-color 0.3s ease;
    }
    .info-card:hover, .achievements-card:hover { border-color: rgba(34,211,238,0.3); }
    .card-top {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .info-title { font-size: 1.05rem; font-weight: 700; color: #e8eaf0; margin-bottom: 0.25rem; }
    .info-sub { font-size: 0.75rem; color: #22d3ee; margin-bottom: 0.5rem; }
    .info-detail { font-size: 0.85rem; color: #8892a4; line-height: 1.6; }
    .cgpa-badge {
      display: inline-block;
      margin-top: 0.75rem;
      font-size: 0.78rem;
      padding: 0.3rem 0.8rem;
      background: rgba(34,211,238,0.1);
      border: 1px solid rgba(34,211,238,0.3);
      color: #22d3ee;
      border-radius: 6px;
    }
    .ach-item {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      padding: 0.75rem 0;
      border-bottom: 1px solid #1a2235;
    }
    .ach-item:last-child { border-bottom: none; }
    .ach-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22d3ee;
      margin-top: 0.45rem;
      flex-shrink: 0;
    }
    .ach-title { font-size: 0.9rem; color: #e8eaf0; font-weight: 500; margin-bottom: 0.15rem; }
    .ach-detail { font-size: 0.72rem; color: #8892a4; }
  `],
})
export class AboutComponent implements AfterViewInit {
  private el = inject(ElementRef).nativeElement;
  private projectService = inject(ProjectService);

  readonly leetcode = computed(() => this.projectService.cpProfiles().find(p => p.platform === 'LeetCode'));
  readonly codeforces = computed(() => this.projectService.cpProfiles().find(p => p.platform === 'Codeforces'));

  skillGroups = [
    { category: 'Languages', items: ['C++', 'Go', 'Java', 'Python', 'JavaScript'] },
    { category: 'Backend / Infra', items: ['Node.js', 'gRPC', 'Kafka', 'Redis', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS'] },
    { category: 'Core CS', items: ['DSA', 'OOP', 'DBMS', 'OS', 'Networks', 'Distributed Systems'] },
    { category: 'Observability', items: ['Prometheus', 'Grafana', 'Linux'] },
  ];

  readonly achievements = computed(() => [
    {
      title: 'Meta Hacker Cup 2025 — Round 3',
      detail: 'Global Rank 186 · Top 0.01%',
    },
    {
      title: 'LeetCode Biweekly Contest 119',
      detail: 'Global Rank 48 / 17,000+ participants',
    },
    {
      title: `LeetCode ${this.leetcode()?.rank ?? 'Guardian'}`,
      detail: `Rating ${this.leetcode()?.rating ?? 2140}`,
    },
    {
      title: `Codeforces ${this.codeforces()?.rank ?? 'Specialist'}`,
      detail: `Rating ${this.codeforces()?.rating ?? 1583}`,
    },
  ]);

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
