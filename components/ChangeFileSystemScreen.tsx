
import React, { useState } from 'react';

const PARTITIONS = [
    { name: 'Data', currentFs: 'f2fs' },
    { name: 'Cache', currentFs: 'ext4' },
    { name: 'System', currentFs: 'ext4' },
    { name: 'MicroSD Card', currentFs: 'vfat' },
];

const FS_TYPES = ['ext4', 'f2fs', 'btrfs (exotic)', 'vfat'];

interface ChangeFileSystemScreenProps {
    onConfirm: (options: { partition: string; fsType?: string; repair: boolean; forceError: boolean }) => void;
}

const ChangeFileSystemScreen: React.FC<ChangeFileSystemScreenProps> = ({ onConfirm }) => {
    const [selectedPartition, setSelectedPartition] = useState<string | null>(null);
    const [targetFs, setTargetFs] = useState<string | null>(null);
    const [action, setAction] = useState<'change' | 'repair' | null>(null);
    const [forceError, setForceError] = useState(false);

    const handlePartitionSelect = (partitionName: string) => {
        setSelectedPartition(partitionName);
        setTargetFs(null);
        setAction(null);
    };

    const handleConfirmAction = () => {
        if (!selectedPartition || !action) return;

        onConfirm({
            partition: selectedPartition,
            fsType: action === 'change' ? targetFs! : undefined,
            repair: action === 'repair',
            forceError: forceError,
        });
    };

    const renderOptions = () => {
        if (!selectedPartition) {
            return <p className="text-center text-gray-500 mt-8">Select a partition to continue.</p>;
        }

        const partitionInfo = PARTITIONS.find(p => p.name === selectedPartition)!;

        return (
            <div className="bg-gray-800 p-4 rounded-lg mt-4 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-200">
                    Partition: <span className="text-[var(--accent-primary)]">{selectedPartition}</span>
                </h3>
                <p className="text-sm text-gray-400 mb-4">Current File System: {partitionInfo.currentFs}</p>
                
                <div className="space-y-2">
                    <button
                        onClick={() => { setAction('repair'); setTargetFs(null); }}
                        className={`w-full p-3 rounded-md text-left transition-colors ${action === 'repair' ? 'bg-[var(--accent-medium)] text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        Repair File System
                    </button>
                    <button
                        onClick={() => { setAction('change'); setTargetFs(null); }}
                        className={`w-full p-3 rounded-md text-left transition-colors ${action === 'change' ? 'bg-[var(--accent-medium)] text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        Change File System
                    </button>
                </div>

                {action === 'change' && (
                    <div className="mt-4 animate-fade-in">
                        <p className="font-semibold mb-2">Select new file system:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {FS_TYPES.map(fs => (
                                <button
                                    key={fs}
                                    onClick={() => setTargetFs(fs)}
                                    className={`p-2 rounded text-sm transition-colors ${targetFs === fs ? 'bg-[var(--accent-dark)] text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    {fs}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="border-t border-gray-700 my-4"></div>

                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={forceError}
                        onChange={(e) => setForceError(e.target.checked)}
                        className="w-5 h-5 bg-gray-700 border-gray-600 rounded text-[var(--accent-medium)] focus:ring-[var(--accent-dark)]"
                    />
                    <span className="ml-3 text-yellow-400">Simulate 100% Error</span>
                </label>
            </div>
        );
    };

    return (
        <div className="p-2 flex-grow flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-2">Change File System</h2>
                <div className="grid grid-cols-2 gap-2 px-2">
                    {PARTITIONS.map(p => (
                        <button
                            key={p.name}
                            onClick={() => handlePartitionSelect(p.name)}
                            className={`p-3 rounded-md transition-colors text-center ${selectedPartition === p.name ? 'bg-[var(--accent-dark)] text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
                {renderOptions()}
            </div>
            
            <div className="p-4">
                {(action === 'repair' || (action === 'change' && targetFs)) && (
                    <button
                        onClick={handleConfirmAction}
                        className="w-full py-4 bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-lg transition-colors text-xl shadow-lg"
                    >
                        Confirm Operation
                    </button>
                )}
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ChangeFileSystemScreen;
