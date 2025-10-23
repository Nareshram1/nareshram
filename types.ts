export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'web' | 'design' | 'opensource';
  tech: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  year: number;
}

export interface WindowType {
  id: string;
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
}

export interface Skill {
  category: string;
  items: {
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }[];
}
