"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Calendar,
    Scissors,
    Image as ImageIcon,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Sparkles
} from "lucide-react";
import Image from "next/image";
import NotificationCenter from "@/components/admin/NotificationCenter";
import { User } from "lucide-react";

const sidebarLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Editor Suite", href: "/admin/content", icon: ImageIcon },
    { name: "Clients", href: "/admin/clients", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white flex">
            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 bg-[#0F0F10] border-r border-white/5 
                    transition-all duration-500 ease-in-out
                    ${isSidebarOpen ? "w-72" : "w-20"}
                    hidden lg:flex flex-col
                `}
            >
                {/* Sidebar Header */}
                <div className="h-24 flex items-center px-6 mb-8 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-3 overflow-hidden">
                        <div className="relative w-10 h-10 flex-shrink-0">
                            <Image
                                src="/images/logo.png"
                                alt="Elegancia Logo"
                                fill
                                className="object-contain mix-blend-screen"
                            />
                        </div>
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-fraunces text-2xl font-light tracking-tighter"
                            >
                                Elegancia
                            </motion.span>
                        )}
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-2">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`
                                    flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group relative
                                    ${isActive
                                        ? "bg-primary-gold text-primary-charcoal shadow-lg shadow-primary-gold/20"
                                        : "text-white/40 hover:text-white hover:bg-white/5"}
                                `}
                            >
                                <Icon className={`w-6 h-6 ${isActive ? "text-primary-charcoal" : "group-hover:text-primary-gold transition-colors"}`} />
                                {isSidebarOpen && (
                                    <span className="font-medium tracking-tight whitespace-nowrap">{link.name}</span>
                                )}
                                {isActive && !isSidebarOpen && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-gold rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-white/5">
                    <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all">
                        <LogOut className="w-6 h-6" />
                        {isSidebarOpen && <span className="font-medium tracking-tight">Sign Out</span>}
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="mt-4 w-full flex items-center justify-center p-2 text-white/20 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main
                className="flex-1 transition-all duration-500"
                style={{ paddingLeft: isSidebarOpen ? '18rem' : '5rem' }}
            >
                {/* Admin Header Bar */}
                <header className="h-24 border-b border-white/5 px-10 flex items-center justify-between sticky top-0 bg-[#0A0A0B]/80 backdrop-blur-xl z-40">
                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Operational: Horizon-1</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <NotificationCenter />
                        <div className="h-8 w-px bg-white/5" />
                        <button className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                            <div className="w-8 h-8 rounded-xl bg-primary-gold flex items-center justify-center text-primary-charcoal font-bold text-xs shadow-lg shadow-primary-gold/10">
                                AD
                            </div>
                            <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">Administrator</span>
                        </button>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto p-6 md:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
