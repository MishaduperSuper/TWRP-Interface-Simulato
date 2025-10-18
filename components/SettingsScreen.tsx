import React from 'react';
import { Theme, themes } from '../themes';
import { Screen } from '../types';

interface SettingsScreenProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
    errorChance: number;
    onSetErrorChance: (chance: number) => void;
    onNavigate: (screen: Screen) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ currentTheme, onThemeChange, errorChance, onSetErrorChance, onNavigate }) => {
    const errorChances = [
        { label: '0%', value: 0 },
        { label: '10%', value: 0.1 },
        { label: '25%', value: 0.25 },
        { label: '50%', value: 0.5 },
    ];
    
    return (
        <div className="p-2 flex-grow flex flex-col">
            <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-2">Settings</h2>
            <div className="flex-grow p-4 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-300 mb-3">Accent Color</h3>
                <div className="grid grid-cols-2 gap-4">
                    {Object.values(themes).map((theme) => {
                        const isSelected = theme.name === currentTheme.name;
                        return (
                            <button
                                key={theme.name}
                                onClick={() => onThemeChange(theme)}
                                className={`
                                    p-4 rounded-lg flex flex-col items-center justify-center
                                    transition-all duration-200 border-2
                                    ${isSelected ? 'border-[var(--accent-primary)] bg-gray-700' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}
                                `}
                                aria-pressed={isSelected}
                            >
                                <div
                                    className="w-10 h-10 rounded-full mb-2 border-2 border-gray-900"
                                    style={{ backgroundColor: theme.primary }}
                                ></div>
                                <span className="font-medium text-gray-200">{theme.name}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="border-t border-gray-700 my-6"></div>

                <h3 className="text-lg font-semibold text-gray-300 mb-3">Simulation</h3>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <label className="block text-gray-400 mb-2">Installation Error Chance</label>
                    <div className="flex items-center justify-between bg-gray-900 p-1 rounded-md">
                         {errorChances.map(({ label, value }) => {
                             const isSelected = errorChance === value;
                             return (
                                <button
                                    key={value}
                                    onClick={() => onSetErrorChance(value)}
                                    className={`
                                        w-full py-2 rounded text-sm font-semibold transition-colors
                                        ${isSelected ? 'bg-[var(--accent-dark)] text-white' : 'text-gray-300 hover:bg-gray-700'}
                                    `}
                                    aria-pressed={isSelected}
                                >
                                    {label}
                                </button>
                             )
                         })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Set the probability of a simulated failure during ZIP installation.</p>
                </div>

                <div className="border-t border-gray-700 my-6"></div>

                 <h3 className="text-lg font-semibold text-gray-300 mb-3">Advanced</h3>
                 <div className="bg-gray-800 p-4 rounded-lg">
                    <button
                        onClick={() => onNavigate(Screen.Magisk)}
                        className="w-full text-left p-3 bg-gray-900 hover:bg-gray-700 rounded-md transition-colors text-gray-200"
                    >
                        Magisk Manager
                    </button>
                    <p className="text-xs text-gray-500 mt-2">Manage simulated root access and patch boot images.</p>
                 </div>
            </div>
        </div>
    );
};

export default SettingsScreen;