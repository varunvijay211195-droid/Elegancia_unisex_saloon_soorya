import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Phone, Mail, MapPin, Sparkles } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary-charcoal-premium text-white pt-32 pb-12 border-t border-white/5 relative overflow-hidden">
            {/* Ambient Background Element */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-gold/5 rounded-full blur-[100px] -z-0" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">

                    {/* Column 1: Brand */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="relative w-12 h-12">
                                <Image
                                    src="/images/logo.png"
                                    alt="Elegancia Logo"
                                    fill
                                    className="object-contain mix-blend-screen"
                                />
                            </div>
                            <span className="font-fraunces text-3xl font-light tracking-tighter">Elegancia</span>
                        </Link>
                        <p className="text-white/50 leading-relaxed text-sm font-light italic">
                            &quot;Where Elegance Meets Style.&quot; <br />
                            Kerala&apos;s premier unisex salon for hair rituals and bridal makeovers.
                        </p>
                        <div className="flex gap-6">
                            {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
                                <a
                                    href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/40 hover:text-primary-gold transition-colors"
                                    title="Instagram"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {process.env.NEXT_PUBLIC_FACEBOOK_URL && (
                                <a
                                    href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/40 hover:text-primary-gold transition-colors"
                                    title="Facebook"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL && (
                                <a
                                    href={process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/40 hover:text-primary-gold transition-colors"
                                    title="Google Reviews"
                                >
                                    <Sparkles className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Column 2: The Rituals */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-gold">The Rituals</h4>
                        <ul className="space-y-4 text-sm text-white/40 font-light">
                            <li><Link href="/services/haircuts-styling" className="hover:text-white transition-colors">Hair Mastery</Link></li>
                            <li><Link href="/services/bridal-styling" className="hover:text-white transition-colors">Bridal Couture</Link></li>
                            <li><Link href="/services/skin-care" className="hover:text-white transition-colors">Skin Alchemy</Link></li>
                            <li><Link href="/book" className="text-primary-gold hover:text-white transition-colors flex items-center gap-2">
                                Reserve Session <span className="w-4 h-[1px] bg-primary-gold" />
                            </Link></li>
                        </ul>
                    </div>

                    {/* Column 3: The Ateliers */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-gold">The Atelier</h4>
                        <ul className="space-y-6 text-sm text-white/40 font-light">
                            <li className="flex gap-4">
                                <MapPin className="w-5 h-5 text-primary-gold flex-shrink-0" />
                                <span>
                                    Near More Super Market,<br />
                                    Kesavanpady, Amballur,<br />
                                    Ernakulam 682305
                                </span>
                            </li>
                            <li className="flex gap-4">
                                <Phone className="w-5 h-5 text-primary-gold flex-shrink-0" />
                                <span>+91 96055 50666</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-gold">Bespoke Updates</h4>
                        <p className="text-sm text-white/40 font-light leading-relaxed">
                            Join our inner circle for seasonal style reports and VIP early access.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email"
                                className="bg-white/5 border border-white/10 rounded-full px-5 py-3 text-xs w-full focus:outline-none focus:border-primary-gold/50 transition-colors"
                            />
                            <button
                                type="submit"
                                className="bg-white/10 hover:bg-primary-gold hover:text-primary-charcoal transition-all p-3 rounded-full flex items-center justify-center border border-white/10"
                            >
                                <Sparkles className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                        © {new Date().getFullYear()} Elegancia Unisex Salon & Makeover Studio
                    </p>
                    <div className="flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] text-white/20">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
