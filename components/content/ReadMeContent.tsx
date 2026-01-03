"use client";

import React, { useState, useEffect, useRef } from "react";

const DEFAULT_CONTENT = `README.TXT
==========

Hi there! 👋 I'm Naresh Ram
---------------------------

💫 ABOUT ME
- 🔭 Currently working on MERN Stack applications
- 👯 Open to collaborating on MERN Stack projects
- 🤝 Looking for help with Flutter
- 🌱 Currently learning GoLang
- 💬 Ask me about Next.js

🌍 SOCIALS
- LinkedIn: https://linkedin.com/in/nareshram1
- Instagram: https://instagram.com/Nareshram1
- GitHub: https://github.com/Nareshram1

💻 TECH STACK
==============
Languages:
- C, C++, Java, JavaScript, TypeScript, GoLang, Python

Frontend:
- HTML5, CSS3, React, Next.js, React Native, Bootstrap, MUI, DaisyUI

Backend:
- Node.js, Express.js, FastAPI, Flask

Databases:
- PostgreSQL, MongoDB, Redis, Supabase, Firebase

Tools & Platforms:
- Docker, Git, GitHub, Jira, Render, Vercel, Netlify, Google Cloud, Anaconda`;

const ReadMeContent: React.FC = () => {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [wordWrap, setWordWrap] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("notepad_content");
    if (saved) setContent(saved);
  }, []);

  const handleSave = () => {
    localStorage.setItem("notepad_content", content);
    setActiveMenu(null);
    alert("File saved successfully!");
  };

  const handleNew = () => {
    if (confirm("Are you sure you want to create a new file? Unsaved changes will be lost.")) {
      setContent("");
      setActiveMenu(null);
    }
  }

  const handleOpen = () => {
    const saved = localStorage.getItem("notepad_content");
    if (saved) {
      setContent(saved);
    } else {
      setContent(DEFAULT_CONTENT);
    }
    setActiveMenu(null);
  }

  const toggleWordWrap = () => {
    setWordWrap(!wordWrap);
    setActiveMenu(null);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClick = () => setActiveMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white font-sans text-xs" onClick={(e) => e.stopPropagation()}>
      {/* Menu Bar */}
      <div className="flex bg-[#c0c0c0] border-b border-gray-400 select-none">
        <Menu
          label="File"
          isActive={activeMenu === 'File'}
          onToggle={() => setActiveMenu(activeMenu === 'File' ? null : 'File')}
        >
          <MenuItem label="New" onClick={handleNew} />
          <MenuItem label="Open" onClick={handleOpen} />
          <MenuItem label="Save" onClick={handleSave} />
          <div className="border-t border-gray-400 my-1"></div>
          <MenuItem label="Exit" onClick={() => { }} disabled />
        </Menu>
        <Menu
          label="Edit"
          isActive={activeMenu === 'Edit'}
          onToggle={() => setActiveMenu(activeMenu === 'Edit' ? null : 'Edit')}
        >
          <MenuItem label="Word Wrap" checked={wordWrap} onClick={toggleWordWrap} />
          <MenuItem label="Select All" onClick={() => editorRef.current?.select()} />
          <MenuItem label="Time/Date" onClick={() => {
            const now = new Date().toLocaleString();
            setContent(prev => prev + now);
            setActiveMenu(null);
          }} />
        </Menu>
        <Menu
          label="Search"
          isActive={activeMenu === 'Search'}
          onToggle={() => setActiveMenu(activeMenu === 'Search' ? null : 'Search')}
        >
          <MenuItem label="Find..." disabled />
          <MenuItem label="Find Next" disabled />
        </Menu>
        <Menu
          label="Help"
          isActive={activeMenu === 'Help'}
          onToggle={() => setActiveMenu(activeMenu === 'Help' ? null : 'Help')}
        >
          <MenuItem label="About Notepad" onClick={() => alert("Windows 98 Notepad Clone\nCreated by Naresh Ram")} />
        </Menu>
      </div>

      {/* Editor Area */}
      <textarea
        ref={editorRef}
        className={`flex-1 w-full resize-none outline-none border-none p-1 font-mono text-sm ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'}`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        spellCheck={false}
        style={{ fontFamily: '"Lucida Console", monospace' }}
      />
    </div>
  );
};

const Menu: React.FC<{ label: string, isActive: boolean, onToggle: () => void, children: React.ReactNode }> = ({ label, isActive, onToggle, children }) => (
  <div className="relative">
    <div
      className={`px-2 py-1 cursor-pointer hover:bg-[#000080] hover:text-white ${isActive ? 'bg-[#000080] text-white' : 'text-black'}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      {label}
    </div>
    {isActive && (
      <div className="absolute top-full left-0 min-w-[150px] bg-[#c0c0c0] border-2 border-white border-r-black border-b-black shadow-lg z-50 flex flex-col py-1 text-black">
        {children}
      </div>
    )}
  </div>
);

const MenuItem: React.FC<{ label: string, onClick?: () => void, disabled?: boolean, checked?: boolean }> = ({ label, onClick, disabled, checked }) => (
  <button
    className="text-left px-4 py-1 hover:bg-[#000080] hover:text-white disabled:text-gray-500 disabled:hover:bg-transparent disabled:hover:text-gray-500 flex items-center gap-2 group"
    onClick={(e) => {
      e.stopPropagation();
      if (!disabled && onClick) onClick();
    }}
    disabled={disabled}
  >
    <span className="w-4 text-center">{checked && "✓"}</span>
    {label}
  </button>
);

export default ReadMeContent;
