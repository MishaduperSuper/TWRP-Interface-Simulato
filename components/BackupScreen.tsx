
import React, { useState } from 'react';

const BACKUP_PARTITIONS = [
    "System",
    "Data",
];

interface BackupScreenProps {
    onConfirm: (selectedPartitions: string[]) => void;
}

const BackupScreen: React.FC<BackupScreenProps> = ({ onConfirm }) => {
    const [selected, setSelected] = useState<string[]>(["System", "Data"]);

    const handleToggle = (partition: string) => {
        setSelected(prev =>
            prev.includes(partition)
                ? prev.filter(p => p !== partition)
                : [...prev, partition]
        );
    };

    return (
        <div className="p-2 flex-grow flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-2">Backup</h2>
                <p className="px-3 pb-3 text-gray-400">Select the partitions to backup.</p>
                <div className="overflow-y-auto px-1">
                    <ul>
                        {BACKUP_PARTITIONS.map(partition => (
                            <li key={partition} className="my-2">
                                <label className="flex items-center bg-gray-800 p-4 rounded-md cursor-pointer hover:bg-[var(--accent-interactive)]">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(partition)}
                                        onChange={() => handleToggle(partition)}
                                        className="w-6 h-6 bg-gray-700 border-gray-600 rounded text-[var(--accent-medium)] focus:ring-[var(--accent-dark)]"
                                    />
                                    <span className="ml-4 text-lg text-gray-200">{partition}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="p-4">
                 <button
                    onClick={() => onConfirm(selected)}
                    disabled={selected.length === 0}
                    className="w-full py-4 bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-lg transition-colors text-xl shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Confirm Backup
                </button>
            </div>
        </div>
    );
};

export default BackupScreen;
