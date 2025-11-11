// DesktopIcon.tsx

"use client"

import React, { useState, useEffect } from 'react';
import { DesktopIconProps } from '@/lib/types/portfolio.types';

// --- DesktopIcon Component ---
const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  icon, 
  label, 
  onClick,
  x, // New prop
  y, // New prop
  onMove // New prop
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent starting drag on right-click, etc.
    if (e.button !== 0) return; 
    
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - x,
      y: e.clientY - y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;
      
      // Basic boundary checks
      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX > window.innerWidth - 80) newX = window.innerWidth - 80; // 80 is icon width
      if (newY > window.innerHeight - 110) newY = window.innerHeight - 110; // 110 is icon height + taskbar
      
      onMove(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onMove]);

  return (
    <div
      className={`absolute flex flex-col items-center w-20 cursor-pointer ${isDragging ? 'opacity-75 z-50' : 'z-10'}`}
      style={{ left: `${x}px`, top: `${y}px` }}
      onMouseDown={handleMouseDown}
    >
      <button
        className="flex flex-col items-center p-2 text-white hover:bg-[#000080] hover:bg-opacity-30 group"
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
    </div>
  );
};

export default DesktopIcon;