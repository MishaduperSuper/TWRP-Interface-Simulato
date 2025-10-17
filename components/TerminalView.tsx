import React, { useState, useEffect, useRef } from 'react';

interface TerminalViewProps {
    actionType: 'install' | 'wipe' | 'advanced-wipe' | 'mount' | null;
    fileName?: string | null;
    onComplete: () => void;
    onReboot: () => void;
    partitions?: string[];
    mountOps?: { partition: string; mount: boolean }[];
}

const generateInstallLogs = (fileName: string): string[] => [
    `Finding update package...`,
    `Opening update package...`,
    `Verifying update package...`,
    `Installing update...`,
    `script succeeded: result was [/system]`,
    `Patching system image unconditionally...`,
    `Verified '/system' partition...`,
    `Installing '${fileName}'...`,
    `Mounting partitions...`,
    `Checking for digest file...`,
    `Skipping digest check: no digest file found.`,
    `Unzipping...`,
    `Running edify script...`,
    `Cleaning up...`,
    `Unmounting partitions...`,
    `Done.`,
];

const generateWipeLogs = (): string[] => [
    `Wiping data...`,
    `--Wiping data...`,
    `Formatting /data...`,
    `Formatting /cache...`,
    `Data wipe complete.`,
    `Done.`,
];

const generateDynamicAdvancedWipeLogs = (options: string[]): string[] => {
    if (!options || options.length === 0) {
        return ["No options selected for wipe.", "Process aborted."];
    }
    
    const logs: string[] = [`Processing selected options: ${options.join(', ')}...`];
    let errors = 0;

    const specialOptions = ["Clean Kernel Drivers", "Remove Encryption (formats data)"];
    const alphaOptions = ["Remove Encryption (no format)", "Clean Vendor Partition", "Create Treble Partition"];

    let partitions = options.filter(o => !specialOptions.includes(o) && !alphaOptions.includes(o));
    const hasCleanDrivers = options.includes("Clean Kernel Drivers");
    const hasRemoveEncryptionFormat = options.includes("Remove Encryption (formats data)");
    const hasRemoveEncryptionNoFormat = options.includes("Remove Encryption (no format)");
    const hasCleanVendor = options.includes("Clean Vendor Partition");
    const hasCreateTreble = options.includes("Create Treble Partition");

    if (hasCleanDrivers) {
        logs.push("\n-- Starting Kernel Driver Cleanup --");
        logs.push("Scanning for residual driver files in /system/lib/modules...");
        logs.push("Found 3 potential leftover modules.");
        logs.push(" - Deleting Helios_kmod.ko...");
        logs.push(" - Deleting audio_fx_driver.ko...");
        logs.push(" - Deleting gpu_governor_v2.ko...");
        logs.push("Kernel driver cleanup complete.");
    }

    if (hasRemoveEncryptionFormat) {
        logs.push("\n-- Starting Encryption Removal (Format Method) --");
        logs.push("NOTE: This process involves formatting the data partition.");
        logs.push("Unmounting /data...");
        logs.push("Executing 'mkfs.f2fs -l FBE_REMOVED /dev/block/bootdevice/by-name/userdata'...");
        
        if (Math.random() > 0.1) { // 90% success
            logs.push("Successfully formatted data partition.");
            logs.push("Encryption metadata wiped.");
            if (partitions.includes("Data")) {
                logs.push("Skipping separate wipe of 'Data' as it was just formatted.");
                partitions = partitions.filter(p => p !== "Data");
            }
        } else {
            errors++;
            logs.push("[ERROR] Failed to execute format command. The partition may be in use.");
            logs.push("[ERROR] Encryption removal failed.");
        }
    }

    if (hasCleanVendor) {
        logs.push("\n-- Cleaning Vendor Partition --");
        logs.push("Mounting /vendor as read-write...");
        if (Math.random() > 0.1) { // 90% success
            logs.push("Vendor partition mounted.");
            logs.push("Deleting blob files from /vendor/lib...");
            logs.push("Deleting overlays from /vendor/overlay...");
            logs.push("Vendor cleanup complete.");
            logs.push("Unmounting /vendor...");
        } else {
            errors++;
            logs.push("[ERROR] Could not mount /vendor. Partition may be corrupt.");
            logs.push("[ERROR] Vendor cleaning failed.");
        }
    }

    if (hasRemoveEncryptionNoFormat) {
        logs.push("\n-- Starting Encryption Removal (No-Format Method) --");
        logs.push("WARNING: This is an experimental feature and may not work on all devices.");
        logs.push("Reading fstab from boot partition...");
        logs.push("Found 'fileencryption=ice' flag.");
        logs.push("Patching fstab to remove encryption flag in memory...");
        if (Math.random() > 0.15) { // 85% success
            logs.push("Successfully patched fstab.");
            logs.push("Flashing modified boot image to disable force_encrypt...");
            logs.push("Encryption disabled on next boot.");
        } else {
            errors++;
            logs.push("[ERROR] Failed to patch boot image. Fstab is read-only or invalid.");
            logs.push("[ERROR] No-format encryption removal failed.");
        }
    }
    
    if (hasCreateTreble) {
        logs.push("\n-- Creating Treble Partition Layout --");
        logs.push("Verifying Project Treble compatibility...");
        logs.push("Device is compatible.");
        logs.push("Backing up partition table to /tmp/partition.bak...");
        logs.push("Repartitioning eMMC...");
        if (Math.random() > 0.2) { // 80% success
            logs.push("Shrinking /system partition...");
            logs.push("Creating new /vendor partition (1.5 GB)...");
            logs.push("Formatting /vendor as ext4...");
            logs.push("Partition table updated successfully.");
            logs.push("A reboot is required to apply changes.");
        } else {
            errors++;
            logs.push("[ERROR] Repartitioning failed. Not enough contiguous space on block device.");
            logs.push("[ERROR] Treble-izing process failed. Restoring partition table from backup.");
        }
    }

    if (partitions.length > 0) {
         logs.push("\n-- Wiping selected partitions --");
    }


    partitions.forEach(p => {
        const partitionName = p.split(' ')[0].toLowerCase().replace('/', '');
        const willFail = Math.random() > 0.8; // 20% chance of failure

        logs.push(`\nStarting wipe of ${p}...`);
        logs.push(`Running format command for /${partitionName}...`);
        
        logs.push(`...`);

        if (willFail) {
            errors++;
            const errorMessages = [
                `Failed to mount '/${partitionName}' (Device or resource busy)`,
                `E:Unable to wipe /${partitionName}`,
                `mkfs.f2fs failed with error code 1`,
            ];
            logs.push(`[ERROR] ${errorMessages[Math.floor(Math.random() * errorMessages.length)]}`);
        } else {
            logs.push(`Successfully formatted /${partitionName}.`);
        }
    });

    logs.push("\n--------------------");
    if (errors > 0) {
        logs.push(`Finished with ${errors} error(s).`);
        logs.push(`Advanced wipe process failed.`);
    } else {
        logs.push(`All selected operations completed successfully.`);
        logs.push(`Advanced wipe complete.`);
    }

    return logs;
};

