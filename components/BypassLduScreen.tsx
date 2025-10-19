import React from 'react';

interface BypassLduScreenProps {
    onConfirm: () => void;
}

const BypassLduScreen: React.FC<BypassLduScreenProps> = ({ onConfirm }) => {
    return (
        <div className="p-4 flex flex-col flex-grow justify-between">
            <div>
                <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-4">Bypass LDU Lock</h2>
                <div className="bg-gray-800 p-4 rounded-lg text-gray-300 space-y-3">
                    <p>
                        <span className="font-bold text-cyan-400">Live Demo Unit (LDU)</span> mode is a special firmware version used for retail display devices. It often has limitations and pre-installed demo content.
                    </p>
                    <p>
                        This process will simulate the removal of these retail restrictions, effectively converting the device to a consumer version.
                    </p>
                    <p className="font-bold text-red-500">
                        WARNING: This is an irreversible process within the simulation.
                    </p>
                </div>
            </div>
            
            <div className="mt-auto mb-4">
                <button
                    onClick={onConfirm}
                    className="w-full py-4 bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-lg transition-colors text-xl shadow-lg"
                >
                    Confirm Bypass
                </button>
            </div>
        </div>
    );
};

export default BypassLduScreen;
