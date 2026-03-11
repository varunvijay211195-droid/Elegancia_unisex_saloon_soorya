"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { galleryImages, galleryFilters, GalleryImage } from "@/lib/data/gallery";
import { cn } from "@/lib/utils";
import { fadeInUp, viewportOptions } from "@/lib/animations";
import Lightbox from "@/components/gallery/Lightbox";
import InstagramFeed from "@/components/sections/InstagramFeed";

export default function GalleryPage() {
    const [filter, setFilter] = useState("all");
    const [selectedImage, setSelectedImage] = useState<{ image: GalleryImage; index: number } | null>(null);

    const filteredImages = filter === "all"
        ? galleryImages
        : galleryImages.filter(img => img.category === filter);

    const handleNext = () => {
        if (!selectedImage) return;
        const nextIndex = (selectedImage.index + 1) % filteredImages.length;
        setSelectedImage({ image: filteredImages[nextIndex], index: nextIndex });
    };

    const handlePrev = () => {
        if (!selectedImage) return;
        const prevIndex = (selectedImage.index - 1 + filteredImages.length) % filteredImages.length;
        setSelectedImage({ image: filteredImages[prevIndex], index: prevIndex });
    };

    return (
        <div className="flex flex-col w-full pb-20">
            {/* Page Header */}
            <section className="bg-primary-charcoal py-20 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80')] bg-cover bg-center grayscale" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-primary-gold font-bold tracking-[0.2em] uppercase mb-4 block text-sm">
                            Our Portfolio
                        </span>
                        <h1 className="font-fraunces text-5xl md:text-6xl font-bold text-white mb-6">
                            Transformations
                        </h1>
                        <p className="text-secondary-rose/60 text-lg max-w-2xl mx-auto">
                            Explore our gallery of stunning hair transformations. Each style
                            is crafted to enhance your unique beauty.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="py-12 bg-primary-ivory border-b border-secondary-pearl sticky top-20 z-30">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-3">
                    {galleryFilters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={cn(
                                "px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300",
                                filter === f.value
                                    ? "bg-primary-gold text-primary-charcoal shadow-lg"
                                    : "bg-white text-secondary-slate border border-secondary-pearl hover:border-primary-gold"
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-20 bg-primary-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        layout
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredImages.map((image, index) => (
                                <motion.div
                                    key={image.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    onClick={() => setSelectedImage({ image, index })}
                                    className="relative group aspect-square rounded-xl overflow-hidden shadow-sm cursor-pointer border border-secondary-pearl"
                                >
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <span className="text-primary-gold text-[10px] font-bold uppercase tracking-widest mb-1 block">
                                                {image.category}
                                            </span>
                                            <p className="text-white text-base font-fraunces font-bold">
                                                {image.alt}
                                            </p>
                                        </div>
                                    </div>
                                    {image.before && (
                                        <div className="absolute top-4 right-4 bg-primary-gold text-primary-charcoal text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg z-20">
                                            Before & After
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {selectedImage && (
                    <Lightbox
                        image={{
                            src: selectedImage.image.src,
                            title: selectedImage.image.alt,
                        }}
                        onClose={() => setSelectedImage(null)}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />
                )}
            </AnimatePresence>

            {/* Instagram Feed */}
            <InstagramFeed />

            {/* Booking CTA */}
            <section className="py-24 bg-primary-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-primary-charcoal rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                        {/* Sparkle background elements */}
                        <div className="absolute top-10 right-10 w-20 h-20 bg-primary-gold/10 blur-xl rounded-full" />
                        <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary-gold/5 blur-2xl rounded-full" />

                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={viewportOptions}
                            variants={fadeInUp}
                            className="relative z-10 space-y-8"
                        >
                            <h2 className="font-fraunces text-4xl md:text-5xl font-bold text-white leading-tight">
                                Inspired by our work? <br />
                                <span className="text-primary-gold">Your story starts here.</span>
                            </h2>
                            <p className="text-secondary-rose/60 text-lg max-w-2xl mx-auto">
                                Every transformation begins with a conversation. Let&apos;s talk about what we can do for your hair.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6 pt-4">
                                <button className="h-16 px-10 bg-primary-gold text-primary-charcoal font-bold rounded-full hover:bg-[#B8944F] transition-colors shadow-xl">
                                    Book Appointment
                                </button>
                                <button className="h-16 px-10 border border-white/20 text-white font-bold rounded-full hover:bg-white hover:text-primary-charcoal transition-all">
                                    View All Services
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
