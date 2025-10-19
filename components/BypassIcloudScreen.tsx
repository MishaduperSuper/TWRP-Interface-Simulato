import React from 'react';

interface BypassIcloudScreenProps {
    onConfirm: () => void;
}

const BypassIcloudScreen: React.FC<BypassIcloudScreenProps> = ({ onConfirm }) => {
    return (
        <div className="p-4 flex flex-col flex-grow justify-between">
            <div>
                <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-4">iCloud Activation Lock Bypass</h2>
                <div className="bg-gray-800 p-4 rounded-lg text-gray-300 space-y-3">
                    <p>
                        This tool will simulate an iCloud bypass on a compatible Apple device (A8-A11 chipsets) using a bootrom exploit similar to <span className="font-mono text-cyan-400">checkm8</span>.
                    </p>
                    <p>
                        The process involves putting the device in DFU mode, exploiting the vulnerability, booting a custom ramdisk, and modifying the filesystem to skip the Setup Assistant.
                    </p>
                    <p className="font-bold text-red-500">
                        WARNING: This is a highly complex and extremely time-consuming simulation. The process cannot be cancelled once it begins.
                    </p>
                </div>
            </div>
            
            <div className="mt-auto mb-4">
                <button
                    onClick={onConfirm}
                    className="w-full py-4 bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-lg transition-colors text-xl shadow-lg"
                >
                    Confirm iCloud Bypass
                </button>
            </div>
        </div>
    );
};

export default BypassIcloudScreen;