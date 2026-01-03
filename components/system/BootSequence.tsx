"use client";

import React, { useState, useEffect } from 'react';

interface BootSequenceProps {
    onComplete: () => void;
}

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
    const [step, setStep] = useState<'bios' | 'splash'>('bios');
    const [memory, setMemory] = useState(0);
    const TOTAL_MEMORY = 65536; // 64MB in KB

    useEffect(() => {
        if (step === 'bios') {
            const memInterval = setInterval(() => {
                setMemory(prev => {
                    const next = prev + 1024;
                    if (next >= TOTAL_MEMORY) {
                        clearInterval(memInterval);
                        setTimeout(() => setStep('splash'), 1500); // Wait a bit after memory count
                        return TOTAL_MEMORY;
                    }
                    return next;
                });
            }, 20); // Fast count
            return () => clearInterval(memInterval);
        } else if (step === 'splash') {
            // Show splash for 3 seconds then complete
            const timer = setTimeout(onComplete, 4000);
            return () => clearTimeout(timer);
        }
    }, [step, onComplete]);

    if (step === 'bios') {
        return (
            <div className="fixed inset-0 bg-black text-[#c0c0c0] font-mono p-10 cursor-none z-[99999] select-none text-lg">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div>Award Modular BIOS v4.51PG, An Energy Star Ally</div>
                        <div>Copyright (C) 1984-98, Award Software, Inc.</div>
                    </div>
                    <div className="border-4 border-white p-2 text-xs font-bold w-32 text-center text-white">
                        <div className="text-xl mb-1">EPA POLLUTION PREVENTER</div>
                        <div>ENERGY STAR</div>
                    </div>
                </div>

                <div className="space-y-1">
                    <div>PENTIUM-II CPU at 400MHz</div>
                    <div className="mb-4">Memory Test : {memory}K OK</div>

                    <div className="mt-8">
                        <div>Award Plug and Play BIOS Extension v1.0A</div>
                        <div>Copyright (C) 1998, Award Software, Inc.</div>
                        <div>Detecting HDD Primary Master ... <span className="text-white">QUANTUM FIREBALL CX13.0A</span></div>
                        <div>Detecting HDD Primary Slave  ... <span className="text-white">None</span></div>
                        <div>Detecting HDD Secondary Master ... <span className="text-white">TSSTcorpCD/DVDW TS-H552U</span></div>
                    </div>

                    <div className="absolute bottom-10 left-10 text-sm">
                        Press <strong>DEL</strong> to enter SETUP
                        <br />
                        08/14/1998-i440BX-W977-2A69KD4FC-00
                    </div>
                </div>
            </div>
        );
    }

    // Splash Screen
    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-[99999] select-none">
            {/* Background Clouds/Gradient */}
            <div className="absolute inset-0 bg-[#008080] opacity-50"></div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Container */}
                <div className="bg-white p-2 mb-10 w-[400px] h-[300px] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                    {/* Windows 98 Logo Placeholder using CSS */}
                    <div className="font-bold text-6xl italic text-black mb-2">Microsoft</div>
                    <div className="flex items-end gap-2">
                        <span className="text-7xl font-bold">Windows</span>
                        <span className="text-5xl font-normal mb-2 text-blue-600">98</span>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-200 via-white to-blue-200 opacity-20 pointer-events-none"></div>
                </div>

                {/* Loading Bar */}
                <div className="w-[300px] h-4 bg-gray-700 border-2 border-gray-500 relative overflow-hidden rounded-full">
                    <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-slide"></div>
                    <style jsx>{`
                    @keyframes slide {
                        0% { left: -30%; }
                        100% { left: 130%; }
                    }
                    .animate-slide {
                        animation: slide 1.5s infinite linear;
                    }
                `}</style>
                </div>
            </div>
        </div>
    );
};

export default BootSequence;
