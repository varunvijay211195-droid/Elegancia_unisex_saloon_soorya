"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function FloatingBookingBar() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
                >
                    <div className="glass-morphism-dark rounded-full p-2 pr-6 flex items-center justify-between gap-4 overflow-hidden group shadow-2xl">
                        {/* Shimmer Effect overlay */}
                        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-150%] group-hover:animate-shimmer" />

                        <div className="flex items-center gap-3 pl-4">
                            <div className="bg-gold-gradient p-2 rounded-full">
                                <Sparkles className="w-4 h-4 text-primary-charcoal animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Elegancia Rituals</span>
                                <span className="text-sm text-white font-medium whitespace-nowrap">Slay Every Look</span>
                            </div>
                        </div>

                        <Link
                            href="/book"
                            className="bg-gold-gradient px-6 py-3 rounded-full text-sm font-bold text-primary-charcoal hover:scale-105 transition-transform active:scale-95"
                        >
                            Book Now
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
