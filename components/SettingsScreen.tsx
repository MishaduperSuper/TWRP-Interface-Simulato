import React from 'react';

const SettingsScreen: React.FC = () => {
    return (
        <div className="p-2 flex-grow flex flex-col">
            <h2 className="text-xl font-bold p-3 border-b-2 border-cyan-500 mb-2">Settings</h2>
            <div className="flex-grow p-4 flex items-center justify-center">
                <p className="text-gray-500 text-lg">Settings are not yet implemented in this simulation.</p>
            </div>
        </div>
    );
};

export default SettingsScreen;
