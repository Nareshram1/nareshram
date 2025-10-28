// Define the structure for a single project
export interface Project {
  id: string; // A unique ID, e.g., "my-app"
  title: string; // "My Awesome App"
  about: string; // A paragraph describing the project
  images: string[]; // An array of URLs to screenshots
  githubUrl: string; // Full URL to the GitHub repo
  icon:string;
}

// Populate your 10 projects here
export const PROJECTS_DATA: Project[] = [
  {
    id: 'spendify',
    title: 'Spendify',
    about: 'Open-source expense tracker app in Expo React. Track, categorize expenses, visualize spending habits, and manage finances seamlessly. Powered by Node.js, Express.js, PostgreSQL, JWT authentication for a secure cross-platform experience.',
    images: [
      '/images/projects/spendify/image-1.png',
      '/images/projects/spendify/image-2.png',
    ],
    githubUrl: 'https://github.com/Nareshram1/spendify',
    icon: '/icons/projects/spendify.png'
  },
  {
    id: 'blueband',
    title: 'Blueband',
    about: 'A real-time tracking system for rally cars using Next.js as the frontend framework. The application displays the live location of rally cars on an interactive map, utilizing socket connections for seamless, real-time updates. The system also features SOS and OK.',
    images: [
      '/images/projects/blueband/image-1.png',
    ],
    githubUrl: 'https://github.com/Nareshram1/blueband',
    icon: '/icons/projects/spendify.png'
  },
  {
    id: 'personal-app-store',
    title: 'Fuck-playstore',
    about: 'A personal app showcase built to bypass Play Store/App Store gatekeeping. Grants full control over app deployment, features admin-only upload access, and is mobile-optimized.',
    images: [
      '/images/projects/personal-app-store/image-1.png',
    ],
    githubUrl: 'https://github.com/Nareshram1/fuck-playstore',
    icon: '/icons/projects/spendify.png'
  },
  {
    id: 'yapspace',
    title: 'Yapspace',
    about: 'A project description for Yapspace. (Please update this description)',
    images: [],
    githubUrl: 'https://github.com/Nareshram1/yapspace',
    icon: '/icons/projects/spendify.png'
  },
  {
    id: 'government-hrm',
    title: 'Government-hrm',
    about: 'A project description for Government-hrm. (Please update this description)',
    images: [],
    githubUrl: 'https://github.com/Nareshram1/government-hrm',
    icon: '/icons/projects/spendify.png'
  },
  {
    id: 'farmconnect',
    title: 'Farmconnect',
    about: 'FarmConnect is a mobile app that connects farmers and locals for renting farming equipment and hiring field workers. Built with Expo React Native, it uses a Golang API and MongoDB.',
    images: [
      '/images/projects/farmconnect/image-1.png',
    ],
    githubUrl: 'https://github.com/Nareshram1/farmconnect',
    icon: '/icons/projects/spendify.png'
  },
  {
    id: 'simbunewyear',
    title: 'SimbunewYear',
    about: 'Bored devs turned a joke into a quirky website project.',
    images: [
      '/images/projects/simbunewyear/image-1.png',
    ],
    githubUrl: 'https://github.com/Nareshram1/simbunewyear',
    icon: '/icons/projects/spendify.png'
  },
  {
    id: 'accelerate',
    title: 'Accelerate',
    about: 'A data-driven problem recommendation system for optimized DSA practice. Analyzes questions based on frequency, ELO rating, and topic dependencies to optimize the learning path.',
    images: [
      '/images/projects/accelerate/image-1.png',
    ],
    githubUrl: 'https://github.com/Nareshram1/accelerate',
    icon: '/icons/projects/spendify.png'
  },
  {
    id: 'oneagent',
    title: 'OneAgent',
    about: 'An Agent to automate workspace.',
    images: [
      '/images/projects/oneagent/image-1.png',
    ],
    githubUrl: 'https://github.com/Nareshram1/oneagent',
    icon: '/icons/projects/spendify.png'
  },
  {
    id: 'icarus',
    title: 'ICARUS',
    about: 'An AI skill mapper to job/internship.',
    images: [
      '/images/projects/icarus/image-1.png',
    ],
    githubUrl: 'https://github.com/Nareshram1/icarus',
    icon: '/icons/projects/spendify.png'
  }
];