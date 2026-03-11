"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeInUp, staggerContainer, viewportOptions } from "@/lib/animations";
import { cn } from "@/lib/utils";
import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

interface GalleryItem {
    id: string;
    title: string;
    image_url: string;
    category: string;
}

export default function GalleryPreview() {
    const supabase = createClient();
    const [images, setImages] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchGallery() {
            const { data } = await supabase
                .from('gallery')
                .select('*')
                .neq('category', 'home_hero')
                .order('created_at', { ascending: false })
                .limit(6);

            setImages(data || []);
            setIsLoading(false);
        }
        fetchGallery();
    }, []);

    const beforeAfter = {
        before: images[0]?.image_url || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
        after: images[1]?.image_url || "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
        title: images[1]?.title || "Radiant Transformation"
    };

    const gridImages = images.slice(2, 6);

    return (
        <section className="py-32 bg-primary-charcoal-premium relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-gold/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="space-y-4">
                        <SectionHeader
                            subtitle="The Portfolio"
                            title="Slay of the Season"
                            align="left"
                            className="mb-0 md:mb-0 text-white"
                        />
                        <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">
                            Interactive lookbook of our signature transformations
                        </p>
                    </div>
                    <Button variant="outline" asChild className="glass-morphism text-white border-white/10 hover:bg-white/5 transition-all hidden md:flex h-14 px-8 rounded-2xl tracking-widest text-[10px] font-bold">
                        <Link href="/gallery">EXPLORE FULL LOOKBOOK</Link>
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex py-40 items-center justify-center">
                        <Loader2 className="w-10 h-10 text-primary-gold/20 animate-spin" />
                    </div>
                ) : (
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={viewportOptions}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6"
                    >
                        {/* Hero Feature: Before/After Slider (Large span) */}
                        <motion.div
                            variants={fadeInUp}
                            className="md:col-span-4 lg:col-span-3 lg:row-span-2"
                        >
                            <BeforeAfterSlider
                                beforeSrc={beforeAfter.before}
                                afterSrc={beforeAfter.after}
                                beforeAlt="Before"
                                afterAlt={beforeAfter.title}
                                className="h-full aspect-auto min-h-[500px] border border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden"
                            />
                        </motion.div>

                        {/* Bento Grid Gallery Items */}
                        {gridImages.map((image, idx) => (
                            <motion.div
                                key={image.id}
                                variants={fadeInUp}
                                className={cn(
                                    "relative overflow-hidden rounded-[2.5rem] group cursor-pointer shadow-xl border border-white/5",
                                    idx === 0 || idx === 3 ? "md:col-span-2 lg:col-span-3 aspect-[16/10]" : "md:col-span-2 lg:col-span-3 aspect-square"
                                )}
                            >
                                <Image
                                    src={image.image_url}
                                    alt={image.title || "Gallery Item"}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500 flex flex-col justify-end p-8 text-left">
                                    <span className="text-primary-gold text-[9px] font-black uppercase tracking-[0.3em] mb-2 block translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        {image.category}
                                    </span>
                                    <p className="text-white text-xl font-fraunces font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                        &ldquo;{image.title || "Elite Ritual"}&rdquo;
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <div className="mt-16 text-center md:hidden">
                    <Button variant="outline" asChild className="w-full h-16 glass-morphism text-white border-white/10 rounded-2xl">
                        <Link href="/gallery">View All Work</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
