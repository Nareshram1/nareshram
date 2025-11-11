// ./components/content/PaintContent.tsx

"use client"

import React, { useRef, useEffect, useState } from 'react';

const PaintContent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to match its container's displayed size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
    }
  }, [color]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = brushSize;
    }
  }, [brushSize]);

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'];

  return (
    <div className="flex flex-col h-full bg-gray-400">
      {/* --- Toolbar --- */}
      <div className="p-2 bg-[#c0c0c0] border-b-2 border-b-black flex items-center gap-4">
        <div>
          <label htmlFor="brushSize" className="text-xs mr-2">Size:</label>
          <input
            type="range"
            id="brushSize"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="flex gap-1">
          {colors.map(c => (
            <button
              key={c}
              className={`w-6 h-6 border-2 ${color === c ? 'border-blue-500' : 'border-gray-600'}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <button className="px-2 py-1 text-xs bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black" onClick={() => setColor('#FFFFFF')}>
          Eraser
        </button>
        <button className="px-2 py-1 text-xs bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black" onClick={clearCanvas}>
          Clear
        </button>
      </div>
      
      {/* --- Canvas --- */}
      <div className="flex-grow p-2 bg-gray-500">
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing} // Stop drawing if mouse leaves canvas
          onMouseMove={draw}
        />
      </div>
    </div>
  );
};

export default PaintContent;