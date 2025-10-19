import React from 'react';
import { Screen } from '../types';

interface UnlockBootloaderScreenProps {
    onConfirmUnlock: (brand: string) => void;
    onNavigate: (screen: Screen) => void;
}

const XiaomiLogo = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500">
        <path d="M5 15.5V12.5C5 12.2239 5.22386 12 5.5 12H7.5M5 15.5H7.5M5 15.5C5 15.7761 5.22386 16 5.5 16H7.5M7.5 15.5V12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 16V12.5C15 12.2239 15.2239 12 15.5 12H18.5C18.7761 12 19 12.2239 19 12.5V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 14H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SamsungLogo = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="2" />
        <path d="M6 12L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const HuaweiLogo = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor" opacity="0.5" />
        <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MediaTekLogo = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
        <path d="M4 8L12 16L20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 14L8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 14L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const AppleLogo = () => (
     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
        <path d="M18.707,10.293c-0.23-0.23-0.512-0.354-0.817-0.354c-0.305,0-0.587,0.124-0.817,0.354c-0.456,0.456-0.707,1.262-0.707,2.207   c0,0.945,0.251,1.751,0.707,2.207c0.23,0.23,0.512,0.354,0.817,0.354c0.305,0,0.587-0.124,0.817-0.354   c0.456-0.456,0.707-1.262,0.707-2.207C19.414,11.555,19.163,10.749,18.707,10.293z" fill="currentColor"/>
        <path d="M15.895,8.105c0.33-0.417,0.531-0.917,0.531-1.469c0-0.99-0.81-1.8-1.8-1.8c-0.552,0-1.052,0.201-1.469,0.531   c-0.417-0.33-0.917-0.531-1.469-0.531c-0.99,0-1.8,0.81-1.8,1.8c0,0.552,0.201,1.052,0.531,1.469   c-1.895,1.095-2.688,3.239-2.688,5.395c0,3.308,2.692,6,6,6s6-2.692,6-6C18.583,11.344,17.79,9.2,15.895,8.105z" fill="currentColor"/>
    </svg>
);


const BrandButton: React.FC<{
    brand: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
    logo: React.ReactNode;
}> = ({ brand, description, onClick, disabled, logo }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-full text-left p-4 bg-gray-800 hover:bg-[var(--accent-interactive)] my-1 rounded-md transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800"
    >
        <div className="w-10 h-10 mr-4 flex-shrink-0 flex items-center justify-center">{logo}</div>
        <div>
            <h3 className="text-lg font-bold text-gray-200">{brand}</h3>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    </button>
);

const UnlockBootloaderScreen: React.FC<UnlockBootloaderScreenProps> = ({ onConfirmUnlock, onNavigate }) => {
    return (
        <div className="p-2 flex-grow flex flex-col">
            <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-2">Unlock / Bypass</h2>
            <p className="px-3 pb-3 text-gray-400">Select the device brand to begin the process. This may wipe all data on the device.</p>
            <div className="flex-grow overflow-y-auto px-1">
                <BrandButton 
                    brand="Xiaomi"
                    description="Utilizes EDL mode and Firehose programmer vulnerabilities."
                    onClick={() => onConfirmUnlock('Xiaomi')}
                    logo={<XiaomiLogo />}
                />
                 <BrandButton 
                    brand="Samsung"
                    description="Bypasses Knox security by flashing a server-generated token."
                    onClick={() => onConfirmUnlock('Samsung')}
                    logo={<SamsungLogo />}
                />
                 <BrandButton 
                    brand="Huawei / Honor"
                    description="Requires Test Point. Patches oeminfo via USB COM 1.0 mode."
                    onClick={() => onConfirmUnlock('Huawei / Honor')}
                    logo={<HuaweiLogo />}
                />
                 <BrandButton 
                    brand="MediaTek Universal"
                    description="Exploits BROM to disable auth and patch lock status."
                    onClick={() => onConfirmUnlock('MediaTek Universal')}
                    logo={<MediaTekLogo />}
                />
                <BrandButton 
                    brand="Apple"
                    description="Bypass iCloud lock via checkm8 exploit. (Very Long Process)"
                    onClick={() => onNavigate(Screen.BypassICloud)}
                    disabled={false}
                    logo={<AppleLogo />}
                />
            </div>
        </div>
    );
};

export default UnlockBootloaderScreen;