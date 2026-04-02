export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  links: {
    github?: string;
    live?: string;
    docs?: string;
  };
  featured: boolean;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  tech: string[];
  certificate?: string;
}

export interface CPProfile {
  platform: string;
  handle: string;
  rating: number;
  rank: string;
  color: string;
  url: string;
  icon: string;
}
