import React from 'react';

interface InstallErrorHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

const InstallErrorHelp: React.FC<InstallErrorHelpProps> = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="dialog-title-error-fix">
            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-full max-w-lg animate-fade-in-up">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 id="dialog-title-error-fix" className="text-lg font-bold text-yellow-400">Fixing Installation Error 7 (Device Mismatch)</h3>
                    <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-4 text-gray-300 max-h-[60vh] overflow-y-auto">
                    <p className="mb-4">This error means the ZIP file has a check to ensure it's only installed on specific devices. You can bypass this by editing a script inside the ZIP.</p>
                    <ol className="list-decimal list-inside space-y-3">
                        <li>Download the ZIP file to your computer.</li>
                        <li>Open the archive (do NOT fully extract it). Use a program like 7-Zip or WinRAR.</li>
                        <li>Navigate to the folder: <code className="bg-gray-900 text-cyan-400 px-1 rounded">META-INF/com/google/android/</code>.</li>
                        <li>Find and extract the file named <code className="bg-gray-900 text-cyan-400 px-1 rounded">updater-script</code>.</li>
                        <li>Open this file with a good text editor (like Notepad++ or VS Code).</li>
                        <li className="space-y-2">
                            Delete or comment out the first few lines that perform the device check. They look like this:
                            <pre className="bg-black/50 text-red-400 p-2 rounded-md text-xs overflow-x-auto my-2">
                                {`getprop("ro.product.device") == "river" || ... \nabort("E3004: This package is for device: ...`);}
                            </pre>
                             Or like this:
                             <pre className="bg-black/50 text-red-400 p-2 rounded-md text-xs overflow-x-auto my-2">
                                {`assert(getprop("ro.product.device") == "river" || ...`);}
                             </pre>
                             <p className="text-xs text-gray-400">(To comment a line, add a '#' character at the beginning).</p>
                        </li>
                        <li>Save the modified <code className="bg-gray-900 text-cyan-400 px-1 rounded">updater-script</code> file.</li>
                        <li>Drag the saved file back into the ZIP archive, replacing the original one.</li>
                        <li>Copy the modified ZIP back to the device and try installing it again.</li>
                    </ol>
                </div>
                <div className="p-3 flex justify-end gap-3 bg-gray-900/50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-medium)]"
                    >
                        Got it
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default InstallErrorHelp;
