import React from 'react';
import { FileText } from 'lucide-react';


const RecycleBinContent: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold border-b-2 border-[#000080] pb-2">Recycle Bin</h2>
    <p>These items have been deleted.</p>
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2 opacity-70">
        <FileText size={24} />
        <span>old_readme.txt</span>
      </div>
      <div className="flex items-center gap-2 p-2 opacity-70">
        <FileText size={24} />
        <span>v1_portfolio.zip</span>
      </div>
    </div>
  </div>
);

export default RecycleBinContent;