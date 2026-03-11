"use client";

import React, { useEffect, useState } from "react";
import {
    Users,
    Search,
    Sparkles,
    ArrowUpCircle,
    ArrowDownCircle,
    History,
    Shield
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface Client {
    id: string;
    full_name: string;
    email: string;
    loyalty_points: number;
    total_spent: number;
    created_at: string;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    const fetchClients = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setClients(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const adjustPoints = async (id: string, amount: number) => {
        const client = clients.find(c => c.id === id);
        if (!client) return;

        const newPoints = (client.loyalty_points || 0) + amount;

        const { error } = await supabase
            .from('profiles')
            .update({ loyalty_points: newPoints })
            .eq('id', id);

        if (error) {
            toast.error("Correction failed");
        } else {
            toast.success(`Ritual balance adjusted by ${amount > 0 ? '+' : ''}${amount}`);
            fetchClients();
        }
    };

    const filteredClients = clients.filter(c =>
        c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-fraunces text-4xl font-bold text-white mb-2">Aesthetic Directory</h1>
                    <p className="text-white/40 italic">Manage your elite clientele and loyalty rewards.</p>
                </div>
            </div>

            {/* Search & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input
                        type="text"
                        placeholder="Search by name or transmission..."
                        className="w-full h-16 pl-14 pr-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-gold outline-none text-white transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="p-6 bg-primary-gold/10 border border-primary-gold/20 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-gold rounded-xl flex items-center justify-center text-primary-charcoal">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-primary-gold/60">Total Clients</p>
                        <p className="text-2xl font-bold text-white">{clients.length}</p>
                    </div>
                </div>
            </div>

            {/* Clients Table */}
            <div className="bg-[#0F0F10] border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-white/40">Profile</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-white/40">Loyalty Balance</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-white/40">Total Contribution</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-white/40">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-lg font-fraunces text-primary-gold">
                                                {client.full_name?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-primary-gold transition-colors">{client.full_name || 'Anonymous'}</p>
                                                <p className="text-xs text-white/20 italic">{client.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-primary-gold" />
                                            <span className="font-bold text-white text-lg">{client.loyalty_points || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-white/60 font-mono">
                                        ₹{(client.total_spent || 0).toLocaleString()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => adjustPoints(client.id, 50)}
                                                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-green-500/10 hover:border-green-500/30 text-white/40 hover:text-green-400 transition-all"
                                                title="Add Points"
                                            >
                                                <ArrowUpCircle className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => adjustPoints(client.id, -50)}
                                                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 text-white/40 hover:text-red-400 transition-all"
                                                title="Deduct Points"
                                            >
                                                <ArrowDownCircle className="w-5 h-5" />
                                            </button>
                                            <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-primary-gold/10 hover:border-primary-gold/30 text-white/40 hover:text-primary-gold transition-all">
                                                <History className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
