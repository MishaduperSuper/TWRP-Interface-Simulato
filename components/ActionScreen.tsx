import React, { useState } from 'react';

interface ActionScreenProps {
    title: string;
    description: string;
    actionText: string;
    onConfirm: (options: { backup: boolean, verify: boolean, reboot: boolean }) => void;
    actionType: 'install' | 'wipe';
}

const Checkbox: React.FC<{ id: string; label: string; checked: boolean; onChange: (checked: boolean) => void; sublabel?: string; }> = ({ id, label, checked, onChange, sublabel }) => (
    <div className="flex items-start my-3">
        <div className="flex items-center h-5">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-5 h-5 bg-gray-700 border-gray-600 rounded text-[var(--accent-medium)] focus:ring-[var(--accent-dark)]"
            />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor={id} className="font-medium text-gray-300">
                {label}
            </label>
            {sublabel && <p className="text-gray-500">{sublabel}</p>}
        </div>
    </div>
);

const ActionScreen: React.FC<ActionScreenProps> = ({ title, description, actionText, onConfirm }) => {
    const [backup, setBackup] = useState(false);
    const [verify, setVerify] = useState(true);
    const [reboot, setReboot] = useState(true);
    
    return (
        <div className="p-4 flex flex-col flex-grow justify-between">
            <div>
                <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-4">{title}</h2>
                <p className="text-gray-300 text-center mb-4">{description}</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
                <Checkbox
                    id="verify-zip-checkbox"
                    label="ZIP file signature verification"
                    checked={verify}
                    onChange={setVerify}
                />
                 <Checkbox
                    id="reboot-checkbox"
                    label="Reboot after installation is complete"
                    checked={reboot}
                    onChange={setReboot}
                />
                <div className="border-t border-gray-700 my-3"></div>
                <Checkbox
                    id="backup-checkbox"
                    label="Create backup before flashing (BETA)"
                    checked={backup}
                    onChange={setBackup}
                    sublabel="This feature is for demonstration only."
                />
            </div>

            <div className="mt-auto mb-4">
                <button
                    onClick={() => onConfirm({ backup, verify, reboot })}
                    className="w-full py-4 bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-lg transition-colors text-xl shadow-lg"
                >
                    {actionText}
                </button>
            </div>
        </div>
    );
};

export default ActionScreen;