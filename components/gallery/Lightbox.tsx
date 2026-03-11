'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface LightboxProps {
    image: {
        src: string;
        title?: string;
        alt?: string;
        description?: string;
    };
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

export default function Lightbox({ image, onClose, onNext, onPrev }: LightboxProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight' && onNext) onNext();
            if (e.key === 'ArrowLeft' && onPrev) onPrev();
        };
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [onClose, onNext, onPrev]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 lg:p-10"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-[110]"
            >
                <X className="w-6 h-6" />
            </button>

            {onPrev && (
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-[110] hidden md:flex"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}

            {onNext && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-[110] hidden md:flex"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-6xl w-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[3/2] max-h-[75vh]">
                    <Image
                        src={image.src}
                        alt={image.alt || image.title || "Gallery image"}
                        fill
                        className="object-contain rounded-lg shadow-2xl"
                        priority
                    />
                </div>

                <div className="text-center mt-8 space-y-2 px-6">
                    <h3 className="font-fraunces text-2xl md:text-3xl font-bold text-white leading-tight">
                        {image.title || image.alt}
                    </h3>
                    {image.description && (
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">{image.description}</p>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
