"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeInUp, staggerContainer, viewportOptions } from "@/lib/animations";
import { Instagram, ExternalLink, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstaPost {
    id: string;
    post_url: string;
    image_url: string;
    caption: string;
    type: string;
}

export default function InstagramFeed() {
    const [posts, setPosts] = useState<InstaPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from("instagram_posts")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(12);

            if (data) setPosts(data);
            setIsLoading(false);
        };
        fetchPosts();
    }, []);

    if (isLoading) return null;

    return (
        <section className="py-32 bg-primary-charcoal relative overflow-hidden">
            {/* Subtle radial glow */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-gold/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8 text-center md:text-left">
                    <div className="max-w-xl">
                        <SectionHeader
                            subtitle="Social Proof"
                            title="As Seen on Instagram"
                            align="left"
                            className="text-white"
                        />
                        <p className="text-white/60 text-lg mt-4 font-light italic leading-relaxed">
                            "Real clients. Real results. Real vibes. Follow us @elegancia_unisex_salon for your daily dose of slay."
                        </p>
                    </div>

                    <a
                        href="https://www.instagram.com/elegancia_unisex_salon/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center gap-4 bg-white/5 hover:bg-primary-gold text-white hover:text-primary-charcoal px-10 py-5 rounded-2xl border border-white/10 transition-all duration-500 overflow-hidden"
                    >
                        <Instagram className="w-6 h-6 relative z-10" />
                        <span className="font-bold tracking-[0.2em] text-xs relative z-10">FOLLOW THE CREW</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-gold to-primary-gold/80 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                    </a>
                </div>

                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={viewportOptions}
                    variants={staggerContainer}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                >
                    {posts.map((post, idx) => (
                        <motion.div
                            key={post.id}
                            variants={fadeInUp}
                            className={cn(
                                "group relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-white/5 shadow-2xl",
                                idx === 1 || idx === 6 ? "md:row-span-2 md:h-full" : ""
                            )}
                        >
                            <Image
                                src={post.image_url}
                                alt="Instagram Post"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />

                            {/* Type Indicator */}
                            <div className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 z-10 opacity-60 group-hover:opacity-100 transition-opacity">
                                {post.type === 'reel' ? (
                                    <Play className="w-4 h-4 text-white fill-white" />
                                ) : (
                                    <Instagram className="w-4 h-4 text-white" />
                                )}
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-charcoal via-primary-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8">
                                <p className="text-white/90 text-sm md:text-base line-clamp-3 font-light leading-relaxed mb-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                    {post.caption || "Styling Excellence at Elegancia."}
                                </p>

                                <a
                                    href={post.post_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-primary-gold font-bold text-xs tracking-widest uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150 hover:text-white"
                                >
                                    VIEW POST <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
