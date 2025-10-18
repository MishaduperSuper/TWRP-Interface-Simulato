import React, { useState, useEffect } from 'react';

interface BootAnimationProps {
    onComplete: () => void;
    systemCorrupted: boolean;
}

const RiverLogo = () => (
    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400">
        <path d="M4 10C4 10 5.6 12 12 12C18.4 12 20 10 20 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 14C4 14 5.6 16 12 16C18.4 16 20 14 20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 6C4 6 5.6 8 12 8C18.4 8 20 6 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 18C4 18 5.6 20 12 20C18.4 20 20 18 20 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
            <div className="w-16 h-16 text-yellow-400 mx-auto mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
            </div>
            <h2 className="text-2xl font-bold text-yellow-300 mb-2">No OS Installed!</h2>
            <p className="text-gray-300">Rebooting to recovery...</p>
        </div>
    );

    return (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50">
            <div className={`transition-opacity duration-1000 ${getOpacity()}`}>
                {systemCorrupted ? (
                    <NoOsScreen />
                ) : (
                    <>
                        <RiverLogo />
                        <p className="text-gray-400 mt-2">RIVER RECOVERY</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default BootAnimation;
