import React from 'react';

interface WipeScreenProps {
    onWipe: () => void;
    onAdvancedWipe: () => void;
}

const WipeScreen: React.FC<WipeScreenProps> = ({ onWipe, onAdvancedWipe }) => {
    return (
        <div className="p-2 flex-grow flex flex-col">
            <h2 className="text-xl font-bold p-3 border-b-2 border-cyan-500 mb-2">Wipe</h2>
            <div className="flex-grow p-3">
                 <p className="mb-4 text-gray-400">Select an option to proceed.</p>
                <button
                    onClick={onWipe}
                    className="w-full text-left p-4 bg-gray-800 hover:bg-cyan-900/50 my-1 rounded-md transition-colors text-lg"
                >
                    Factory Reset
                </button>
                 <button 
                    onClick={onAdvancedWipe}
                    className="w-full text-left p-4 bg-gray-800 hover:bg-cyan-900/50 my-1 rounded-md transition-colors text-lg">
                    Advanced Wipe
                </button>
                 <button className="w-full text-left p-4 bg-gray-800 my-1 rounded-md text-lg opacity-50 cursor-not-allowed">
                    Format Data
                </button>
            </div>
        </div>
    );
};

export default WipeScreen;