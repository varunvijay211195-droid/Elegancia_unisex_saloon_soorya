"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Calendar,
    Scissors,
    TrendingUp,
    Users,
    Sparkles,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    XCircle,
    MoreHorizontal
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { format, isToday, isThisWeek } from "date-fns";
import Link from "next/link";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const stagger = {
    animate: { transition: { staggerChildren: 0.1 } }
};

export default function DashboardPage() {
    const [stats, setStats] = React.useState({
        revenue: 0,
        rituals: 0,
        pending: 0,
        clients: 0,
        newClients: 0
    });
    const [dailyRituals, setDailyRituals] = React.useState<any[]>([]);
    const [liveActivity, setLiveActivity] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const supabase = createClient();

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            // 1. Fetch Bookings
            const { data: bookings } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

            // 2. Fetch Profiles (Clients)
            const { data: profiles } = await supabase
                .from('profiles')
                .select('*');

            // 3. Fetch Notifications (Activity)
            const { data: notifications } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (bookings && profiles) {
                const todayBookings = bookings.filter(b => isToday(new Date(b.date)));
                const completedToday = todayBookings.filter(b => b.status === 'completed');

                // Calculate revenue (assuming total_price exists, fallback to 500 for demo)
                const revenue = completedToday.reduce((sum, b) => sum + (Number(b.total_price) || 500), 0);

                const weekProfiles = profiles.filter(p => isThisWeek(new Date(p.created_at)));

                setStats({
                    revenue,
                    rituals: bookings.length,
                    pending: bookings.filter(b => b.status === 'pending').length,
                    clients: profiles.length,
                    newClients: weekProfiles.length
                });

                // Set today's rituals for the feed
                setDailyRituals(todayBookings.slice(0, 5));
            }

            if (notifications) {
                setLiveActivity(notifications);
            }

            setIsLoading(false);
        };

        fetchDashboardData();

        // Real-time subscription
        const channel = supabase
            .channel('dashboard_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchDashboardData)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-primary-gold border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="font-fraunces text-4xl font-bold bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                        Command <span className="text-primary-gold">Center</span>
                    </h1>
                    <p className="text-white/40 mt-2 italic font-light">Elegancia's Business Pulse • {format(new Date(), 'MMMM d, yyyy')}</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 px-4 backdrop-blur-xl">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <span className="text-sm font-medium tracking-tight text-white/60">Live Management Active</span>
                </div>
            </div>

            {/* Top Row: Business Pulse Stats */}
            <motion.div
                initial="initial"
                animate="animate"
                variants={stagger}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {[
                    { label: "Today's Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, change: "Live", color: "text-green-400" },
                    { label: "Total Rituals", value: stats.rituals.toString(), icon: Scissors, change: `${stats.pending} Pending`, color: "text-primary-gold" },
                    { label: "Total Clients", value: stats.clients.toString(), icon: Users, change: `+${stats.newClients} this week`, color: "text-blue-400" },
                    { label: "Active Channels", value: "3", icon: Sparkles, change: "Web, App, Walk-in", color: "text-purple-400" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={fadeInUp}
                        className="bg-white/5 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-[#1A1A1B] border border-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-primary-gold transition-colors">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-xs font-bold font-mono tracking-tighter ${stat.color} bg-white/5 px-3 py-1 rounded-full uppercase`}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-xs uppercase tracking-[0.2em] font-bold text-white/30 mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-fraunces font-bold text-white">{stat.value}</h3>
                    </motion.div>
                ))}
            </motion.div>

            {/* Bento Grid: Main Content Tiles */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Large Tile: Daily Rituals Feed */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="lg:col-span-8 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl relative overflow-hidden group min-h-[400px]"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-gold/5 rounded-full blur-[80px] -z-10 group-hover:bg-primary-gold/10 transition-colors duration-700" />

                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-gold rounded-2xl flex items-center justify-center text-primary-charcoal">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h2 className="font-fraunces text-2xl font-bold text-white">Daily Rituals</h2>
                        </div>
                        <Link href="/admin/bookings" className="text-xs uppercase tracking-widest font-bold text-white/40 hover:text-primary-gold transition-colors underline decoration-primary-gold/20 underline-offset-8">
                            View All Bookings
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {dailyRituals.length > 0 ? dailyRituals.map((ritual) => (
                            <div key={ritual.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl group/item hover:bg-white/10 transition-all cursor-pointer gap-4">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center text-white/60 font-fraunces text-xl border border-white/10">
                                            {ritual.customer_name?.[0] || 'A'}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#0A0A0B] ${ritual.status === 'completed' ? 'bg-blue-500' :
                                            ritual.status === 'confirmed' ? 'bg-green-500' :
                                                ritual.status === 'cancelled' ? 'bg-red-500' : 'bg-primary-gold'
                                            }`} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white group-hover/item:text-primary-gold transition-colors">{ritual.customer_name}</h4>
                                        <p className="text-xs text-white/30 uppercase tracking-widest font-bold mt-1 flex flex-wrap items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-primary-gold rounded-full" /> {ritual.service_name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 justify-between sm:justify-end">
                                    <div className="text-right flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0 mt-4 sm:mt-0">
                                        <div className="text-sm font-fraunces font-bold text-white flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-primary-gold" /> {ritual.booking_time}
                                        </div>
                                    </div>
                                    <Link href="/admin/bookings" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:bg-white/10 hover:text-white transition-all">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12 text-white/20 italic font-medium">
                                No rituals scheduled for today yet.
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Right Column: Live Feed & Insights */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Live Ticker Tile */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <h3 className="font-fraunces text-xl font-bold text-white tracking-tight">Live Activity</h3>
                        </div>

                        <div className="space-y-8 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-5 top-0 bottom-0 w-px bg-white/5" />

                            {liveActivity.length > 0 ? liveActivity.map((item) => (
                                <div key={item.id} className="flex gap-6 relative z-10 group">
                                    <div className={`w-10 h-10 bg-[#0A0A0B] border rounded-xl flex flex-shrink-0 items-center justify-center transition-colors
                                        ${item.type === 'reward' ? 'border-primary-gold/30 text-primary-gold group-hover:bg-primary-gold/10' :
                                            item.type === 'booking_new' ? 'border-blue-500/30 text-blue-400 group-hover:bg-blue-500/10' :
                                                'border-white/10 text-white/40 group-hover:bg-white/5'}`}
                                    >
                                        {item.type === 'reward' ? <Sparkles className="w-4 h-4" /> :
                                            item.type === 'booking_new' ? <Calendar className="w-4 h-4" /> :
                                                <Clock className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 mt-1">
                                        <p className="text-sm font-bold text-white group-hover:text-primary-gold transition-colors">{item.title}</p>
                                        <p className="text-xs font-medium text-white/40 leading-tight mt-1 truncate">{item.message}</p>
                                        <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold mt-2 block">
                                            {format(new Date(item.created_at), 'hh:mm a')}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-6 text-white/20 italic text-sm">Waiting for transmissions...</div>
                            )}
                        </div>
                    </motion.div>

                    {/* Quick Launch Tile */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-primary-gold text-primary-charcoal rounded-[2.5rem] p-8 shadow-2xl shadow-primary-gold/10 group cursor-pointer overflow-hidden relative"
                    >
                        {/* Decorative background logo */}
                        <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
                            <LayoutDashboard className="w-48 h-48 rotate-[-15deg]" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="font-fraunces text-2xl font-bold mb-2">Create Ritual</h3>
                            <p className="text-primary-charcoal/60 text-sm italic font-medium">Add a walk-in appointment or manual booking.</p>
                            <Link href="/admin/bookings" className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-widest bg-primary-charcoal border border-white/10 text-white rounded-2xl px-6 py-4 hover:shadow-2xl transition-all">
                                Launch Creator <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
