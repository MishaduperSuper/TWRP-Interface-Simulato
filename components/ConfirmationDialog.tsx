import React from 'react';

interface ConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-full max-w-sm animate-fade-in-up">
                <div className="p-4 border-b border-gray-700">
                    <h3 id="dialog-title" className="text-lg font-bold text-cyan-400">{title}</h3>
                </div>
                <div className="p-4 text-gray-300">
                    {message}
                </div>
                <div className="p-3 flex justify-end gap-3 bg-gray-900/50 rounded-b-lg">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        {confirmText}
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

export default ConfirmationDialog;
