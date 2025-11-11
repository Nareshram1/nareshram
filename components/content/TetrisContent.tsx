/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Gamepad2 } from "lucide-react"; // Assuming lucide-react is installed

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

/**
 * Creates an empty game stage.
 * @returns {Stage} A new stage grid.
 */
export const createStage = (): Stage =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, "clear"])
  );

/**
 * Defines the shapes and colors of the Tetrominos.
 */
export const TETROMINOS: Tetrominos = {
  0: { shape: [[0]], color: "rgb(0, 0, 0)" }, // Empty shape
  I: {
    shape: [
      [0, "I", 0, 0],
      [0, "I", 0, 0],
      [0, "I", 0, 0],
      [0, "I", 0, 0],
    ],
    color: "rgb(0, 255, 255)", // Cyan
  },
  J: {
    shape: [
      [0, "J", 0],
      [0, "J", 0],
      ["J", "J", 0],
    ],
    color: "rgb(0, 0, 255)", // Blue
  },
  L: {
    shape: [
      [0, "L", 0],
      [0, "L", 0],
      [0, "L", "L"],
    ],
    color: "rgb(255, 165, 0)", // Orange
  },
  O: {
    shape: [
      ["O", "O"],
      ["O", "O"],
    ],
    color: "rgb(255, 255, 0)", // Yellow
  },
  S: {
    shape: [
      [0, "S", "S"],
      ["S", "S", 0],
      [0, 0, 0],
    ],
    color: "rgb(0, 255, 0)", // Green
  },
  T: {
    shape: [
      [0, 0, 0],
      ["T", "T", "T"],
      [0, "T", 0],
    ],
    color: "rgb(128, 0, 128)", // Purple
  },
  Z: {
    shape: [
      ["Z", "Z", 0],
      [0, "Z", "Z"],
      [0, 0, 0],
    ],
    color: "rgb(255, 0, 0)", // Red
  },
};

/**
 * Gets a random Tetromino.
 * @returns {TetrominoShape} A random tetromino object.
 */
export const randomTetromino = (): TetrominoShape => {
  const tetrominos = "IJLOSTZ";
  const randTetromino =
    tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};

/**
 * Checks for collision with stage boundaries or other merged cells.
 * @param player The current player object.
 * @param stage The game stage.
 * @param move The intended move { x, y }.
 * @returns {boolean} True if a collision is detected, false otherwise.
 */
const checkCollision = (
  player: Player,
  stage: Stage,
  { x: moveX, y: moveY }: { x: number; y: number }
): boolean => {
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      if (player.tetromino[y][x] !== 0) {
        if (
          // 1. Check if move is inside game area height (y)
          !stage[y + player.pos.y + moveY] ||
          // 2. Check if move is inside game area width (x)
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          // 3. Check if cell is not set to 'clear' (it's occupied)
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !==
            "clear"
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

// --- Custom Hooks ---

/**
 * A custom hook for setting up an interval timer.
 * @param callback The function to execute at each interval.
 * @param delay The interval delay in milliseconds (null to stop).
 */
function useInterval(callback: () => void, delay: number | null) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
  const savedCallback = useRef<() => void>();

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

/**
 * Custom hook for managing the player state.
 */
const usePlayer = () => {
  const [player, setPlayer] = useState<Player>({
    pos: { x: STAGE_WIDTH / 2 - 1, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  });

  /**
   * Rotates a tetromino matrix.
   * @param matrix The tetromino shape matrix.
   * @param dir The direction of rotation (1 for clockwise, -1 for counter-clockwise).
   * @returns A new, rotated matrix.
   */
  const rotate = (matrix: (string | number)[][], dir: number) => {
    // Transpose rows and columns
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map((col) => col[index])
    );
    // Reverse each row to get rotated matrix
    if (dir > 0) return rotatedTetro.map((row) => row.reverse());
    return rotatedTetro.reverse();
  };

  /**
   * Rotates the player's tetromino and checks for wall kicks.
   * @param stage The game stage.
   * @param dir The direction of rotation.
   */
  const playerRotate = (stage: Stage, dir: number) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player)) as Player;
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        // If it can't find a valid rotation, revert.
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  };

  /**
   * Updates the player's position.
   */
  const updatePlayerPos = ({
    x,
    y,
    collided,
  }: {
    x: number;
    y: number;
    collided: boolean;
  }) => {
    setPlayer((prev) => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided,
    }));
  };

  /**
   * Resets the player to the starting position with a new tetromino.
   */
  const resetPlayer = useCallback(() => {
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: randomTetromino().shape,
      collided: false,
    });
  }, []);

  return { player, updatePlayerPos, resetPlayer, playerRotate };
};

