
export interface Theme {
    name: string;
    primary: string;    // for text, icons
    medium: string;     // for interactive elements, borders, rings
    dark: string;       // for solid buttons
    hover: string;      // for button hover
    border: string;     // for darker borders
    interactive: string; // for lighter hover on list items
}

export const themes: { [key: string]: Theme } = {
    demonRed: {
        name: 'Demon Red',
        primary: '#f87171', // red-400
        medium: '#ef4444', // red-500
        dark: '#dc2626', // red-600
        hover: '#b91c1c', // red-700
        border: '#991b1b', // red-800
        interactive: 'rgba(127, 29, 29, 0.5)', // red-900/50
    },
    cyan: {
        name: 'Demon Cyan',
        primary: '#22d3ee', // 400
        medium: '#06b6d4', // 500
        dark: '#0891b2', // 600
        hover: '#0e7490', // 700
        border: '#155e75', // 800
        interactive: 'rgba(22, 78, 99, 0.5)', // 900/50
    },
    amber: {
        name: 'Amber',
        primary: '#fbbf24', // 400
        medium: '#f59e0b', // 500
        dark: '#d97706', // 600
        hover: '#b45309', // 700
        border: '#92400e', // 800
        interactive: 'rgba(120, 53, 15, 0.5)', // 900/50
    },
    lime: {
        name: 'Lime',
        primary: '#a3e635', // 400
        medium: '#84cc16', // 500
        dark: '#65a30d', // 600
        hover: '#4d7c0f', // 700
        border: '#3f6212', // 800
        interactive: 'rgba(54, 83, 20, 0.5)', // 900/50
    },
    fuchsia: {
        name: 'Fuchsia',
        primary: '#e879f9', // 400
        medium: '#d946ef', // 500
        dark: '#c026d3', // 600
        hover: '#a21caf', // 700
        border: '#86198f', // 800
        interactive: 'rgba(112, 26, 117, 0.5)', // 900/50
    }
};
