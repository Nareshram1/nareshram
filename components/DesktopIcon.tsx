"use client"

import React from 'react';
import { DesktopIconProps } from '@/lib/types/portfolio.types';

// --- DesktopIcon Component ---
const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onClick }) => (
  <button
    className="flex flex-col items-center w-20 p-2 text-white hover:bg-[#000080] hover:bg-opacity-30 group"
    onDoubleClick={onClick}
    onClick={() => {}} // Prevent single-click action
  >
    <div className="bg-[#c0c0c0] p-2 border-2 group-hover:bg-[#c0c0c0]" style={{
      borderTopColor: '#ffffff',
      borderLeftColor: '#ffffff',
      borderRightColor: '#000000',
      borderBottomColor: '#000000'
    }}>
      {icon}
    </div>
    <span className="text-xs mt-1 text-center text-shadow">{label}</span>
  </button>
);

export default DesktopIcon;