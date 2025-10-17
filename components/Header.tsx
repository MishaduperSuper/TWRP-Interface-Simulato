
import React, { useState, useEffect } from 'react';

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
            <div className="w-6 h-3 border border-gray-400 rounded-sm flex items-center p-0.5 relative">
                <div className="h-full bg-[var(--accent-primary)] rounded-sm" style={{ width }}></div>
                <div className="w-1 h-2 bg-gray-400 absolute -right-1 top-1/2 -translate-y-1/2 rounded-r-sm"></div>
            </div>
        );
    };

    return (
        <header className="flex-shrink-0 bg-gray-900 p-2 flex justify-between items-center text-sm text-gray-300 border-b border-gray-700">
            <div className="font-bold text-[var(--accent-primary)]">Team Win Recovery Project</div>
            <div className="flex items-center space-x-2">
                <span>{formatTime(time)}</span>
                <BatteryIcon level={battery} />
                <span>{battery}%</span>
            </div>
        </header>
    );
};

export default Header;