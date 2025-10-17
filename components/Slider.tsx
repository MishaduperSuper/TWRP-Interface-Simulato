
import React, { useState, useRef, MouseEvent, TouchEvent } from 'react';

interface SliderProps {
    text: string;
    onConfirm: () => void;
}

const Slider: React.FC<SliderProps> = ({ text, onConfirm }) => {
    const [sliderX, setSliderX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
        setIsDragging(true);
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging || !sliderRef.current || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const sliderWidth = sliderRef.current.offsetWidth;
        let newX = clientX - containerRect.left - sliderWidth / 2;

        newX = Math.max(0, newX);
        newX = Math.min(containerRect.width - sliderWidth, newX);

        setSliderX(newX);
    };
    
    const handleMouseMove = (e: globalThis.MouseEvent) => handleDragMove(e.clientX);
    const handleTouchMove = (e: globalThis.TouchEvent) => handleDragMove(e.touches[0].clientX);

    const handleDragEnd = () => {
        if (!isDragging || !containerRef.current || !sliderRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        const sliderWidth = sliderRef.current.offsetWidth;
        const threshold = containerWidth * 0.9;
        
        if (sliderX + sliderWidth > threshold) {
            onConfirm();
        } else {
            setSliderX(0);
        }
        setIsDragging(false);
    };

    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchend', handleDragEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchend', handleDragEnd);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className="w-full bg-gray-900/70 rounded-full h-14 relative flex items-center justify-center overflow-hidden border-2 border-[var(--accent-border)]"
        >
            <div
                ref={sliderRef}
                className="w-16 h-16 bg-[var(--accent-medium)] rounded-full absolute -top-1 left-0 flex items-center justify-center cursor-pointer select-none z-10"
                style={{ transform: `translateX(${sliderX}px)` }}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
            <span className="text-white font-semibold text-lg animate-pulse">{text}</span>
        </div>
    );
};

export default Slider;