import React from 'react';

const SkillsContent: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold border-b-2 border-[#000080] pb-2">Device Manager</h2>
    <p>Viewing all installed drivers and technologies.</p>
    {/* --- TODO --- Update with your skills */}
    <div className="space-y-2 font-mono text-sm">
      <div className="pl-4">
        <div className="font-bold">⊞ AI & Data</div>
        <div className="pl-4">✓ LangChain / LangGraph [Active]</div>
        <div className="pl-4">✓ Hugging Face [Installed]</div>
        <div className="pl-4">✓ Python [Active]</div>
      </div>
      <div className="pl-4">
        <div className="font-bold">⊞ DevOps</div>
        <div className="pl-4">✓ Docker / Docker Compose [Active]</div>
        <div className="pl-4">✓ Git/GitHub [Active]</div>
        <div className="pl-4">✓ FFmpeg [Installed]</div>
      </div>
      <div className="pl-4">
        <div className="font-bold">⊞ Web & Mobile</div>
        <div className="pl-4">✓ Next.js / React.js [Active]</div>
        <div className="pl-4">✓ FastAPI [Active]</div>
        <div className="pl-4">✓ React Native (Expo) [Active]</div>
        <div className="pl-4">✓ Tailwind CSS [Installed]</div>
      </div>
    </div>
  </div>
);

export default SkillsContent;