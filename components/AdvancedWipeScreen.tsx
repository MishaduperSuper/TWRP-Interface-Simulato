import React, { useState } from 'react';

const PARTITIONS = [
    "Dalvik / ART Cache",
    "System",
    "Data",
    "Internal Storage",
    "Cache",
    "MicroSD Card",
    "USB OTG",
];

const SPECIAL_OPTIONS = [
    "Clean Kernel Drivers",
    "Remove Encryption (formats data)",
];

const ALPHA_OPTIONS = [
    "Remove Encryption (no format)",
    "Clean Vendor Partition",
    "Create Treble Partition",
];


interface AdvancedWipeScreenProps {
    onConfirm: (selectedPartitions: string[]) => void;
}

const AdvancedWipeScreen: React.FC<AdvancedWipeScreenProps> = ({ onConfirm }) => {
    const [selected, setSelected] = useState<string[]>([]);

    const handleToggle = (partition: string) => {
        setSelected(prev => 
            prev.includes(partition) 
                ? prev.filter(p => p !== partition) 
                : [...prev, partition]
        );
    };

    return (
        <div className="p-2 flex-grow flex flex-col">
            <h2 className="text-xl font-bold p-3 border-b-2 border-cyan-500 mb-2">Advanced Wipe</h2>
            <p className="px-3 pb-3 text-gray-400">Select the partitions and actions to execute.</p>
            <div className="flex-grow overflow-y-auto px-1">
                <p className="px-3 pb-1 text-gray-300 font-bold">Partitions</p>
                <ul>
                    {PARTITIONS.map(partition => (
                        <li key={partition} className="my-2">
                            <label className="flex items-center bg-gray-800 p-4 rounded-md cursor-pointer hover:bg-cyan-900/50">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(partition)}
                                    onChange={() => handleToggle(partition)}
                                    className="w-6 h-6 bg-gray-700 border-gray-600 rounded text-cyan-500 focus:ring-cyan-600"
                                />
                                <span className="ml-4 text-lg text-gray-200">{partition}</span>
                            </label>
                        </li>
                    ))}
                </ul>
                <div className="border-t border-gray-700 my-4"></div>
                <p className="px-3 pb-1 text-gray-300 font-bold">Special Actions</p>
                 <ul>
                    {SPECIAL_OPTIONS.map(option => (
                        <li key={option} className="my-2">
                            <label className="flex items-center bg-gray-800 p-4 rounded-md cursor-pointer hover:bg-cyan-900/50">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option)}
                                    onChange={() => handleToggle(option)}
                                    className="w-6 h-6 bg-gray-700 border-gray-600 rounded text-cyan-500 focus:ring-cyan-600"
                                />
                                <span className="ml-4 text-lg text-gray-200">{option}</span>
                                {option === "Remove Encryption (formats data)" && <span className="ml-auto text-sm text-yellow-500">(formats data)</span>}
                            </label>
                        </li>
                    ))}
                </ul>
                <div className="border-t border-gray-700 my-4"></div>
                <p className="px-3 pb-1 text-yellow-400 font-bold">Alpha/Experimental Actions</p>
                 <ul>
                    {ALPHA_OPTIONS.map(option => (
                        <li key={option} className="my-2">
                            <label className="flex items-center bg-gray-800 p-4 rounded-md cursor-pointer hover:bg-cyan-900/50">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option)}
                                    onChange={() => handleToggle(option)}
                                    className="w-6 h-6 bg-gray-700 border-gray-600 rounded text-cyan-500 focus:ring-cyan-600"
                                />
                                <span className="ml-4 text-lg text-gray-200">{option}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-4">
                 <button
                    onClick={() => onConfirm(selected)}
                    disabled={selected.length === 0}
                    className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors text-xl shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Confirm Wipe
                </button>
            </div>
        </div>
    );
};

export default AdvancedWipeScreen;