/**
 * Custom hook for managing the game stage state.
 * @param player The player object.
 * @param resetPlayer Function to reset the player.
 */
const useStage = (player: Player, resetPlayer: () => void) => {
  const [stage, setStage] = useState<Stage>(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);

    /**
     * Sweeps the stage for completed rows.
     * @param newStage The stage to sweep.
     * @returns A new stage with completed rows removed.
     */
    const sweepRows = (newStage: Stage): Stage =>
      newStage.reduce((ack, row) => {
        // FindIndex returns -1 if no '0' (empty cell) is found, meaning row is full
        if (row.findIndex((cell) => cell[0] === 0) === -1) {
          setRowsCleared((prev) => prev + 1);
          // Add a new empty row to the top
          ack.unshift(
            new Array(newStage[0].length).fill([0, "clear"]) as StageCell[]
          );
          return ack;
        }
        ack.push(row);
        return ack;
      }, [] as Stage);

    /**
     * Updates the stage based on player movement and collisions.
     * @param prevStage The previous stage state.
     * @returns The new stage state.
     */
    const updateStage = (prevStage: Stage): Stage => {
      // First, flush the stage of 'clear' cells
      const newStage = prevStage.map(
        (row) =>
          row.map((cell) =>
            cell[1] === "clear" ? ([0, "clear"] as StageCell) : cell
          ) as StageCell[]
      );

      // Then, draw the tetromino
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [
              value,
              player.collided ? "merged" : "clear",
            ];
          }
        });
      });

      // Check if player collided
      if (player.collided) {
        resetPlayer();
        return sweepRows(newStage);
      }
      return newStage;
    };

    setStage((prev: Stage) => updateStage(prev));
  }, [player, resetPlayer]);

  return { stage, setStage, rowsCleared };
};

/**
 * Custom hook for managing game status (score, rows, level).
 * @param rowsCleared The number of rows cleared in the last update.
 */
const useGameStatus = (rowsCleared: number) => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(0);

  const linePoints = [40, 100, 300, 1200]; // 1, 2, 3, 4 lines

  useEffect(() => {
    if (rowsCleared > 0) {
      setScore((prev) => prev + linePoints[rowsCleared - 1] * (level + 1));
      setRows((prev) => prev + rowsCleared);
    }
  }, [rowsCleared, level, linePoints]);

  return { score, setScore, rows, setRows, level, setLevel };
};

// --- Child Components ---

type CellProps = {
  type: string | number;
};

/**
 * Renders a single cell of the game grid.
 * Memoized for performance.
 */
const Cell = React.memo(({ type }: CellProps) => {
  const color = TETROMINOS[type]?.color || "rgb(0, 0, 0)";
  const isSet = type !== 0;

  // Helper to parse rgb string
  const getColorValues = (rgb: string): [number, number, number] => {
    const values = rgb.slice(4, -1).split(",").map(s => parseInt(s.trim()));
    return [values[0] || 0, values[1] || 0, values[2] || 0];
  };

  const [r, g, b] = getColorValues(color);

  const style = {
    background: `rgba(${r}, ${g}, ${b}, 0.8)`,
    borderWidth: isSet ? "4px" : "1px",
    borderColor: isSet ? `rgba(${r}, ${g}, ${b}, 1)` : 'rgba(100, 100, 100, 0.2)',
    borderTopColor: isSet ? `rgba(${r * 1.2}, ${g * 1.2}, ${b * 1.2}, 1)` : 'rgba(100, 100, 100, 0.2)',
    borderRightColor: isSet ? `rgba(${r * 0.8}, ${g * 0.8}, ${b * 0.8}, 1)` : 'rgba(100, 100, 100, 0.2)',
    borderBottomColor: isSet ? `rgba(${r * 0.7}, ${g * 0.7}, ${b * 0.7}, 1)` : 'rgba(100, 100, 100, 0.2)',
    borderLeftColor: isSet ? `rgba(${r * 1.1}, ${g * 1.1}, ${b * 1.1}, 1)` : 'rgba(100, 100, 100, 0.2)',
  };

  return (
    <div
      className="w-full aspect-square"
      style={style}
    />
  );
});
Cell.displayName = "Cell"; // For easier debugging with React.memo

type StageProps = {
  stage: Stage;
};

/**
 * Renders the game stage grid.
 */
