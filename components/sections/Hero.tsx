"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { createClient } from "@/lib/supabase/client";

export default function Hero() {
    const supabase = createClient();
    const [heroImages, setHeroImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        async function fetchHero() {
            const { data } = await supabase
                .from('gallery')
                .select('image_url')
                .eq('category', 'home_hero')
                .order('created_at', { ascending: false });

            if (data && data.length > 0) {
                setHeroImages(data.map(item => item.image_url));
            } else {
                // Fallback
                setHeroImages(["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80"]);
            }
        }
        fetchHero();
    }, []);

    useEffect(() => {
        if (heroImages.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [heroImages]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary-charcoal-premium">
            {/* Immersive Media Wall background */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.35, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={heroImages[currentIndex] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80"}
                            alt="Elegancia Salon Ambience"
                            fill
                            className="object-cover grayscale"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-b from-primary-charcoal-premium/20 via-primary-charcoal-premium/60 to-primary-charcoal-premium" />
            </div>

            <div className="container mx-auto px-6 z-10 relative text-center max-w-5xl">
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={staggerContainer}
                    className="space-y-12"
                >
                    <motion.div variants={fadeInUp} className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 backdrop-blur-sm text-primary-gold rounded-full text-xs font-bold tracking-[0.2em] uppercase border border-white/10">
                            <Image
                                src="/images/logo.png"
                                alt=""
                                width={16}
                                height={16}
                                className="object-contain mix-blend-screen"
                            />
                            Now in Amballur, Ernakulam
                        </div>

                        <h1 className="font-fraunces text-6xl md:text-8xl lg:text-9xl font-extralight text-white leading-tight tracking-tighter">
                            Slay Every Look with <br />
                            <span className="bg-gold-gradient bg-clip-text text-transparent italic font-medium">
                                Elegancia
                            </span>
                        </h1>

                        <div className="flex flex-col items-center space-y-4">
                            <p className="text-xl md:text-2xl text-white/70 max-w-2xl font-light leading-relaxed tracking-wide">
                                Where Elegance Meets Style. Experience the ultimate Unisex Salon for Hair, Beauty, and Bridal rituals.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
                        <Button
                            size="lg"
                            asChild
                            className="px-12 h-16 text-lg bg-primary-gold text-primary-charcoal font-bold hover:scale-105 transition-all shadow-xl shadow-primary-gold/20 overflow-hidden relative group"
                        >
                            <Link href="/book">
                                <span className="absolute inset-0 bg-gold-gradient opacity-100 transition-opacity" />
                                <span className="relative z-10">Book Your Ritual</span>
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild className="px-12 h-16 text-lg glass-morphism text-white border-white/20 hover:bg-white/10 transition-all">
                            <Link href="/services">The Rituals Menu</Link>
                        </Button>
                    </motion.div>

                    {/* Low-profile Trust/Location Info */}
                    <motion.div variants={fadeInUp} className="pt-12 flex flex-col items-center space-y-4">
                        <div className="h-px w-24 bg-white/20" />
                        <p className="text-white/40 text-sm uppercase tracking-[0.3em]">
                            Near More Super Market, Kesavanpady
                        </p>
                        <div className="flex items-center gap-8 opacity-60">
                            <div className="text-center">
                                <p className="text-white font-bold text-lg">Unisex</p>
                                <p className="text-white/50 text-[10px] uppercase">Hair • Beauty</p>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="text-center">
                                <p className="text-white font-bold text-lg">Bridal</p>
                                <p className="text-white/50 text-[10px] uppercase">Makeover Studio</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Cinematic Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 "
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-primary-gold to-transparent" />
            </motion.div>
        </section>
    );
}
