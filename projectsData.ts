// types.ts
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

// ============================================
// projectsData.ts
export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard. Built with modern technologies for scalability and performance.',
    category: 'web',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/ecommerce',
    featured: true,
    year: 2024
  },
  {
    id: 'project-2',
    title: 'Real-Time Chat Application',
    description: 'WebSocket-based chat app with message encryption, file sharing, and video calls. Supports multiple chat rooms and direct messaging.',
    category: 'web',
    tech: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'WebRTC'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/chat-app',
    featured: true,
    year: 2024
  },
  {
    id: 'project-3',
    title: 'AI Content Generator',
    description: 'OpenAI-powered content generation tool for marketing copy, blog posts, and social media. Features custom templates and tone adjustment.',
    category: 'web',
    tech: ['Next.js', 'OpenAI API', 'Prisma', 'PostgreSQL'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/ai-content',
    featured: true,
    year: 2025
  },
  {
    id: 'project-4',
    title: 'Design System Library',
    description: 'Comprehensive component library with 50+ reusable components, dark mode support, and accessibility features. Published on npm.',
    category: 'design',
    tech: ['React', 'TypeScript', 'Storybook', 'Tailwind CSS'],
    githubUrl: 'https://github.com/yourusername/design-system',
    featured: false,
    year: 2024
  },
  {
    id: 'project-5',
    title: 'Task Management Dashboard',
    description: 'Kanban-style project management tool with drag-and-drop, team collaboration, and deadline tracking. Integrates with popular tools.',
    category: 'web',
    tech: ['React', 'Firebase', 'DnD Kit', 'Material-UI'],
    liveUrl: 'https://example.com',
    featured: false,
    year: 2023
  },
  {
    id: 'project-6',
    title: 'Weather Visualization App',
    description: 'Beautiful weather app with interactive maps, hourly forecasts, and weather alerts. Features data visualization and location search.',
    category: 'design',
    tech: ['React', 'OpenWeatherMap API', 'Chart.js', 'Mapbox'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/weather-app',
    featured: false,
    year: 2023
  },
  {
    id: 'project-7',
    title: 'Open Source CLI Tool',
    description: 'Command-line productivity tool for developers. Automates common workflows and includes plugin system. 1k+ GitHub stars.',
    category: 'opensource',
    tech: ['Node.js', 'TypeScript', 'Commander.js'],
    githubUrl: 'https://github.com/yourusername/cli-tool',
    featured: true,
    year: 2024
  },
  {
    id: 'project-8',
    title: 'Portfolio Template',
    description: 'Modern portfolio template for developers with dark mode, animations, and SEO optimization. Used by 500+ developers.',
    category: 'opensource',
    tech: ['Next.js', 'Framer Motion', 'MDX'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/portfolio-template',
    featured: false,
    year: 2023
  }
];

export const skills: Skill[] = [
  {
    category: 'Programming Languages',
    items: [
      { name: 'JavaScript/TypeScript', level: 'Expert' },
      { name: 'Python', level: 'Advanced' },
      { name: 'HTML/CSS', level: 'Expert' },
      { name: 'SQL', level: 'Advanced' }
    ]
  },
  {
    category: 'Frameworks & Libraries',
    items: [
      { name: 'React.js', level: 'Expert' },
      { name: 'Next.js', level: 'Expert' },
      { name: 'Node.js', level: 'Advanced' },
      { name: 'Tailwind CSS', level: 'Expert' },
      { name: 'Express.js', level: 'Advanced' }
    ]
  },
  {
    category: 'Tools & Platforms',
    items: [
      { name: 'Git/GitHub', level: 'Expert' },
      { name: 'VS Code', level: 'Expert' },
      { name: 'Figma', level: 'Advanced' },
      { name: 'Docker', level: 'Intermediate' },
      { name: 'AWS', level: 'Intermediate' }
    ]
  },
  {
    category: 'Databases',
    items: [
      { name: 'PostgreSQL', level: 'Advanced' },
      { name: 'MongoDB', level: 'Advanced' },
      { name: 'Redis', level: 'Intermediate' },
      { name: 'Firebase', level: 'Advanced' }
    ]
  }
];