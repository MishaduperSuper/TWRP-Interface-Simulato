import React from 'react';

interface DownloadStockFirmwareScreenProps {
    onConfirm: (brand: string) => void;
}

const SamsungLogo = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="2" />
        <path d="M6 12L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const XiaomiLogo = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500">
        <path d="M5 15.5V12.5C5 12.2239 5.22386 12 5.5 12H7.5M5 15.5H7.5M5 15.5C5 15.7761 5.22386 16 5.5 16H7.5M7.5 15.5V12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 16V12.5C15 12.2239 15.2239 12 15.5 12H18.5C18.7761 12 19 12.2239 19 12.5V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 14H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const AsusLogo = () => (
     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-teal-400">
        <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M8.5 8.5L15.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8.5 15.5L15.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);


const BrandButton: React.FC<{
    brand: string;
    description: string;
    onClick: () => void;
    logo: React.ReactNode;
}> = ({ brand, description, onClick, logo }) => (
    <button
        onClick={onClick}
        className="w-full text-left p-4 bg-gray-800 hover:bg-[var(--accent-interactive)] my-1 rounded-md transition-colors flex items-center"
    >
        <div className="w-10 h-10 mr-4 flex-shrink-0 flex items-center justify-center">{logo}</div>
        <div>
            <h3 className="text-lg font-bold text-gray-200">{brand}</h3>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    </button>
);

const DownloadStockFirmwareScreen: React.FC<DownloadStockFirmwareScreenProps> = ({ onConfirm }) => {
    return (
        <div className="p-2 flex-grow flex flex-col">
            <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-2">Download & Flash Stock Firmware</h2>
            <p className="px-3 pb-3 text-gray-400">Select the device brand. This will download the latest official firmware and flash it, restoring the device to factory state and wiping all data.</p>
            <div className="flex-grow overflow-y-auto px-1">
                <BrandButton
                    brand="Samsung"
                    description="Flashes official TAR.MD5 firmware via Odin protocol."
                    onClick={() => onConfirm('Samsung')}
                    logo={<SamsungLogo />}
                />
                 <BrandButton
                    brand="Xiaomi"
                    description="Flashes official Fastboot ROM via MiFlash protocol."
                    onClick={() => onConfirm('Xiaomi')}
                    logo={<XiaomiLogo />}
                />
                 <BrandButton
                    brand="Asus"
                    description="Flashes official ZIP package via ADB Sideload."
                    onClick={() => onConfirm('Asus')}
                    logo={<AsusLogo />}
                />
            </div>
        </div>
    );
};

export default DownloadStockFirmwareScreen;