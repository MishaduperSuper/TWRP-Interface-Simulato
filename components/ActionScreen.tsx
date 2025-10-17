import React, { useState } from 'react';

interface ActionScreenProps {
    title: string;
    description: string;
    actionText: string;
    onConfirm: (backup: boolean) => void;
    actionType: 'install' | 'wipe';
}

const ActionScreen: React.FC<ActionScreenProps> = ({ title, description, actionText, onConfirm, actionType }) => {
    const [backup, setBackup] = useState(false);
    
    return (
        <div className="p-4 flex flex-col flex-grow justify-between">
            <div>
                <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-4">{title}</h2>
                <p className="text-gray-300 text-center mb-4">{description}</p>
            </div>
            <div className="mt-auto mb-4">
                {actionType === 'install' && (
                    <div className="flex items-center justify-center my-6">
                        <input
                            id="backup-checkbox"
                            type="checkbox"
                            checked={backup}
                            onChange={(e) => setBackup(e.target.checked)}
                            className="w-5 h-5 bg-gray-700 border-gray-600 rounded text-[var(--accent-medium)] focus:ring-[var(--accent-dark)]"
                        />
                        <label htmlFor="backup-checkbox" className="ml-3 text-gray-300">
                            Create backup before flashing (BETA)
                        </label>
                    </div>
                )}
                <button
                    onClick={() => onConfirm(backup)}
                    className="w-full py-4 bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-lg transition-colors text-xl shadow-lg"
                >
                    {actionText}
                </button>
            </div>
        </div>
    );
};

export default ActionScreen;