"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

import { Volume2 } from "lucide-react";
import dynamic from 'next/dynamic'
 
const Win98PortfolioComponent = dynamic(() => import('../components/Win98Portfolio'), { ssr: false })
type BootStep = "login" | "booting" | "desktop" | "shutdown";

export default function HomePage() {
  const [bootStep, setBootStep] = useState<BootStep>("login");
  const [booting, setBooting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Memoize handleLogin to prevent unnecessary re-renders in useEffect
  const handleLogin = useCallback(() => {
    if (booting) return;
    setBooting(true);

    if (audioRef.current) {
      console.log("audio here");
      audioRef.current.play().catch((e) => console.error("Audio play failed:", e));
    }

    setBootStep("booting");
    setTimeout(() => setBootStep("desktop"), 2000);
  }, [booting]); // Dependency on 'booting' state

  const handleShutdown = useCallback(() => {
    const shutdownaudio = new Audio('/sounds/shutdown.mp3');
    shutdownaudio.play().catch(e => console.error("Error playing shutdown sound:", e));
    setBootStep("shutdown")
  }, []);
  const handleRestart = useCallback(() => {
    setBootStep("login");
    setBooting(false);
  }, []);

  // --- Detect key press for login screen ---
  useEffect(() => {
    if (bootStep !== "login") return;

    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      handleLogin();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [bootStep, handleLogin]);

  return (
    <>
      <audio ref={audioRef} src="/sounds/boot.mp3" preload="auto" />

      {/* --- Login Screen (Re-imagined Layout) --- */}
      {bootStep === "login" && (
        <div
          className="h-screen w-screen bg-[#008080] flex items-center justify-center p-4" // Added padding
          onKeyDown={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          tabIndex={0}
        >
          {/* Centered container with distinct Win98-style box */}
          <div
            className="bg-[#c0c0c0] border-2 border-solid"
            style={{
              borderTopColor: "#ffffff",
              borderLeftColor: "#ffffff",
              borderRightColor: "#000000",
              borderBottomColor: "#000000",
              padding: '24px 40px', // More generous internal padding
              maxWidth: '90%', // Ensure it doesn't get too wide on small screens
              width: '450px', // Max width for a typical Win98 dialog feel
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.75)' // Add some depth
            }}
          >
            {/* Title Bar - Mimicking Win98 style */}
            <div className="w-full bg-[#000080] text-white py-1 px-2 text-sm flex items-center justify-between font-bold cursor-default"
                 style={{ borderBottom: '1px solid #c0c0c0', marginBottom: '24px' }}>
                Windows 98 Portfolio
                <div className="flex">
                    <button className="w-4 h-4 bg-[#c0c0c0] border border-solid border-gray-700 mr-1 text-xs leading-none flex items-center justify-center"
                            style={{ borderTopColor: '#fff', borderLeftColor: '#fff' }}>_</button>
                    <button className="w-4 h-4 bg-[#c0c0c0] border border-solid border-gray-700 text-xs leading-none flex items-center justify-center"
                            style={{ borderTopColor: '#fff', borderLeftColor: '#fff' }}>X</button>
                </div>
            </div>


            <p className="text-black font-ms-sans-serif text-lg mb-4 text-center">
              Enter your credentials to continue.
            </p>

            {/* Faux Input Fields (for visual effect) */}
            <div className="w-full mb-6 text-black font-ms-sans-serif text-base">
                <div className="flex items-center mb-2">
                    <label className="w-24 shrink-0">User name:</label>
                    <input type="text" value="Guest" readOnly
                           className="flex-grow bg-white border-2 border-solid border-gray-700 px-2 py-1"
                           style={{ borderTopColor: '#808080', borderLeftColor: '#808080', borderRightColor: '#ffffff', borderBottomColor: '#ffffff' }} />
                </div>
                <div className="flex items-center">
                    <label className="w-24 shrink-0">Password:</label>
                    <input type="password" value="********" readOnly
                           className="flex-grow bg-white border-2 border-solid border-gray-700 px-2 py-1"
                           style={{ borderTopColor: '#808080', borderLeftColor: '#808080', borderRightColor: '#ffffff', borderBottomColor: '#ffffff' }} />
                </div>
            </div>


            {/* Log In Button - Now more prominent and aligned */}
            <button
              onClick={handleLogin}
              className="px-6 py-2 bg-[#c0c0c0] border-2 font-bold text-base flex items-center justify-center gap-2 mt-4" // Adjusted padding and font size
              style={{
                borderTopColor: "#ffffff",
                borderLeftColor: "#ffffff",
                borderRightColor: "#000000",
                borderBottomColor: "#000000",
                minWidth: '120px' // Give button a consistent minimum width
              }}
            >
              <Volume2 size={20} /> {/* Smaller icon for better fit */}
              {' Log In'}
            </button>

            {/* "Press any key" hint - positioned at bottom for subtle guidance */}
            <p
              className="mt-8 text-black text-sm font-mono animate-pulse cursor-pointer"
              onClick={(e) => {
                (e.currentTarget.parentElement?.parentElement as HTMLElement)?.focus();
              }}
            >
              Press any key to start...
            </p>
          </div>
        </div>
      )}

      {/* --- Booting Screen --- */}
      {bootStep === "booting" && (
        <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-gray-400 font-mono">
          <p className="text-xl mb-2">Windows is starting up...</p>
          <p className="text-base mb-6">Please wait.</p>
          <div className="w-64 h-4 bg-gray-800 border border-gray-600 mt-4 overflow-hidden rounded-sm"> {/* Refined progress bar */}
            <div className="h-full bg-blue-600 animate-pulse w-full"></div>
          </div>
        </div>
      )}

      {/* --- Shutdown Screen --- */}
      {bootStep === "shutdown" && (
        <div className="h-screen w-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-orange-500 text-4xl font-bold mb-4">
              It&apos;s now safe to turn off your computer.
            </h1>
            <button
              onClick={handleRestart}
              className="mt-8 px-6 py-2 bg-[#c0c0c0] border-2 font-bold text-black"
              style={{
                borderTopColor: "#ffffff",
                borderLeftColor: "#ffffff",
                borderRightColor: "#000000",
                borderBottomColor: "#000000",
              }}
            >
              Restart
            </button>
          </div>
        </div>
      )}

      {/* --- Desktop --- */}
      {bootStep === "desktop" && (
        <Win98PortfolioComponent onShutdown={handleShutdown} />
      )}
    </>
  );
}