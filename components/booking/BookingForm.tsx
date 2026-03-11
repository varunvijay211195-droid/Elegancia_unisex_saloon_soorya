'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Scissors,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { services } from '@/lib/data/services';
import { team } from '@/lib/data/team';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

import { createBooking } from '@/lib/actions/booking';

type Step = 'service' | 'stylist' | 'datetime' | 'details' | 'confirm' | 'success';

export default function BookingForm() {
    const [step, setStep] = useState<Step>('service');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        service: '',
        stylist: '',
        date: '',
        time: '',
        name: '',
        email: '',
        phone: '',
        notes: '',
    });

    const searchParams = useSearchParams();

    useEffect(() => {
        const serviceSlug = searchParams.get('service');
        if (serviceSlug) {
            const exists = services.some(s => s.slug === serviceSlug);
            if (exists) {
                setFormData(prev => ({ ...prev, service: serviceSlug }));
                setStep('stylist'); // Skip to stylist selection if service is pre-selected
            }
        }
    }, [searchParams]);

    const steps: Step[] = ['service', 'stylist', 'datetime', 'details', 'confirm'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentIndex = steps.indexOf(step as any); // Cast because success isn't in steps progress

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        const selectedServiceData = services.find(s => s.slug === formData.service);

        try {
            const result = await createBooking({
                serviceId: formData.service,
                serviceName: selectedServiceData?.title || formData.service,
                date: formData.date,
                time: formData.time,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                notes: formData.notes,
            });

            if (result.success) {
                setStep('success');
            } else {
                setError(result.error || 'Failed to book appointment. Please try again.');
            }
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        if (step === 'confirm') {
            handleSubmit();
            return;
        }
        const nextIdx = currentIndex + 1;
        if (nextIdx < steps.length) setStep(steps[nextIdx]);
    };

    const prevStep = () => {
        if (step === 'success') return;
        const prevIdx = currentIndex - 1;
        if (prevIdx >= 0) setStep(steps[prevIdx]);
    };

    const isStepValid = () => {
        switch (step) {
            case 'service': return !!formData.service;
            case 'stylist': return !!formData.stylist;
            case 'datetime': return !!formData.date && !!formData.time;
            case 'details': return !!formData.name && !!formData.email && !!formData.phone;
            default: return true;
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-secondary-pearl">
            <div className="flex flex-col md:flex-row min-h-[600px]">
                {/* Progress Sidebar */}
                <div className="md:w-1/3 bg-primary-charcoal p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80')] bg-cover bg-center opacity-10 grayscale" />

                    <div className="relative z-10 space-y-12">
                        <div>
                            <h2 className="font-fraunces text-3xl font-bold mb-2">Book Your Visit</h2>
                            <p className="text-secondary-rose/60 text-sm">Follow the steps to secure your premium experience.</p>
                        </div>

                        <div className="space-y-6">
                            {steps.map((s, i) => (
                                <div key={s} className="flex items-center space-x-4">
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-500 border",
                                        currentIndex >= i
                                            ? "bg-primary-gold border-primary-gold text-primary-charcoal"
                                            : "bg-white/5 border-white/10 text-white/40"
                                    )}>
                                        {currentIndex > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                                    </div>
                                    <span className={cn(
                                        "text-sm font-bold tracking-widest uppercase transition-colors duration-500",
                                        currentIndex >= i ? "text-white" : "text-white/20"
                                    )}>
                                        {s}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Selection Summary */}
                        {formData.service && (
                            <div className="pt-12 border-t border-white/10 space-y-4">
                                <p className="text-[10px] font-bold text-primary-gold uppercase tracking-[0.2em]">Your Selection</p>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 text-sm">
                                        <Scissors className="w-4 h-4 text-primary-gold" />
                                        <span className="font-bold">{services.find(ser => ser.slug === formData.service)?.title}</span>
                                    </div>
                                    {formData.stylist && (
                                        <div className="flex items-center space-x-3 text-sm">
                                            <User className="w-4 h-4 text-primary-gold" />
                                            <span className="font-bold">{team.find(t => t.id.toString() === formData.stylist)?.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Content */}
                <div className="md:w-2/3 p-8 md:p-16 flex flex-col">
                    <div className="flex-grow">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-8"
                            >
                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5" />
                                        {error}
                                    </div>
                                )}

                                {/* Step Content */}
                                {step === 'success' && (
                                    <div className="space-y-8 text-center py-12">
                                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto">
                                            <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="font-fraunces text-3xl font-bold text-primary-charcoal">Booking Confirmed!</h3>
                                            <p className="text-secondary-label max-w-sm mx-auto">
                                                Thank you for booking with Elegancia Salon. We&apos;ve sent a confirmation email to {formData.email}.
                                            </p>
                                        </div>
                                        <Button asChild size="lg" className="w-full mt-8">
                                            <Link href="/">Back to Home</Link>
                                        </Button>
                                    </div>
                                )}

                                {step === 'service' && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="font-fraunces text-2xl font-bold text-primary-charcoal">Select Service</h3>
                                            <p className="text-secondary-label text-sm">Which transformation are we working on today?</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                            {services.map((s) => (
                                                <button
                                                    key={s.slug}
                                                    onClick={() => setFormData({ ...formData, service: s.slug })}
                                                    className={cn(
                                                        "w-full p-6 rounded-2xl border text-left transition-all group flex items-center justify-between",
                                                        formData.service === s.slug
                                                            ? "bg-primary-gold/5 border-primary-gold ring-1 ring-primary-gold"
                                                            : "bg-white border-secondary-pearl hover:border-primary-gold/50"
                                                    )}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                                            formData.service === s.slug ? "bg-primary-gold text-primary-charcoal" : "bg-primary-ivory text-secondary-rose"
                                                        )}>
                                                            <Scissors className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-primary-charcoal">{s.title}</p>
                                                            <p className="text-[10px] text-secondary-label uppercase font-bold tracking-widest">₹{s.startingPrice} • {s.duration}</p>
                                                        </div>
                                                    </div>
                                                    {formData.service === s.slug && <CheckCircle2 className="w-6 h-6 text-primary-gold" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {step === 'stylist' && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="font-fraunces text-2xl font-bold text-primary-charcoal">Choose Expert</h3>
                                            <p className="text-secondary-label text-sm">Our specialists are ready to bring your vision to life.</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                            {team.map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setFormData({ ...formData, stylist: t.id.toString() })}
                                                    className={cn(
                                                        "w-full p-4 rounded-2xl border text-left transition-all group flex items-center justify-between",
                                                        formData.stylist === t.id.toString()
                                                            ? "bg-primary-gold/5 border-primary-gold ring-1 ring-primary-gold"
                                                            : "bg-white border-secondary-pearl hover:border-primary-gold/50"
                                                    )}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="relative w-14 h-14 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                                            <Image src={t.image} alt={t.name} width={56} height={56} className="object-cover w-full h-full" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-primary-charcoal">{t.name}</p>
                                                            <p className="text-[10px] text-primary-gold uppercase font-bold tracking-widest">{t.role}</p>
                                                        </div>
                                                    </div>
                                                    {formData.stylist === t.id.toString() && <CheckCircle2 className="w-6 h-6 text-primary-gold" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {step === 'datetime' && (
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <h3 className="font-fraunces text-2xl font-bold text-primary-charcoal">Select Time</h3>
                                            <p className="text-secondary-label text-sm">Pick a date and time that suits your schedule.</p>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 gap-4">
                                                <label className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Appointment Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full h-16 px-6 bg-primary-ivory border border-secondary-pearl rounded-2xl font-bold focus:ring-2 focus:ring-primary-gold outline-none transition-all"
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                    value={formData.date}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Available Slots</label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {['10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '05:00 PM'].map((t) => (
                                                        <button
                                                            key={t}
                                                            onClick={() => setFormData({ ...formData, time: t })}
                                                            className={cn(
                                                                "h-14 rounded-xl border font-bold text-sm transition-all",
                                                                formData.time === t
                                                                    ? "bg-primary-gold border-primary-gold text-primary-charcoal shadow-lg"
                                                                    : "bg-white border-secondary-pearl text-secondary-slate hover:border-primary-gold"
                                                            )}
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 'details' && (
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <h3 className="font-fraunces text-2xl font-bold text-primary-charcoal">Personal Details</h3>
                                            <p className="text-secondary-label text-sm">Tell us how we can reach you.</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Full Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="E.g. Jane Doe"
                                                    className="w-full h-16 px-6 bg-primary-ivory border border-secondary-pearl rounded-2xl font-bold focus:ring-2 focus:ring-primary-gold outline-none transition-all"
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    value={formData.name}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Email Address</label>
                                                    <input
                                                        type="email"
                                                        placeholder="jane@example.com"
                                                        className="w-full h-16 px-6 bg-primary-ivory border border-secondary-pearl rounded-2xl font-bold focus:ring-2 focus:ring-primary-gold outline-none transition-all"
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        value={formData.email}
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        placeholder="+91 96055 50666"
                                                        className="w-full h-16 px-6 bg-primary-ivory border border-secondary-pearl rounded-2xl font-bold focus:ring-2 focus:ring-primary-gold outline-none transition-all"
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        value={formData.phone}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Special Notes (Optional)</label>
                                                <textarea
                                                    placeholder="Any specific requests or hair history..."
                                                    className="w-full h-32 p-6 bg-primary-ivory border border-secondary-pearl rounded-2xl font-bold focus:ring-2 focus:ring-primary-gold outline-none transition-all resize-none"
                                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                    value={formData.notes}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 'confirm' && (
                                    <div className="space-y-12 text-center py-12">
                                        <div className="w-24 h-24 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold mx-auto relative">
                                            <Sparkles className="w-12 h-12" />
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="absolute inset-0 rounded-full border-2 border-primary-gold/20"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="font-fraunces text-3xl font-bold text-primary-charcoal">All Set!</h3>
                                            <p className="text-secondary-label max-w-sm mx-auto">
                                                Review your appointment details and confirm to secure your slot.
                                            </p>
                                        </div>
                                        <div className="bg-primary-ivory rounded-3xl p-8 border border-secondary-pearl text-left space-y-4 max-w-sm mx-auto shadow-inner">
                                            <div className="flex justify-between items-center pb-4 border-b border-secondary-pearl/50">
                                                <span className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Service</span>
                                                <span className="font-bold text-primary-charcoal">{services.find(s => s.slug === formData.service)?.title}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-4 border-b border-secondary-pearl/50">
                                                <span className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Stylist</span>
                                                <span className="font-bold text-primary-charcoal">{team.find(t => t.id.toString() === formData.stylist)?.name}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-secondary-rose uppercase tracking-widest">Time</span>
                                                <span className="font-bold text-primary-charcoal">{formData.date} at {formData.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    {step !== 'success' && (
                        <div className="pt-12 border-t border-secondary-pearl flex items-center justify-between">
                            <button
                                onClick={prevStep}
                                className={cn(
                                    "h-14 px-8 rounded-xl font-bold flex items-center space-x-2 transition-all",
                                    step === 'service' ? "invisible" : "text-secondary-slate hover:text-primary-charcoal hover:bg-secondary-pearl/20"
                                )}
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span>Back</span>
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={!isStepValid() || isSubmitting}
                                className={cn(
                                    "h-14 px-10 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg",
                                    isStepValid() && !isSubmitting
                                        ? "bg-primary-charcoal text-white hover:bg-primary-gold hover:text-primary-charcoal"
                                        : "bg-secondary-pearl text-secondary-label cursor-not-allowed"
                                )}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>{step === 'confirm' ? 'Confirm Booking' : 'Next Step'}</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
