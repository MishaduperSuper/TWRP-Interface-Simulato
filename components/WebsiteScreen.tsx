import React, { useState } from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-xl font-bold text-[var(--accent-primary)] border-b-2 border-[var(--accent-medium)] pb-2 mb-3">{title}</h3>
        <div className="text-gray-300 space-y-2">
            {children}
        </div>
    </div>
);

const WebsiteScreen: React.FC = () => {
    const [loginToSearch, setLoginToSearch] = useState('');
    const [searchResult, setSearchResult] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = () => {
        if (!loginToSearch) {
            setSearchResult('Please enter a login to search.');
            return;
        }
        setIsSearching(true);
        setSearchResult(null);
        setTimeout(() => {
            if (loginToSearch.toLowerCase() === 'theprofgh') {
                setSearchResult(`Login: theprofgh\nStatus: Active\nLicense: Universal Pack (All Brands)`);
            } else if (loginToSearch.length < 5) {
                 setSearchResult(`Login: ${loginToSearch}\nStatus: Expired\nLicense: Samsung`);
            } else {
                setSearchResult(`Login: ${loginToSearch}\nStatus: Not Found\nNo active license associated with this login.`);
            }
            setIsSearching(false);
        }, 1200);
    };

    return (
        <div className="p-2 flex-grow flex flex-col">
            <h2 className="text-2xl font-bold p-3 border-b-2 border-gray-700 mb-4 text-center">DemonTOOL Official Portal</h2>
            <div className="flex-grow overflow-y-auto px-3 max-w-4xl mx-auto w-full">

                <Section title="What is DemonTOOL?">
                    <p>
                        DemonTOOL is a professional-grade, all-in-one toolkit for advanced Android device servicing. Our awesome program provides a powerful, intuitive interface for technicians and enthusiasts to perform complex operations such as firmware flashing, FRP removal, partition management, and system debloating.
                    </p>
                    <p>
                        Our proprietary server-based solutions ensure high success rates for even the most difficult tasks. All operations are logged and verified for maximum reliability.
                    </p>
                </Section>
                
                <Section title="Check License Status">
                    <p>Enter a username to check the status of a DemonTOOL license.</p>
                    <div className="flex gap-2 my-2">
                        <input
                            type="text"
                            value={loginToSearch}
                            onChange={(e) => setLoginToSearch(e.target.value)}
                            placeholder="Enter login..."
                            className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent-medium)] transition"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="px-6 py-2 bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white font-semibold rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-wait"
                        >
                            {isSearching ? '...' : 'Search'}
                        </button>
                    </div>
                    {searchResult && (
                        <pre className="bg-black/50 p-3 rounded-md text-sm text-cyan-300 mt-3 whitespace-pre-wrap animate-fade-in">
                            {searchResult}
                        </pre>
                    )}
                </Section>

                <Section title="Available Licenses (in Rubles)">
                    <p>
                        A license is required per device brand to access the full features of DemonTOOL. Licenses are permanent for the version purchased. Prices have been updated to reflect our awesome, enhanced server capabilities.
                    </p>
                    <ul className="list-disc list-inside bg-gray-800 p-4 rounded-lg">
                        <li><strong>Samsung:</strong> 2000 RUB</li>
                        <li><strong>Xiaomi / Poco / Redmi:</strong> 1800 RUB</li>
                        <li><strong>Realme / OPPO / OnePlus:</strong> 1900 RUB</li>
                        <li><strong>Huawei / Honor:</strong> 2500 RUB (Includes advanced Kirin SoC support)</li>
                        <li><strong>Universal Pack (All Brands):</strong> 6000 RUB</li>
                    </ul>
                </Section>
                
                <Section title="Available Firmware">
                    <p>
                        DemonTOOL provides access to a vast, curated library of official and combination firmwares, updated daily. Our library includes:
                    </p>
                     <ul className="list-disc list-inside bg-gray-800 p-4 rounded-lg">
                        <li><strong>Stock Firmware:</strong> Full official packages for unbricking and restoring devices to factory state.</li>
                        <li><strong>Combination Files:</strong> Special service firmware for advanced diagnostics, FRP removal, and repair.</li>
                        <li><strong>Engineering ROMs:</strong> For low-level hardware access and debugging (requires special license).</li>
                        <li><strong>Region-Specific Variants:</strong> We support firmware for all major global regions (EUX, INS, RU, etc.).</li>
                    </ul>
                </Section>

            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-in-out forwards;
                }
            `}</style>
        </div>
    );
};

export default WebsiteScreen;