const StageComponent = ({ stage }: StageProps) => (
  <div
    className="grid"
    style={{
      gridTemplateRows: `repeat(${STAGE_HEIGHT}, calc(100% / ${STAGE_HEIGHT}))`,
      gridTemplateColumns: `repeat(${STAGE_WIDTH}, 1fr)`,
      width: "100%",
      height: "100%",
      border: "4px solid #333",
      background: "#111",
    }}
  >
    {stage.map((row) =>
      row.map((cell, x) => <Cell key={x} type={cell[0]} />)
    )}
  </div>
);

type DisplayProps = {
  text: string;
  value: string | number;
};

/**
 * Renders a stat display (e.g., Score, Level).
 */
const Display = ({ text, value }: DisplayProps) => (
  <div className="flex items-center justify-between w-full p-2 mb-2 bg-black border-2 border-gray-600 rounded">
    <span className="text-gray-400">{text}:</span>
    <span className="font-bold text-green-400">{value}</span>
  </div>
);

// --- Main Game Component ---

/**
 * The main component for the Tetris game.
 */
const TetrisContent = () => {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(true); // Start as "game over" to show "Start Game"

  const { player, updatePlayerPos, resetPlayer, playerRotate } = usePlayer();
  const { stage, setStage, rowsCleared } = useStage(player, resetPlayer);
  const { score, setScore, rows, setRows, level, setLevel } =
    useGameStatus(rowsCleared);

  // Ref for the game area to ensure it can be focused
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const movePlayer = useCallback((dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  }, [player, stage, updatePlayerPos]);

  const startGame = useCallback(() => {
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setScore(0);
    setRows(0);
    setLevel(0);
    // Focus the game area to capture key presses
    gameAreaRef.current?.focus();
  }, [resetPlayer, setLevel, setRows, setScore, setStage]);

  const drop = useCallback(() => {
    // Increase level when player has cleared 10 rows
    if (rows > (level + 1) * 10) {
      setLevel((prev) => prev + 1);
      // Also increase speed
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // Game Over
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  }, [level, player, rows, setLevel, stage, updatePlayerPos]);

  const keyUp = useCallback(({ keyCode }: React.KeyboardEvent<HTMLDivElement>) => {
    if (!gameOver) {
      if (keyCode === 40) { // ArrowDown
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  }, [gameOver, level]);

  const dropPlayer = useCallback(() => {
    if (gameOver) return;
    setDropTime(null);
    drop();
  }, [drop, gameOver]);

  const move = useCallback(({ keyCode }: React.KeyboardEvent<HTMLDivElement>) => {
    if (!gameOver) {
      if (keyCode === 37) { // ArrowLeft
        movePlayer(-1);
      } else if (keyCode === 39) { // ArrowRight
        movePlayer(1);
      } else if (keyCode === 40) { // ArrowDown
        dropPlayer();
      } else if (keyCode === 38) { // ArrowUp (Rotate)
        playerRotate(stage, 1);
      }
    }
  }, [dropPlayer, gameOver, movePlayer, playerRotate, stage]);

  useInterval(() => {
    drop();
  }, dropTime);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-screen bg-[#1a1a1a] text-white p-4 overflow-hidden focus:outline-none"
      style={{ fontFamily: '"Press Start 2P", monospace' }}
      onKeyDown={(e) => move(e)}
      onKeyUp={(e) => keyUp(e)}
      tabIndex={0} // Allows div to be focusable to capture key events
      ref={gameAreaRef}
      role="button" // For accessibility
    >
      <div className="flex w-full max-w-[400px] justify-between gap-4">
        {/* Game Stage */}
        <div className="w-[240px] h-[400px] relative">
          <StageComponent stage={stage} />
          {(gameOver) && ( // Show overlay if game is over or not started
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-10">
              {score > 0 && ( // Only show "Game Over" if a game was actually played
                 <h2 className="text-red-500 text-xl mb-4 animate-pulse">GAME OVER</h2>
              )}
              <button
                onClick={startGame}
                className="px-4 py-2 bg-green-500 text-black font-bold border-2 border-green-300 hover:bg-green-400 transition"
              >
                {score > 0 ? "Restart" : "Start Game"}
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <aside className="w-[140px] flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-green-400">
            <Gamepad2 size={20} />
            <h2 className="text-sm">Tetris</h2>
          </div>
          <Display text="Score" value={score} />
          <Display text="Rows" value={rows} />
          <Display text="Level" value={level} />
          <div className="mt-auto text-xs text-gray-500">
            <p className="mb-2">Controls:</p>
            <p>←: Left</p>
            <p>→: Right</p>
            <p>↓: Soft Drop</p>
            <p>↑: Rotate</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TetrisContent;
