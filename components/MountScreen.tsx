import React, { useState } from 'react';

const MOUNT_PARTITIONS = [
    "System",
    "Data",
    "Cache",
    "Vendor",
    "MicroSD Card",
];

interface MountScreenProps {
    onConfirm: (toggledPartitions: { partition: string; mount: boolean }[]) => void;
}

const MountScreen: React.FC<MountScreenProps> = ({ onConfirm }) => {
    // Assume System, Vendor, and SD card are mounted by default in recovery.
    const [mountState, setMountState] = useState<{ [key: string]: boolean }>({
        "System": true,
        "Data": false,
        "Cache": false,
        "Vendor": true,
        "MicroSD Card": true,
    });
    const [initialMountState] = useState(mountState);

    const handleToggle = (partition: string) => {
        setMountState(prev => ({
            ...prev,
            [partition]: !prev[partition]
        }));
    };
    
    const getToggledPartitions = () => {
        return MOUNT_PARTITIONS.filter(p => mountState[p] !== initialMountState[p]);
    };
    
    const toggledPartitions = getToggledPartitions();

    const handleConfirm = () => {
        const changes = toggledPartitions.map(p => ({ 
            partition: p, 
            mount: mountState[p] 
        }));
        onConfirm(changes);
    };

    return (
        <div className="p-2 flex-grow flex flex-col">
            <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-2">Mount</h2>
            <p className="px-3 pb-3 text-gray-400">Select partitions to mount or unmount.</p>
            <div className="flex-grow overflow-y-auto px-1">
                <ul>
                    {MOUNT_PARTITIONS.map(partition => (
                        <li key={partition} className="my-2">
                            <label className="flex items-center bg-gray-800 p-4 rounded-md cursor-pointer hover:bg-[var(--accent-interactive)]">
                                <input
                                    type="checkbox"
                                    checked={mountState[partition]}
                                    onChange={() => handleToggle(partition)}
                                    className="w-6 h-6 bg-gray-700 border-gray-600 rounded text-[var(--accent-medium)] focus:ring-[var(--accent-dark)]"
                                />
                                <span className="ml-4 text-lg text-gray-200">{partition}</span>
                                {mountState[partition] ? 
                                    <span className="ml-auto text-sm text-[var(--accent-primary)]">(Mounted)</span>
                                    :
                                    <span className="ml-auto text-sm text-gray-500">(Unmounted)</span>
                                }
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-4">
                 <button
                    onClick={handleConfirm}
                    disabled={toggledPartitions.length === 0}
                    className="w-full py-4 bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-lg transition-colors text-xl shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Confirm Changes
                </button>
            </div>
        </div>
    );
};

export default MountScreen;