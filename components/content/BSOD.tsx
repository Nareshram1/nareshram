import React, { useEffect, useState } from 'react';

const BSOD = ({ onRestart }: { onRestart: () => void }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length > 2 ? '' : d + '.');
    }, 500);
    
    const handleKey = (e: KeyboardEvent) => {
      if(e.key === 'Enter' || e.key === 'Escape') onRestart();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKey);
    }
  }, [onRestart]);

  return (
    <div className="fixed inset-0 bg-[#0000AA] text-white font-[Px437_IBM_VGA8] p-8 z-[9999] cursor-none font-mono text-lg">
      <div className="max-w-3xl mx-auto flex flex-col gap-8 mt-20">
        <p className="bg-[#c0c0c0] text-[#0000AA] inline-block px-1 w-fit font-bold mb-4">Windows</p>
        <p>A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36. The current application will be terminated.</p>
        
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Press any key to terminate the current application.</li>
          <li>Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>
        </ul>

        <p className="mt-8 text-center blink">Press any key to continue{dots}</p>
      </div>
    </div>
  );
};

export default BSOD;