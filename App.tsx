import React, { useState, useCallback } from 'react';
import { Screen } from './types';
import { Theme, themes } from './themes';
import { SPARE_PARTS } from './constants';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import InstallScreen from './components/InstallScreen';
import WipeScreen from './components/WipeScreen';
import ActionScreen from './components/ActionScreen';
import TerminalView from './components/TerminalView';
import AdvancedWipeScreen from './components/AdvancedWipeScreen';
import MountScreen from './components/MountScreen';
import SettingsScreen from './components/SettingsScreen';
import BootAnimation from './components/BootAnimation';
import ConfirmationDialog from './components/ConfirmationDialog';
import FileManagerScreen from './components/FileManagerScreen';
import RebootScreen from './components/RebootScreen';
import BackupScreen from './components/BackupScreen';
import ChangeFileSystemScreen from './components/ChangeFileSystemScreen';
import MagiskScreen from './components/MagiskScreen';
import ConfirmImageFlashScreen from './components/ConfirmImageFlashScreen';
import HardBrickScreen from './components/HardBrickScreen';
import OdinScreen from './components/OdinScreen';
import EraseFrpScreen from './components/EraseFrpScreen';

const initialFilesystem = {
    'system': { 'app': {}, 'bin': {}, 'build.prop': null },
    'system-root': { 'init.rc': null },
    'sdcard': {
        'DCIM': {},
        'Download': {},
        'boot.img': null,
        ...SPARE_PARTS.reduce((acc, part) => ({ ...acc, [part]: null }), {}),
    },
};

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Home);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [actionType, setActionType] = useState<'install' | 'wipe' | 'advanced-wipe' | 'mount' | 'backup' | 'change-fs' | 'magisk-patch' | 'image-flash' | 'corrupt-partitions' | 'odin-flash' | 'erase-frp' | null>(null);
    const [partitionsToWipe, setPartitionsToWipe] = useState<string[]>([]);
    const [partitionsToBackup, setPartitionsToBackup] = useState<string[]>([]);
    const [mountOps, setMountOps] = useState<{ partition: string; mount: boolean }[]>([]);
    const [fsChangeOptions, setFsChangeOptions] = useState<{ partition: string; fsType?: string; repair: boolean; forceError: boolean } | null>(null);
    const [targetPartition, setTargetPartition] = useState<string | null>(null);
    const [odinFiles, setOdinFiles] = useState<{ [key: string]: string }>({});
    const [isRebooting, setIsRebooting] = useState(false);
    const [isHardBricked, setIsHardBricked] = useState(false);
    const [isConfirming, setIsConfirming] = useState<null | 'wipe' | 'advanced-wipe' | 'corrupt'>(null);
    const [theme, setTheme] = useState<Theme>(themes.cyan);

    // Simulation Settings
    const [installErrorChance, setInstallErrorChance] = useState(0);
    const [verifyZip, setVerifyZip] = useState(true);
    const [autoReboot, setAutoReboot] = useState(true);
    const [createBackup, setCreateBackup] = useState(false);

    // Global Filesystem State
    const [filesystem, setFilesystem] = useState(initialFilesystem);

    const navigateTo = (screen: Screen) => {
        setCurrentScreen(screen);
    };

    const handleSelectFile = (fileName: string) => {
        setSelectedFile(fileName);
        if (fileName.endsWith('.zip')) {
            navigateTo(Screen.ConfirmInstall);
        } else if (fileName.endsWith('.img')) {
            navigateTo(Screen.ConfirmImageFlash);
        }
    };
    
    const handleConfirmInstall = useCallback((options: { backup: boolean, verify: boolean, reboot: boolean }) => {
        setCreateBackup(options.backup);
        setVerifyZip(options.verify);
        setAutoReboot(options.reboot);
        setActionType('install');
        navigateTo(Screen.Processing);
    }, []);

    const handleConfirmImageFlash = useCallback((partition: string) => {
        setTargetPartition(partition);
        setActionType('image-flash');
        navigateTo(Screen.Processing);
    }, []);

    const handleConfirmWipe = useCallback(() => {
        setIsConfirming(null);
        setActionType('wipe');
        navigateTo(Screen.Processing);
    }, []);
    
    const handleSelectPartitions = (partitions: string[]) => {
        setPartitionsToWipe(partitions);
        setIsConfirming('advanced-wipe');
    };

    const handleConfirmAdvancedWipe = useCallback(() => {
        setIsConfirming(null);
        setActionType('advanced-wipe');
        navigateTo(Screen.Processing);
    }, []);

    const handleConfirmMount = useCallback((operations: { partition: string; mount: boolean }[]) => {
        setMountOps(operations);
        setActionType('mount');
        navigateTo(Screen.Processing);
    }, []);

    const handleConfirmBackup = useCallback((partitions: string[]) => {
        setPartitionsToBackup(partitions);
        setActionType('backup');
        navigateTo(Screen.Processing);
    }, []);

    const handleConfirmChangeFs = useCallback((options: { partition: string; fsType?: string; repair: boolean; forceError: boolean }) => {
        setFsChangeOptions(options);
        setActionType('change-fs');
        navigateTo(Screen.Processing);
    }, []);

    const handleConfirmMagiskPatch = useCallback(() => {
        setActionType('magisk-patch');
        navigateTo(Screen.Processing);
    }, []);

    const handleConfirmCorruptPartitions = useCallback(() => {
        setIsConfirming(null);
        setActionType('corrupt-partitions');
        navigateTo(Screen.Processing);
    }, []);

    const handleConfirmOdinFlash = useCallback((files: { [key: string]: string }) => {
        setOdinFiles(files);
        setActionType('odin-flash');
        navigateTo(Screen.Processing);
    }, []);

    const handleConfirmEraseFrp = useCallback(() => {
        setActionType('erase-frp');
        navigateTo(Screen.Processing);
    }, []);
    
    const handleReboot = useCallback(() => {
        setIsRebooting(true);
    }, []);
    
    const goHome = useCallback(() => {
        setSelectedFile(null);
        setActionType(null);
        setPartitionsToWipe([]);
        setPartitionsToBackup([]);
        setMountOps([]);
        setFsChangeOptions(null);
        setTargetPartition(null);
        setOdinFiles({});
        navigateTo(Screen.Home);
    }, []);

    const handleRebootComplete = useCallback(() => {
        setIsRebooting(false);
        goHome();
    }, [goHome]);

    const handleActionComplete = useCallback((success: boolean) => {
        if (success) {
            const newFs = JSON.parse(JSON.stringify(filesystem));
            let fsChanged = false;

            if (actionType === 'install' || actionType === 'odin-flash') {
                newFs.system = { 'app': {}, 'bin': {}, 'build.prop': 'from_zip' };
                fsChanged = true;
            } else if (actionType === 'wipe') { // Factory Reset
                 newFs.sdcard.Download = {};
                 newFs.sdcard.DCIM = {};
                 fsChanged = true;
            } else if (actionType === 'advanced-wipe') {
                if (partitionsToWipe.includes('System')) {
                    newFs.system = {};
                    fsChanged = true;
                }
                if (partitionsToWipe.includes('Data') || partitionsToWipe.includes('Internal Storage')) {
                     newFs.sdcard.Download = {};
                     newFs.sdcard.DCIM = {};
                     fsChanged = true;
                }
            } else if (actionType === 'backup') {
                const date = new Date();
                const timestamp = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}`;
                const backupName = `backup_${timestamp}`;
                
                if (!newFs.sdcard['TWRP']) {
                    newFs.sdcard['TWRP'] = { 'BACKUPS': {} };
                } else if (!newFs.sdcard['TWRP']['BACKUPS']) {
                    newFs.sdcard['TWRP']['BACKUPS'] = {};
                }
                
                newFs.sdcard['TWRP']['BACKUPS'][backupName] = {};
                partitionsToBackup.forEach(p => {
                    const safeName = p.replace(/\s+/g, '_');
                    newFs.sdcard['TWRP']['BACKUPS'][backupName][`${safeName.toLowerCase()}.win`] = null;
                });
                fsChanged = true;
            } else if (actionType === 'magisk-patch') {
                const randomId = Math.random().toString(36).substring(2, 7);
                const patchedFileName = `magisk_patched-${randomId}.img`;
                if (!newFs.sdcard['Download']) {
                    newFs.sdcard['Download'] = {};
                }
                newFs.sdcard['Download'][patchedFileName] = null;
                fsChanged = true;
            } else if (actionType === 'corrupt-partitions') {
                setIsHardBricked(true);
            }
            if (fsChanged) {
                setFilesystem(newFs);
            }
        }
        
        goHome();
    }, [actionType, filesystem, partitionsToWipe, partitionsToBackup, goHome]);

    const goBack = useCallback(() => {
       switch(currentScreen) {
           case Screen.Install:
           case Screen.Wipe:
           case Screen.Backup:
           case Screen.Mount:
           case Screen.Settings:
           case Screen.Terminal:
           case Screen.FileManager:
           case Screen.Reboot:
           case Screen.ChangeFileSystem:
           case Screen.Odin:
               goHome();
               break;
            case Screen.Magisk:
            case Screen.EraseFRP:
                navigateTo(Screen.Settings);
                break;
           case Screen.ConfirmInstall:
           case Screen.ConfirmImageFlash:
               navigateTo(Screen.Install);
               break;
           case Screen.AdvancedWipeSelection:
               navigateTo(Screen.Wipe);
               break;
           default:
               goHome();
       }
    }, [currentScreen, goHome]);

    const handleDownloadFile = (fileName: string) => {
        setFilesystem(prevFs => {
            const newFs = JSON.parse(JSON.stringify(prevFs));
            if (!newFs.sdcard.Download) {
                newFs.sdcard.Download = {};
            }
            newFs.sdcard.Download[fileName] = null;
            return newFs;
        });
    };

    const renderConfirmationDialog = () => {
        if (isConfirming === 'wipe') {
            return (
                <ConfirmationDialog
                    isOpen={true}
                    title="Confirm Factory Reset"
                    message="This will wipe all user data, including internal storage. This cannot be undone."
                    onConfirm={handleConfirmWipe}
                    onCancel={() => setIsConfirming(null)}
                    confirmText="Factory Reset"
                />
            );
        }
    
        if (isConfirming === 'advanced-wipe') {
            return (
                <ConfirmationDialog
                    isOpen={true}
                    title="Confirm Advanced Wipe"
                    message={
                        <>
                            <p className="mb-2">You are about to wipe the following:</p>
                            <ul className="list-disc list-inside my-2 text-[var(--accent-primary)] bg-gray-900 p-2 rounded-md">
                                {partitionsToWipe.map(p => <li key={p}>{p}</li>)}
                            </ul>
                            <p className="mt-2 font-bold text-yellow-400">This action cannot be undone.</p>
                        </>
                    }
                    onConfirm={handleConfirmAdvancedWipe}
                    onCancel={() => setIsConfirming(null)}
                    confirmText="Confirm Wipe"
                />
            );
        }

        if (isConfirming === 'corrupt') {
            return (
                <ConfirmationDialog
                    isOpen={true}
                    title="DANGER: Confirm Partition Corruption"
                    message={
                        <>
                            <p className="mb-2 text-yellow-300 font-bold">This is an irreversible destructive action.</p>
                            <p className="mb-2">This will simulate a catastrophic failure of the eMMC memory, corrupting the partition table and making the device permanently unbootable (a "hard brick").</p>
                            <p className="mt-2 font-bold text-red-500">You will have to reload the entire web page to restart the simulation.</p>
                        </>
                    }
                    onConfirm={handleConfirmCorruptPartitions}
                    onCancel={() => setIsConfirming(null)}
                    confirmText="Yes, brick my device"
                />
            );
        }
    
        return null;
    };

    const systemCorrupted = Object.keys(filesystem.system).length === 0;

    const renderScreen = () => {
        switch (currentScreen) {
            case Screen.Home:
                return <HomeScreen onNavigate={navigateTo} />;
            case Screen.Install:
                return <InstallScreen onSelectFile={handleSelectFile} filesystem={filesystem} />;
            case Screen.FileManager:
                return <FileManagerScreen filesystem={filesystem} onDownloadFile={handleDownloadFile} />;
            case Screen.Wipe:
                return <WipeScreen onWipe={() => setIsConfirming('wipe')} onAdvancedWipe={() => navigateTo(Screen.AdvancedWipeSelection)} onChangeFileSystem={() => navigateTo(Screen.ChangeFileSystem)} onCorruptPartitions={() => setIsConfirming('corrupt')} />;
            case Screen.Backup:
                return <BackupScreen onConfirm={handleConfirmBackup} />;
            case Screen.AdvancedWipeSelection:
                return <AdvancedWipeScreen onConfirm={handleSelectPartitions} />;
            case Screen.ChangeFileSystem:
                return <ChangeFileSystemScreen onConfirm={handleConfirmChangeFs} />;
            case Screen.Mount:
                return <MountScreen onConfirm={handleConfirmMount} />;
            case Screen.Reboot:
                return <RebootScreen onRebootSystem={handleReboot} onRebootRecovery={goHome} />;
            case Screen.Settings:
                return <SettingsScreen 
                            currentTheme={theme} 
                            onThemeChange={setTheme} 
                            errorChance={installErrorChance}
                            onSetErrorChance={setInstallErrorChance}
                            onNavigate={navigateTo}
                        />;
            case Screen.Magisk:
                return <MagiskScreen onConfirmPatch={handleConfirmMagiskPatch} />;
            case Screen.Odin:
                return <OdinScreen onConfirm={handleConfirmOdinFlash} />;
            case Screen.EraseFRP:
                return <EraseFrpScreen onConfirm={handleConfirmEraseFrp} />;
            case Screen.Terminal:
                 return (
                    <TerminalView
                        actionType={null}
                        onComplete={goHome}
                        onReboot={handleReboot}
                        filesystem={filesystem}
                        setFilesystem={setFilesystem}
                    />
                );
            case Screen.ConfirmInstall:
                return (
                    <ActionScreen
                        title="Confirm Flash"
                        description={`Are you sure you want to flash ${selectedFile}?`}
                        actionText="Confirm Flash"
                        onConfirm={handleConfirmInstall}
                        actionType="install"
                    />

                );
            case Screen.ConfirmImageFlash:
                return (
                    <ConfirmImageFlashScreen
                        fileName={selectedFile!}
                        onConfirm={handleConfirmImageFlash}
                    />
                );
            case Screen.Processing:
                 return (
                    <TerminalView
                        actionType={actionType}
                        fileName={selectedFile}
                        partitions={actionType === 'advanced-wipe' ? partitionsToWipe : (actionType === 'backup' ? partitionsToBackup : undefined)}
                        mountOps={actionType === 'mount' ? mountOps : undefined}
                        fsChangeOptions={actionType === 'change-fs' ? fsChangeOptions : undefined}
                        targetPartition={actionType === 'image-flash' ? targetPartition : undefined}
                        odinFiles={actionType === 'odin-flash' ? odinFiles : undefined}
                        onComplete={handleActionComplete}
                        onReboot={handleReboot}
                        filesystem={filesystem}
                        setFilesystem={setFilesystem}
                        installOptions={{
                            errorChance: installErrorChance,
                            verifyZip: verifyZip,
                            autoReboot: autoReboot,
                            createBackup: createBackup
                        }}
                    />
                );
            default:
                return <HomeScreen onNavigate={navigateTo} />;
        }
    };
    
    const appStyle = {
        '--accent-primary': theme.primary,
        '--accent-medium': theme.medium,
        '--accent-dark': theme.dark,
        '--accent-hover': theme.hover,
        '--accent-border': theme.border,
        '--accent-interactive': theme.interactive,
    } as React.CSSProperties;

    if (isHardBricked && isRebooting) {
        return <HardBrickScreen />;
    }

    return (
        <div className="h-screen w-screen bg-black flex flex-col font-sans max-w-md mx-auto border-2 border-gray-700 shadow-2xl relative" style={appStyle}>
            {isRebooting && <BootAnimation onComplete={handleRebootComplete} systemCorrupted={systemCorrupted} />}
            {renderConfirmationDialog()}
            <Header />
            <main className="flex-grow flex flex-col overflow-y-auto">
                {renderScreen()}
            </main>
            {currentScreen !== Screen.Processing && currentScreen !== Screen.Terminal && (
                <footer className="flex-shrink-0 bg-gray-900 flex justify-around items-center h-16 border-t border-gray-700">
                    <button onClick={goBack} className="p-4" aria-label="Go Back">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                       </svg>
                    </button>
                    <button onClick={goHome} className="p-4" aria-label="Go Home">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </button>
                </footer>
            )}
        </div>
    );
};

export default App;