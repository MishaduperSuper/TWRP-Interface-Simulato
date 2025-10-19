import React, { useState, useEffect, useRef } from 'react';
import InstallErrorHelp from './InstallErrorHelp';

interface TerminalViewProps {
    actionType: 'install' | 'wipe' | 'advanced-wipe' | 'mount' | 'backup' | 'change-fs' | 'magisk-patch' | 'image-flash' | 'corrupt-partitions' | 'odin-flash' | 'erase-frp' | 'bypass-ldu' | 'debloat-realme' | 'unlock-bootloader' | 'bypass-icloud' | 'stock-firmware-flash' | null;
    fileName?: string | null;
    onComplete: (success: boolean) => void;
    onReboot: () => void;
    partitions?: string[];
    mountOps?: { partition: string; mount: boolean }[];
    fsChangeOptions?: { partition: string; fsType?: string; repair: boolean; forceError: boolean };
    targetPartition?: string;
    odinFiles?: { [key: string]: string };
    unlockBrand?: string;
    firmwareBrand?: string;
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
        `Backup folder: /sdcard/DemonTOOL/BACKUPS/${backupFolderName}`
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

const generateEraseFrpLogs = (): { logs: string[], success: boolean } => {
    const logs: string[] = [
        `*********************************`,
        `*    DemonTOOL FRP Erase Tool   *`,
        `*         Version 1.2.5         *`,
        `*********************************`,
        `[INFO] Reading device identifiers...`,
        `[INFO]   - Serial: SM-G998B-SIMULATED`,
        `[INFO]   - Board: exynos2100`,
        `[INFO]   - Bootloader: G998BXXU1AUB6`,
        `[INFO] Checking for FRP lock status...`,
        `[INFO] Partition '/dev/block/persistent' exists.`,
        `[INFO] Reading FRP status... LOCKED.`,
        `[WARN] This is an advanced operation. Do not disconnect the device.`,
        `[STEP 1/5] Entering diagnostic mode...`,
        `[INFO] Sending ADB command: 'reboot-bootloader'`,
        `...`,
        `[INFO] Device entered bootloader.`,
        `[INFO] Switching to RCM mode via payload injection...`,
        `[INFO] Payload sent successfully.`,
        `[STEP 2/5] Establishing connection with remote server...`,
        `[INFO] Pinging frp.demontool.sim...`,
        `[INFO] Ping successful (34ms).`,
        `[INFO] Authenticating with API key...`,
        `[INFO] Authentication successful. Session ID: 8a4f9c2b`,
        `[STEP 3/5] Uploading device signature for token generation...`,
        `[INFO] Signature size: 4KB`,
        `[INFO] Uploading... 10%`,
        `[INFO] Uploading... 30%`,
        `[INFO] Uploading... 75%`,
        `[INFO] Uploading... 100%`,
        `[INFO] Signature uploaded. Awaiting server-side processing.`,
        `[INFO] This may take several minutes.`,
        `[SERVER] Received signature. Verifying against known models.`,
        `[SERVER] Match found: Samsung S21 (exynos2100).`,
        `[SERVER] Generating unique unlock token...`,
        `[SERVER] Applying cryptographic signature to token...`,
        `[SERVER] Token generation successful. Sending back to client.`,
        `[INFO] Received unlock token (256 bytes).`,
        `[INFO] Verifying token signature... OK.`,
        `[STEP 4/5] Preparing to flash unlock token...`,
        `[INFO] Mounting 'persistent' partition as read-write...`,
        `[WARN] This is a critical step. Any failure may result in a brick.`,
        `[INFO] Mount successful.`,
        `[INFO] Backing up original FRP data to /tmp/frp.bak...`,
        `[INFO] Backup complete.`,
        `[INFO] Writing unlock token to block 0x00A1 of /dev/block/persistent...`,
        `...`,
        `...`,
        `[INFO] Write operation successful.`,
        `[INFO] Verifying write...`,
        `[INFO] Readback matches token. Verification OK.`,
        `[STEP 5/5] Finalizing and cleaning up...`,
        `[INFO] Unmounting 'persistent' partition...`,
        `[INFO] Deleting temporary files...`,
        `[INFO] Sending ADB command: 'reboot'`,
        `[INFO] Device is rebooting.`,
        `[SUCCESS] FRP Erase process completed successfully!`,
        `[SUCCESS] The device should now be unlocked on next boot.`,
    ];

    // 10% chance of a "server-side" failure for variety
    if (Math.random() < 0.1) {
        const failureLogs = logs.slice(0, 25); // Cut before token is received
        failureLogs.push(`[SERVER] [ERROR] Token generation failed. Server load too high.`);
        failureLogs.push(`[SERVER] Please try again in a few hours.`);
        failureLogs.push(`[ERROR] Failed to receive unlock token from server.`);
        failureLogs.push(`[FAIL] FRP Erase process failed.`);
        return { logs: failureLogs, success: false };
    }

    return { logs, success: true };
};

const generateBypassLduLogs = (): { logs: string[], success: boolean } => {
    const logs: string[] = [
        `*********************************`,
        `*  DemonTOOL LDU Bypass Utility *`,
        `*         Version 2.1.0         *`,
        `*********************************`,
        `[INFO] Establishing ADB connection...`,
        `[INFO] ADB connection successful.`,
        `[INFO] Device Model: SM-G998U1-LDU (Simulated)`,
        `[INFO] Android Version: 13`,
        `[INFO] Security Patch: 2023-05-01`,
        `[INFO] Searching for LDU services...`,
        `[INFO] Found service: com.samsung.retail`,
        `[INFO] Found service: knox_lud_service`,
        `[STEP 1/4] Disabling Knox Security for LDU...`,
        `[SHELL] pm disable-user --user 0 com.samsung.android.knox.container`,
        `[SHELL] Package com.samsung.android.knox.container new state: disabled`,
        `[SUCCESS] Knox LDU service disabled.`,
        `[STEP 2/4] Removing retail mode packages...`,
        `[SHELL] pm uninstall -k --user 0 com.samsung.retail`,
        `[SHELL] Success`,
        `[SHELL] pm uninstall -k --user 0 com.sec.android.app.retailmode`,
        `[SHELL] Success`,
        `[SUCCESS] Retail packages removed.`,
        `[STEP 3/4] Modifying system properties...`,
        `[WARN] This requires a temporary read-write mount of /system.`,
        `[SHELL] mount -o rw,remount /`,
        `[INFO] Remount successful.`,
        `[SHELL] setprop persist.sys.retaildemo.enabled 0`,
        `[INFO] Property 'persist.sys.retaildemo.enabled' set to '0'.`,
        `[SHELL] setprop sys.retail.demo.enabled 0`,
        `[INFO] Property 'sys.retail.demo.enabled' set to '0'.`,
        `[SHELL] setprop ro.frp.pst ""`,
        `[INFO] FRP status flag cleared.`,
        `[SHELL] mount -o ro,remount /`,
        `[INFO] Remounted /system as read-only.`,
        `[SUCCESS] System properties modified.`,
        `[STEP 4/4] Cleaning up demo content...`,
        `[INFO] Deleting /sdcard/Retail/ folder...`,
        `[INFO] Deleted 1.2 GB of demo videos and images.`,
        `[INFO] Deleting demo user accounts...`,
        `[INFO] Cleanup complete.`,
        `[SUCCESS] LDU Bypass process completed successfully!`,
        `[SUCCESS] Please reboot the device to apply all changes.`,
    ];

    return { logs, success: true };
};

const generateDebloatRealmeLogs = (): { logs: string[], success: boolean } => {
    const bloatware = [
        { name: "Heytap Browser", pkg: "com.heytap.browser" },
        { name: "Smart Assistant", pkg: "com.coloros.assistantscreen" },
        { name: "App Market", pkg: "com.heytap.market" },
        { name: "Realme Store", pkg: "com.realmestore.app" },
        { name: "OPPO Push Service", pkg: "com.opos.cs" },
        { name: "Heytap Cloud", pkg: "com.heytap.cloud" },
        { name: "ORoaming", pkg: "com.redteamobile.roaming" },
        { name: "FinShell Pay", pkg: "com.finshell.fin" },
        { name: "YouTube Music", pkg: "com.google.android.apps.youtube.music.p" },
        { name: "Google TV", pkg: "com.google.android.videos" },
        { name: "Facebook", pkg: "com.facebook.katana" },
        { name: "Facebook App Manager", pkg: "com.facebook.appmanager" },
    ];
    
    const logs: string[] = [
        `*********************************`,
        `*  DemonTOOL Realme Debloat Tool*`,
        `*         Version 1.0.0         *`,
        `*********************************`,
        `[INFO] Connecting via ADB...`,
        `[INFO] Device detected: RMX3363 (Realme GT Master Edition)`,
        `[INFO] Starting debloat process for user 0...`,
    ];

    bloatware.forEach((app, index) => {
        const useDisable = Math.random() > 0.5; // Randomly choose disable or uninstall
        const command = useDisable ? `pm disable-user --user 0 ${app.pkg}` : `pm uninstall -k --user 0 ${app.pkg}`;
        const result = useDisable ? `Package ${app.pkg} new state: disabled` : 'Success';

        logs.push(`---`);
        logs.push(`[STEP ${index + 1}/${bloatware.length}] Removing ${app.name}...`);
        logs.push(`[SHELL] ${command}`);
        if (Math.random() < 0.05) { // 5% chance of failure
            logs.push(`[SHELL] Failure [INSTALL_FAILED_USER_RESTRICTED]`);
            logs.push(`[WARN] Failed to remove ${app.name}, it might be a critical system app.`);
        } else {
            logs.push(`[SHELL] ${result}`);
        }
    });

    logs.push(`---`);
    logs.push(`[SUCCESS] Debloat process completed. Processed ${bloatware.length} packages.`);
    logs.push(`[SUCCESS] A reboot is recommended to clear cache and apply all changes.`);

    return { logs, success: true };
};

const generateUnlockBootloaderLogs = (brand: string): { logs: string[], success: boolean } => {
    let logs: string[] = [
        `*********************************`,
        `* DemonTOOL Bootloader Unlocker *`,
        `*       Target: ${brand.padEnd(16)} *`,
        `*********************************`,
    ];
    let success = true;

    switch (brand) {
        case 'Xiaomi':
            logs.push(...[
                `[INFO] Device detected in fastboot mode.`,
                `[INFO] Rebooting to Emergency Download (EDL) mode...`,
                `[SHELL] fastboot oem edl`,
                `[INFO] Device connected in Qualcomm HS-USB QDLoader 9008 mode.`,
                `[INFO] Identifying chipset: SM8350 (Snapdragon 888).`,
                `[INFO] Loading Firehose programmer: prog_firehose_ddr.elf...`,
                `[WARN] Bypassing programmer signature verification via CVE-2021-30333 exploit...`,
                `[SUCCESS] Programmer authenticated.`,
                `[INFO] Sending payload to read RPMB partition...`,
                `[INFO] Extracting unlock token from encrypted data block...`,
                `[INFO] Token found: 3A5F8C1E9B2D7A4F`,
                `[INFO] Rebooting to fastboot mode...`,
                `[SHELL] fastboot flashing unlock_critical`,
                `[OUTPUT] ... OKAY`,
                `[SHELL] fastboot oem unlock 3A5F8C1E9B2D7A4F`,
                `[OUTPUT] ...`,
                `[OUTPUT] OKEY [ 0.050s]`,
                `[OUTPUT] finished. total time: 0.050s`,
                `[SUCCESS] Bootloader is now UNLOCKED.`,
                `[WARN] Device data has been wiped.`,
            ]);
            break;
        case 'Samsung':
            logs.push(...[
                `[INFO] Device Model: SM-G998B (Exynos 2100).`,
                `[INFO] Reading Knox Guard status... Active.`,
                `[INFO] Reading CROM Service status... Locked.`,
                `[WARN] This procedure will trip the Knox fuse (0x0 -> 0x1).`,
                `[STEP 1/3] Disabling Knox services via memory exploit...`,
                `[INFO] Injecting payload into RIL service...`,
                `[SUCCESS] Knox services disabled in memory.`,
                `[STEP 2/3] Generating unlock token via server...`,
                `[INFO] Uploading device unique ID to DemonTOOL server...`,
                `[SERVER] Generating unlock blob for device... OK.`,
                `[INFO] Received unlock blob (unlock.bin).`,
                `[STEP 3/3] Flashing unlock blob to 'param' partition...`,
                `[INFO] Rebooting to Download Mode...`,
                `[ODIN] Flashing unlock.bin to PARAM...`,
                `[ODIN] PASS!`,
                `[SUCCESS] Bootloader is now UNLOCKED.`,
                `[WARN] Device data has been wiped.`,
            ]);
            break;
        case 'Huawei / Honor':
            logs.push(...[
                `[INFO] Device detected: HMA-L29 (Kirin 980).`,
                `[WARN] This procedure requires a Test Point connection.`,
                `[INFO] Assuming device is in USB COM 1.0 mode (Test Point).`,
                `[STEP 1/4] Bypassing boot ROM signature check...`,
                `[INFO] Loading custom bootloader: usbloader-kirin980.bin`,
                `[SUCCESS] Handshake with device successful.`,
                `[STEP 2/4] Reading oeminfo partition...`,
                `[INFO] Oeminfo backup saved to /logs/oeminfo.bin`,
                `[STEP 3/4] Patching oeminfo with unlock flag...`,
                `[INFO] Setting bootloader unlock status to 'unlocked' at offset 0x8A.`,
                `[INFO] Recalculating checksum... OK.`,
                `[STEP 4/4] Writing patched oeminfo back to device...`,
                `[INFO] Writing...`,
                `[INFO] Verification... OK.`,
                `[INFO] Rebooting device...`,
                `[SUCCESS] Bootloader is now UNLOCKED.`,
                `[WARN] Device data has been wiped.`,
            ]);
            break;
        case 'MediaTek Universal':
             logs.push(...[
                `[INFO] Attempting universal MediaTek unlock...`,
                `[INFO] Chipset detected: Dimensity 1200.`,
                `[STEP 1/3] Bypassing Secure Boot (BROM exploit)...`,
                `[INFO] Shorting Test Point and connecting USB...`,
                `[INFO] Device connected in BROM mode.`,
                `[INFO] Executing MediaTek Auth Bypass utility v3.1...`,
                `[SUCCESS] Authentication protection disabled.`,
                `[STEP 2/3] Loading custom Download Agent (DA)...`,
                `[INFO] Sending custom DA file: DA_SWSEC_CRYPTO.bin...`,
                `[SUCCESS] DA loaded. Gaining control over eMMC.`,
                `[STEP 3/3] Disabling lock flags in 'seccfg' partition...`,
                `[INFO] Reading 'seccfg' partition...`,
                `[INFO] Setting flash_lock_state to 0.`,
                `[INFO] Setting unlock_status to 1.`,
                `[INFO] Writing modified partition back to device...`,
                `[SUCCESS] Bootloader is now UNLOCKED.`,
                `[WARN] Device data has been wiped.`,
            ]);
            break;
        default:
            logs.push('[ERROR] Unknown brand selected. Aborting.');
            success = false;
    }
    return { logs, success };
};

const generateBypassICloudLogs = (): { logs: string[], success: boolean } => {
    const logs = [
        `*********************************`,
        `*   DemonTOOL iCloud Bypass Tool  *`,
        `*     Target: Apple A11 Bionic    *`,
        `*********************************`,
        `[INFO] Waiting for device in DFU mode...`,
        `[INFO] Apple Mobile Device (DFU Mode) connected!`,
        `[DAEMON] DemonTOOL iTunes Daemon v1.1 engaged.`,
        `[STEP 1/7] Executing checkm8 exploit...`,
        `[INFO] Found vulnerable device with APNonce mismatch.`,
        `[INFO] Heap overflow initiated...`,
        `[INFO] Overwriting USB DFU request buffer...`,
        `[INFO] Payload sent.`,
        `[SUCCESS] Device is now in a pwned DFU state.`,
        `[STEP 2/7] Sending patched iBSS...`,
        `[INFO] Decompressing iBSS...`,
        `[INFO] Applying signature patches...`,
        `[INFO] Re-compressing and sending to device...`,
        `[INFO] Booting patched iBSS... OK.`,
        `[STEP 3/7] Sending patched iBEC...`,
        `[INFO] Applying boot-args '-v rd=md0 amfi_get_out_of_my_way=1'...`,
        `[INFO] Sending to device... OK.`,
        `[STEP 4/7] Booting into verbose mode...`,
        `[DEVICE] Apple logo displayed...`,
        `[DEVICE] Booting kernel...`,
        `[DEVICE] ...`,
        `[DEVICE] ...`,
        `[DEVICE] Successfully booted Ramdisk.`,
        `[STEP 5/7] Establishing SSH over USB...`,
        `[INFO] Forwarding port 22 to 2222...`,
        `[INFO] Connection established.`,
        `[SSH] root@localhost:~#`,
        `[STEP 6/7] Modifying filesystem for bypass...`,
        `[SSH] mount -o rw /`,
        `[INFO] Root filesystem mounted as read-write.`,
        `[SSH] mv /Applications/Setup.app /Applications/Setup.app.bak`,
        `[INFO] Renamed Setup.app to prevent activation screen.`,
        `[SSH] touch /var/root/Library/Lockdown/activation_records/COUNTRY_DONT_ALLOW`,
        `[INFO] Created dummy activation records.`,
        `[SSH] uicache -a`,
        `[INFO] Rebuilding icon cache...`,
        `[SSH] kill 1`,
        `[INFO] Restarting SpringBoard...`,
        `[STEP 7/7] Finalizing and rebooting...`,
        `[INFO] Connection closed. Sending reboot command.`,
        `[SUCCESS] iCloud Bypass complete! Device will boot to home screen.`,
    ];
    return { logs, success: true };
};

const generateStockFirmwareLogs = (brand: string): { logs: string[], success: boolean } => {
    let logs: string[] = [
        `*********************************`,
        `* DemonTOOL Stock Firmware Flash*`,
        `*         Target: ${brand.padEnd(16)} *`,
        `*********************************`,
    ];
    let success = true;

    switch (brand) {
        case 'Samsung':
            logs.push(...[
                `[INFO] Using Odin protocol for Samsung device.`,
                `[INFO] File: HOME_CSC_OXM_S918BOXM1AWBD_...tar.md5`,
                `<ID:0/005> Odin engine v(ID:3.1401)..`,
                `<ID:0/005> File analysis..`,
                `<ID:0/005> Total file size: 8.2 GB`,
                `<ID:0/005> SetupConnection..`,
                `<ID:0/005> Initialzation..`,
                `<ID:0/005> Get PIT for mapping..`,
                `<ID:0/005> Firmware update start..`,
                `<ID:0/005> SingleDownloadFile: boot.img...`,
                `<ID:0/005> SingleDownloadFile: recovery.img...`,
                `<ID:0/005> SingleDownloadFile: system.img... (chunk 1/10)`,
                `<ID:0/005> SingleDownloadFile: system.img... (chunk 2/10)`,
                `...`,
                `<ID:0/005> SingleDownloadFile: system.img... (chunk 10/10)`,
                `<ID:0/005> SingleDownloadFile: vendor.img...`,
                `<ID:0/005> SingleDownloadFile: userdata.img...`,
                `<ID:0/005> SingleDownloadFile: modem.bin...`,
                `<ID:0/005> RQT_CLOSE !!`,
                `<ID:0/005> RES OK !!`,
                `<OSM> All threads completed. (succeed 1 / failed 0)`,
                `[SUCCESS] Stock firmware flashed successfully.`,
                `[INFO] Device will reboot to setup wizard.`,
            ]);
            break;
        case 'Xiaomi':
            logs.push(...[
                `[INFO] Using Fastboot protocol for Xiaomi device (MiFlash).`,
                `[INFO] Device detected in fastboot mode.`,
                `[SHELL] fastboot getvar product`,
                `[OUTPUT] product: apollo`,
                `[INFO] Flashing images for 'apollo'...`,
                `[SHELL] fastboot flash boot boot.img`,
                `[OUTPUT] Sending 'boot' (128 MB)... OKAY`,
                `[OUTPUT] Writing 'boot'... OKAY`,
                `[SHELL] fastboot flash system system.img`,
                `[OUTPUT] Sending sparse 'system' 1/5 (1024 MB)... OKAY`,
                `[OUTPUT] Writing 'system' 1/5... OKAY`,
                `...`,
                `[OUTPUT] Sending sparse 'system' 5/5 (512 MB)... OKAY`,
                `[OUTPUT] Writing 'system' 5/5... OKAY`,
                `[SHELL] fastboot flash vendor vendor.img`,
                `[OUTPUT] Sending 'vendor' (768 MB)... OKAY`,
                `[OUTPUT] Writing 'vendor'... OKAY`,
                `[SHELL] fastboot erase userdata`,
                `[OUTPUT] Erasing 'userdata'... OKAY`,
                `[SHELL] fastboot reboot`,
                `[SUCCESS] Stock firmware flashed successfully.`,
                `[INFO] Device rebooting...`,
            ]);
            break;
        case 'Asus':
            logs.push(...[
                `[INFO] Using ADB Sideload for Asus device.`,
                `[INFO] Device detected in recovery mode.`,
                `[INFO] Starting ADB sideload...`,
                `[SHELL] adb sideload UL-ASUS_I005D-WW-31.0810.1226.91-1.1.25.zip`,
                `[OUTPUT] serving: 'UL-ASUS_I005D-...' (~47%)`,
                `[DEVICE] Verifying update package...`,
                `[DEVICE] Installing update...`,
                `[DEVICE] Step 1/2`,
                `[DEVICE] ...`,
                `[DEVICE] Step 2/2`,
                `[DEVICE] ...`,
                `[DEVICE] Script succeeded: result was [/system]`,
                `[OUTPUT] Total xfer: 1.00x`,
                `[SUCCESS] Stock firmware flashed successfully.`,
                `[INFO] Install from ADB completed with status 0.`,
            ]);
            break;
        default:
            logs.push('[ERROR] Unknown brand selected for firmware flash. Aborting.');
            success = false;
    }

    return { logs, success };
};


const TerminalView: React.FC<TerminalViewProps> = ({ actionType, fileName, onComplete, onReboot, partitions, mountOps, fsChangeOptions, targetPartition, odinFiles, unlockBrand, firmwareBrand, filesystem, setFilesystem, installOptions }) => {
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
        let intervalDuration = 350 + Math.random() * 200;

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
        } else if (actionType === 'erase-frp') {
            const result = generateEraseFrpLogs();
            logLines = result.logs;
            success = result.success;
            // Make this process very long as requested
            intervalDuration = 90000 / logLines.length; // ~90 seconds total
        } else if (actionType === 'bypass-ldu') {
            const result = generateBypassLduLogs();
            logLines = result.logs;
            success = result.success;
            intervalDuration = 30000 / logLines.length; // ~30 seconds total
        } else if (actionType === 'debloat-realme') {
            const result = generateDebloatRealmeLogs();
            logLines = result.logs;
            success = result.success;
            intervalDuration = 25000 / logLines.length; // ~25 seconds total
        } else if (actionType === 'unlock-bootloader' && unlockBrand) {
            const result = generateUnlockBootloaderLogs(unlockBrand);
            logLines = result.logs;
            success = result.success;
            intervalDuration = 400;
        } else if (actionType === 'bypass-icloud') {
            const result = generateBypassICloudLogs();
            logLines = result.logs;
            success = result.success;
            intervalDuration = 120000 / logLines.length; // ~2 minutes total
        } else if (actionType === 'stock-firmware-flash' && firmwareBrand) {
            const result = generateStockFirmwareLogs(firmwareBrand);
            logLines = result.logs;
            success = result.success;
            intervalDuration = 60000 / logLines.length; // ~60 seconds total
        }
        else {
            logLines = generateWipeLogs();
            success = true;
        }

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
                if (success && (actionType === 'install' || actionType === 'odin-flash' || actionType === 'stock-firmware-flash') && installOptions?.autoReboot) {
                    onReboot();
                } else {
                    setIsComplete(true);
                }
                 (window as any)._onComplete = () => onComplete(success);
            }
        }, intervalDuration);

        let i = 0;
        return () => clearInterval(intervalId);
    }, [actionType, fileName, partitions, mountOps, fsChangeOptions, targetPartition, odinFiles, unlockBrand, firmwareBrand, installOptions, onReboot, onComplete]);

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
        if (actionType === 'odin-flash') return 'DemonTOOL ODIN Flash';
        if (actionType === 'unlock-bootloader') return `Unlocking Bootloader: ${unlockBrand}`;
        if (actionType === 'stock-firmware-flash') return `Flashing Stock Firmware: ${firmwareBrand}`;
        if (actionType === 'bypass-icloud') return 'Bypassing iCloud Lock (Apple)';
        if (actionType === 'wipe') return 'Wiping Data';
        if (actionType === 'backup') return 'Creating Backup';
        if (actionType === 'advanced-wipe') return 'Advanced Wipe';
        if (actionType === 'mount') return 'Mounting Partitions';
        if (actionType === 'change-fs') return 'File System Operation';
        if (actionType === 'magisk-patch') return 'Patching Boot Image';
        if (actionType === 'erase-frp') return 'Erasing FRP Lock';
        if (actionType === 'bypass-ldu') return 'Bypassing LDU Lock';
        if (actionType === 'debloat-realme') return 'Debloating Realme Device';
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
                    const isWarning = log.includes('[WARN]');
                    const isFatal = log.includes('[FATAL]');
                    const isSuccess = log.toLowerCase().includes('successfully') || log.toLowerCase().includes('succeeded') || log.toLowerCase().includes('! ') || log.toLowerCase().includes('[success]');
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