import React from 'react';

const HardBrickScreen: React.FC = () => {
    return (
        <div className="h-screen w-screen bg-black flex flex-col font-mono text-gray-400 items-center justify-center p-4">
            <div className="text-center animate-pulse">
                <p>QHSUSB_BULK</p>
                <p>PID: 9008</p>
            </div>
            <p className="text-xs text-gray-600 absolute bottom-4">
                To restart the simulation, please refresh the page.
            </p>
        </div>
    );
};

export default HardBrickScreen;
