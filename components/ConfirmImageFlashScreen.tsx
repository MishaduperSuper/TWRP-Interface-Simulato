import React, { useState } from 'react';

interface ConfirmImageFlashScreenProps {
    fileName: string;
    onConfirm: (partition: string) => void;
}

const ConfirmImageFlashScreen: React.FC<ConfirmImageFlashScreenProps> = ({ fileName, onConfirm }) => {
    const [partition, setPartition] = useState<'Boot' | 'Recovery'>('Boot');

    return (
        <div className="p-4 flex flex-col flex-grow justify-between">
            <div>
                <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-4">Flash Image</h2>
                <p className="text-gray-300 text-center mb-1">You are about to flash:</p>
                <p className="text-cyan-400 text-center font-mono bg-gray-900 p-2 rounded-md mb-4 break-all">{fileName}</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
                 <h3 className="font-semibold text-gray-300 mb-3">Select Partition to Flash to:</h3>
                 <div className="space-y-3">
                    <label className={`flex items-center p-4 rounded-md cursor-pointer transition-colors ${partition === 'Boot' ? 'bg-[var(--accent-medium)]' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        <input
                            type="radio"
                            name="partition"
                            value="Boot"
                            checked={partition === 'Boot'}
                            onChange={() => setPartition('Boot')}
                            className="h-5 w-5 text-[var(--accent-dark)] bg-gray-600 border-gray-500 focus:ring-[var(--accent-dark)]"
                        />
                        <span className="ml-3 font-medium text-white">Boot</span>
                    </label>
                     <label className={`flex items-center p-4 rounded-md cursor-pointer transition-colors ${partition === 'Recovery' ? 'bg-[var(--accent-medium)]' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        <input
                            type="radio"
                            name="partition"
                            value="Recovery"
                            checked={partition === 'Recovery'}
                            onChange={() => setPartition('Recovery')}
                            className="h-5 w-5 text-[var(--accent-dark)] bg-gray-600 border-gray-500 focus:ring-[var(--accent-dark)]"
                        />
                        <span className="ml-3 font-medium text-white">Recovery</span>
                    </label>
                 </div>
                 <p className="text-xs text-yellow-400 mt-4">Warning: Flashing to the wrong partition may brick your device. The patched Magisk image should typically be flashed to 'Boot'.</p>
            </div>

            <div className="mt-auto mb-4">
                <button
                    onClick={() => onConfirm(partition)}
                    className="w-full py-4 bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-lg transition-colors text-xl shadow-lg"
                >
                    Confirm Flash
                </button>
            </div>
        </div>
    );
};

export default ConfirmImageFlashScreen;
