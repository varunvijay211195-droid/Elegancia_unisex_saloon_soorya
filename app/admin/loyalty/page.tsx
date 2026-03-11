'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Gift,
    Users,
    TrendingUp,
    Award,
    Coins,
    ArrowUpRight,
    Crown,
    Sparkles,
    Receipt
} from 'lucide-react';
import { getLoyaltyStats, getAllCustomerPoints, getAllReferrals, getAllPointsTransactions } from '@/lib/actions/loyalty';

interface LoyaltyStats {
    totalPointsOutstanding: number;
    totalCustomers: number;
    tierDistribution: Record<string, number> | [];
    monthlyEarned: number;
    monthlyRedeemed: number;
    totalReferrals: number;
    topEarners: Array<{
        available_points: number;
        lifetime_points: number;
        profiles: { full_name: string | null };
    }>;
}

interface CustomerPoints {
    id: string;
    customer_id: string;
    total_points: number;
    available_points: number;
    lifetime_points: number;
    tier: string;
    profiles: {
        id: string;
        full_name: string | null;
        email: string | null;
        avatar_url: string | null;
    };
}

interface Referral {
    id: string;
    referral_code: string;
    status: string;
    referrer: {
        full_name: string | null;
        email: string | null;
    };
    referred_at: string;
    completed_at: string | null;
}

interface Transaction {
    id: string;
    points: number;
    transaction_type: string;
    description: string;
    created_at: string;
    profiles: {
        id: string;
        full_name: string | null;
        email: string | null;
    } | null;
}

const tierColors: Record<string, string> = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2'
};

const tierGradients: Record<string, string> = {
    bronze: 'from-[#CD7F32] to-[#8B4513]',
    silver: 'from-[#C0C0C0] to-[#808080]',
    gold: 'from-[#FFD700] to-[#B8860B]',
    platinum: 'from-[#E5E4E2] to-[#A9A9A9]'
};

