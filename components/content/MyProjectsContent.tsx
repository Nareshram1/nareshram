"use client"

import React from 'react';
import { PROJECTS_DATA, Project } from '@/lib/data/projects.data';
import { WindowState } from '@/lib/types/portfolio.types';
import ProjectDetailContent from './ProjectDetailContent';

// --- Reusable Icon Component (like DesktopIcon but for inside a window) ---
interface ProjectIconProps {
  project: Project;
  onOpen: (project: Project) => void;
}

const ProjectIcon: React.FC<ProjectIconProps> = ({ project, onOpen }) => (
  <button
    className="flex flex-col items-center w-24 p-2 text-black hover:bg-blue-200/50"
    onDoubleClick={() => onOpen(project)}
  >
    <span className="text-xs mt-1 text-center">{project.title}</span>
  </button>
);

// --- Main Explorer Content ---
interface MyProjectsContentProps {
  createWindow: (
    id: string, 
    title: string, 
    content: React.ReactNode, 
    icon: React.ReactNode, 
    width?: number, 
    height?: number
  ) => void;
  playClickSound: () => void;
}

const MyProjectsContent: React.FC<MyProjectsContentProps> = ({ 
  createWindow, 
  playClickSound 
}) => {
  
  const handleOpenProject = (project: Project) => {
    playClickSound();
    
    // Create a NEW window for the project details
    createWindow(
      `project_${project.id}`, // Unique window ID
      project.title, // Window title
      <ProjectDetailContent project={project} />, // The content
      500, // Optional: custom width
      400  // Optional: custom height
    );
  };

  return (
    <div className="p-2 h-full">
      <div className="flex flex-wrap gap-2">
        {PROJECTS_DATA.map(project => (
          <ProjectIcon 
            key={project.id}
            project={project}
            onOpen={handleOpenProject}
          />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-1 bg-[#c0c0c0] border-t-2 border-white text-sm">
        {PROJECTS_DATA.length} object(s)
      </div>
    </div>
  );
};

export default MyProjectsContent;