import React from 'react';

interface EraseFrpScreenProps {
    onConfirm: () => void;
}

const EraseFrpScreen: React.FC<EraseFrpScreenProps> = ({ onConfirm }) => {
    return (
        <div className="p-4 flex flex-col flex-grow justify-between">
            <div>
                <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-4">Erase FRP Lock</h2>
                <div className="bg-gray-800 p-4 rounded-lg text-gray-300 space-y-3">
                    <p>
                        <span className="font-bold text-yellow-400">Factory Reset Protection (FRP)</span> is a security feature to prevent unauthorized access after a factory reset.
                    </p>
                    <p>
                        This simulation will attempt to bypass the FRP lock by communicating with a mock server. This is a destructive and very time-consuming process.
                    </p>
                    <p className="font-bold text-red-500">
                        WARNING: This is a one-way process. There is no cancellation once it begins. The device will be unusable during this time.
                    </p>
                </div>
            </div>
            
            <div className="mt-auto mb-4">
                <button
                    onClick={onConfirm}
                    className="w-full py-4 bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-lg transition-colors text-xl shadow-lg"
                >
                    Erase FRP
                </button>
            </div>
        </div>
    );
};

export default EraseFrpScreen;