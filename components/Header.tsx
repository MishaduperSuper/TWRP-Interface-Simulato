
import React, { useState, useEffect } from 'react';

const SignalIcon: React.FC = () => (
    <span className="flex items-end space-x-0.5 h-4 w-4" aria-label="Signal strength full">
        <span className="w-1 h-1 bg-gray-300 rounded-sm"></span>
        <span className="w-1 h-2 bg-gray-300 rounded-sm"></span>
        <span className="w-1 h-3 bg-gray-300 rounded-sm"></span>
        <span className="w-1 h-4 bg-gray-300 rounded-sm"></span>
    </span>
);

const WifiIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Wi-Fi connected">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.556a5.5 5.5 0 017.778 0M12 20.25a.75.75 0 01.75-.75h.008a.75.75 0 01-.008 1.5h-.008A.75.75 0 0112 20.25zM4.444 12.889a10.5 10.5 0 0115.112 0" />
    </svg>
);


const Header: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [battery, setBattery] = useState(88);

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        const batteryId = setInterval(() => {
            setBattery(b => {
                if (b <= 1) return 100; // Simulate charging cycle
                return b - 1;
            });
        }, 30000);

        return () => {
            clearInterval(timerId);
            clearInterval(batteryId);
        };
    }, []);

    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const BatteryIcon: React.FC<{ level: number }> = ({ level }) => {
        const width = `${level}%`;
        return (
            <div className="w-6 h-3 border border-gray-400 rounded-sm flex items-center p-0.5 relative" aria-label={`Battery level: ${level}%`}>
                <div className="h-full bg-[var(--accent-primary)] rounded-sm" style={{ width }}></div>
                <div className="w-1 h-2 bg-gray-400 absolute -right-1 top-1/2 -translate-y-1/2 rounded-r-sm"></div>
            </div>
        );
    };

    return (
        <header className="flex-shrink-0 bg-gray-900 p-2 flex justify-between items-center text-sm text-gray-300 border-b border-gray-700">
            <div className="font-bold text-[var(--accent-primary)]">DemonTOOL</div>
            <div className="flex items-center space-x-2">
                <SignalIcon />
                <WifiIcon />
                <span>{formatTime(time)}</span>
                <BatteryIcon level={battery} />
                <span>{battery}%</span>
            </div>
        </header>
    );
};

export default Header;
