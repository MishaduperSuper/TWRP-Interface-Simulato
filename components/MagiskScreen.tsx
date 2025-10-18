import React from 'react';

interface MagiskScreenProps {
    onConfirmPatch: () => void;
}

const InfoCard: React.FC<{ label: string; value: string; color: 'green' | 'red' | 'gray' }> = ({ label, value, color }) => {
    const colorClasses = {
        green: 'text-green-400',
        red: 'text-red-400',
        gray: 'text-gray-400'
    };
    return (
        <div className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
            <span className="text-gray-300">{label}</span>
            <span className={`font-bold ${colorClasses[color]}`}>{value}</span>
        </div>
    );
};

const MagiskScreen: React.FC<MagiskScreenProps> = ({ onConfirmPatch }) => {
    return (
        <div className="p-2 flex-grow flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-4">Magisk Manager</h2>

                <div className="px-3">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Device Compatibility</h3>
                    <div className="space-y-2">
                        <InfoCard label="Ramdisk" value="Yes" color="green" />
                        <InfoCard label="System-as-Root (SAR)" value="Yes" color="green" />
                        <InfoCard label="A/B Partition Layout" value="No" color="gray" />
                        <InfoCard label="SELinux" value="Permissive" color="green" />
                    </div>
                </div>
            </div>
            <div className="p-4">
                 <button
                    onClick={onConfirmPatch}
                    className="w-full py-4 bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-lg transition-colors text-xl shadow-lg disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Select and Patch a File
                </button>
            </div>
        </div>
    );
};

export default MagiskScreen;