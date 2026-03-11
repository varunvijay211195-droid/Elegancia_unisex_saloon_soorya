"use client";

import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getServiceBySlug } from "@/lib/data/services";
import { Button } from "@/components/ui/Button";
import { Scissors, Sparkles, Flower2, Heart, Star, Smile, Clock, Palette, Crown, Zap, Wand2, Hand } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function ServiceDetail() {
    const params = useParams();
    const slug = params.slug as string;
    const service = getServiceBySlug(slug);

    if (!service) {
        notFound();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const iconMap: Record<string, any> = { Scissors, Sparkles, Flower2, Heart, Star, Smile, Clock, Palette, Crown, Zap, Wand2, Hand };
    const Icon = iconMap[service.icon] || Scissors;

    return (
        <div className="flex flex-col w-full">
            {/* Product Hero */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover z-0 grayscale-[20%]"
                />
                <div className="absolute inset-0 bg-primary-charcoal/60 z-10" />

                <div className="max-w-7xl mx-auto px-6 relative z-20 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex w-20 h-20 bg-primary-gold rounded-full items-center justify-center shadow-2xl mb-4">
                            <Icon className="w-10 h-10 text-primary-charcoal" />
                        </div>
                        <h1 className="font-fraunces text-5xl md:text-7xl font-bold">
                            {service.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-sm font-bold tracking-widest uppercase">
                            <span className="text-primary-gold">{service.duration}</span>
                            <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                            <span>Starting from ₹{service.startingPrice}</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Detail Content */}
            <section className="py-24 bg-primary-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16">

                    {/* Main Info */}
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        variants={staggerContainer}
                        className="lg:col-span-2 space-y-12"
                    >
                        <motion.div variants={fadeInUp} className="space-y-6">
                            <h2 className="font-fraunces text-4xl font-bold text-primary-charcoal">
                                Experience the transformation
                            </h2>
                            <p className="text-lg text-secondary-slate leading-relaxed">
                                {service.longDesc}
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="space-y-8">
                            <h3 className="font-fraunces text-2xl font-bold text-primary-charcoal border-b border-secondary-pearl pb-4">
                                What&apos;s included
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {service.subServices.map((sub, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-primary-ivory rounded-xl border border-secondary-pearl">
                                        <div className="w-2 h-2 rounded-full bg-primary-gold" />
                                        <span className="font-bold text-primary-charcoal text-sm">{sub}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="p-8 bg-primary-charcoal rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-2 text-center md:text-left">
                                <h4 className="font-fraunces text-2xl font-bold">Ready to book?</h4>
                                <p className="text-secondary-rose/60">Secure your session now via our online system or WhatsApp.</p>
                            </div>
                            <div className="flex gap-4">
                                <Button size="lg" asChild>
                                    <Link href="/book">Book Online</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Sidebar / Info Card */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="bg-primary-ivory p-8 rounded-3xl border border-secondary-pearl space-y-8 sticky top-28"
                        >
                            <div className="space-y-4">
                                <h4 className="font-fraunces text-xl font-bold text-primary-charcoal underline underline-offset-8 decoration-primary-gold/30">
                                    Service Details
                                </h4>
                                <ul className="space-y-4 pt-4">
                                    <li className="flex items-center justify-between text-sm">
                                        <span className="text-secondary-slate uppercase tracking-widest font-bold text-[10px]">Avg. Duration</span>
                                        <span className="font-bold text-primary-charcoal">{service.duration}</span>
                                    </li>
                                    <li className="flex items-center justify-between text-sm">
                                        <span className="text-secondary-slate uppercase tracking-widest font-bold text-[10px]">Price starts at</span>
                                        <span className="font-bold text-primary-charcoal">₹{service.startingPrice}</span>
                                    </li>
                                    <li className="flex items-center justify-between text-sm">
                                        <span className="text-secondary-slate uppercase tracking-widest font-bold text-[10px]">Availability</span>
                                        <span className="font-bold text-green-600">Now Booking</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-secondary-pearl">
                                <h4 className="font-fraunces text-xl font-bold text-primary-charcoal">
                                    Our Guarantee
                                </h4>
                                <p className="text-xs text-secondary-slate leading-relaxed italic">
                                    &quot;If you aren&apos;t completely satisfied with your transformation, we will make it right. That is our promise.&quot;
                                </p>
                            </div>

                            <Button variant="outline" size="lg" className="w-full border-primary-charcoal text-primary-charcoal hover:bg-primary-charcoal hover:text-white" asChild>
                                <Link href="/services">Back to all services</Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
