import React, { useState, useEffect } from 'react';

interface OdinScreenProps {
    onConfirm: (files: { [key: string]: string }) => void;
}

const FIRMWARE_FILES = {
    BL: 'BL_S918BXXU1AWBD_CL26239105_QB62758151_REV00_user_low_ship_meta_os13.tar.md5',
    AP: 'AP_S918BXXU1AWBD_CL26239105_QB62758151_REV00_user_low_ship_meta_os13.tar.md5',
    CP: 'CP_S918BXXU1AWBD_CP23883313_CL26239105_QB62758151_REV00_user_low_ship.tar.md5',
    CSC: 'CSC_OXM_S918BOXM1AWBD_CL26239105_QB62758151_REV00_user_low_ship.tar.md5',
};

const OdinScreen: React.FC<OdinScreenProps> = ({ onConfirm }) => {
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: string }>({});
    const [log, setLog] = useState<string[]>([]);

    useEffect(() => {
        // Simulate device connection
        setTimeout(() => {
            setLog(prev => [...prev, '<ID:0/005> Added!!']);
            setTimeout(() => {
                setLog(prev => [...prev, '<OSM> Enter CS for MD5..']);
                setLog(prev => [...prev, '<OSM> Check MD5.. Do not unplug the cable..']);
                setLog(prev => [...prev, '<OSM> Please wait..']);
            }, 500);
        }, 1000);
    }, []);

    const handleFileSelect = (type: 'BL' | 'AP' | 'CP' | 'CSC') => {
        const file = FIRMWARE_FILES[type];
        setSelectedFiles(prev => ({ ...prev, [type]: file }));
        setLog(prev => [...prev, `<OSM> ${file} is valid.`]);
    };
    
    const canStart = Object.keys(selectedFiles).length > 0;

    return (
        <div className="p-2 flex-grow flex flex-col bg-gray-700">
            <h2 className="text-xl font-bold p-3 border-b-2 border-[var(--accent-medium)] mb-2 text-center">TWRP ODIN v3.14.1</h2>
            <div className="flex-grow p-2 bg-gray-200 text-black font-sans flex flex-col text-sm">
                <div className="flex gap-2 h-full">
                    {/* Left Panel */}
                    <div className="flex-grow flex flex-col gap-2">
                        <div className="border border-gray-400 p-1">
                            <label className="font-bold">ID:COM</label>
                            <div className="h-8 bg-cyan-400 flex items-center justify-center font-bold text-white">
                                0:[COM5]
                            </div>
                        </div>
                        <div className="border border-gray-400 p-2 flex-grow">
                            <label className="font-bold">Log</label>
                            <div className="bg-white h-48 mt-1 p-1 overflow-y-auto font-mono text-xs">
                                {log.map((line, i) => <p key={i}>{line}</p>)}
                            </div>
                        </div>
                    </div>
                    {/* Right Panel */}
                    <div className="w-3/5 flex flex-col gap-2">
                        <div className="border border-gray-400 p-2">
                             <p className="font-bold mb-2">Files [Download]</p>
                             {Object.keys(FIRMWARE_FILES).map(key => (
                                <div key={key} className="flex items-center gap-1 my-1">
                                    <button onClick={() => handleFileSelect(key as any)} className="bg-gray-300 hover:bg-gray-400 border border-gray-500 px-4 py-1 font-bold">{key}</button>
                                    <input type="text" readOnly value={selectedFiles[key] || ''} className="w-full bg-white border border-gray-400 p-1 text-xs truncate" placeholder={`Click ${key} to select file...`}/>
                                </div>
                             ))}
                        </div>
                         <div className="border border-gray-400 p-2">
                            <p className="font-bold mb-2">Option</p>
                            <div className="space-y-1">
                                <label className="flex items-center"><input type="checkbox" defaultChecked className="mr-2" /> Auto Reboot</label>
                                <label className="flex items-center"><input type="checkbox" className="mr-2" /> Nand Erase</label>
                                <label className="flex items-center"><input type="checkbox" defaultChecked className="mr-2" /> F. Reset Time</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-2 flex items-end justify-between">
                    <div className="w-1/2">
                        <p className="font-bold">Message</p>
                        <div className="h-16 border border-gray-400 bg-white p-1 font-mono text-xs">
                           <p>S23 Ultra (SM-S918B) Connected.</p>
                        </div>
                    </div>
                     <button 
                        onClick={() => onConfirm(selectedFiles)}
                        disabled={!canStart}
                        className="w-1/4 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
                        START
                     </button>
                </div>
            </div>
        </div>
    );
};

export default OdinScreen;