
import React from 'react';
import { SPARE_PARTS } from '../constants';

interface InstallScreenProps {
    onSelectZip: (zipName: string) => void;
}

const ZipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[var(--accent-primary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);


const InstallScreen: React.FC<InstallScreenProps> = ({ onSelectZip }) => {
    return (
        <div className="p-2 flex-grow flex flex-col">
            <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-2">Select ZIP to Install</h2>
            <div className="flex-grow overflow-y-auto">
                <ul>
                    {SPARE_PARTS.map((part) => (
                        <li key={part}>
                            <button
                                onClick={() => onSelectZip(part)}
                                className="w-full text-left p-3 flex items-center bg-gray-800 hover:bg-[var(--accent-interactive)] my-1 rounded-md transition-colors"
                            >
                               <ZipIcon />
                               <span className="truncate">{part}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default InstallScreen;