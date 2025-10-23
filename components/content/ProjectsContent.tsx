import React from 'react';
import { Folder } from 'lucide-react';


const ProjectsContent: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold border-b-2 border-[#000080] pb-2">My Computer</h2>
    <div className="space-y-3">
      
      {/* --- TODO --- This is where you add your projects. Here are templates. */}
      
      <div className="flex items-center gap-3 p-2 hover:bg-[#000080] hover:text-white cursor-pointer"
           onDoubleClick={() => alert("Open project 'KnowledgeCapture AI' folder?")}>
        <Folder className="text-yellow-600" size={32} />
        <div>
          <div className="font-bold">KnowledgeCapture AI (K:)</div>
          <div className="text-sm">AI agent for processing and summarizing training videos. (LangChain, FastAPI, Next.js)</div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-2 hover:bg-[#000080] hover:text-white cursor-pointer"
           onDoubleClick={() => alert("Open project 'LUNA Expense Tracker' folder?")}>
        <Folder className="text-yellow-600" size={32} />
        <div>
          <div className="font-bold">LUNA Expense Tracker (L:)</div>
          <div className="text-sm">Personal finance app with AI voice assistant and UPI integration. (Expo, React Native)</div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-2 hover:bg-[#000080] hover:text-white cursor-pointer"
           onDoubleClick={() => alert("Open project 'byecko' folder?")}>
        <Folder className="text-yellow-600" size={32} />
        <div>
          <div className="font-bold">byecko (B:)</div>
          <div className="text-sm">Python backend for video processing using FFmpeg, Docker, and Hugging Face models.</div>
        </div>
      </div>

    </div>
  </div>
);

export default ProjectsContent;