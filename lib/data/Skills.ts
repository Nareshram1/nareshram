import type { Skill } from '@/lib/types/Skills';
import {
  Code,
  Braces,
  Database,
  GitBranch,
  Layout,
  Globe,
  DatabaseZap,
  Figma,
  Terminal,
  Server,
  Palette,
} from 'lucide-react';

export const skills: Skill[] = [
  // Languages
  { name: 'JavaScript', category: 'Languages', icon: Code, level: 95 },
  { name: 'TypeScript', category: 'Languages', icon: Code, level: 90 },
  { name: 'Python', category: 'Languages', icon: Code, level: 75 },
  { name: 'HTML5', category: 'Languages', icon: Layout, level: 100 },
  { name: 'CSS3/Sass', category: 'Languages', icon: Palette, level: 95 },

  // Frameworks & Libraries
  { name: 'React.js', category: 'Frameworks & Libraries', icon: Braces, level: 95 },
  { name: 'Next.js', category: 'Frameworks & Libraries', icon: Braces, level: 90 },
  { name: 'Node.js', category: 'Frameworks & Libraries', icon: Server, level: 85 },
  { name: 'Express.js', category: 'Frameworks & Libraries', icon: Server, level: 80 },
  { name: 'Tailwind CSS', category: 'Frameworks & Libraries', icon: Palette, level: 100 },

  // Tools & Platforms
  { name: 'Git & GitHub', category: 'Tools & Platforms', icon: GitBranch, level: 95 },
  { name: 'VS Code', category: 'Tools & Platforms', icon: Terminal, level: 100 },
  { name: 'Figma', category: 'Tools & Platforms', icon: Figma, level: 70 },
  { name: 'Vercel', category: 'Tools & Platforms', icon: Globe, level: 85 },

  // Databases
  { name: 'PostgreSQL', category: 'Databases', icon: Database, level: 75 },
  { name: 'MongoDB', category: 'Databases', icon: DatabaseZap, level: 70 },
  { name: 'Firebase', category: 'Databases', icon: Database, level: 80 },
];

