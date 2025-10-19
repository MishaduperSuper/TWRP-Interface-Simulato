import React from 'react';

interface DebloatRealmeScreenProps {
    onConfirm: () => void;
}

const DebloatRealmeScreen: React.FC<DebloatRealmeScreenProps> = ({ onConfirm }) => {
    return (
        <div className="p-4 flex flex-col flex-grow justify-between">
            <div>
                <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-4">Realme Game/App Debloat</h2>
                <div className="bg-gray-800 p-4 rounded-lg text-gray-300 space-y-3">
                    <p>
                        This tool simulates the removal of pre-installed applications and services ("junkware") often found on Realme devices.
                    </p>
                    <p>
                        Debloating can help improve device performance, increase battery life, and remove unwanted ads or tracking from the system. This process targets common ColorOS/RealmeUI packages.
                    </p>
                    <p className="font-bold text-red-500">
                        WARNING: In a real-world scenario, removing system apps can cause instability. This simulation is safe and reversible.
                    </p>
                </div>
            </div>
            
            <div className="mt-auto mb-4">
                <button
                    onClick={onConfirm}
                    className="w-full py-4 bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-lg transition-colors text-xl shadow-lg"
                >
                    Confirm Debloat
                </button>
            </div>
        </div>
    );
};

export default DebloatRealmeScreen;
