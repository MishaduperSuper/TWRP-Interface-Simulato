import React from 'react';

interface InstallScreenProps {
    onSelectFile: (fileName: string) => void;
    filesystem: any;
}

const ZipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[var(--accent-primary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const InstallScreen: React.FC<InstallScreenProps> = ({ onSelectFile, filesystem }) => {
    const installableFiles = Object.keys(filesystem.sdcard || {})
        .filter(file => file.endsWith('.zip') || file.endsWith('.img'))
        .sort((a, b) => a.localeCompare(b));

    return (
        <div className="p-2 flex-grow flex flex-col">
            <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-2">Select File to Install from /sdcard</h2>
            <div className="flex-grow overflow-y-auto">
                {installableFiles.length > 0 ? (
                    <ul>
                        {installableFiles.map((file) => (
                            <li key={file}>
                                <button
                                    onClick={() => onSelectFile(file)}
                                    className="w-full text-left p-3 flex items-center bg-gray-800 hover:bg-[var(--accent-interactive)] my-1 rounded-md transition-colors"
                                >
                                {file.endsWith('.zip') ? <ZipIcon /> : <ImageIcon />}
                                <span className="truncate">{file}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-4 text-center text-gray-400">
                        <p>No installable files found on /sdcard.</p>
                        <p className="mt-2 text-sm">Use the File Manager to download packages.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstallScreen;