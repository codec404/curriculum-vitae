/**
 * PORTFOLIO DATA — single source of truth.
 *
 * Update any value here, push to git, and the production build
 * will reflect the change automatically on the next deploy.
 */

import { CPProfile } from '../shared/models/project.model';

// ─── Competitive Programming ─────────────────────────────────────────────────

export const CP_PROFILES: CPProfile[] = [
  {
    platform: 'LeetCode',
    handle: 'sapta8103',
    rating: 2140,
    rank: 'Guardian',
    color: '#68a1ed',
    url: 'https://leetcode.com/u/sapta8103/',
    icon: 'LC',
  },
  {
    platform: 'Codeforces',
    handle: 'Gojo_Satoru_091',
    rating: 1583,
    rank: 'Specialist',
    color: '#03A89E',
    url: 'https://codeforces.com/profile/Gojo_Satoru_091',
    icon: 'CF',
  },
  {
    platform: 'CodeChef',
    handle: 'sapta8103',
    rating: 1756,
    rank: '3★',
    color: '#4a90d9',
    url: 'https://www.codechef.com/users/sapta8103',
    icon: 'CC',
  },
  {
    platform: 'AtCoder',
    handle: 'Gojo_satoru_091',
    rating: 1175,
    rank: 'Green',
    color: '#008000',
    url: 'https://atcoder.jp/users/Gojo_satoru_091',
    icon: 'AC',
  },
];

// ─── Hero quick-stats ─────────────────────────────────────────────────────────
// These show on the landing screen below the CTA buttons.

export const HERO_STATS = [
  { value: '2140', label: 'LeetCode Rating' },
  { value: '1583', label: 'Codeforces Rating' },
  { value: 'Top 200', label: 'Meta Hacker Cup' },
  { value: '8.88', label: 'CGPA / 10' },
];
