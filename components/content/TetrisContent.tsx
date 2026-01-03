/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Gamepad2, Play, Pause as PauseIcon, RotateCcw } from "lucide-react";

// --- Type Definitions ---
type StageCell = [string | number, "clear" | "merged"];
type Stage = StageCell[][];

type Player = {
  pos: { x: number; y: number };
  tetromino: (string | number)[][];
  collided: boolean;
};

type TetrominoShape = {
  shape: (string | number)[][];
  color: string;
};

type Tetrominos = {
  [key: string | number]: TetrominoShape;
};

// --- Constants ---
const STAGE_WIDTH = 12;
const STAGE_HEIGHT = 20;

// --- Game Helpers ---

export const createStage = (): Stage =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, "clear"])
  );

export const TETROMINOS: Tetrominos = {
  0: { shape: [[0]], color: "0, 0, 0" },
  I: {
    shape: [
      [0, "I", 0, 0],
      [0, "I", 0, 0],
      [0, "I", 0, 0],
      [0, "I", 0, 0],
    ],
    color: "80, 227, 230", // Cyan
  },
  J: {
    shape: [
      [0, "J", 0],
      [0, "J", 0],
      ["J", "J", 0],
    ],
    color: "36, 95, 223", // Blue
  },
  L: {
    shape: [
      [0, "L", 0],
      [0, "L", 0],
      [0, "L", "L"],
    ],
    color: "223, 173, 36", // Orange
  },
  O: {
    shape: [
      ["O", "O"],
      ["O", "O"],
    ],
    color: "223, 217, 36", // Yellow
  },
  S: {
    shape: [
      [0, "S", "S"],
      ["S", "S", 0],
      [0, 0, 0],
    ],
    color: "48, 211, 56", // Green
  },
  T: {
    shape: [
      [0, 0, 0],
      ["T", "T", "T"],
      [0, "T", 0],
    ],
    color: "132, 61, 198", // Purple
  },
  Z: {
    shape: [
      ["Z", "Z", 0],
      [0, "Z", "Z"],
      [0, 0, 0],
    ],
    color: "227, 78, 78", // Red
  },
};

export const randomTetromino = (): TetrominoShape => {
  const tetrominos = "IJLOSTZ";
  const randTetromino =
    tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};

// --- Render Component: Retro Cell ---
const Cell = React.memo(({ type }: { type: string | number }) => {
  const color = TETROMINOS[type]?.color || "0, 0, 0";
  const isSet = type !== 0;

  return (
    <div
      className={`w-full h-full relative ${!isSet ? 'bg-black/20' : ''}`}
      style={{
        backgroundColor: isSet ? `rgb(${color})` : 'transparent',
      }}
    >
      {isSet && (
        <>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/50" />
          <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-white/50" />
          <div className="absolute bottom-0 right-0 left-0 h-[2px] bg-black/40" />
          <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-black/40" />
        </>
      )}
      {!isSet && <div className="w-full h-full border border-gray-800/30" />}
    </div>
  );
});
Cell.displayName = "Cell";

const StageComponent = React.memo(({ stage }: { stage: Stage }) => (
  <div
    className="grid bg-[#111] border-4 border-[#333]"
    style={{
      gridTemplateRows: `repeat(${STAGE_HEIGHT}, calc(100% / ${STAGE_HEIGHT}))`,
      gridTemplateColumns: `repeat(${STAGE_WIDTH}, 1fr)`,
      width: "100%",
      height: "100%",
    }}
  >
    {stage.map((row, y) =>
      row.map((cell, x) => <Cell key={`${x}-${y}`} type={cell[0]} />)
    )}
  </div>
));
StageComponent.displayName = "StageComponent";

// Display Component used for stats
const Display = ({ text, value }: { text: string; value: string | number }) => (
  <div className="flex items-center justify-between w-full p-2 mb-2 bg-black border-2 border-gray-600 rounded shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]">
    <span className="text-gray-400 font-none text-xs tracking-wider">{text}</span>
    <span className="font-bold text-green-400 font-mono">{value}</span>
  </div>
);

// Preview Next Piece Component
const NextPiece = ({ tetromino }: { tetromino: (string | number)[][] }) => (
  <div className="w-full aspect-square bg-black border-2 border-gray-600 rounded p-2 flex items-center justify-center mb-4">
    <div
      className="grid gap-[1px]"
      style={{
        gridTemplateColumns: `repeat(${tetromino[0].length}, 20px)`,
        gridTemplateRows: `repeat(${tetromino.length}, 20px)`,
      }}
    >
      {tetromino.map((row, y) =>
        row.map((cell, x) => (
          <div key={`${x}-${y}`} className="w-5 h-5 relative" style={{ backgroundColor: cell !== 0 ? `rgb(${TETROMINOS[cell].color})` : 'transparent' }}>
            {cell !== 0 && (
              <>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/50" />
                <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-white/50" />
                <div className="absolute bottom-0 right-0 left-0 h-[2px] bg-black/40" />
                <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-black/40" />
              </>
            )}
          </div>
        ))
      )}
    </div>
  </div>
);

