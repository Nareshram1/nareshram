"use client";

import React, { useState, useEffect } from "react";
import SnakeGameContent from "./SnakeGameContent";
import { Gamepad2, Bomb } from "lucide-react";

// --- Troll Game Component ---
const TrollGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [message, setMessage] = useState("Do NOT click this button.");
  const [clickCount, setClickCount] = useState(0);
  const [pos, setPos] = useState({ top: "50%", left: "50%" });
  const [crashed, setCrashed] = useState(false);

  const moveButton = () => {
    const randomTop = Math.floor(Math.random() * 80) + 10;
    const randomLeft = Math.floor(Math.random() * 80) + 10;
    setPos({ top: `${randomTop}%`, left: `${randomLeft}%` });
  };

  const handleClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount === 1) setMessage("Wow... you actually clicked it 😏");
    else if (nextCount === 2) setMessage("Stop clicking!");
    else if (nextCount === 3) setMessage("Seriously, stop!");
    else if (nextCount === 4) setMessage("Ok, now you made it angry 😡");
    else if (nextCount === 5) {
      setMessage("💥 SYSTEM FAILURE 💥");
      setTimeout(() => setCrashed(true), 1000);
    } else if (nextCount > 5 && crashed) {
      setMessage("Just kidding 😜");
      setTimeout(() => onBack(), 2000);
    }

    moveButton();
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-[#111] text-green-400 font-mono overflow-hidden"
      style={{ fontFamily: '"Press Start 2P", monospace' }}
    >
      {/* Fake CRT overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] opacity-20" />
      <div className="absolute inset-0 bg-black opacity-5 animate-pulse" />

      {!crashed ? (
        <>
          <h1 className="text-xl mb-8 animate-pulse">TROLL MODE</h1>
          <p className="mb-10 text-sm text-center">{message}</p>
          <button
            onClick={handleClick}
            className="absolute transition-all bg-red-500 text-black font-bold px-4 py-2 border-4 border-black hover:scale-110"
            style={{
              top: pos.top,
              left: pos.left,
              transform: "translate(-50%, -50%)",
            }}
          >
            DO NOT CLICK
          </button>
          <button
            onClick={onBack}
            className="absolute bottom-4 left-4 text-xs text-gray-400 hover:text-white"
          >
            ← Back
          </button>
        </>
      ) : (
        <div className="text-center text-red-500 animate-pulse">
          <h2 className="text-2xl mb-2">💀 SYSTEM CRASH 💀</h2>
          <p className="text-xs text-gray-400">Rebooting...</p>
        </div>
      )}
    </div>
  );
};

// --- Game Hub ---
const RetroGamesHub: React.FC = () => {
  const [activeGame, setActiveGame] = useState<"menu" | "snake" | "troll">("menu");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {activeGame === "menu" && (
        <div
          className="flex flex-col items-center justify-center gap-6"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          <Gamepad2 size={48} className="text-green-400 animate-pulse" />
          <h1 className="text-green-400 text-xl">RETRO GAMES HUB</h1>

          <button
            onClick={() => setActiveGame("snake")}
            className="px-6 py-3 bg-green-500 text-black font-bold text-sm hover:bg-green-400 border-2 border-green-200 transition"
          >
            🐍 Play Snake
          </button>

          <button
            onClick={() => setActiveGame("troll")}
            className="px-6 py-3 bg-red-500 text-black font-bold text-sm hover:bg-red-400 border-2 border-red-200 transition"
          >
            💣 Troll Game
          </button>
        </div>
      )}

      {activeGame === "snake" && (
        <div className="relative w-full">
          <SnakeGameContent />
          <button
            onClick={() => setActiveGame("menu")}
            className="absolute top-2 left-2 px-2 py-1 bg-gray-700 text-xs text-white border border-gray-400 hover:bg-gray-600"
          >
            ← Back
          </button>
        </div>
      )}

      {activeGame === "troll" && <TrollGame onBack={() => setActiveGame("menu")} />}
    </div>
  );
};

export default RetroGamesHub;
