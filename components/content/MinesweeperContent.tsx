"use client"

import React, { useState, useEffect } from 'react';

// Game settings
const ROWS = 9;
const COLS = 9;
const MINES = 10;

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

type Grid = CellState[][];

  function createGrid(): Grid {
    // 1. Create blank grid
    const grid: Grid = new Array(ROWS).fill(null).map(() => 
      new Array(COLS).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    );

    // 2. Plant mines
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!grid[r][c].isMine) {
        grid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // 3. Calculate adjacent mines
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc].isMine) {
              count++;
            }
          }
        }
        grid[r][c].adjacentMines = count;
      }
    }
    return grid;
  }

const MinesweeperContent: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(() => createGrid());
  const [mineCount, setMineCount] = useState<number>(MINES);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);

  // Game Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!gameOver && !gameWon) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameOver, gameWon]);
  

  
  const resetGame = () => {
    setGrid(createGrid());
    setMineCount(MINES);
    setGameOver(false);
    setGameWon(false);
    setTimer(0);
  };

  const checkWinCondition = (newGrid: Grid) => {
    let revealedCount = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (newGrid[r][c].isRevealed) {
          revealedCount++;
        }
      }
    }
    if (revealedCount === ROWS * COLS - MINES) {
      setGameWon(true);
      setGameOver(true);
    }
  };

  const revealCell = (r: number, c: number, newGrid: Grid) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || newGrid[r][c].isRevealed || newGrid[r][c].isFlagged) {
      return;
    }

    newGrid[r][c].isRevealed = true;

    if (newGrid[r][c].isMine) {
      setGameOver(true);
      // Reveal all mines
      newGrid.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
      return;
    }

    // Flood fill if it's a 0
    if (newGrid[r][c].adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          revealCell(r + dr, c + dc, newGrid);
        }
      }
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameOver || gameWon) return;
    const newGrid = [...grid.map(row => [...row])];
    
    if (newGrid[r][c].isFlagged || newGrid[r][c].isRevealed) return;

    revealCell(r, c, newGrid);
    
    setGrid(newGrid);
    if (!gameOver) {
      checkWinCondition(newGrid);
    }
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || gameWon || grid[r][c].isRevealed) return;

    const newGrid = [...grid.map(row => [...row])];
    const cell = newGrid[r][c];
    
    if (cell.isFlagged) {
      cell.isFlagged = false;
      setMineCount(m => m + 1);
    } else {
      cell.isFlagged = true;
      setMineCount(m => m - 1);
    }
    setGrid(newGrid);
  };
  
  const getCellContent = (cell: CellState) => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.adjacentMines > 0) return cell.adjacentMines;
    return '';
  };

  const getNumberColor = (num: number) => {
    switch (num) {
      case 1: return 'text-blue-600';
      case 2: return 'text-green-600';
      case 3: return 'text-red-600';
      case 4: return 'text-blue-900';
      case 5: return 'text-red-900';
      case 6: return 'text-teal-600';
      case 7: return 'text-black';
      case 8: return 'text-gray-600';
      default: return '';
    }
  };
  
  return (
    <div className="bg-[#c0c0c0] p-2 select-none" style={{ fontFamily: '"Pixelify Sans", sans-serif' }}>
      <div className="border-2 p-2 flex justify-between items-center mb-2" style={{
        borderTopColor: '#808080', borderLeftColor: '#808080',
        borderRightColor: '#ffffff', borderBottomColor: '#ffffff'
      }}>
        <div className="bg-black text-red-500 font-mono px-1 border-2 border-t-gray-700 border-l-gray-700">
          {String(mineCount).padStart(3, '0')}
        </div>
        <button
          className="w-8 h-8 border-2 flex items-center justify-center text-xl"
          style={{
            borderTopColor: '#ffffff', borderLeftColor: '#ffffff',
            borderRightColor: '#808080', borderBottomColor: '#808080'
          }}
          onClick={resetGame}
        >
          {gameOver && !gameWon ? '🤯' : gameWon ? '😎' : '🙂'}
        </button>
        <div className="bg-black text-red-500 font-mono px-1 border-2 border-t-gray-700 border-l-gray-700">
          {String(timer).padStart(3, '0')}
        </div>
      </div>

      <div className="border-2" style={{
        borderTopColor: '#808080', borderLeftColor: '#808080',
        borderRightColor: '#ffffff', borderBottomColor: '#ffffff'
      }}>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS}, 24px)` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                className={`w-6 h-6 border font-bold flex items-center justify-center ${getNumberColor(cell.adjacentMines)}`}
                style={cell.isRevealed
                  ? { border: '1px solid #808080', backgroundColor: '#c0c0c0' }
                  : {
                      borderTopColor: '#ffffff', borderLeftColor: '#ffffff',
                      borderRightColor: '#808080', borderBottomColor: '#808080',
                      borderWidth: '2px', backgroundColor: '#c0c0c0'
                    }
                }
                onClick={() => handleCellClick(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
                disabled={gameOver || gameWon}
              >
                {getCellContent(cell)}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MinesweeperContent;