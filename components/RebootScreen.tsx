import React from 'react';

interface RebootScreenProps {
    onRebootSystem: () => void;
    onRebootRecovery: () => void;
}

const RebootScreen: React.FC<RebootScreenProps> = ({ onRebootSystem, onRebootRecovery }) => {
    return (
        <div className="p-2 flex-grow flex flex-col">
            <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-2">Reboot</h2>
            <div className="flex-grow p-3">
                 <p className="mb-4 text-gray-400">Select a reboot option.</p>
                <button
                    onClick={onRebootSystem}
                    className="w-full text-left p-4 bg-gray-800 hover:bg-[var(--accent-interactive)] my-1 rounded-md transition-colors text-lg"
                >
                    System
                </button>
                 <button 
                    onClick={onRebootRecovery}
                    className="w-full text-left p-4 bg-gray-800 hover:bg-[var(--accent-interactive)] my-1 rounded-md transition-colors text-lg">
                    Recovery
                </button>
                 <button className="w-full text-left p-4 bg-gray-800 my-1 rounded-md text-lg opacity-50 cursor-not-allowed">
                    Power Off
                </button>
                 <button className="w-full text-left p-4 bg-gray-800 my-1 rounded-md text-lg opacity-50 cursor-not-allowed">
                    Bootloader
                </button>
            </div>
        </div>
    );
};

export default RebootScreen;
