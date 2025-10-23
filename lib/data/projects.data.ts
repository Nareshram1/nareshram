import React from 'react';


// Define the structure for a single project
export interface Project {
  id: string; // A unique ID, e.g., "my-app"
  title: string; // "My Awesome App"
  about: string; // A paragraph describing the project
  images: string[]; // An array of URLs to screenshots
  githubUrl: string; // Full URL to the GitHub repo
}

// Populate your 10+ projects here
export const PROJECTS_DATA: Project[] = [
  {
    id: 'expense-tracker',
    title: 'Expo Expense Tracker',
    about: 'A cross-platform mobile app built with Expo and React Native to track daily expenses. Includes features for recurring payments and category management.',
    images: [
      '/images/projects/expense-tracker-1.png',
      '/images/projects/expense-tracker-2.png',
    ],
    githubUrl: 'https://github.com/your-username/expense-tracker'
  },
  {
    id: 'video-ai-tool',
    title: 'KnowledgeCapture AI',
    about: 'A Python-based AI tool using FastAPI and Next.js that transcribes, summarizes, and answers questions about video content. Built in October 2025.',
    images: [
      '/images/projects/video-ai-1.png',
    ],
    githubUrl: 'https://github.com/your-username/video-ai-tool'
  },
  {
    id: 'another-project',
    title: 'Project GameX',
    about: 'This is another project, maybe a game. It was built with... (etc.)',
    images: [],
    githubUrl: 'https://github.com/your-username/game-x'
  },
  // ... Add your other 7+ projects here
];