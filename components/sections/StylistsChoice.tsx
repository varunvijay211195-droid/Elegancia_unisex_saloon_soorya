'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ArrowRight, Scissors, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/lib/data/services';
import { Button } from '@/components/ui/Button';

export default function StylistsChoice() {
    const featured = services.find(s => s.isStylistsChoice) || services[0];

    return (
        <section className="py-24 relative overflow-hidden bg-[#0A0A0B]">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl aspect-video bg-primary-gold/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left side: Visuals */}
                    <div className="w-full lg:w-1/2 relative group">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10"
                        >
                            <Image
                                src={featured.image}
                                alt={featured.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                            />
                            {/* Premium Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-80" />

                            {/* Animated Tag */}
                            <motion.div
                                animate={{ boxShadow: ["0 0 0px rgba(212,175,55,0)", "0 0 30px rgba(212,175,55,0.4)", "0 0 0px rgba(212,175,55,0)"] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute top-8 left-8 bg-gradient-to-r from-primary-gold via-[#FFD700] to-primary-gold text-primary-charcoal px-6 py-3 rounded-2xl flex items-center gap-3 overflow-hidden shadow-2xl z-30"
                            >
                                <motion.div
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-white/40 skew-x-[30deg]"
                                />
                                <Zap className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Stylist&apos;s Choice</span>
                            </motion.div>
                        </motion.div>

                        {/* Floating elements for depth */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-8 -right-8 w-48 h-48 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-6 flex flex-col justify-center gap-2 shadow-2xl z-20"
                        >
                            <div className="flex items-center gap-2 text-primary-gold">
                                <Clock className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{featured.duration}</span>
                            </div>
                            <h4 className="font-fraunces text-xl text-white">Precise Ritual</h4>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest leading-relaxed">Booked 24 times this week</p>
                        </motion.div>
                    </div>

                    {/* Right side: Content */}
                    <div className="w-full lg:w-1/2 space-y-10">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 mb-2"
                            >
                                <Sparkles className="w-4 h-4 text-primary-gold" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Weekly Feature</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="font-fraunces text-5xl md:text-7xl font-bold text-white leading-tight"
                            >
                                The Signature <br />
                                <span className="text-primary-gold italic">{featured.title}</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-white/40 text-lg md:text-xl font-light leading-relaxed max-w-lg italic"
                            >
                                &ldquo;{featured.longDesc}&rdquo;
                            </motion.p>
                        </div>

                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                            {featured.subServices.slice(0, 4).map((sub, i) => (
                                <motion.li
                                    key={sub}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-center gap-3 group/item cursor-default"
                                >
                                    <div className="w-2 h-2 rounded-full bg-primary-gold/40 group-hover/item:bg-primary-gold transition-colors" />
                                    <span className="text-white/60 text-sm group-hover/item:text-white transition-colors">{sub}</span>
                                </motion.li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                            <Button asChild size="lg" className="h-16 px-10 bg-white text-primary-charcoal hover:bg-primary-gold rounded-2xl group w-full sm:w-auto">
                                <Link href={`/book?service=${featured.slug}`} className="flex items-center gap-3">
                                    <span className="font-black uppercase tracking-[0.2em] text-[11px]">Experience Now</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>

                            <div className="flex flex-col items-center sm:items-start">
                                <span className="text-[10px] uppercase tracking-widest text-white/20 mb-1">Ritual Value</span>
                                <span className="text-2xl font-bold text-white tracking-tight">₹{featured.startingPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
