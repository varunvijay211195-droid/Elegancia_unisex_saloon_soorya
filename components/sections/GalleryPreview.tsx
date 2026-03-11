"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { galleryImages } from "@/lib/data/gallery";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeInUp, staggerContainer, viewportOptions } from "@/lib/animations";
import { cn } from "@/lib/utils";
import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";

export default function GalleryPreview() {
    const previewImages = galleryImages.slice(0, 5); // 5 images, 1 will be replaced by slider

    return (
        <section className="py-32 bg-primary-charcoal-premium">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="space-y-4">
                        <SectionHeader
                            subtitle="The Portfolio"
                            title="Slay of the Season"
                            align="left"
                            className="mb-0 md:mb-0 text-white"
                        />
                        <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-light">
                            Interactive lookbook of our signature transformations
                        </p>
                    </div>
                    <Button variant="outline" asChild className="glass-morphism text-white border-white/10 hover:bg-white/5 transition-all hidden md:flex h-14 px-8">
                        <Link href="/gallery">Explore Full Lookbook</Link>
                    </Button>
                </div>

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
                            beforeSrc="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                            afterSrc="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80"
                            beforeAlt="Dull Hair"
                            afterAlt="Radiant Gold Transformation"
                            className="h-full aspect-auto min-h-[500px]"
                        />
                    </motion.div>

                    {/* Bento Grid Gallery Items */}
                    {previewImages.map((image, idx) => (
                        <motion.div
                            key={image.id}
                            variants={fadeInUp}
                            className={cn(
                                "relative overflow-hidden rounded-2xl group cursor-pointer shadow-xl border border-white/5",
                                idx === 0 ? "md:col-span-2 lg:col-span-3 aspect-[16/9]" : "md:col-span-2 lg:col-span-3 aspect-square lg:aspect-auto h-full"
                            )}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-charcoal-premium/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-left">
                                <span className="text-primary-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {image.category}
                                </span>
                                <p className="text-white text-xl font-fraunces font-light translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                    {image.alt}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="mt-16 text-center md:hidden">
                    <Button variant="outline" asChild className="w-full h-16 glass-morphism text-white border-white/10">
                        <Link href="/gallery">View All Work</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
