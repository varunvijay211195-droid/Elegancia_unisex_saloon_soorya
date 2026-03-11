"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface BeforeAfterSliderProps {
    beforeSrc: string;
    afterSrc: string;
    beforeAlt?: string;
    afterAlt?: string;
    className?: string;
}

export default function BeforeAfterSlider({
    beforeSrc,
    afterSrc,
    beforeAlt = "Before",
    afterAlt = "After",
    className = ""
}: BeforeAfterSliderProps) {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (e: React.MouseEvent | React.TouchEvent | any) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPos(pos);
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-full aspect-[4/5] overflow-hidden rounded-2xl cursor-ew-resize group select-none shadow-2xl ${className}`}
            onMouseMove={handleMove}
            onTouchMove={handleMove}
        >
            {/* After Image (Background) */}
            <Image
                src={afterSrc}
                alt={afterAlt}
                fill
                className="object-cover"
                draggable={false}
            />

            {/* Before Image (Clipped) */}
            <div
                className="absolute inset-0 z-10"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
                <Image
                    src={beforeSrc}
                    alt={beforeAlt}
                    fill
                    className="object-cover"
                    draggable={false}
                />
            </div>

            {/* Slider Handle */}
            <div
                className="absolute inset-0 z-20 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
            >
                <div className="absolute inset-y-0 -left-[1px] w-[2px] bg-primary-gold/80 shadow-[0_0_15px_rgba(201,169,98,0.5)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 glass-morphism rounded-full flex items-center justify-center border border-white/20">
                    <div className="flex gap-1">
                        <div className="w-[2px] h-4 bg-primary-gold rounded-full" />
                        <div className="w-[2px] h-4 bg-primary-gold rounded-full" />
                    </div>
                </div>
            </div>

            {/* Labels */}
            <div className="absolute inset-x-0 bottom-6 px-6 z-30 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-[10px] uppercase font-bold tracking-[0.2em] bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">Before</span>
                <span className="text-white text-[10px] uppercase font-bold tracking-[0.2em] bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">After</span>
            </div>
        </div>
    );
}
