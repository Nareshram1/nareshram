"use client"

import React, { useState } from 'react';

type Player = 'X' | 'O';
type Square = Player | null;

const calculateWinner = (squares: Square[]): Player | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const isBoardFull = (squares: Square[]): boolean => {
  return squares.every(square => square !== null);
};

const TicTacToeContent: React.FC = () => {
  const [board, setBoard] = useState<Square[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  
  const winner = calculateWinner(board);
  const isDraw = !winner && isBoardFull(board);
  const player = isXNext ? 'X' : 'O';

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = player;
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const renderStatus = () => {
    if (winner) return `Winner: ${winner}!`;
    if (isDraw) return "It's a Draw!";
    return `Next Player: ${player}`;
  };

  return (
    <div className="bg-[#c0c0c0] p-4 select-none h-full flex flex-col" style={{ fontFamily: '"Pixelify Sans", sans-serif' }}>
      <div 
        className="status-bar border-2 p-2 mb-4 text-center font-bold"
        style={{
          borderTopColor: '#808080', borderLeftColor: '#808080',
          borderRightColor: '#ffffff', borderBottomColor: '#ffffff',
          backgroundColor: '#c0c0c0'
        }}
      >
        {renderStatus()}
      </div>
      
      <div 
        className="border-2"
        style={{
          borderTopColor: '#808080', borderLeftColor: '#808080',
          borderRightColor: '#ffffff', borderBottomColor: '#ffffff'
        }}
      >
        <div className="grid grid-cols-3">
          {board.map((square, i) => (
            <button
              key={i}
              className="w-16 h-16 border font-bold text-3xl flex items-center justify-center"
              style={{
                borderTopColor: '#ffffff', borderLeftColor: '#ffffff',
                borderRightColor: '#808080', borderBottomColor: '#808080',
                borderWidth: '2px',
                backgroundColor: '#c0c0c0',
                color: square === 'X' ? '#000080' : '#800000' // Classic blue/red
              }}
              onClick={() => handleClick(i)}
              disabled={!!winner || !!square}
            >
              {square}
            </button>
          ))}
        </div>
      </div>
      
      <button
        className="w-full mt-4 p-2 border-2 font-bold"
        style={{
          borderTopColor: '#ffffff', borderLeftColor: '#ffffff',
          borderRightColor: '#808080', borderBottomColor: '#808080',
          backgroundColor: '#c0c0c0'
        }}
        onClick={resetGame}
      >
        {winner || isDraw ? 'Play Again' : 'Reset Game'}
      </button>
    </div>
  );
};

export default TicTacToeContent;