
import React, { useState, FormEvent } from 'react';

interface LoginScreenProps {
    onLogin: (user: string, pass: string) => boolean;
}

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        setLoadingMessage('Contacting authentication server...');

        setTimeout(() => {
            setLoadingMessage('Verifying license...');
            setTimeout(() => {
                const success = onLogin(username, password);
                if (success) {
                    setLoadingMessage('Login successful!');
                    // The parent component will handle unmounting this screen
                } else {
                    setError('Authentication failed. Check credentials or license status.');
                    setIsLoading(false);
                    setLoadingMessage('');
                }
            }, 1000);
        }, 800);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4">
            <div className="w-full max-w-sm">
                 <h1 className="text-2xl font-bold text-center text-[var(--accent-primary)] mb-2">DemonTOOL Pro</h1>
                 <p className="text-center text-gray-400 mb-6">License authentication required</p>
                <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-400 text-sm font-bold mb-2">Username</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserIcon />
                            </span>
                             <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent-medium)] transition"
                                placeholder="theprofgh"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-400 text-sm font-bold mb-2">Password</label>
                         <div className="relative">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockIcon />
                            </span>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent-medium)] transition"
                                placeholder="••••"
                                required
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 flex items-center justify-center py-3 bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-lg transition-colors text-lg shadow-lg disabled:bg-gray-600 disabled:cursor-wait"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <span>{loadingMessage}</span>
                                <span className="animate-pulse ml-2">...</span>
                            </div>
                        ) : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
