import React from 'react';

interface ErrorScreenProps {
    onGoHome: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ onGoHome }) => {
    return (
        <div className="p-4 flex flex-col flex-grow justify-center items-center text-center bg-[#110000]">
            <div className="w-16 h-16 text-red-500 mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">CRITICAL ERROR</h2>
            <p className="text-gray-300 mb-4">The backup process has failed.</p>
            <div className="w-full max-w-sm bg-black p-3 rounded-md font-mono text-left text-sm text-red-400/80 overflow-x-auto">
                <p>E: Failed to run backup job.</p>
                <p>E: Cannot create backup folder in /sdcard/TWRP/BACKUPS/</p>
                <p>process ended with ERROR: 1</p>
                <p>I: Error partitioning.</p>
                <p>ALPHA feature 'backup' not implemented.</p>
            </div>

            <button
                onClick={onGoHome}
                className="w-full max-w-sm mt-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
            >
                Reboot to Recovery
            </button>
        </div>
    );
};

export default ErrorScreen;