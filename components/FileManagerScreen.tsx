import React from 'react';
import { AVAILABLE_DOWNLOADS } from '../constants';

interface FileManagerScreenProps {
    filesystem: any;
    onDownloadFile: (fileName: string) => void;
}

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0011.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


const FileManagerScreen: React.FC<FileManagerScreenProps> = ({ filesystem, onDownloadFile }) => {
    const sdcardFiles = filesystem.sdcard || {};
    const sortedSdcardFiles = Object.keys(sdcardFiles).sort((a, b) => {
        const aIsDir = typeof sdcardFiles[a] === 'object' && sdcardFiles[a] !== null;
        const bIsDir = typeof sdcardFiles[b] === 'object' && sdcardFiles[b] !== null;
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        return a.localeCompare(b);
    });

    return (
        <div className="p-2 flex-grow flex flex-col">
            <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-2">File Manager</h2>
            <div className="flex-grow overflow-y-auto px-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Files on Device */}
                <div className="bg-gray-900/50 rounded-lg p-3">
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">/sdcard</h3>
                    <div className="h-48 overflow-y-auto">
                        {sortedSdcardFiles.length > 0 ? (
                             <ul>
                                {sortedSdcardFiles.map(name => {
                                    const isDir = typeof sdcardFiles[name] === 'object' && sdcardFiles[name] !== null;
                                    return (
                                        <li key={name} className="flex items-center p-2 my-1 bg-gray-800 rounded-md">
                                            {isDir ? <FolderIcon /> : <FileIcon />}
                                            <span className="truncate text-gray-400">{name}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center p-4">/sdcard is empty.</p>
                        )}
                    </div>
                </div>

                {/* Available Downloads */}
                <div className="bg-gray-900/50 rounded-lg p-3">
                     <h3 className="text-lg font-semibold mb-2 text-gray-300">Available Downloads</h3>
                    <div className="h-48 overflow-y-auto">
                         <ul>
                            {AVAILABLE_DOWNLOADS.map(file => {
                                const isDownloaded = !!sdcardFiles[file.name];
                                return (
                                    <li key={file.name} className="flex items-center justify-between p-2 my-1 bg-gray-800 rounded-md">
                                        <div>
                                            <p className="font-semibold text-gray-300">{file.name}</p>
                                            <p className="text-xs text-gray-500">{file.description}</p>
                                        </div>
                                        <button 
                                            onClick={() => onDownloadFile(file.name)}
                                            disabled={isDownloaded}
                                            className="ml-4 p-2 rounded-md bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0"
                                            aria-label={isDownloaded ? `Already downloaded ${file.name}`: `Download ${file.name}`}
                                        >
                                            {isDownloaded ? 'Done' : <DownloadIcon />}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileManagerScreen;
