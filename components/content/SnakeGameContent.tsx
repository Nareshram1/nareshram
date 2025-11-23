"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Gamepad2 } from "lucide-react";

const GRID_SIZE = 15;
const CELL_SIZE = 20;
const INITIAL_SPEED = 200;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Coordinate = { x: number; y: number };

function createFood(snake: Coordinate[]): Coordinate {
  let newFood: Coordinate;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((s) => s.x === newFood.x && s.y === newFood.y)) break;
  }
  return newFood;
}

const INITIAL_SNAKE = [{ x: 7, y: 7 }];

const SnakeGameContent: React.FC = () => {
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Coordinate>(() => createFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState<Direction>("RIGHT"); // Only used for initial state
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);

  // --- MODIFIED: Split direction refs to prevent 180-degree turn bug ---
  const nextDirectionRef = useRef<Direction>(direction);
  const currentDirectionRef = useRef<Direction>(direction);
  // --- END MODIFICATION ---

  const loopRef = useRef<NodeJS.Timeout | null>(null);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(createFood(INITIAL_SNAKE));
    // --- MODIFIED ---
    nextDirectionRef.current = "RIGHT";
    currentDirectionRef.current = "RIGHT";
    // --- END MODIFICATION ---
    setSpeed(INITIAL_SPEED);
    setScore(0);
    setGameOver(false);
    setStarted(true);
  };

  const moveSnake = useCallback(() => {
    if (gameOver) return;
    setSnake((prev) => {
      // --- MODIFIED: Update current direction at the start of the move ---
      currentDirectionRef.current = nextDirectionRef.current;
      // --- END MODIFICATION ---

      const newSnake = [...prev];
      const head = { ...newSnake[0] };

      // --- MODIFIED: Move based on the direction for this tick ---
      switch (currentDirectionRef.current) {
        case "UP": head.y -= 1; break;
        case "DOWN": head.y += 1; break;
        case "LEFT": head.x -= 1; break;
        case "RIGHT": head.x += 1; break;
      }
      // --- END MODIFICATION ---

      // wall or self collision
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE ||
        newSnake.some((s) => s.x === head.x && s.y === head.y)
      ) {
        setGameOver(true);
        return prev;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 1);
        setFood(createFood(newSnake));
        setSpeed((s) => Math.max(50, s * 0.95));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver]);

  useEffect(() => {
    if (!started || gameOver) return;
    loopRef.current = setInterval(moveSnake, speed);
    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [moveSnake, speed, started, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // --- MODIFIED: Check against the *last moved* direction ---
      const dir = currentDirectionRef.current;
      switch (e.key) {
        case "ArrowUp": if (dir !== "DOWN") nextDirectionRef.current = "UP"; break;
        case "ArrowDown": if (dir !== "UP") nextDirectionRef.current = "DOWN"; break;
        case "ArrowLeft": if (dir !== "RIGHT") nextDirectionRef.current = "LEFT"; break;
        case "ArrowRight": if (dir !== "LEFT") nextDirectionRef.current = "RIGHT"; break;
        case "Enter": if (!started || gameOver) restartGame(); break; // Allow restart on Enter if game over
      }
      // --- END MODIFICATION ---
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started, gameOver]); // Added gameOver dependency

  return (
    <div
      // --- MODIFIED: Replaced min-h-screen with h-full w-full ---
      className="flex flex-col items-center justify-center h-full w-full bg-[#1a1a1a] text-white relative overflow-hidden"
      // --- END MODIFICATION ---
      style={{
        fontFamily: '"Press Start 2P", monospace',
      }}
    >
      {/* CRT overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:2px_2px]" />
      <div className="absolute inset-0 bg-black opacity-5 animate-pulse" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Gamepad2 size={28} className="text-green-400 animate-pulse" />
        <h1 className="text-xl text-green-400">RETRO SNAKE</h1>
      </div>

      {/* Scoreboard */}
      <div className="flex justify-between w-[300px] mb-2 text-xs">
        <span>SCORE: {score}</span>
        <span>SPEED: {(200 / speed).toFixed(1)}x</span>
      </div>

      {/* Game board */}
      <div
        className="relative border-4 border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.5)]"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        }}
      >
        {snake.map((s, i) => (
          <div
            key={i}
            className={`${i === 0
                ? "bg-green-400 shadow-[0_0_10px_#00ff00]"
                : "bg-green-700"
              }`}
            style={{
              gridColumn: s.x + 1,
              gridRow: s.y + 1,
            }}
          />
        ))}
        <div
          className="bg-red-500 border border-red-700 animate-pulse"
          style={{
            gridColumn: food.x + 1,
            gridRow: food.y + 1,
          }}
        />

        {/* Start Screen */}
        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80">
            <h2 className="text-green-400 mb-2 text-lg animate-pulse">PRESS ENTER</h2>
            <p className="text-xs text-gray-400">to start</p>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 animate-fadeIn">
            <h2 className="text-red-500 text-xl mb-4">GAME OVER</h2>
            <button
              onClick={restartGame}
              className="px-4 py-2 bg-green-500 text-black font-bold border-2 border-green-300 hover:bg-green-400 transition"
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGameContent;