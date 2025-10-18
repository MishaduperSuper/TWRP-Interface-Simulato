
import React from 'react';

interface WipeScreenProps {
    onWipe: () => void;
    onAdvancedWipe: () => void;
    onChangeFileSystem: () => void;
    onCorruptPartitions: () => void;
}

const WipeScreen: React.FC<WipeScreenProps> = ({ onWipe, onAdvancedWipe, onChangeFileSystem, onCorruptPartitions }) => {
    return (
        <div className="p-2 flex-grow flex flex-col">
            <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-2">Wipe</h2>
            <div className="flex-grow p-3">
                 <p className="mb-4 text-gray-400">Select an option to proceed.</p>
                <button
                    onClick={onWipe}
                    className="w-full text-left p-4 bg-gray-800 hover:bg-[var(--accent-interactive)] my-1 rounded-md transition-colors text-lg"
                >
                    Factory Reset
                </button>
                 <button 
                    onClick={onAdvancedWipe}
                    className="w-full text-left p-4 bg-gray-800 hover:bg-[var(--accent-interactive)] my-1 rounded-md transition-colors text-lg">
                    Advanced Wipe
                </button>
                 <button 
                    onClick={onChangeFileSystem}
                    className="w-full text-left p-4 bg-gray-800 hover:bg-[var(--accent-interactive)] my-1 rounded-md transition-colors text-lg">
                    Change File System
                </button>
                 <button className="w-full text-left p-4 bg-gray-800 my-1 rounded-md text-lg opacity-50 cursor-not-allowed">
                    Format Data
                </button>
                <div className="border-t border-gray-600 my-4"></div>
                <button
                    onClick={onCorruptPartitions}
                    className="w-full text-left p-4 bg-red-900/50 hover:bg-red-800/60 my-1 rounded-md transition-colors text-lg text-red-400 border border-red-700">
                    <span className="font-bold">Corrupt Partitions (DANGER)</span>
                </button>
            </div>
        </div>
    );
};

export default WipeScreen;
