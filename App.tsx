import React, { useState, useCallback } from 'react';
import { Screen } from './types';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import InstallScreen from './components/InstallScreen';
import WipeScreen from './components/WipeScreen';
import ActionScreen from './components/ActionScreen';
import TerminalView from './components/TerminalView';
import AdvancedWipeScreen from './components/AdvancedWipeScreen';
import ErrorScreen from './components/ErrorScreen';
import MountScreen from './components/MountScreen';
import SettingsScreen from './components/SettingsScreen';
import RebootScreen from './components/RebootScreen';

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Home);
    const [selectedZip, setSelectedZip] = useState<string | null>(null);
    const [actionType, setActionType] = useState<'install' | 'wipe' | 'advanced-wipe' | 'mount' | null>(null);
    const [partitionsToWipe, setPartitionsToWipe] = useState<string[]>([]);
    const [mountOps, setMountOps] = useState<{ partition: string; mount: boolean }[]>([]);
    const [isRebooting, setIsRebooting] = useState(false);

    const navigateTo = (screen: Screen) => {
        setCurrentScreen(screen);
    };

    const handleSelectZip = (zipName: string) => {
        setSelectedZip(zipName);
        navigateTo(Screen.ConfirmInstall);
    };
    
    const handleConfirmInstall = useCallback((backup: boolean) => {
        setActionType('install');
        navigateTo(Screen.Processing);
    }, []);

    const handleConfirmWipe = useCallback(() => {
        setActionType('wipe');
        navigateTo(Screen.Processing);
    }, []);
    
    const handleSelectPartitions = (partitions: string[]) => {
        setPartitionsToWipe(partitions);
        navigateTo(Screen.ConfirmAdvancedWipe);
    };

    const handleConfirmAdvancedWipe = useCallback(() => {
        setActionType('advanced-wipe');
        navigateTo(Screen.Processing);
    }, []);

    const handleConfirmMount = useCallback((operations: { partition: string; mount: boolean }[]) => {
        setMountOps(operations);
        setActionType('mount');
        navigateTo(Screen.Processing);
    }, []);
    
    const handleReboot = useCallback(() => {
        setIsRebooting(true);
    }, []);

    const handleRebootComplete = useCallback(() => {
        setIsRebooting(false);
        handleActionComplete();
    }, []);

    const handleActionComplete = useCallback(() => {
        setSelectedZip(null);
        setActionType(null);
        setPartitionsToWipe([]);
        setMountOps([]);
        navigateTo(Screen.Home);
    }, []);
    
    const goHome = useCallback(() => {
        setSelectedZip(null);
        setActionType(null);
        setPartitionsToWipe([]);
        setMountOps([]);
        navigateTo(Screen.Home);
    }, []);

    const goBack = useCallback(() => {
       switch(currentScreen) {
           case Screen.Install:
           case Screen.Wipe:
           case Screen.Mount:
           case Screen.Settings:
               goHome();
               break;
           case Screen.ConfirmInstall:
               navigateTo(Screen.Install);
               break;
           case Screen.ConfirmWipe:
               navigateTo(Screen.Wipe);
               break;
           case Screen.AdvancedWipeSelection:
               navigateTo(Screen.Wipe);
               break;
           case Screen.ConfirmAdvancedWipe:
               navigateTo(Screen.AdvancedWipeSelection);
               break;
           default:
               goHome();
       }
    }, [currentScreen, goHome]);

    const renderScreen = () => {
        switch (currentScreen) {
            case Screen.Home:
                return <HomeScreen onNavigate={navigateTo} />;
            case Screen.Install:
                return <InstallScreen onSelectZip={handleSelectZip} />;
            case Screen.Wipe:
                return <WipeScreen onWipe={() => navigateTo(Screen.ConfirmWipe)} onAdvancedWipe={() => navigateTo(Screen.AdvancedWipeSelection)} />;
            case Screen.AdvancedWipeSelection:
                return <AdvancedWipeScreen onConfirm={handleSelectPartitions} />;
            case Screen.Mount:
                return <MountScreen onConfirm={handleConfirmMount} />;
            case Screen.Settings:
                return <SettingsScreen />;
            case Screen.ConfirmInstall:
                return (
                    <ActionScreen
                        title="Confirm Flash"
                        description={`Are you sure you want to flash ${selectedZip}?`}
                        actionText="Confirm Flash"
                        onConfirm={handleConfirmInstall}
                        actionType="install"
                    />
                );
            case Screen.ConfirmWipe:
                 return (
                    <ActionScreen
                        title="Confirm Wipe"
                        description="This will wipe all user data. This cannot be undone."
                        actionText="Factory Reset"
                        onConfirm={handleConfirmWipe}
                        actionType="wipe"
                    />
                );
            case Screen.ConfirmAdvancedWipe:
                return (
                    <ActionScreen
                        title="Advanced Wipe"
                        description={`You are about to wipe the following partitions: ${partitionsToWipe.join(', ')}. This cannot be undone.`}
                        actionText="Confirm Advanced Wipe"
                        onConfirm={handleConfirmAdvancedWipe}
                        actionType="wipe"
                    />
                );
            case Screen.Processing:
                 return (
                    <TerminalView
                        actionType={actionType}
                        fileName={selectedZip}
                        partitions={actionType === 'advanced-wipe' ? partitionsToWipe : undefined}
                        mountOps={actionType === 'mount' ? mountOps : undefined}
                        onComplete={handleActionComplete}
                        onReboot={handleReboot}
                    />
                );
            case Screen.BackupError:
                return <ErrorScreen onGoHome={goHome} />;
            default:
                return <HomeScreen onNavigate={navigateTo} />;
        }
    };

    return (
        <div className="h-screen w-screen bg-black flex flex-col font-sans max-w-md mx-auto border-2 border-gray-700 shadow-2xl relative">
            {isRebooting && <RebootScreen onComplete={handleRebootComplete} />}
            <Header />
            <main className="flex-grow flex flex-col overflow-y-auto">
                {renderScreen()}
            </main>
            {currentScreen !== Screen.Processing && (
                <footer className="flex-shrink-0 bg-gray-900 flex justify-around items-center h-16 border-t border-gray-700">
                    <button onClick={goBack} className="p-4">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                       </svg>
                    </button>
                    <button onClick={goHome} className="p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </button>
                </footer>
            )}
        </div>
    );
};

export default App;