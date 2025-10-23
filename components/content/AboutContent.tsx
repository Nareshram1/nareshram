import React from 'react';

const AboutContent: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold border-b-2 border-[#000080] pb-2">System Properties</h2>
    <div className="space-y-2">
      <div className="flex gap-2">
        <span className="font-bold">User:</span>
        <span>Arul Moneesh</span>
      </div>
      <div className="flex gap-2">
        <span className="font-bold">Title:</span>
        <span>AI & DevOps Engineer</span>
      </div>
      <div className="flex gap-2">
        <span className="font-bold">Version:</span>
        <span>2025.1 Professional Edition</span>
      </div>
      <p className="mt-4">
        Passionate engineer with expertise in creating innovative AI-driven applications and robust DevOps pipelines.
        Specializing in modern frameworks like Next.js, FastAPI, and agentic systems with LangGraph/LangChain.
        When I&apos;m not coding, I&apos;m tracking expenses, optimizing personal finances, or exploring new tech.
      </p>
      <div className="mt-4 p-2 bg-[#c0c0c0] border-2" style={{
        borderTopColor: '#808080',
        borderLeftColor: '#808080',
        borderRightColor: '#ffffff',
        borderBottomColor: '#ffffff'
      }}>
        <p className="text-sm">📧 your.email@example.com</p>
        <p className="text-sm">🌐 github.com/yourusername</p>
        <p className="text-sm">📍 Tamil Nadu, India</p>
      </div>
    </div>
  </div>
);

export default AboutContent;