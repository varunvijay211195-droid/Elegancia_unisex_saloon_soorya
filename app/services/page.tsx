"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getServices, DBService } from "@/lib/supabase/services";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer, viewportOptions } from "@/lib/animations";
import {
    Scissors,
    Sparkles,
    Clock,
    Palette,
    Crown,
    Zap,
    Wand2,
    Hand,
    Tag,
    Search,
    Filter,
    ChevronRight,
    Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
    Scissors, Sparkles, Palette, Crown, Zap, Wand2, Hand
};

export default function ServicesPage() {
    const [services, setServices] = useState<DBService[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchServices() {
            try {
                const data = await getServices();
                setServices(data || []);
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchServices();
    }, []);

    const categories = ["all", ...Array.from(new Set(services.map(s => s.category)))];

    const filteredServices = services.filter(service => {
        const matchesCategory = activeCategory === "all" || service.category === activeCategory;
        const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.short_desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#0A0A0B]">
            {/* Immersive Header */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary-gold/10 via-transparent to-transparent opacity-50" />
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] aspect-square rounded-full bg-primary-gold/5 blur-[120px] animate-pulse" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-gold/10 text-primary-gold border border-primary-gold/20">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Crafting Confidence Since 2018</span>
                        </div>
                        <h1 className="font-fraunces text-6xl md:text-8xl font-bold text-white tracking-tight">
                            The <span className="text-primary-gold italic">Rituals</span> Menu
                        </h1>
                        <p className="text-white/40 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                            Discover a curated collection of artisanal hair and beauty experiences.
                            Where precision meets passion.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Interactive Filters & Search */}
            <section className="sticky top-20 z-40 bg-[#0A0A0B]/80 backdrop-blur-2xl border-y border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Category Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar w-full md:w-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border",
                                    activeCategory === cat
                                        ? "bg-primary-gold border-primary-gold text-primary-charcoal shadow-lg shadow-primary-gold/20"
                                        : "bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:bg-white/10"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary-gold transition-colors" />
                        <input
                            type="text"
                            placeholder="Find your ritual..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary-gold/50 focus:ring-1 focus:ring-primary-gold/20 transition-all font-medium"
                        />
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 flex-grow">
                <div className="max-w-7xl mx-auto px-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-40 space-y-4">
                            <Loader2 className="w-12 h-12 text-primary-gold animate-spin" />
                            <p className="text-[10px] uppercase font-bold tracking-widest text-primary-gold/40 animate-pulse">Summoning Perfection...</p>
                        </div>
                    ) : filteredServices.length > 0 ? (
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredServices.map((service) => {
                                const Icon = iconMap[service.icon] || Scissors;

                                return (
                                    <motion.div key={service.id} variants={fadeInUp} className="group">
                                        <Card className="h-full bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden hover:border-primary-gold/30 transition-all duration-700 relative">
                                            {/* Top Image Preview */}
                                            <div className="relative h-72 w-full overflow-hidden">
                                                <Image
                                                    src={service.image_url}
                                                    alt={service.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-all duration-1000 brightness-75 group-hover:brightness-100"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-60" />

                                                {/* Floating Icon */}
                                                <div className="absolute top-6 left-6 z-20">
                                                    <div className="w-14 h-14 bg-[#0A0A0B]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-primary-gold transition-colors duration-500">
                                                        <Icon className="w-6 h-6 text-primary-gold group-hover:text-primary-charcoal transition-colors duration-500" />
                                                    </div>
                                                </div>

                                                {service.is_stylists_choice && (
                                                    <motion.div
                                                        animate={{
                                                            boxShadow: ["0 0 0px rgba(212, 175, 55, 0)", "0 0 20px rgba(212, 175, 55, 0.4)", "0 0 0px rgba(212, 175, 55, 0)"]
                                                        }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="absolute top-6 right-6 bg-gradient-to-r from-primary-gold via-[#FFD700] to-primary-gold text-primary-charcoal text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl z-20 shadow-2xl flex items-center gap-2 overflow-hidden"
                                                    >
                                                        <motion.div
                                                            animate={{ x: ["-100%", "200%"] }}
                                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                            className="absolute inset-0 bg-white/30 skew-x-12"
                                                        />
                                                        <Zap className="w-3 h-3 animate-pulse" />
                                                        Stylist&apos;s Choice
                                                    </motion.div>
                                                )}

                                                {service.tag && !service.is_stylists_choice && (
                                                    <span className="absolute top-6 right-6 bg-primary-gold text-primary-charcoal text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-2 rounded-xl z-20 shadow-2xl">
                                                        {service.tag}
                                                    </span>
                                                )}
                                            </div>

                                            <CardContent className="p-8 space-y-6 relative z-10">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[9px] uppercase tracking-[0.3em] font-black text-primary-gold/60">{service.category}</span>
                                                        <div className="flex items-center gap-2 text-white/40">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">{service.duration}</span>
                                                        </div>
                                                    </div>
                                                    <h3 className="font-fraunces text-3xl font-bold text-white group-hover:text-primary-gold transition-colors duration-500 leading-tight">
                                                        {service.title}
                                                    </h3>
                                                    <p className="text-white/40 text-sm leading-relaxed font-light line-clamp-3 italic">
                                                        &ldquo;{service.short_desc}&rdquo;
                                                    </p>
                                                </div>

                                                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Starting From</p>
                                                        <p className="text-2xl font-bold text-white tracking-tight">₹{service.starting_price}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button asChild variant="outline" className="border-white/10 hover:bg-white/5 h-12 w-12 p-0 rounded-2xl group/btn">
                                                            <Link href={`/services/${service.slug}`}>
                                                                <ChevronRight className="w-5 h-5 text-white group-hover/btn:text-primary-gold transition-colors" />
                                                            </Link>
                                                        </Button>
                                                        <Button asChild className="h-12 px-6 rounded-2xl bg-white text-[#0A0A0B] hover:bg-primary-gold hover:text-primary-charcoal font-bold tracking-widest text-[10px] border-none">
                                                            <Link href={`/book?service=${service.slug}`}>BOOK NOW</Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <div className="py-40 text-center space-y-6">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                                <Filter className="w-8 h-8 text-white/20" />
                            </div>
                            <h3 className="font-fraunces text-3xl font-bold text-white">No Rituals Found</h3>
                            <p className="text-white/40 max-w-sm mx-auto italic">We couldn&apos;t find any sessions matching your search or category filter.</p>
                            <Button onClick={() => { setActiveCategory("all"); setSearchQuery(""); }} variant="outline" className="mt-8 border-primary-gold/20 text-primary-gold hover:bg-primary-gold hover:text-primary-charcoal">
                                Reset Filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Luxury CTA */}
            <section className="py-32 relative overflow-hidden bg-primary-gold group">
                <div className="absolute inset-0 bg-[#0A0A0B] translate-y-full group-hover:translate-y-0 transition-transform duration-1000 ease-in-out" />
                <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10 transition-colors duration-1000 group-hover:text-white text-primary-charcoal">
                    <h2 className="font-fraunces text-5xl md:text-7xl font-bold leading-tight">
                        Still seeking your <br />
                        <span className="italic font-light">Perfect Ritual?</span>
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto font-medium opacity-80">
                        Our master stylists offer bespoke consultations to craft a unique identity just for you.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 pt-4">
                        <Button size="lg" asChild className="h-16 px-12 bg-primary-charcoal text-white hover:bg-white hover:text-primary-charcoal border-none rounded-2xl tracking-[0.2em] uppercase text-[11px] font-black group-hover:bg-primary-gold group-hover:text-primary-charcoal shadow-2xl transition-all">
                            <Link href="/book">Schedule a Consultation</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