const generateMountLogs = (operations: { partition: string; mount: boolean }[]): string[] => {
    if (!operations || operations.length === 0) {
        return ["No mount changes selected.", "Process aborted."];
    }
    const logs: string[] = [];
    let errors = 0;

    operations.forEach(({ partition, mount }) => {
        const action = mount ? 'Mounting' : 'Unmounting';
        const partitionPath = `/${partition.split(' ')[0].toLowerCase()}`;
        const willFail = Math.random() > 0.85; // 15% chance of failure

        logs.push(`${action} ${partitionPath}...`);
        
        if (willFail) {
            errors++;
            const errorMessages = mount 
                ? [`Failed to mount ${partitionPath} (Invalid argument)`, `E:Unable to mount storage`, `mount: ${partitionPath}: No such file or directory`]
                : [`Failed to unmount ${partitionPath} (Device or resource busy)`, `E:Unable to unmount ${partitionPath}`];
            logs.push(`[ERROR] ${errorMessages[Math.floor(Math.random() * errorMessages.length)]}`);
        } else {
            logs.push(`Successfully ${mount ? 'mounted' : 'unmounted'} ${partitionPath}.`);
        }
    });

    logs.push("\n--------------------");
    if (errors > 0) {
        logs.push(`Finished with ${errors} error(s).`);
    } else {
        logs.push(`All mount operations completed successfully.`);
    }

    return logs;
};

const TerminalView: React.FC<TerminalViewProps> = ({ actionType, fileName, onComplete, onReboot, partitions, mountOps }) => {
    const [logs, setLogs] = useState<string[]>(['Initiating process...']);
    const [isComplete, setIsComplete] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let logLines: string[];
        if (actionType === 'install' && fileName) {
            logLines = generateInstallLogs(fileName);
        } else if (actionType === 'advanced-wipe' && partitions) {
            logLines = generateDynamicAdvancedWipeLogs(partitions);
        } else if (actionType === 'mount' && mountOps) {
            logLines = generateMountLogs(mountOps);
        }
        else {
            logLines = generateWipeLogs();
        }

        let i = 0;
        const intervalId = setInterval(() => {
            if (i < logLines.length) {
                setLogs(prev => [...prev, `${logLines[i]}`]);
                i++;
            } else {
                clearInterval(intervalId);
                setIsComplete(true);
            }
        }, 350 + Math.random() * 200);

        return () => clearInterval(intervalId);
    }, [actionType, fileName, partitions, mountOps]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs]);

    const getTitle = () => {
        if (actionType === 'install') return `Installing: ${fileName}`;
        if (actionType === 'wipe') return 'Wiping Data';
        if (actionType === 'advanced-wipe') return 'Advanced Wipe';
        if (actionType === 'mount') return 'Mounting Partitions';
        return 'Processing';
    }

    return (
        <div className="flex flex-col h-full bg-[#0d1117]">
            <h2 className="text-lg font-bold p-3 bg-gray-900 border-b-2 border-[var(--accent-medium)] text-center flex-shrink-0">
                {getTitle()}
            </h2>
            <div ref={terminalRef} className="flex-grow p-2 overflow-y-auto font-mono text-sm">
                {logs.map((log, index) => {
                    const isError = log.includes('[ERROR]');
                    const isSuccess = log.toLowerCase().includes('successfully') || log.toLowerCase().includes('succeeded');
                    const color = isError ? 'text-red-500' : isSuccess ? 'text-[var(--accent-primary)]' : 'text-green-400';
                    return <p key={index} className={`whitespace-pre-wrap ${color}`}>{log}</p>
                })}
                {isComplete && <p className="text-[var(--accent-primary)] font-bold mt-2">Process completed.</p>}
            </div>
            {isComplete && (
                <div className="p-4 flex-shrink-0 flex items-center gap-4">
                    <button
                        onClick={onComplete}
                        className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                    >
                        Back
                    </button>
                    <button
                        onClick={onReboot}
                        className="w-full py-3 bg-[var(--accent-dark)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-lg transition-colors"
                    >
                        Reboot System
                    </button>
                </div>
            )}
        </div>
    );
};

export default TerminalView;