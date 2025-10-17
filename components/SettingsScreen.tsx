import React from 'react';
import { Theme, themes } from '../themes';

interface SettingsScreenProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ currentTheme, onThemeChange }) => {
    return (
        <div className="p-2 flex-grow flex flex-col">
            <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-2">Settings</h2>
            <div className="flex-grow p-4">
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
            </div>
        </div>
    );
};

export default SettingsScreen;
