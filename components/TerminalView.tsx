import React, { useState, useEffect, useRef } from 'react';
import InstallErrorHelp from './InstallErrorHelp';

interface TerminalViewProps {
    actionType: 'install' | 'wipe' | 'advanced-wipe' | 'mount' | 'backup' | 'change-fs' | 'magisk-patch' | 'image-flash' | 'corrupt-partitions' | 'odin-flash' | null;
    fileName?: string | null;
    onComplete: (success: boolean) => void;
    onReboot: () => void;
    partitions?: string[];
    mountOps?: { partition: string; mount: boolean }[];
    fsChangeOptions?: { partition: string; fsType?: string; repair: boolean; forceError: boolean };
    targetPartition?: string;
    odinFiles?: { [key: string]: string };
    filesystem: any;
    setFilesystem: (fs: any) => void;
    installOptions?: {
        errorChance: number;
        verifyZip: boolean;
        autoReboot: boolean;
        createBackup: boolean;
    }
}

const generateInstallLogs = (fileName: string, options: TerminalViewProps['installOptions']): { logs: string[], success: boolean, errorCode: 'ERROR_7' | 'CORRUPT' | null } => {
    let logs: string[] = [];
    const { errorChance = 0, verifyZip = true } = options || {};
    
    logs.push(`Finding update package...`);
    logs.push(`Opening update package...`);

    if (verifyZip) {
        logs.push(`Verifying update package...`);
        logs.push(`Signature verified.`);
    } else {
        logs.push(`Skipping zip signature verification.`);
    }

    // Simulate potential failure
    if (Math.random() < errorChance) {
        const errorType = Math.random() > 0.5 ? 'Status 7' : 'Corrupt';
        if (errorType === 'Status 7') {
             logs.push(`[ERROR] This package is for device: 'river', 'bayside'; this device is 'simulator'.`);
             logs.push(`[ERROR] Updater process ended with ERROR: 7`);
             logs.push(`Installation aborted.`);
             return { logs, success: false, errorCode: 'ERROR_7' };
        } else {
            logs.push(`[ERROR] Failed to read footer from /sdcard/${fileName}`);
            logs.push(`[ERROR] Zip is corrupt.`);
            logs.push(`Installation aborted.`);
            return { logs, success: false, errorCode: 'CORRUPT' };
        }
    }

    logs = [
        ...logs,
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
    return { logs, success: true, errorCode: null };
};

const generateImageFlashLogs = (fileName: string, partition: string): { logs: string[], success: boolean } => {
    const partitionPath = `/dev/block/bootdevice/by-name/${partition.toLowerCase()}`;
    const logs = [
        `Flashing Image: ${fileName}`,
        `Target Partition: ${partition}`,
        `--------------------------------`,
        `Running command: dd if=/sdcard/Download/${fileName} of=${partitionPath}`,
        `...`,
        `...`,
        `...`,
        `131072+0 records in`,
        `131072+0 records out`,
        `67108864 bytes (64.0MB) copied, 3.5421 s, 18.1MB/s`,
        `Successfully flashed image to ${partition}.`,
        `Updating partition details...`,
        `Done.`
    ];

    if (Math.random() > 0.9) { // 10% chance of failure
        return {
            logs: [
                `Flashing Image: ${fileName}`,
                `Target Partition: ${partition}`,
                `--------------------------------`,
                `Running command: dd if=/sdcard/Download/${fileName} of=${partitionPath}`,
                `...`,
                `[ERROR] dd: writing '${partitionPath}': I/O error`,
                `[ERROR] Failed to write to partition. It may be read-only or corrupt.`,
                `Flash failed.`
            ],
            success: false
        };
    }

    return { logs, success: true };
};

const generateWipeLogs = (): string[] => [
    `Wiping data...`,
    `--Wiping data...`,
    `Formatting /data...`,
    `Formatting /cache...`,
    `Data wipe complete.`,
    `Done.`,
];

const generateCorruptionLogs = (): { logs: string[], success: boolean } => {
    const logs = [
        `[WARN] Initiating raw eMMC block access...`,
        `[WARN] This is a highly dangerous operation.`,
        `Bypassing kernel security lock... SUCCESS.`,
        `Attempting to erase partition table at /dev/block/mmcblk0...`,
        `Running command: dd if=/dev/zero of=/dev/block/mmcblk0 bs=512 count=34`,
        `...`,
        `dd: writing '/dev/block/mmcblk0': I/O error`,
        `[ERROR] eMMC controller timed out.`,
        `Retrying with force flag...`,
        `...`,
        `[FATAL] Unable to write to block device. The controller may be damaged.`,
        `Verifying GPT headers...`,
        `[FATAL] Primary and secondary GPT headers are invalid or missing.`,
        `The partition table is irrecoverably corrupted.`,
        `All data is likely lost.`,
        `Device will not boot.`,
        `Process complete.`
    ];
    return { logs, success: true }; // "Success" means the corruption was successful
};

const generateOdinLogs = (files: { [key: string]: string }): { logs: string[], success: boolean } => {
    const logs: string[] = [
        "<ID:0/005> Odin engine v(ID:3.1401).. S",
        "<ID:0/005> File analysis.. S",
    ];

    Object.entries(files).forEach(([type, name]) => {
        logs.push(`<ID:0/005> [${type}] ${name}`);
    });
    
    logs.push(...[
        "<ID:0/005> SetupConnection.. S",
        "<ID:0/005> Initialzation.. S",
        "<ID:0/005> Get PIT for mapping.. S",
        "<ID:0/005> Firmware update start.. S"
    ]);

    const partitions = [
        'sboot.bin', 'param.bin', 'up_param.bin', 'cm.bin', 'boot.img', 'recovery.img', 'system.img', 'userdata.img', 'modem.bin'
    ];
    
    partitions.forEach(p => {
        logs.push(`<ID:0/005> SingleDownloadFile: ${p}.. S`);
    });

    logs.push(...[
        "<ID:0/005> NAND Write Start!! S",
        "...",
        "...",
        "<ID:0/005> RQT_CLOSE !! S",
        "<ID:0/005> RES OK !! S",
        "<ID:0/005> Removed!!",
        "<ID:0/005> Remain Port ....  0 S",
        "<OSM> All threads completed. (succeed 1 / failed 0)",
        "<ID:0/005> Removed!!",
        "PASS!"
    ]);

    return { logs, success: true };
};


const generateBackupLogs = (partitions: string[]): { logs: string[], success: boolean } => {
    if (!partitions || partitions.length === 0) {
        return { logs: ["No partitions selected for backup.", "Backup aborted."], success: false };
    }

    const date = new Date();
    const timestamp = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}`;
    const backupFolderName = `backup_${timestamp}`;
    
    const logs: string[] = [
        `Creating backup...`,
        `Backup folder: /sdcard/TWRP/BACKUPS/${backupFolderName}`
    ];
    let errors = 0;

    partitions.forEach(p => {
        const partitionName = p.toLowerCase().replace(/\s+/g, '_');
        logs.push(`\n-- Backing up ${p}... --`);
        const willFail = Math.random() > 0.95; // 5% chance of failure

        if (willFail) {
            errors++;
            logs.push(`[ERROR] Failed to mount /${partitionName} for backup.`);
            logs.push(`[ERROR] Backup of ${p} failed.`);
            return;
        }

        logs.push(`Calculating backup details...`);
        const size = p === 'System' ? (Math.random() * 1.5 + 1.0).toFixed(2) : (Math.random() * 5 + 2.0).toFixed(2);
        logs.push(`Partition size: ${size} GB`);
        logs.push(`Creating image... (system.win)`);
        logs.push(`Compressing image... (tar)`);
        logs.push(`...`);
        logs.push(`...`);
        logs.push(`Generating checksum... (md5)`);
        logs.push(`Backup of ${p} completed.`);
    });
    
    logs.push("\n--------------------");
    if (errors > 0) {
        logs.push(`Finished with ${errors} error(s).`);
        logs.push(`Backup process failed.`);
        return { logs, success: false };
    } else {
        logs.push(`All partitions backed up successfully.`);
        logs.push(`Backup complete.`);
        return { logs, success: true };
    }
};

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

const generateChangeFsLogs = (options: { partition: string; fsType?: string; repair: boolean; forceError: boolean }): { logs: string[], success: boolean } => {
    const { partition, fsType, repair, forceError } = options;
    const partitionPath = `/${partition.toLowerCase().replace(/\s+/g, '')}`;
    let logs: string[] = [];
    
    if (forceError) {
        logs.push(`Starting process for ${partitionPath}...`);
        logs.push(`Unmounting partition...`);
        logs.push(`[ERROR] Partition is in use by another process.`);
        logs.push(`[ERROR] Failed to unmount ${partitionPath}.`);
        logs.push(`Process failed.`);
        return { logs, success: false };
    }
    
    if (repair) {
        logs = [
            `Starting filesystem repair for ${partition}...`,
            `Unmounting ${partitionPath}...`,
            `Running e2fsck on ${partitionPath}...`,
            `Pass 1: Checking inodes, blocks, and sizes`,
            `Pass 2: Checking directory structure`,
            `Pass 3: Checking directory connectivity`,
            `Pass 4: Checking reference counts`,
            `Pass 5: Checking group summary information`,
            `${partitionPath}: 12345/67890 files, 98765/543210 blocks`,
            `Filesystem was modified.`,
            `Mounting ${partitionPath}...`,
            `Repair complete.`
        ];
        return { logs, success: true };
    }

    if (fsType) {
        logs = [
            `Changing filesystem for ${partition} to ${fsType}...`,
            `Unmounting ${partitionPath}...`,
            `Running mkfs.${fsType.split(' ')[0]} ${partitionPath}...`,
            `mke2fs 1.45.5 (07-Jan-2020)`,
            `Creating filesystem with 123456 4k blocks and 30880 inodes`,
            `Filesystem UUID: 12345678-abcd-efgh-ijkl-901234567890`,
            `Superblock backups stored on blocks: ...`,
            `Allocating group tables: done`,                            
            `Writing inode tables: done`,
            `Creating journal: done`,
            `Writing superblocks and filesystem accounting information: done`,
            `Mounting ${partitionPath}...`,

            `Change complete.`
        ];
        return { logs, success: true };
    }
    
    return { logs: ['[ERROR] Invalid operation specified.'], success: false };
};

const generateMagiskPatchLogs = (): { logs: string[], success: boolean } => {
    const randomId = Math.random().toString(36).substring(2, 7);
    const patchedFileName = `magisk_patched-${randomId}.img`;
    
    const logs = [
        `*********************************`,
        `* Magisk Boot Image Patcher v25.2 *`,
        `*********************************`,
        `! Target Image: /sdcard/boot.img`,
        `! Device platform: arm64`,
        `! Forcing legacy SAR mode`,
        ``,
        `--------------------------------`,
        `-- Phase 1: Unpacking boot image`,
        `--------------------------------`,
        `  Parsing boot image header at offset 0x00`,
        `  Found magic: ANDROID!`,
        `  HEADER_VER      [2]`,
        `  KERNEL_SZ       [24512304]`,
        `  RAMDISK_SZ      [12148848]`,
        `  OS_VERSION      [13.0.0]`,
        `  OS_PATCH_LEVEL  [2023-05]`,
        `  PAGESIZE        [4096]`,
        `  CMDLINE         [console=ttyMSM0,115200n8 androidboot.hardware=qcom]`,
        `  Decompressing kernel image...`,
        `  Detected compression: GZIP`,
        `  Writing kernel to /tmp/kernel.gz`,
        `  gunzip: /tmp/kernel.gz: OK`,
        `  Kernel decompressed successfully.`,
        `  Unpacking ramdisk from cpio archive...`,
        `  Reading ramdisk from offset 0x01800000`,
        `  Found 241 files in ramdisk.`,
        `  Extracting to /tmp/magisk/ramdisk`,
        `  Extraction complete.`,
        ``,
        `--------------------------------`,
        `-- Phase 2: Analyzing environment`,
        `--------------------------------`,
        `  Searching for fstab... found in /system/etc/fstab.qcom`,
        `  Searching for init binary... found in /init`,
        `  Checking for system-as-root... Yes`,
        `  Checking ramdisk status... Ramdisk detected.`,
        `  SELinux status: Enforcing -> Forcing Permissive`,
        `  AVB/dm-verity status: ENABLED -> Patching`,
        `  Cgroup version: 2`,
        `  Device is not encrypted.`,
        `  Preliminary checks passed.`,
        ``,
        `--------------------------------`,
        `-- Phase 3: Applying HARD patches`,
        `--------------------------------`,
        `  Injecting magiskinit binary...`,
        `  Writing to 0x1A00... OK`,
        `  [WARNING] Overwriting existing data. This is normal.`,
        `  Patching init binary via hex replacement...`,
        `  Searching for pattern: 50 41 53 43 48 4D 45`,
        `  Found at 0x44BC. Patching...`,
        `  Adding hooks to init.rc...`,
        `  Hook: on post-fs-data`,
        `  Hook: on late-init`,
        `  Redirecting service starts to magisk...`,
        `  Adding aggressive sepolicy rules...`,
        `  Compiling rules from magisk.rules`,
        `  Rule: 'allow * * * *'`,
        `  [WARNING] This permissive rule may reduce security.`,
        `  Policy patch successful.`,
        `  Patching fstab for read-write mount...`,
        `  Found entry for /system... changing 'ro' to 'rw'`,
        `  Found entry for /vendor... changing 'ro' to 'rw'`,
        `  Disabling dm-verity in fstab... Done.`,
        `  Compressing new cpio ramdisk archive...`,
        `  Adding magiskinit...`,
        `  Adding overlay.d...`,
        `  Adding custom sepolicy...`,
        `  Compressing... 20%`,
        `  Compressing... 50%`,
        `  Compressing... 90%`,
        `  Ramdisk compression complete. New size: 14256128 (+2.1MB)`,
        ``,
        `--------------------------------`,
        `-- Phase 4: Repacking boot image`,
        `--------------------------------`,
        `  Using raw memory copy for kernel...`,
        `  Final kernel size: 24512304`,
        `  Updating boot image header...`,
        `  Writing new offsets...`,
        `  Signing boot image with test keys...`,
        `  This is not a production signature.`,
        `  Generating new SHA1 checksum...`,
        `  Running hashing algorithm...`,
        `  ....................`,
        `  ....................`,
        `  New boot image checksum: d8e8fca2dc0f896fd7cb4cb0031ba249`,
        ``,
        `--------------------------------`,
        `-- Phase 5: Finalizing`,
        `--------------------------------`,
        `- New boot image is saved to:`,
        `  /sdcard/Download/${patchedFileName}`,
        `- All done! Reboot and enjoy.`,
    ];
    return { logs, success: true };
};

const TerminalView: React.FC<TerminalViewProps> = ({ actionType, fileName, onComplete, onReboot, partitions, mountOps, fsChangeOptions, targetPartition, odinFiles, filesystem, setFilesystem, installOptions }) => {
    const [logs, setLogs] = useState<string[]>(['Initiating process...']);
    const [isComplete, setIsComplete] = useState(false);
    const [cliOutput, setCliOutput] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isError7, setIsError7] = useState(false);
    const [showError7Help, setShowError7Help] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!actionType) {
            setLogs([]);
            setIsComplete(true);
            return;
        }

        let logLines: string[] = [];
        let success = true;

        if (actionType === 'install' && fileName) {
            const result = generateInstallLogs(fileName, installOptions);
            logLines = result.logs;
            success = result.success;
            if (result.errorCode === 'ERROR_7') {
                setIsError7(true);
            }
        } else if (actionType === 'image-flash' && fileName && targetPartition) {
            const result = generateImageFlashLogs(fileName, targetPartition);
            logLines = result.logs;
            success = result.success;
        } else if (actionType === 'backup' && partitions) {
            const result = generateBackupLogs(partitions);
            logLines = result.logs;
            success = result.success;
        } else if (actionType === 'advanced-wipe' && partitions) {
            logLines = generateDynamicAdvancedWipeLogs(partitions);
            success = !logLines.some(l => l.includes('[ERROR]')) && !logLines[logLines.length - 1]?.includes('failed');
        } else if (actionType === 'mount' && mountOps) {
            logLines = generateMountLogs(mountOps);
            success = !logLines.some(l => l.includes('[ERROR]'));
        } else if (actionType === 'change-fs' && fsChangeOptions) {
            const result = generateChangeFsLogs(fsChangeOptions);
            logLines = result.logs;
            success = result.success;
        } else if (actionType === 'magisk-patch') {
            const result = generateMagiskPatchLogs();
            logLines = result.logs;
            success = result.success;
        } else if (actionType === 'corrupt-partitions') {
            const result = generateCorruptionLogs();
            logLines = result.logs;
            success = result.success;
        } else if (actionType === 'odin-flash' && odinFiles) {
            const result = generateOdinLogs(odinFiles);
            logLines = result.logs;
            success = result.success;
        }
        else {
            logLines = generateWipeLogs();
            success = true;
        }

        let i = 0;
        let intervalDuration = 350 + Math.random() * 200;
        if (actionType === 'magisk-patch') {
             // Make the process last about 60 seconds
            intervalDuration = 60000 / logLines.length;
        } else if (actionType === 'odin-flash') {
            intervalDuration = 250;
        }

        const intervalId = setInterval(() => {
            if (i < logLines.length) {
                setLogs(prev => [...prev, `${logLines[i]}`]);
                i++;
            } else {
                clearInterval(intervalId);
                if (success && (actionType === 'install' || actionType === 'odin-flash') && installOptions?.autoReboot) {
                    onReboot();
                } else {
                    setIsComplete(true);
                }
                 (window as any)._onComplete = () => onComplete(success);
            }
        }, intervalDuration);

        return () => clearInterval(intervalId);
    }, [actionType, fileName, partitions, mountOps, fsChangeOptions, targetPartition, odinFiles, installOptions, onReboot, onComplete]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs, cliOutput]);
    
    useEffect(() => {
        if (isComplete) {
            inputRef.current?.focus();
        }
    }, [isComplete]);

    const resolvePath = (path: string, fs: any) => {
        const parts = path.split('/').filter(p => p);
        if (path === '/') return { parent: null, name: '/', node: fs, exists: true };
    
        let current = fs;
        let parent = null;
    
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (current && typeof current === 'object' && current[part] !== undefined) {
                current = current[part];
            } else {
                return { parent: null, name: part, node: null, exists: false };
            }
        }
        
        parent = current;
        const name = parts[parts.length - 1];
        const node = parent ? parent[name] : null;

        return { parent, name, node, exists: node !== undefined };
    };
    
    const handleCompletion = () => {
         if ((window as any)._onComplete) {
            (window as any)._onComplete();
            (window as any)._onComplete = null;
        }
    };

    const executeCommand = (command: string): string[] => {
        const [cmd, ...args] = command.trim().split(' ').filter(Boolean);
        const newFs = JSON.parse(JSON.stringify(filesystem));

        switch (cmd) {
            case 'help':
                return [
                    'Available commands:',
                    '  help                   - Show this help message',
                    '  ls [path]              - List directory contents (e.g., /sdcard)',
                    '  mkdir <path>           - Create a new directory',
                    '  rm [-r] <file/dir>     - Remove a file or directory (-r for recursive)',
                    '  mv <source> <dest>     - Move or rename a file/directory',
                    '  date                   - Display the current date and time',
                    '  echo [text]            - Print text to the terminal',
                    '  clear                  - Clear the command output',
                    '  reboot                 - Reboot the system',
                    '  exit                   - Go back to the main menu',
                ];
            case 'ls': {
                const path = args[0] || '/';
                const resolved = resolvePath(path, filesystem);
                if (!resolved.exists) return [`ls: ${path}: No such file or directory`];
                if (typeof resolved.node !== 'object' || resolved.node === null) return [path.split('/').pop() || ''];
                
                const contents = Object.keys(resolved.node).sort();
                return contents.map(item => {
                    return (resolved.node[item] && typeof resolved.node[item] === 'object') ? `${item}/` : item;
                });
            }
            case 'mkdir': {
                if (!args[0]) return ['mkdir: missing operand'];
                const path = args[0];
                const resolved = resolvePath(path, newFs);
                if (resolved.exists) return [`mkdir: ${path}: File exists`];
                if (!resolved.parent || typeof resolved.parent !== 'object') return [`mkdir: ${path}: No such file or directory`];
                
                resolved.parent[resolved.name] = {};
                setFilesystem(newFs);
                return [];
            }
            case 'rm': {
                const recursive = args.includes('-r');
                const path = args.find(a => !a.startsWith('-'));
                if (!path) return ['rm: missing operand'];

                const resolved = resolvePath(path, newFs);
                if (!resolved.exists) return [`rm: ${path}: No such file or directory`];
                if (!resolved.parent) return [`rm: cannot remove '${path}': Permission denied`];
                if (typeof resolved.node === 'object' && resolved.node !== null && !recursive) {
                    return [`rm: ${path}: is a directory`];
                }

                delete resolved.parent[resolved.name];
                setFilesystem(newFs);
                return [];
            }
            case 'mv': {
                if (args.length < 2) return ['mv: missing destination file operand after \'' + args[0] + '\''];
                const srcPath = args[0];
                const destPath = args[1];

                const src = resolvePath(srcPath, newFs);
                if (!src.exists) return [`mv: ${srcPath}: No such file or directory`];
                if (!src.parent) return [`mv: cannot move '${srcPath}': Permission denied`];

                const dest = resolvePath(destPath, newFs);
                let destParent = dest.parent;
                let destName = dest.name;

                // If destination is an existing directory, move source inside it
                if (dest.exists && typeof dest.node === 'object' && dest.node !== null) {
                    destParent = dest.node;
                    destName = src.name;
                } else if (!dest.exists && !dest.parent) {
                    return [`mv: ${destPath}: No such file or directory`];
                }
                
                if (destParent[destName] !== undefined) {
                     return [`mv: ${destPath}: File exists`];
                }
                
                destParent[destName] = src.node; // Move/rename
                delete src.parent[src.name];   // Delete original
                setFilesystem(newFs);
                return [];
            }
            case 'date':
                return [new Date().toString()];
            case 'echo':
                return [args.join(' ')];
            case 'reboot':
                onReboot();
                return ['Rebooting system...'];
            case 'exit':
                handleCompletion();
                return ['Exiting terminal...'];
            case 'clear':
                setCliOutput([]);
                return [];
            case '':
                return [];
            default:
                return [`sh: ${cmd}: command not found`];
        }
    }

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const command = inputValue;
        const output = executeCommand(command);
        
        setCliOutput(prev => [
            ...prev,
            `~ # ${command}`,
            ...output
        ]);

        setInputValue('');
    };


    const getTitle = () => {
        if (actionType === 'install') return `Installing: ${fileName}`;
        if (actionType === 'image-flash') return `Flashing Image: ${fileName}`;
        if (actionType === 'odin-flash') return 'TWRP ODIN Flash';
        if (actionType === 'wipe') return 'Wiping Data';
        if (actionType === 'backup') return 'Creating Backup';
        if (actionType === 'advanced-wipe') return 'Advanced Wipe';
        if (actionType === 'mount') return 'Mounting Partitions';
        if (actionType === 'change-fs') return 'File System Operation';
        if (actionType === 'magisk-patch') return 'Patching Boot Image';
        if (actionType === 'corrupt-partitions') return 'Corrupting Partitions';
        if (!actionType) return 'Terminal';
        return 'Processing';
    }

    return (
        <div className="flex flex-col h-full bg-[#0d1117]">
            <InstallErrorHelp isOpen={showError7Help} onClose={() => setShowError7Help(false)} />
            <h2 className="text-lg font-bold p-3 bg-gray-900 border-b-2 border-[var(--accent-medium)] text-center flex-shrink-0">
                {getTitle()}
            </h2>
            <div ref={terminalRef} className="flex-grow p-2 overflow-y-auto font-mono text-sm" onClick={() => inputRef.current?.focus()}>
                {logs.map((log, index) => {
                    if (actionType === 'odin-flash') {
                        const isPass = log === 'PASS!';
                        const color = isPass ? 'bg-green-600 text-white font-bold p-1 text-center' : 'text-blue-400';
                        return <p key={index} className={`whitespace-pre-wrap ${color}`}>{log}</p>;
                    }
                    const isError = log.includes('[ERROR]');
                    const isWarning = log.includes('[WARNING]');
                    const isFatal = log.includes('[FATAL]');
                    const isSuccess = log.toLowerCase().includes('successfully') || log.toLowerCase().includes('succeeded') || log.toLowerCase().includes('! ');
                    const color = isFatal ? 'text-red-600 font-bold' : isError ? 'text-red-500' : isWarning ? 'text-yellow-400' : isSuccess ? 'text-[var(--accent-primary)]' : 'text-green-400';
                    return <p key={index} className={`whitespace-pre-wrap ${color}`}>{log}</p>
                })}
                {isComplete && actionType && <p className="text-[var(--accent-primary)] font-bold mt-2">Process completed.</p>}
                 {cliOutput.map((line, index) => {
                    const isPrompt = line.startsWith('~ #');
                    const isDir = line.endsWith('/');
                    const color = isPrompt ? 'text-cyan-400' : isDir ? 'text-blue-400' : 'text-green-400';
                     return <p key={`cli-${index}`} className={`whitespace-pre-wrap ${color}`}>{line}</p>
                })}

                {isComplete && (
                    <form onSubmit={handleCommand} className="flex items-center">
                        <span className="text-cyan-400 mr-2">~ #</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-1 bg-transparent border-none text-green-400 focus:outline-none font-mono"
                            autoComplete="off"
                            spellCheck="false"
                        />
                    </form>
                )}
            </div>
            {isComplete && (
                <div className="p-4 flex-shrink-0 flex flex-col items-center gap-4">
                    <div className="w-full flex items-center gap-4">
                         <button
                            onClick={handleCompletion}
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
                     {isError7 && (
                        <button
                            onClick={() => setShowError7Help(true)}
                            className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition-colors"
                        >
                            Fix Error 7 Guide
                        </button>
                     )}
                </div>
            )}
        </div>
    );
};

export default TerminalView;