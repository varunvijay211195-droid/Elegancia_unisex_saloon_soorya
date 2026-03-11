'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Sparkles, Loader2 } from 'lucide-react';
import BookingForm from '@/components/booking/BookingForm';

export default function BookPage() {
    return (
        <div className="flex flex-col w-full min-h-screen">
            {/* Background Decor */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-primary-gold/5 blur-[120px]" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[40%] aspect-square rounded-full bg-secondary-rose/5 blur-[100px]" />
            </div>

            {/* Header Section */}
            <section className="relative z-10 pt-32 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-gold/10 text-primary-gold border border-primary-gold/20">
                            <Calendar className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Your Experience</span>
                        </div>
                        <h1 className="font-fraunces text-5xl md:text-7xl font-bold text-primary-charcoal leading-tight">
                            Reserve Your <br />
                            <span className="text-secondary-label font-normal italic">Transformation</span>
                        </h1>
                        <p className="text-secondary-slate text-lg max-w-2xl mx-auto leading-relaxed">
                            Step into the Elegancia world. Select your service, find your perfect stylist,
                            and begin your journey to a more confident you.
                        </p>
                    </motion.div>

                    {/* Quick Stats/Trust markers */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="flex flex-wrap justify-center items-center gap-8 pt-6"
                    >
                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-primary-gold" />
                            <span className="text-xs font-bold text-secondary-label uppercase tracking-widest">Instant Confirmation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-primary-gold" />
                            <span className="text-xs font-bold text-secondary-label uppercase tracking-widest">Premium Care Guaranteed</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Booking Form Section */}
            <section className="relative z-10 pb-32 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <Suspense fallback={<div className="h-60 flex items-center justify-center"><Loader2 className="animate-spin text-primary-gold" /></div>}>
                        <BookingForm />
                    </Suspense>
                </motion.div>
            </section>

            {/* Help Section */}
            <section className="relative z-10 py-24 bg-primary-ivory border-t border-secondary-pearl">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="space-y-6">
                        <h2 className="font-fraunces text-3xl font-bold text-primary-charcoal">Need Assistance?</h2>
                        <p className="text-secondary-slate text-lg">
                            If you&apos;re unsure about a service or need a last-minute appointment, our team is here to help.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 pt-4">
                            <a href="tel:+919605550666" className="flex items-center space-x-3 text-primary-charcoal font-bold hover:text-primary-gold transition-colors">
                                <span className="w-12 h-12 rounded-full bg-white border border-secondary-pearl flex items-center justify-center">📞</span>
                                <span>Call Us Directly</span>
                            </a>
                            <a href="https://wa.me/919605550666" className="flex items-center space-x-3 text-primary-charcoal font-bold hover:text-primary-gold transition-colors">
                                <span className="w-12 h-12 rounded-full bg-white border border-secondary-pearl flex items-center justify-center">💬</span>
                                <span>Chat via WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
