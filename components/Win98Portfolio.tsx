"use client"

import React, { useState, useEffect, useCallback } from 'react'; // <-- MODIFIED (added useCallback)
import Image from 'next/image'
import { 
  Folder, FileText, Globe, Mail, Settings, 
  Trash2, Volume2, User 
} from 'lucide-react';
import { 
  WindowState, 
  Wallpaper, 
  Win98PortfolioProps 
} from '@/lib/types/portfolio.types';

// Import the separated components
import DraggableWindow from './DraggableWindow';
import DesktopIcon from './DesktopIcon';
import AboutContent from './content/AboutContent';
import ProjectsContent from './content/ProjectsContent';
import SkillsContent from './content/SkillsContent';
import ContactContent from './content/ContactContent';
import RecycleBinContent from './content/RecycleBinContent';
import ReadMeContent from './content/ReadMeContent';
import MyProjectsContent from './content/MyProjectsContent';

// Main Portfolio Component
const Win98Portfolio: React.FC<Win98PortfolioProps> = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const [time, setTime] = useState<Date>(new Date());
  const [wallpaper, setWallpaper] = useState<Wallpaper>('teal');
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [showSystemTray, setShowSystemTray] = useState<boolean>(false);
  const [cpuUsage, setCpuUsage] = useState<number>(0);
  const [volume, setVolume] = useState<number>(50);
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate CPU usage
  useEffect(() => {
    const cpuTimer = setInterval(() => {
      const newUsage = Math.floor(Math.random() * 30) + (windows.length * 5);
      setCpuUsage(Math.min(newUsage, 100));
    }, 2000);
    return () => clearInterval(cpuTimer);
  }, [windows.length]);

  const playClickSound = useCallback(() => {
    const audio = new Audio('/sounds/click.mp3');
    audio.play().catch(e => console.error("Error playing click sound:", e));
  }, []);

  const playErrorSound = useCallback(() => {
    const audio = new Audio('/sounds/error.mp3');
    audio.play().catch(e => console.error("Error playing error sound:", e));
  }, []);

  const wallpapers: Record<Wallpaper, string> = {
    teal: 'bg-[#008080]',
    clouds: 'bg-gradient-to-b from-blue-400 to-blue-200',
    bricks: 'bg-red-800',
    green: 'bg-green-700'
  };

  const createWindow = (
    id: string, 
    title: string, 
    content: React.ReactNode, 
    icon: React.ReactNode, 
    width: number = 600, 
    height: number = 400
  ) => {
    if (windows.find(w => w.id === id)) {
      setActiveWindow(id);
      restoreWindow(id);
      return;
    }

    const newWindow: WindowState = {
      id,
      title,
      content,
      icon,
      x: 50 + windows.length * 30,
      y: 50 + windows.length * 30,
      width,
      height,
      minimized: false,
      maximized: false,
      prevData: null
    };
    setWindows([...windows, newWindow]);
    setActiveWindow(id);
  };

  const closeWindow = (id: string) => {
    playClickSound();
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindow === id) {
      const remainingWindows = windows.filter(w => w.id !== id && !w.minimized);
      setActiveWindow(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null);
    }
  };

  const minimizeWindow = (id: string) => {
    playClickSound();
    setWindows(windows.map(w => w.id === id ? {...w, minimized: true} : w));
    const remainingWindows = windows.filter(w => w.id !== id && !w.minimized);
    setActiveWindow(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null);
  };

  const restoreWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? {...w, minimized: false} : w));
    setActiveWindow(id);
  };

  const toggleMaximizeWindow = (id: string) => {
    playClickSound();
    setWindows(prevWindows =>
      prevWindows.map(w => {
        if (w.id === id) {
          if (w.maximized) {
            if (!w.prevData) return w;
            return {
              ...w,
              maximized: false,
              x: w.prevData.x,
              y: w.prevData.y,
              width: w.prevData.width,
              height: w.prevData.height,
              prevData: null
            };
          } else {
            return {
              ...w,
              maximized: true,
              prevData: { x: w.x, y: w.y, width: w.width, height: w.height },
              x: 0,
              y: 0
            };
          }
        }
        return w;
      })
    );
    setActiveWindow(id);
  };

  const updateWindowPos = useCallback((id: string, x: number, y: number) => {
    setWindows(prevWindows =>
      prevWindows.map(w => (w.id === id ? { ...w, x, y } : w))
    );
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prevWindows =>
      prevWindows.map(w => (w.id === id ? { ...w, width, height } : w))
    );
  }, []);

  return (
    <div 
      className={`h-screen w-screen ${wallpapers[wallpaper]} overflow-hidden relative font-sans`}
      onClick={() => {
        if (showSystemTray) setShowSystemTray(false);
      }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap');
        .font-sans {
          font-family: 'Tahoma', 'Verdana', sans-serif;
        }
        .text-shadow {
          text-shadow: 1px 1px 1px rgba(0,0,0,0.7);
        }
      `}</style>

      {/* Desktop Icons */}
      <div className="p-4 grid grid-cols-1 gap-2 w-24">
        <DesktopIcon
          icon={<Folder className="text-yellow-600" size={32} />}
          label="My Computer"
          onClick={() => {
            playClickSound();
            createWindow('projects', 'My Computer', <ProjectsContent />, <Folder size={16} />);
          }}
        />
        <DesktopIcon
          icon={<FileText size={32} />}
          label="ReadMe.txt"
          onClick={() => {
            playClickSound();
            createWindow('readme', 'ReadMe.txt - Notepad', <ReadMeContent />, <FileText size={16} />, 500, 400);
          }}
        />
        <DesktopIcon
          icon={<Folder className="text-yellow-600" size={32} />}
          label="My Projects"
          onClick={() => {
            playClickSound();
            createWindow(
              'my_projects', 
              'My Projects', 
              <MyProjectsContent 
                createWindow={createWindow} 
                playClickSound={playClickSound} 
              />, 
              <Folder size={16} />,
              500,
              350
            );
          }}
        />
        <DesktopIcon
          icon={<Trash2 className="text-gray-700" size={32} />}
          label="Recycle Bin"
          onClick={() => {
            playClickSound();
            createWindow('recycle', 'Recycle Bin', <RecycleBinContent />, <Trash2 size={16} />);
          }}
        />
      </div>

      {/* Windows */}
      {windows.map(win => (
        <DraggableWindow
          key={win.id}
          window={win}
          activeWindow={activeWindow}
          setActiveWindow={setActiveWindow}
          closeWindow={closeWindow}
          minimizeWindow={minimizeWindow}
          toggleMaximizeWindow={toggleMaximizeWindow}
          updateWindowPos={updateWindowPos}
          updateWindowSize={updateWindowSize}
          playClickSound={playClickSound}
        />
      ))}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#c0c0c0] border-t-2 border-white flex items-center px-1 gap-1 z-40 ">
        <button
          className={`px-3 py-1 bg-[#c0c0c0] border-2 font-bold flex items-center gap-2 cursor-pointer ${startMenuOpen ? 'border-t-black border-l-black border-r-white border-b-white' : 'border-t-white border-l-white border-r-black border-b-black'}`}
          onClick={() => {
            playClickSound();
            setStartMenuOpen(!startMenuOpen);
          }}
        >
            <img src='/start-logo.png' alt='Start' width={25} height={25}/>
          
          <span className="text-black">Start</span>
        </button>

        <div className="h-full border-l-2 border-gray-500 border-r-2 border-white mx-1"></div>

        {/* Quick Launch Icons */}
        <div className="flex gap-1 items-center h-full px-1">
          <button
            className="w-7 h-7 border-2 border-transparent hover:border-white hover:border-t-white hover:border-l-white hover:border-r-black hover:border-b-black flex items-center justify-center bg-[#c0c0c0]"
            onClick={() => {
              playClickSound();
              createWindow('readme', 'ReadMe.txt - Notepad', <ReadMeContent />, <FileText size={16} />, 500, 400);
            }}
            title="ReadMe.txt"
          >
            <FileText size={16} />
          </button>
          <button
            className="w-7 h-7 border-2 border-transparent hover:border-white hover:border-t-white hover:border-l-white hover:border-r-black hover:border-b-black flex items-center justify-center bg-[#c0c0c0]"
            onClick={() => {
              playClickSound();
              createWindow('contact', 'Outlook Express - New Message', <ContactContent />, <Mail size={16} />);
            }}
            title="Outlook Express"
          >
            <Mail size={16} className="text-blue-600" />
          </button>
          <button
            className="w-7 h-7 border-2 border-transparent hover:border-white hover:border-t-white hover:border-l-white hover:border-r-black hover:border-b-black flex items-center justify-center bg-[#c0c0c0]"
            onClick={() => {
              playClickSound();
              window.open('https://github.com/Nareshram1', '_blank');
            }}
            title="Internet Explorer"
          >
            <Globe size={16} className="text-blue-700" />
          </button>
        </div>

        <div className="h-full border-l-2 border-gray-500 border-r-2 border-white mx-1"></div>

        <div className="flex gap-1 flex-1 overflow-x-auto h-full items-center">
          {windows.map(win => (
            <button
              key={win.id}
              className={`px-2 py-1 border-2 text-sm flex items-center gap-1 h-7 min-w-[100px] max-w-[200px] ${
                activeWindow === win.id && !win.minimized
                  ? 'bg-[#a0a0a0] font-bold'
                  : 'bg-[#c0c0c0]'
              }`}
              style={{
                borderTopColor: activeWindow === win.id && !win.minimized ? '#000000' : '#ffffff',
                borderLeftColor: activeWindow === win.id && !win.minimized ? '#000000' : '#ffffff',
                borderRightColor: activeWindow === win.id && !win.minimized ? '#ffffff' : '#000000',
                borderBottomColor: activeWindow === win.id && !win.minimized ? '#ffffff' : '#000000'
              }}
              onClick={() => {
                playClickSound();
                if (win.minimized) {
                  restoreWindow(win.id);
                } else if (activeWindow === win.id) {
                  minimizeWindow(win.id);
                } else {
                  setActiveWindow(win.id);
                }
              }}
            >
              {win.icon}
              <span className="truncate">{win.title}</span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="border-2 px-2 h-7 flex items-center gap-2" style={{
          borderTopColor: '#808080',
          borderLeftColor: '#808080',
          borderRightColor: '#ffffff',
          borderBottomColor: '#ffffff'
        }}>
          {/* CPU Indicator */}
          <div 
            className="relative group cursor-pointer"
            title={`CPU Usage: ${cpuUsage}%`}
          >
            <div className="w-4 h-4 bg-gray-700 border border-gray-900 flex items-end justify-center overflow-hidden">
              <div 
                className="w-full bg-green-500 transition-all duration-300"
                style={{ height: `${cpuUsage}%` }}
              />
            </div>
          </div>

          {/* Volume Control */}
          <button
            className="relative group"
            onClick={(e) => {
              e.stopPropagation();
              playClickSound();
              setShowSystemTray(!showSystemTray);
            }}
            title={`Volume: ${volume}%`}
          >
            <Volume2 size={16} className={volume === 0 ? 'text-red-600' : ''} />
          </button>

          {/* Clock with Easter Egg */}
          <button
            className="text-sm font-medium hover:bg-[#000080] hover:text-white px-1 transition-colors"
            onClick={() => {
              playClickSound();
              const messages = [
                "It's always time to code! 💻",
                "Don't forget to take a break! ☕",
                "You've been here for a while... 👀",
                "Time flies when you're having fun! 🚀",
                "Quick! Check your emails! 📧"
              ];
              alert(messages[Math.floor(Math.random() * messages.length)]);
            }}
            title="Click for a surprise!"
          >
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </button>
        </div>

        {/* Volume Slider Popup */}
        {showSystemTray && (
          <div
            className="absolute bottom-12 right-2 w-48 bg-[#c0c0c0] border-2 border-white shadow-lg p-3 z-50"
            style={{
              borderTopColor: '#ffffff',
              borderLeftColor: '#ffffff',
              borderRightColor: '#000000',
              borderBottomColor: '#000000'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs font-bold mb-2">Volume Control</div>
            <div className="flex items-center gap-2">
              <Volume2 size={14} />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setVolume(parseInt(e.target.value));
                  playClickSound();
                }}
                className="flex-1"
              />
              <span className="text-xs w-8">{volume}%</span>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              System Tray: {windows.length} window{windows.length !== 1 ? 's' : ''} open
            </div>
          </div>
        )}
      </div>

      {/* Start Menu */}
      {startMenuOpen && (
        <div
          className="absolute bottom-10 left-0 w-64 bg-[#c0c0c0] border-2 shadow-lg z-50"
          style={{
            borderTopColor: '#ffffff',
            borderLeftColor: '#ffffff',
            borderRightColor: '#000000',
            borderBottomColor: '#000000'
          }}
          onClick={() => setStartMenuOpen(false)}
        >
          <div className="bg-gradient-to-b from-[#000080] to-[#1084d0] text-white py-2 px-3 font-bold text-xl flex items-end">
            <span className="italic text-2xl">Windows</span><span className="font-normal text-lg">98</span>
          </div>
          
          <div className="p-1">
            <button
              className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white flex items-center gap-2"
              onClick={() => {
                playClickSound();
                createWindow('about', 'About Me - System Properties', <AboutContent />, <User size={16} />);
              }}
            >
              <User size={20} />
              About Me
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white flex items-center gap-2"
              onClick={() => {
                playClickSound();
                createWindow('projects', 'My Computer', <ProjectsContent />, <Folder size={16} />);
              }}
            >
              <Folder size={20} />
              Projects
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white flex items-center gap-2"
              onClick={() => {
                playClickSound();
                createWindow('readme', 'ReadMe.txt - Notepad', <ReadMeContent />, <FileText size={16} />, 500, 400);
              }}
            >
              <FileText size={20} />
              ReadMe.txt
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white flex items-center gap-2"
              onClick={() => {
                playClickSound();
                createWindow('skills', 'Device Manager', <SkillsContent />, <Settings size={16} />);
              }}
            >
              <Settings size={20} />
              Skills
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white flex items-center gap-2"
              onClick={() => {
                playClickSound();
                createWindow('contact', 'Outlook Express - New Message', <ContactContent />, <Mail size={16} />);
              }}
            >
              <Mail size={20} />
              Contact
            </button>
            <div className="border-t-2 border-[#808080] my-1 mx-2"></div>
            <button
              className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white flex items-center gap-2"
              onClick={() => { 
                playClickSound();
                alert('Thanks for visiting! 👋');
              }} 
            >
              <Volume2 size={20} />
              Shut Down...
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Win98Portfolio;