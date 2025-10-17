
import React from 'react';

interface ButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, icon, label, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                flex flex-col items-center justify-center 
                w-full h-full bg-gray-800 rounded-lg shadow-md
                hover:bg-[var(--accent-interactive)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-medium)]
                transition-all duration-200 ease-in-out
                transform hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            `}
        >
            <div className="w-12 h-12 text-[var(--accent-primary)] mb-2">{icon}</div>
            <span className="text-gray-200 font-medium">{label}</span>
        </button>
    );
};

export default Button;