export default function LoyaltyPage() {
    const [stats, setStats] = useState<LoyaltyStats | null>(null);
    const [customers, setCustomers] = useState<CustomerPoints[]>([]);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'transactions' | 'referrals'>('overview');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statsData, customersData, referralsData, transactionsData] = await Promise.all([
                getLoyaltyStats(),
                getAllCustomerPoints(),
                getAllReferrals(),
                getAllPointsTransactions()
            ]);

            if (statsData) {
                setStats(statsData as unknown as LoyaltyStats);
            }
            setCustomers(customersData);
            setReferrals(referralsData);
            setTransactions(transactionsData as unknown as Transaction[]);
        } catch (error) {
            console.error('Error loading loyalty data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-gold"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-white">
                        Loyalty & Referrals
                    </h1>
                    <p className="text-white/40 mt-2">
                        Manage rewards program and track engagement
                    </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-primary-gold/10 rounded-full">
                    <Sparkles className="w-4 h-4 text-primary-gold" />
                    <span className="text-sm font-medium text-primary-gold">Program Active</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10">
                {[
                    { id: 'overview', label: 'Overview', icon: TrendingUp },
                    { id: 'customers', label: 'Customers', icon: Users },
                    { id: 'transactions', label: 'Transactions', icon: Receipt },
                    { id: 'referrals', label: 'Referrals', icon: Gift }
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as 'overview' | 'customers' | 'transactions' | 'referrals')}
                            className={`
                flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all
                ${isActive
                                    ? 'bg-white/10 text-white border-b-2 border-primary-gold'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'}
              `}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-primary-gold/20 to-primary-gold/5 border border-primary-gold/20 rounded-3xl p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <Coins className="w-8 h-8 text-primary-gold" />
                                <span className="text-xs text-primary-gold bg-primary-gold/10 px-2 py-1 rounded-full">Total</span>
                            </div>
                            <p className="text-3xl font-light text-white">{stats.totalPointsOutstanding.toLocaleString()}</p>
                            <p className="text-sm text-white/40 mt-1">Points Outstanding</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <Users className="w-8 h-8 text-blue-400" />
                                <ArrowUpRight className="w-4 h-4 text-green-400" />
                            </div>
                            <p className="text-3xl font-light text-white">{stats.totalCustomers}</p>
                            <p className="text-sm text-white/40 mt-1">Active Members</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <Gift className="w-8 h-8 text-purple-400" />
                                <ArrowUpRight className="w-4 h-4 text-green-400" />
                            </div>
                            <p className="text-3xl font-light text-white">{stats.monthlyEarned.toLocaleString()}</p>
                            <p className="text-sm text-white/40 mt-1">Points Earned (This Month)</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <Award className="w-8 h-8 text-pink-400" />
                            </div>
                            <p className="text-3xl font-light text-white">{stats.totalReferrals}</p>
                            <p className="text-sm text-white/40 mt-1">Successful Referrals</p>
                        </motion.div>
                    </div>

                    {/* Tier Distribution & Top Earners */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Tier Distribution */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                            <h3 className="text-lg font-medium text-white mb-6">Tier Distribution</h3>
                            <div className="space-y-4">
                                {Object.entries(stats.tierDistribution).map(([tier, count]) => {
                                    const percentage = stats.totalCustomers > 0 ? (count / stats.totalCustomers) * 100 : 0;
                                    return (
                                        <div key={tier} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Crown className="w-4 h-4" style={{ color: tierColors[tier] }} />
                                                    <span className="capitalize text-white">{tier}</span>
                                                </div>
                                                <span className="text-white/60">{count} members ({percentage.toFixed(1)}%)</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 0.5, delay: 0.2 }}
                                                    className={`h-full bg-gradient-to-r ${tierGradients[tier]} rounded-full`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Top Earners */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                            <h3 className="text-lg font-medium text-white mb-6">Top Point Earners</h3>
                            <div className="space-y-4">
                                {stats.topEarners.length === 0 ? (
                                    <p className="text-white/40 text-center py-8">No top earners yet</p>
                                ) : (
                                    stats.topEarners.map((earner, index) => (
                                        <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl">
                                            <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
                        ${index === 0 ? 'bg-gradient-to-br from-[#FFD700] to-[#B8860B] text-black' : ''}
                        ${index === 1 ? 'bg-gradient-to-br from-[#C0C0C0] to-[#808080] text-black' : ''}
                        ${index === 2 ? 'bg-gradient-to-br from-[#CD7F32] to-[#8B4513] text-white' : ''}
                        ${index > 2 ? 'bg-white/10 text-white/60' : ''}
                      `}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{earner.profiles?.full_name || 'Anonymous'}</p>
                                                <p className="text-xs text-white/40">{earner.lifetime_points.toLocaleString()} lifetime points</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-primary-gold font-bold">{earner.available_points.toLocaleString()}</p>
                                                <p className="text-xs text-white/40">available</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-lg font-medium text-white">All Members</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="text-left p-4 text-xs font-medium text-white/60 uppercase tracking-wider">Member</th>
                                    <th className="text-left p-4 text-xs font-medium text-white/60 uppercase tracking-wider">Tier</th>
                                    <th className="text-right p-4 text-xs font-medium text-white/60 uppercase tracking-wider">Available</th>
                                    <th className="text-right p-4 text-xs font-medium text-white/60 uppercase tracking-wider">Lifetime</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {customers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-white/40">
                                            No loyalty members yet. Members will appear here after their first booking.
                                        </td>
                                    </tr>
                                ) : (
                                    customers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary-gold/20 flex items-center justify-center text-primary-gold font-bold">
                                                        {customer.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{customer.profiles?.full_name || 'Unknown'}</p>
                                                        <p className="text-xs text-white/40">{customer.profiles?.email || 'No email'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`
                          inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                          bg-gradient-to-r ${tierGradients[customer.tier]} text-black
                        `}>
                                                    <Crown className="w-3 h-3" />
                                                    {customer.tier}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="text-white font-medium">{customer.available_points.toLocaleString()}</span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="text-white/60">{customer.lifetime_points.toLocaleString()}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-lg font-medium text-white">Recent Transactions</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="text-left p-4 text-xs font-medium text-white/60 uppercase tracking-wider">Date</th>
                                    <th className="text-left p-4 text-xs font-medium text-white/60 uppercase tracking-wider">Customer</th>
                                    <th className="text-left p-4 text-xs font-medium text-white/60 uppercase tracking-wider">Type</th>
                                    <th className="text-left p-4 text-xs font-medium text-white/60 uppercase tracking-wider">Description</th>
                                    <th className="text-right p-4 text-xs font-medium text-white/60 uppercase tracking-wider">Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-white/40">
                                            No transactions found.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-white/60 text-sm">
                                                {new Date(tx.created_at).toLocaleDateString()} {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">{tx.profiles?.full_name || 'Unknown'}</span>
                                                    <span className="text-xs text-white/40">{tx.profiles?.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`
                                                    inline-flex px-2 py-1 rounded text-xs font-medium uppercase
                                                    ${['earn', 'bonus', 'referral_earn', 'referral_bonus'].includes(tx.transaction_type) ? 'bg-green-500/20 text-green-400' : ''}
                                                    ${tx.transaction_type === 'redeem' ? 'bg-red-500/20 text-red-400' : ''}
                                                    ${tx.transaction_type === 'expire' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                                                `}>
                                                    {tx.transaction_type.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4 text-white/80">
                                                {tx.description}
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className={`font-bold ${['earn', 'bonus', 'referral_earn', 'referral_bonus'].includes(tx.transaction_type) ? 'text-green-400' : 'text-red-400'}`}>
                                                    {['earn', 'bonus', 'referral_earn', 'referral_bonus'].includes(tx.transaction_type) ? '+' : ''}{tx.points}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Referrals Tab */}
            {activeTab === 'referrals' && (
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-lg font-medium text-white">Referral Program</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="text-left p-4 text-xs font-medium text-white/60 uppercase tracking-wider">Referrer</th>
                                    <th className="text-left p-4 text-xs font-medium text-white/60 uppercase tracking-wider">Code</th>
                                    <th className="text-left p-4 text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                                    <th className="text-left p-4 text-xs font-medium text-white/60 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {referrals.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-white/40">
                                            No referrals yet. Customers will generate referral codes when they join the program.
                                        </td>
                                    </tr>
                                ) : (
                                    referrals.map((referral) => (
                                        <tr key={referral.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <p className="text-white font-medium">{referral.referrer?.full_name || 'Unknown'}</p>
                                            </td>
                                            <td className="p-4">
                                                <code className="bg-white/10 px-3 py-1 rounded-lg text-primary-gold font-mono">
                                                    {referral.referral_code}
                                                </code>
                                            </td>
                                            <td className="p-4">
                                                <span className={`
                          inline-flex px-3 py-1 rounded-full text-xs font-medium
                          ${referral.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
                          ${referral.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                          ${referral.status === 'expired' ? 'bg-red-500/20 text-red-400' : ''}
                        `}>
                                                    {referral.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-white/60">
                                                {new Date(referral.referred_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