// --- Custom Hook only for Interval ---
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// --- Main Component ---

const TetrisContent = () => {
  const [stage, setStage] = useState(createStage());
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(true);
  const [paused, setPaused] = useState(false);

  // Player State
  const [player, setPlayer] = useState<Player>({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  });

  // Next Piece State
  const [nextPiece, setNextPiece] = useState<TetrominoShape>(randomTetromino());

  // Stats
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(0);

  const gameAreaRef = useRef<HTMLDivElement>(null);

  // --- Logic ---

  const checkCollision = useCallback((
    currentPlayer: Player,
    currentStage: Stage,
    { x: moveX, y: moveY }: { x: number; y: number }
  ): boolean => {
    for (let y = 0; y < currentPlayer.tetromino.length; y += 1) {
      for (let x = 0; x < currentPlayer.tetromino[y].length; x += 1) {
        if (currentPlayer.tetromino[y][x] !== 0) {
          if (
            !currentStage[y + currentPlayer.pos.y + moveY] ||
            !currentStage[y + currentPlayer.pos.y + moveY][x + currentPlayer.pos.x + moveX] ||
            currentStage[y + currentPlayer.pos.y + moveY][x + currentPlayer.pos.x + moveX][1] !==
            "clear"
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const movePlayer = useCallback((dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      setPlayer(prev => ({
        ...prev,
        pos: { x: prev.pos.x + dir, y: prev.pos.y }
      }));
    }
  }, [player, stage, checkCollision]);

  const resetPlayer = useCallback(() => {
    const currentTetromino = nextPiece;
    const newTetromino = randomTetromino();
    setNextPiece(newTetromino);

    const newPlayer = {
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: currentTetromino.shape,
      collided: false,
    };

    // Use logic, not state update, to check game over
    if (checkCollision(newPlayer, stage, { x: 0, y: 0 })) {
      setGameOver(true);
      setDropTime(null);
    }

    setPlayer(newPlayer);
  }, [nextPiece, stage, checkCollision]);

  const drop = useCallback(() => {
    // Increase level logic
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1);
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      setPlayer(prev => ({
        ...prev,
        pos: { x: prev.pos.x, y: prev.pos.y + 1 }
      }));
    } else {
      // Game Over Check (Top out)
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
        return;
      }

      // Lock the piece
      const newStage = stage.map(row => row.map(cell => [...cell] as StageCell));
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const sy = y + player.pos.y;
            const sx = x + player.pos.x;
            if (newStage[sy] && newStage[sy][sx]) {
              newStage[sy][sx] = [value, "merged"];
            }
          }
        });
      });

      // Sweep Rows
      let rowsCleared = 0;
      const sweptStage = newStage.reduce((ack, row) => {
        if (row.findIndex(cell => cell[0] === 0) === -1) {
          rowsCleared += 1;
          ack.unshift(new Array(newStage[0].length).fill([0, "clear"]));
          return ack;
        }
        ack.push(row);
        return ack;
      }, [] as Stage);

      if (rowsCleared > 0) {
        setRows(prev => prev + rowsCleared);
        setScore(prev => prev + rowsCleared * 100);
      }

      setStage(sweptStage);

      // Reset player inline to avoid circular dependency
      const currentTetromino = nextPiece;
      const newTetromino = randomTetromino();
      setNextPiece(newTetromino);

      const newPlayer = {
        pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
        tetromino: currentTetromino.shape,
        collided: false,
      };

      if (checkCollision(newPlayer, sweptStage, { x: 0, y: 0 })) {
        setGameOver(true);
        setDropTime(null);
      }


      setPlayer(newPlayer);
    }
  }, [player, stage, nextPiece, rows, level, checkCollision]);

  const keyUp = ({ keyCode }: React.KeyboardEvent<HTMLDivElement>) => {
    if (!gameOver && !paused) {
      if (keyCode === 40) {
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  };

  const dropPlayer = useCallback(() => {
    setDropTime(null);
    drop();
  }, [drop]);

  const rotate = (matrix: (string | number)[][], dir: number) => {
    const rotatedTetro = matrix.map((_, index) => matrix.map(col => col[index]));
    if (dir > 0) return rotatedTetro.map(row => row.reverse());
    return rotatedTetro.reverse();
  };

  const playerRotate = useCallback((stage: Stage, dir: number) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  }, [player, checkCollision]);

  const startGame = () => {
    setStage(createStage());
    setDropTime(1000);

    // Generate first piece and next piece
    const firstPiece = randomTetromino();
    const secondPiece = randomTetromino();

    setNextPiece(secondPiece);
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: firstPiece.shape,
      collided: false,
    });
    setGameOver(false);
    setPaused(false);
    setScore(0);
    setRows(0);
    setLevel(0);
    gameAreaRef.current?.focus();
  };

  const pauseGame = () => {
    if (gameOver) return;
    if (paused) {
      setPaused(false);
      setDropTime(1000 / (level + 1) + 200);
    } else {
      setPaused(true);
      setDropTime(null);
    }
  };

  const move = ({ keyCode }: React.KeyboardEvent<HTMLDivElement>) => {
    if (!gameOver && !paused) {
      if (keyCode === 37) { // Left
        movePlayer(-1);
      } else if (keyCode === 39) { // Right
        movePlayer(1);
      } else if (keyCode === 40) { // Down
        dropPlayer();
      } else if (keyCode === 38) { // Up (Rotate)
        playerRotate(stage, 1);
      } else if (keyCode === 80) { // P (Pause)
        pauseGame();
      }
    } else if (keyCode === 80 && !gameOver) {
      pauseGame(); // Unpause
    }
  };

  // --- Effects ---

  useInterval(() => {
    drop();
  }, dropTime);

  // Combine Stage and Player for Rendering
  const displayStage = useMemo(() => {
    // Deep clone stage to prevent mutation of state
    const newStage = stage.map(row => row.map(cell => [...cell] as StageCell));

    player.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const stageY = y + player.pos.y;
          const stageX = x + player.pos.x;
          if (newStage[stageY] && newStage[stageY][stageX] && newStage[stageY][stageX][1] === 'clear') {
            newStage[stageY][stageX] = [value, 'clear']; // 'clear' because not locked yet
          }
        }
      });
    });
    return newStage;
  }, [player, stage]);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-screen bg-[#1a1a1a] text-white p-4 overflow-hidden outline-none"
      style={{ fontFamily: '"Courier New", monospace' }}
      role="button"
      tabIndex={0}
      onKeyDown={move}
      onKeyUp={keyUp}
      ref={gameAreaRef}
    >
      <div className="flex w-full max-w-[480px] justify-center gap-6">

        {/* Game Board */}
        <div className="relative border-4 border-gray-600 shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-black h-[480px] w-[288px]">
          <StageComponent stage={displayStage} />

          {/* Overlays */}
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 p-4 text-center">
              {score > 0 && <h2 className="text-red-500 font-bold text-3xl mb-4 font-mono glitch-text">GAME OVER</h2>}
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-sm border-2 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all active:scale-95"
              >
                <Play size={20} />
                {score > 0 ? "TRY AGAIN" : "START GAME"}
              </button>
            </div>
          )}

          {paused && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 backdrop-blur-sm">
              <h2 className="text-yellow-400 font-bold text-3xl mb-4 tracking-widest">PAUSED</h2>
              <button
                onClick={pauseGame}
                className="flex items-center gap-2 px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-sm border-2 border-yellow-400 transition-all active:scale-95"
              >
                <Play size={20} />
                RESUME
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-[140px] flex flex-col">
          <div className="mb-6 flex items-center gap-2 text-yellow-500 border-b-2 border-yellow-500/30 pb-2">
            <Gamepad2 size={24} />
            <h1 className="text-xl font-bold tracking-tighter">TETRIS</h1>
          </div>

          <div className="mb-4">
            <p className="text-gray-500 text-xs mb-1">NEXT</p>
            <NextPiece tetromino={nextPiece.shape} />
          </div>

          <div className="space-y-1 mb-6">
            <Display text="SCORE" value={score} />
            <Display text="ROWS" value={rows} />
            <Display text="LEVEL" value={level} />
          </div>

          <div className="mt-auto">
            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 font-mono">
              <div className="bg-[#222] p-1 rounded text-center border border-gray-700">←/→<br />Move</div>
              <div className="bg-[#222] p-1 rounded text-center border border-gray-700">↑<br />Rotate</div>
              <div className="bg-[#222] p-1 rounded text-center border border-gray-700">↓<br />Drop</div>
              <div className="bg-[#222] p-1 rounded text-center border border-gray-700">P<br />Pause</div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={pauseGame}
                disabled={gameOver}
                className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 p-2 rounded flex justify-center items-center transition-colors"
                title="Pause Game"
              >
                {paused ? <Play size={16} /> : <PauseIcon size={16} />}
              </button>
              <button
                onClick={startGame}
                className="flex-1 bg-gray-700 hover:bg-gray-600 p-2 rounded flex justify-center items-center transition-colors"
                title="Restart Game"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
                .glitch-text {
                    text-shadow: 2px 2px #ff0000, -2px -2px #00ff00;
                }
            `}</style>
    </div>
  );
};

export default TetrisContent;
