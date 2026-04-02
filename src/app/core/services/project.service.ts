import { Injectable, signal } from '@angular/core';
import { Project, Experience, CPProfile } from '../../shared/models/project.model';
import { CP_PROFILES } from '../../data/portfolio.data';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  readonly projects = signal<Project[]>([
    {
      id: 'konfig',
      title: 'Konfig',
      description: 'Distributed Configuration Management System',
      longDescription:
        'Architected 3 C++ microservices (API, Distribution, Validation) with bidirectional gRPC streaming, write-through Redis/Postgres caching, and Kafka fan-out. Achieves sub-100ms config propagation with Prometheus/Grafana observability, gradual rollouts, and instant rollbacks.',
      tech: ['C++', 'Go', 'gRPC', 'PostgreSQL', 'Redis', 'Kafka', 'React', 'TypeScript'],
      links: {
        live: 'https://konfig.org.in',
      },
      featured: true,
    },
    {
      id: 'nsh',
      title: 'nsh',
      description: 'Custom Unix Shell',
      longDescription:
        'Crafted a Unix shell in C with typed pipelines, job control, and a SQLite-backed persistence layer — enabling full-text search across 10,000+ command history entries with sub-10ms query time. Implemented declarative per-directory environment management via .shellenv files.',
      tech: ['C', 'SQLite', 'Make', 'POSIX'],
      links: {},
      featured: true,
    },
  ]);

  readonly experiences = signal<Experience[]>([
    {
      company: 'Zomato',
      role: 'Software Development Engineer - I',
      period: 'Jul 2025 – Feb 2026',
      location: 'Gurugram, India',
      tech: ['Go', 'MongoDB', 'SQL', 'AWS', 'REST APIs', 'gRPC', 'Kafka'],
      bullets: [
        'Owned RNP V2 — engineered a hierarchical role-permission mapping framework (Admin → Agent) enabling scoped visibility across 3+ subordinate node levels.',
        'Architected the Error State Management System, automating detection of invalid states across 100+ active bot flows.',
        'Designed and shipped a Pre-publish Testing Suite for voice bots — cutting pre-release defects by ~40%.',
        'Led large-scale data migrations from Freshdesk to Nugget, improving onboarding efficiency by 30%.',
      ],
    },
    {
      company: 'Cisco Systems',
      role: 'Technical Intern - I (Spring)',
      period: 'Jan 2025 – Jun 2025',
      location: 'Bengaluru, India',
      tech: ['Go', 'C++', 'Linux', 'Bloom Filters', 'BusyBox'],
      bullets: [
        'Developed a modular CLI tool for NGFW platforms consolidating 10+ diagnostic utilities into a single BusyBox-style binary — cutting memory usage by 75%.',
        'Engineered Bloom Filters in C++ for ACL-based malicious IP/URL detection, achieving sub-millisecond lookup in constant time.',
      ],
    },
    {
      company: 'Cisco Systems',
      role: 'Technical Intern - I (Summer)',
      period: 'May 2024 – Jul 2024',
      location: 'Bengaluru, India',
      tech: ['Go', 'SQLite', 'MariaDB', 'Linux'],
      bullets: [
        'Migrated and optimized 5+ Python/Perl daemons in NGFW infrastructure; replaced legacy modules with lightweight Go alternatives.',
        'Performed memory profiling and leak detection, achieving 80% reduction in daemon memory footprint.',
      ],
    },
  ]);

  readonly cpProfiles = signal<CPProfile[]>(CP_PROFILES);
}
