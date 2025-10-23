"use client"

import React, { useState } from 'react';
import { Project } from '@/lib/data/projects.data';
import { ChevronLeft, ChevronRight, Github } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetailContent: React.FC<ProjectDetailProps> = ({ project }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      {/* 1. Image Gallery */}
      <div className="bg-black w-full h-48 relative flex items-center justify-center">
        {project.images.length > 0 ? (
          <>
            <img
              src={project.images[currentImageIndex]}
              alt={`${project.title} screenshot ${currentImageIndex + 1}`}
              className="object-contain w-full h-full"
            />
            {project.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage} 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/80"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextImage} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/80"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </>
        ) : (
          <span className="text-gray-400">No images available</span>
        )}
      </div>

      {/* 2. About Section */}
      <div>
        <h3 className="font-bold text-lg">{project.title}</h3>
        <p className="text-sm mt-2">{project.about}</p>
      </div>

      {/* 3. GitHub Link */}
      <div className="mt-auto pt-4 border-t">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <Github size={18} />
          <span>View on GitHub</span>
        </a>
      </div>
    </div>
  );
};

export default ProjectDetailContent;