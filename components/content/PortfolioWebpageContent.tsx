"use client"

import React from 'react';
import Image from 'next/image';
import { PROJECTS_DATA, Project } from '@/lib/data/projects.data';
import ProjectDetailContent from './ProjectDetailContent';

// Props to allow this component to create new windows
interface PortfolioWebpageContentProps {
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

const PortfolioWebpageContent: React.FC<PortfolioWebpageContentProps> = ({
  createWindow,
  playClickSound
}) => {

  // This function is just like the one in MyProjectsContent
  // It opens a new window for a specific project
  const handleOpenProject = (project: Project) => {
    playClickSound();

    const windowIcon = (
      <Image
        src={project.icon || '/icons/default-app.png'}
        alt={project.title}
        width={16}
        height={16}
      />
    );

    createWindow(
      `project_${project.id}`, // Unique window ID
      project.title, // Window title
      <ProjectDetailContent project={project} />, // The content
      windowIcon, 
      500, // Optional: custom width
      400  // Optional: custom height
    );
  };

  return (
    // We remove all padding and overflow from the window to make the "page" fill it
    <div 
      className="h-full w-full"
      style={{ 
        fontFamily: "'Times New Roman', serif", // The classic!
        backgroundColor: '#E0E0E0', // A nice retro page background color
        overflowY: 'auto',
      }}
    >
      {/* 1. Tacky 90s Header */}
      <div className="text-center p-4" style={{ backgroundColor: '#000080', color: 'white' }}>
        {/* @ts-expect-error: Using deprecated <marquee> for retro theme */}
        <marquee className="text-2xl font-bold">
          ~~~ Welcome to My Portfolio Homepage! ~~~
        {/* @ts-expect-error: Using deprecated <marquee> for retro theme */}
        </marquee>
        <p className="text-yellow-300">The best projects on the World Wide Web!</p>
      </div>

      {/* 2. Main Content */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Image 
            src="/images/under-construction.gif" // You'll need to find one of these!
            alt="Under Construction" 
            width={100} 
            height={100}
            unoptimized // Keep the GIF animation
          />
          <h2 className="text-3xl font-bold">My Awesome Projects</h2>
        </div>

        {/* 3. Project List */}
        <div className="space-y-6">
          {PROJECTS_DATA.map(project => (
            <div 
              key={project.id} 
              className="p-4 border-2 border-gray-500 shadow-md"
              style={{
                borderTopColor: '#ffffff',
                borderLeftColor: '#ffffff',
                borderRightColor: '#808080',
                borderBottomColor: '#808080',
                backgroundColor: '#C0C0C0' // System grey
              }}
            >
              <h3 className="text-2xl font-bold text-blue-800">{project.title}</h3>
              <div className="flex gap-4 mt-2">
                <Image
                  src={project.icon || '/icons/default-app.png'}
                  alt={project.title}
                  width={48}
                  height={48}
                  className="shrink-0 mt-1"
                />
                <div>
                  <p className="text-sm">{project.about}</p>
                  <button 
                    onClick={() => handleOpenProject(project)}
                    className="text-blue-600 font-bold underline hover:text-red-500 mt-2"
                  >
                    Click here to learn more about {project.title}!
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Tacky 90s Footer */}
        <hr className="my-8 border-gray-500" />
        <div className="text-center">
          <p>You are visitor number:</p>
          <Image 
            src="/images/hit-counter.gif" // You'll need to find one of these, too!
            alt="Hit Counter" 
            width={150} 
            height={40}
            unoptimized
          />
          <p className="mt-4 text-xs">
            © 1998 Arul Moneesh. All rights reserved.
            <br />
            This site is best viewed with Netscape Navigator 4.0 or Internet Explorer 4.0
            at 800x600 resolution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioWebpageContent;