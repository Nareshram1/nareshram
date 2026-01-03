"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, SkipBack, SkipForward, Menu, Minus, Zap } from 'lucide-react';

const WinampContent: React.FC = () => {
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(50);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Using a sample MP3 (reusing boot sound or similar for demo if available, or a public placeholder)
    // Ideally we'd have a specific song track. I'll use a placeholder URL for now.
    const TRACK_URL = "/sounds/startup.mp3"; // Fallback to startup sound for demo purposes

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const onEnded = () => setPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (playing) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Playback error:", e));
            }
            setPlaying(!playing);
        }
    };

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setPlaying(false);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-[#181818] text-[#00ff00] font-mono select-none p-1 w-full h-full flex flex-col relative overflow-hidden">
            <audio ref={audioRef} src={TRACK_URL} />

            {/* Title Bar Area (Simulation inside content) */}
            <div className="bg-[#1f1f1f] h-4 mb-1 flex items-center px-1 justify-between text-[10px] text-gray-400 cursor-default">
                <span>WINAMP 2.91</span>
                <div className="flex gap-1">
                    <Minus size={8} />
                    <Square size={8} />
                    <div className="rotate-45"><Menu size={8} /></div>
                </div>
            </div>

            {/* Main Display Area */}
            <div className="flex gap-1 mb-2">
                {/* Time Display */}
                <div className="bg-black border border-gray-600 w-16 h-8 flex items-center justify-center text-xl tracking-widest text-[#00ff00] font-bold font-digital">
                    {formatTime(currentTime)}
                </div>

                {/* Visualizer / Song Title */}
                <div className="flex-1 bg-black border border-gray-600 h-8 relative overflow-hidden flex items-center px-2">
                    <div className="whitespace-nowrap animate-marquee text-xs text-[#00ff00]">
                        1. Windows 98 Startup Sound (Demo Track) *** 128kbps stereo ***
                    </div>
                    <style jsx>{`
                @font-face {
                    font-family: 'Digital';
                    src: url('https://fonts.cdnfonts.com/s/14878/Digital-7.woff') format('woff');
                }
                .font-digital { font-family: 'Courier New', monospace; } /* Fallback */
                .animate-marquee {
                    animation: marquee 10s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
                </div>
            </div>

            {/* Info Line */}
            <div className="flex justify-between text-[10px] text-[#00ff00] mb-2 px-1">
                <span>128 kbps</span>
                <span>44 kHz</span>
                <span className="text-white">mono</span>
            </div>

            {/* Volume / Balance (Mock) */}
            <div className="flex gap-2 mb-2 items-center">
                <div className="text-[10px] text-gray-400">VOL</div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-20 h-2 accent-[#c0c0c0] bg-gray-700 appearance-none cursor-pointer"
                    style={{ appearance: 'auto' }}
                />
                <div className="text-[10px] text-gray-400">BAL</div>
                <input
                    type="range"
                    className="w-10 h-2 bg-gray-700"
                    disabled
                />
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mt-auto pb-1">
                <div className="flex gap-1">
                    <button className="w-6 h-6 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:bg-gray-400" title="Previous">
                        <SkipBack size={12} fill="black" className="text-black" />
                    </button>
                    <button className="w-6 h-6 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:bg-gray-400" onClick={togglePlay} title="Play">
                        <Play size={12} fill="black" className="text-black" />
                    </button>
                    <button className="w-6 h-6 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:bg-gray-400" onClick={togglePlay} title="Pause">
                        <Pause size={12} fill="black" className="text-black" />
                    </button>
                    <button className="w-6 h-6 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:bg-gray-400" onClick={stop} title="Stop">
                        <Square size={10} fill="black" className="text-black" />
                    </button>
                    <button className="w-6 h-6 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:bg-gray-400" title="Next">
                        <SkipForward size={12} fill="black" className="text-black" />
                    </button>
                </div>

                <button className="w-6 h-6 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:bg-gray-400" title="Shuffle">
                    <Zap size={12} fill="black" className="text-black" />
                </button>
            </div>

            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-2 h-2 border-tr border-gray-500"></div>
        </div>
    );
};

export default WinampContent;
