"use client";

import React, { useState } from 'react';
import { Folder } from 'lucide-react';

interface RunDialogProps {
    onExecute: (command: string) => void;
    onCancel: () => void;
}

const RunDialog: React.FC<RunDialogProps> = ({ onExecute, onCancel }) => {
    const [command, setCommand] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (command.trim()) {
            onExecute(command.trim());
        }
    };

    return (
        <div className="bg-[#c0c0c0] p-4 flex flex-col h-full font-sans text-sm select-none">
            <div className="flex gap-4 mb-4">
                <div className="shrink-0">
                    <img src="/icons/run-icon.png" alt="Run" className="w-8 h-8 md:hidden" /> {/* Fallback or hide if no image */}
                    <Folder size={32} className="text-blue-900" />
                </div>
                <div>
                    <p className="mb-2">Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.</p>
                    <div className="flex items-center gap-2">
                        <label className="shrink-0">Open:</label>
                        <form onSubmit={handleSubmit} className="flex-1">
                            <input
                                type="text"
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                className="w-full px-1 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white outline-none"
                                autoFocus
                            />
                        </form>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-auto">
                <button
                    onClick={() => onExecute(command.trim())}
                    className="w-20 py-1 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black font-bold active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
                >
                    OK
                </button>
                <button
                    onClick={onCancel}
                    className="w-20 py-1 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
                >
                    Cancel
                </button>
                <button
                    onClick={() => alert("Browse feature not implemented.")}
                    className="w-20 py-1 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
                >
                    Browse...
                </button>
            </div>
        </div>
    );
};

export default RunDialog;
