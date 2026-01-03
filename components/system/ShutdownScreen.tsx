"use client";

import React from 'react';

const ShutdownScreen: React.FC<{ onRestart: () => void }> = ({ onRestart }) => {
    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center font-sans select-none z-[99999]">
            <div className="text-[#ff6600] text-2xl md:text-3xl font-bold tracking-wider mb-8 text-center px-4" style={{ textShadow: "2px 2px 0px #803300" }}>
                It is now safe to turn off your computer.
            </div>

            <button
                onClick={onRestart}
                className="px-6 py-2 bg-[#c0c0c0] border-2 border-white border-r-black border-b-black text-black font-bold active:border-t-black active:border-l-black active:border-r-white active:border-b-white active:bg-[#a0a0a0]"
            >
                Restart
            </button>
        </div>
    );
};

export default ShutdownScreen;
