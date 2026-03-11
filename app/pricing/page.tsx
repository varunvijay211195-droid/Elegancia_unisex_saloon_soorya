"use client";

import { motion } from "framer-motion";
import { pricingTable, memberships } from "@/lib/data/pricing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeInUp, staggerContainer, viewportOptions } from "@/lib/animations";
import { Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PricingPage() {
    return (
        <div className="flex flex-col w-full pb-20">
            {/* Page Header */}
            <section className="bg-primary-charcoal py-20 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80')] bg-cover bg-center grayscale" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="font-fraunces text-5xl md:text-6xl font-bold text-white mb-6">
                            Our <span className="text-primary-gold">Pricing</span>
                        </h1>
                        <p className="text-secondary-rose/60 text-lg max-w-2xl mx-auto">
                            Transparent pricing for world-class care. Choose between single
                            appointments or join our membership for exclusive benefits.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Memberships */}
            <section className="py-24 bg-primary-ivory">
                <div className="max-w-7xl mx-auto px-6">
                    <SectionHeader
                        subtitle="The Club"
                        title="Membership Tiers"
                        align="center"
                    />

                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={viewportOptions}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {memberships.map((tier) => (
                            <motion.div key={tier.tier} variants={fadeInUp}>
                                <Card className={cn(
                                    "h-full flex flex-col relative overflow-hidden transition-all duration-500",
                                    tier.popular
                                        ? "border-primary-gold shadow-2xl scale-105 z-10 bg-white"
                                        : "border-secondary-pearl bg-white/50"
                                )}>
                                    {tier.popular && (
                                        <div className="absolute top-0 right-0 bg-primary-gold text-primary-charcoal text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-bl-xl z-20">
                                            Most Popular
                                        </div>
                                    )}

                                    <CardHeader className="p-8 pb-4 text-center">
                                        <CardDescription className="uppercase tracking-[0.2em] font-bold text-primary-gold mb-2">
                                            {tier.subtitle}
                                        </CardDescription>
                                        <CardTitle className="text-4xl font-fraunces text-primary-charcoal">
                                            {tier.tier}
                                        </CardTitle>
                                        <div className="mt-6 flex items-baseline justify-center gap-1">
                                            <span className="text-2xl font-bold text-primary-charcoal">₹</span>
                                            <span className="text-5xl font-bold text-primary-charcoal tracking-tight">{tier.price}</span>
                                            <span className="text-secondary-slate text-sm font-medium">/{tier.period.split('per ')[1]}</span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-8 flex-grow">
                                        <ul className="space-y-4">
                                            {tier.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-secondary-slate">
                                                    <Check className="w-5 h-5 text-primary-gold flex-shrink-0 mt-0.5" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>

                                    <CardFooter className="p-8 pt-0">
                                        <Button
                                            variant={tier.popular ? "primary" : "outline"}
                                            className={cn("w-full h-14 font-bold text-base", !tier.popular && "border-primary-charcoal text-primary-charcoal")}
                                            asChild
                                        >
                                            <Link href="/book">{tier.cta}</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Full Price List */}
            <section className="py-24 bg-primary-white">
                <div className="max-w-5xl mx-auto px-6">
                    <SectionHeader
                        subtitle="Full Menu"
                        title="Service Price List"
                        align="center"
                    />

                    <div className="space-y-12">
                        {pricingTable.map((category, idx) => (
                            <motion.div
                                key={category.category}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={viewportOptions}
                                transition={{ delay: idx * 0.1 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-6">
                                    <h3 className="font-fraunces text-2xl font-bold text-primary-charcoal whitespace-nowrap">
                                        {category.category}
                                    </h3>
                                    <div className="h-0.5 w-full bg-secondary-pearl rounded-full" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                    {category.items.map((item, i) => (
                                        <div key={i} className="flex items-end justify-between group">
                                            <div className="space-y-1">
                                                <span className="font-bold text-primary-charcoal group-hover:text-primary-gold transition-colors">
                                                    {item.name}
                                                </span>
                                                {item.note && (
                                                    <div className="flex items-center gap-1.5 text-[10px] text-secondary-slate uppercase tracking-wider font-medium">
                                                        <Info className="w-3 h-3 text-primary-gold" /> {item.note}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow border-b border-dotted border-secondary-pearl mx-4 mb-1.5 opacity-50" />
                                            <span className="font-fraunces font-bold text-primary-charcoal">
                                                ₹{item.price}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 p-8 bg-primary-ivory rounded-3xl border border-secondary-pearl text-center">
                        <p className="text-secondary-slate italic">
                            * Final prices may vary based on hair length, texture, and technical complexity.
                            Consultation is always free of charge.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
