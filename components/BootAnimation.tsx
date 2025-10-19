
import React, { useState, useEffect } from 'react';

interface BootAnimationProps {
    onComplete: () => void;
    systemCorrupted: boolean;
}

const DemonLogo = () => (
    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500 animate-pulse">
        <path d="M6 3L8 7M18 3L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 21H8C6.89543 21 6 20.1046 6 19V9C6 7.89543 6.89543 7 8 7H16C17.1046 7 18 7.89543 18 9V19C18 20.1046 17.1046 21 16 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 16C10 16 11 15 12 15C13 15 14 16 14 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


const BootAnimation: React.FC<BootAnimationProps> = ({ onComplete, systemCorrupted }) => {
    const [phase, setPhase] = useState<'start' | 'logo' | 'end'>('start');

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('logo'), 500);
        const t2 = setTimeout(() => setPhase('end'), 3000);
        const t3 = setTimeout(onComplete, 4000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [onComplete]);

    const getOpacity = () => {
        switch(phase) {
            case 'start': return 'opacity-0';
            case 'logo': return 'opacity-100';
            case 'end': return 'opacity-0';
        }
    };
    
    const NoOsScreen = () => (
        <div className="text-center p-4">
            <div className="w-16 h-16 text-red-500 mx-auto mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">No OS Installed!</h2>
            <p className="text-gray-300">Rebooting to DemonTOOL...</p>
        </div>
    );

    return (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50">
            <div className={`transition-opacity duration-1000 ${getOpacity()}`}>
                {systemCorrupted ? (
                    <NoOsScreen />
                ) : (
                    <div className="flex flex-col items-center">
                        <DemonLogo />
                        <p className="text-gray-400 mt-2 font-mono tracking-widest">DEMONTOOL</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BootAnimation;
