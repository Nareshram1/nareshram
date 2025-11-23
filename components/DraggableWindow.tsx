"use client"

import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { WindowState } from '@/lib/types/portfolio.types';

interface DraggableWindowProps {
  window: WindowState;
  activeWindow: string | null;
  setActiveWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximizeWindow: (id: string) => void;
  updateWindowPos: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  playClickSound: () => void;
  bringToFront: (id: string) => void; // New prop
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({ 
  window: win, 
  activeWindow,
  closeWindow,
  minimizeWindow,
  toggleMaximizeWindow,
  updateWindowPos,
  updateWindowSize,
  playClickSound,
  bringToFront
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });
  
  // Handle interaction start (Mouse & Touch)
  const handleInteractionStart = (clientX: number, clientY: number, type: 'drag' | 'resize') => {
    bringToFront(win.id);
    
    if (type === 'drag') {
      if (win.maximized) return;
      setIsDragging(true);
      setDragOffset({ x: clientX - win.x, y: clientY - win.y });
    } else {
      setIsResizing(true);
      setResizeStart({ x: clientX, y: clientY, w: win.width, h: win.height });
    }
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (isDragging) {
        const newX = clientX - dragOffset.x;
        const newY = clientY - dragOffset.y;
        // Simple bounds checking
        const boundedY = Math.max(0, Math.min(window.innerHeight - 40, newY));
        updateWindowPos(win.id, newX, boundedY);
      }
      if (isResizing) {
        const deltaX = clientX - resizeStart.x;
        const deltaY = clientY - resizeStart.y;
        updateWindowSize(
          win.id, 
          Math.max(200, resizeStart.w + deltaX), 
          Math.max(150, resizeStart.h + deltaY)
        );
      }
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
    
    const onUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchend', onUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, win.id, updateWindowPos, updateWindowSize]);

  if (win.minimized) return null;

  const isActive = activeWindow === win.id;

  return (
    <div
      className="absolute bg-[#c0c0c0] border-2 shadow-[2px_2px_10px_rgba(0,0,0,0.5)] flex flex-col"
      style={{
        left: win.maximized ? 0 : win.x,
        top: win.maximized ? 0 : win.y,
        width: win.maximized ? '100vw' : win.width,
        height: win.maximized ? 'calc(100vh - 40px)' : win.height,
        zIndex: win.zIndex, // Use dynamic zIndex
        borderTopColor: '#dfdfdf', borderLeftColor: '#dfdfdf',
        borderRightColor: '#000000', borderBottomColor: '#000000'
      }}
      onMouseDown={() => bringToFront(win.id)}
      onTouchStart={() => bringToFront(win.id)}
    >
      {/* Title Bar */}
      <div
        className={`flex items-center justify-between px-1 py-0.5 select-none ${
          isActive ? 'bg-[#000080] text-white' : 'bg-[#808080] text-[#c0c0c0]'
        }`}
        onMouseDown={(e) => handleInteractionStart(e.clientX, e.clientY, 'drag')}
        onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX, e.touches[0].clientY, 'drag')}
        onDoubleClick={() => toggleMaximizeWindow(win.id)}
      >
        <div className="flex items-center gap-2 font-bold text-sm truncate mr-2">
          {win.icon}
          <span>{win.title}</span>
        </div>
        <div className="flex gap-0.5">
          {[
            { Icon: Minus, action: () => minimizeWindow(win.id), size: 10 },
            { Icon: Square, action: () => toggleMaximizeWindow(win.id), size: 9 },
            { Icon: X, action: () => closeWindow(win.id), size: 12 }
          ].map((btn, i) => (
            <button
              key={i}
              className="w-4 h-4 bg-[#c0c0c0] flex items-center justify-center border border-b-black border-r-black border-t-white border-l-white active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                btn.action();
              }}
            >
              <btn.Icon size={btn.size} className="text-black" />
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-white relative">
        {win.content}
      </div>

      {/* Resize Handle */}
      {!win.maximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
          style={{
            background: 'linear-gradient(135deg, transparent 50%, #000 50%, #000 60%, transparent 60%, transparent 70%, #000 70%, #000 80%, transparent 80%)'
          }}
          onMouseDown={(e) => handleInteractionStart(e.clientX, e.clientY, 'resize')}
          onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX, e.touches[0].clientY, 'resize')}
        />
      )}
    </div>
  );
};

export default DraggableWindow;