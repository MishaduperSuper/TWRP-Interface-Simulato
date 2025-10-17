import React, { useState, useEffect } from 'react';

interface RebootScreenProps {
    onComplete: () => void;
}

const RiverLogo = () => (
    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400">
        <path d="M4 10C4 10 5.6 12 12 12C18.4 12 20 10 20 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 14C4 14 5.6 16 12 16C18.4 16 20 14 20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 6C4 6 5.6 8 12 8C18.4 8 20 6 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 18C4 18 5.6 20 12 20C18.4 20 20 18 20 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const RebootScreen: React.FC<RebootScreenProps> = ({ onComplete }) => {
    const [phase, setPhase] = useState<'start' | 'logo' | 'end'>('start');

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('logo'), 500); // Fade to black is done, show logo
        const t2 = setTimeout(() => setPhase('end'), 3000); // Hold logo, then start fade out
        const t3 = setTimeout(onComplete, 4000); // Animation finished, call complete

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

    return (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50">
            <div className={`transition-opacity duration-1000 ${getOpacity()}`}>
                <RiverLogo />
                <p className="text-gray-400 mt-2">RIVER RECOVERY</p>
            </div>
        </div>
    );
};

export default RebootScreen;