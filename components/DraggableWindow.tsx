"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'; // <-- MODIFIED
import { X, Minus, Square } from 'lucide-react';
import { DraggableWindowProps } from '@/lib/types/portfolio.types';

// --- DraggableWindow Component ---
const DraggableWindow: React.FC<DraggableWindowProps> = ({ 
  window: win, 
  activeWindow,
  setActiveWindow,
  closeWindow,
  minimizeWindow,
  toggleMaximizeWindow,
  updateWindowPos,
  updateWindowSize,
  playClickSound
}) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [resizing, setResizing] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement | null>(null);

  // --- NEW Focus Handler ---
  // This function handles focusing the window and playing the sound
  const handleFocus = useCallback(() => { // <-- NEW
    if (activeWindow !== win.id) { // <-- NEW
      playClickSound(); // <-- NEW
    } // <-- NEW
    setActiveWindow(win.id); // <-- NEW
  }, [activeWindow, win.id, playClickSound, setActiveWindow]); // <-- NEW
  // --- End Focus Handler ---

  // Dragging Logic
  const handleDragMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (win.maximized || (e.target as HTMLElement).closest('.window-content') || (e.target as HTMLElement).closest('.window-button') || (e.target as HTMLElement).closest('.resize-handle')) return;
    e.preventDefault();
    setDragging(true);
    setDragOffset({
      x: e.clientX - win.x,
      y: e.clientY - win.y
    });
    handleFocus(); // <-- MODIFIED
  };

  // Resizing Logic
  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (win.maximized) return;
    setResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: win.width,
      height: win.height
    });
    handleFocus(); // <-- MODIFIED
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;
        
        const taskbarHeight = 40;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight - taskbarHeight;
        
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + win.width > screenWidth) newX = screenWidth - win.width;
        if (newY + 24 > screenHeight) newY = screenHeight - 24; // 24px is title bar

        updateWindowPos(win.id, newX, newY);
      }
      if (resizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(resizeStart.width + deltaX, 200); // Min width
        const newHeight = Math.max(resizeStart.height + deltaY, 150); // Min height
        updateWindowSize(win.id, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
    };

    if (dragging || resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
      dragging, 
      resizing, 
      dragOffset, 
      resizeStart, 
      win.id, 
      win.width, 
      win.height, 
      updateWindowPos,
      updateWindowSize
  ]);

  if (win.minimized) return null;

  const windowStyle: React.CSSProperties = win.maximized
    ? {
        left: '0px',
        top: '0px',
        width: '100vw',
        height: 'calc(100vh - 40px)',
        transition: 'all 0.1s ease-out'
      }
    : {
        left: `${win.x}px`,
        top: `${win.y}px`,
        width: `${win.width}px`,
        height: `${win.height}px`,
      };

  return (
    <div
      ref={windowRef}
      className={`absolute bg-[#c0c0c0] border-2 shadow-lg ${
        activeWindow === win.id ? 'z-30' : 'z-20'
      } ${win.maximized ? '' : 'resize'}`}
      style={{
        ...windowStyle,
        borderTopColor: '#ffffff',
        borderLeftColor: '#ffffff',
        borderRightColor: '#000000',
        borderBottomColor: '#000000'
      }}
      onClick={handleFocus} // <-- MODIFIED (handles clicks on content area, etc.)
    >
      <div
        className={`flex items-center justify-between px-1 py-1 text-white text-sm font-bold ${
          win.maximized ? 'cursor-default' : 'cursor-move'
        } ${
          activeWindow === win.id ? 'bg-gradient-to-r from-[#000080] to-[#1084d0]' : 'bg-gray-600'
        }`}
        onMouseDown={handleDragMouseDown}
        onDoubleClick={() => toggleMaximizeWindow(win.id)}
      >
        <div className="flex items-center gap-1">
          {win.icon}
          <span>{win.title}</span>
        </div>
        <div className="flex gap-1">
          <button
            className="window-button w-4 h-4 bg-[#c0c0c0] border flex items-center justify-center text-black"
            style={{
              borderTopColor: '#ffffff',
              borderLeftColor: '#ffffff',
              borderRightColor: '#000000',
              borderBottomColor: '#000000'
            }}
            onClick={(e) => { // <-- MODIFIED
              e.stopPropagation(); // <-- NEW (prevent parent onClick from firing)
              minimizeWindow(win.id);
            }} // <-- MODIFIED
          >
            <Minus size={10} />
          </button>
          <button
            className="window-button w-4 h-4 bg-[#c0c0c0] border flex items-center justify-center text-black"
            style={{
              borderTopColor: '#ffffff',
              borderLeftColor: '#ffffff',
              borderRightColor: '#000000',
              borderBottomColor: '#000000'
            }}
            onClick={(e) => { // <-- MODIFIED
              e.stopPropagation(); // <-- NEW (prevent parent onClick from firing)
              toggleMaximizeWindow(win.id);
            }} // <-- MODIFIED
          >
            <Square size={8} />
          </button>
          <button
            className="window-button w-4 h-4 bg-[#c0c0c0] border flex items-center justify-center text-black"
            style={{
              borderTopColor: '#ffffff',
              borderLeftColor: '#ffffff',
              borderRightColor: '#000000',
              borderBottomColor: '#000000'
            }}
            onClick={(e) => { // <-- MODIFIED
              e.stopPropagation(); // <-- NEW (prevent parent onClick from firing)
              closeWindow(win.id);
            }} // <-- MODIFIED
          >
            <X size={10} />
          </button>
        </div>
      </div>
      <div className="window-content bg-white h-[calc(100%-24px)] overflow-auto p-4">
        {win.content}
      </div>

      {!win.maximized && (
        <div
          className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          style={{
            clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
            backgroundColor: '#c0c0c0',
            borderRight: '2px solid #000',
            borderBottom: '2px solid #000',
            borderLeft: '2px solid #fff',
            borderTop: '2px solid #fff',
            transform: 'translateX(2px) translateY(2px)'
          }}
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
};

export default DraggableWindow;