"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Image as ImageIcon,
    Upload,
    Trash2,
    Plus,
    Scissors,
    Check,
    X,
    Filter,
    Loader2,
    LayoutDashboard,
    Edit3,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { uploadGalleryPhoto, deleteGalleryPhoto, updateService } from "@/lib/actions/content";

interface GalleryItem {
    id: string;
    title: string;
    image_url: string;
    public_id: string;
    category: string;
}

interface Service {
    id: string;
    title: string;
    slug: string;
    category: string;
    starting_price: number;
    is_active: boolean;
}

export default function ContentManagementPage() {
    const supabase = createClient();
    const [activeTab, setActiveTab] = useState<'gallery' | 'services' | 'home'>('gallery');
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setIsLoading(true);
        if (activeTab === 'gallery' || activeTab === 'home') {
            const query = supabase.from('gallery').select('*');
            if (activeTab === 'home') {
                query.eq('category', 'home_hero');
            }
            const { data } = await query.order('created_at', { ascending: false });
            setGallery(data || []);
        } else {
            const { data } = await supabase.from('services').select('*').order('category', { ascending: true });
            setServices(data || []);
        }
        setIsLoading(false);
    };

    const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const result = await uploadGalleryPhoto(formData);
            if (result.success) {
                setUploadPreview(null);
                form.reset();
                fetchData();
            } else {
                alert(result.error);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeletePhoto = async (id: string, publicId: string) => {
        if (!confirm('Are you sure you want to delete this photo?')) return;

        const result = await deleteGalleryPhoto(id, publicId);
        if (result.success) {
            fetchData();
        } else {
            alert(result.error);
        }
    };

    const toggleServiceStatus = async (id: string, currentStatus: boolean) => {
        const result = await updateService(id, { is_active: !currentStatus });
        if (result.success) fetchData();
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="font-fraunces text-4xl font-bold text-white mb-2">Editor Suite</h1>
                    <p className="text-white/40 text-sm italic">Sculpt your digital presence. Keep Elegancia fresh.</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-fit">
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'gallery' ? 'bg-primary-gold text-primary-charcoal shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                        Gallery Studio
                    </button>
                    <button
                        onClick={() => setActiveTab('home')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'home' ? 'bg-primary-gold text-primary-charcoal shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                        Homepage Aesthetic
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'services' ? 'bg-primary-gold text-primary-charcoal shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                        Retail Rituals
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {(activeTab === 'gallery' || activeTab === 'home') && (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                    >
                        {/* Upload Panel */}
                        <div className="lg:col-span-4">
                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 border-dashed hover:border-primary-gold/30 transition-all sticky top-32 group">
                                <form onSubmit={handleFileUpload} className="space-y-6">
                                    <h3 className="font-fraunces text-2xl font-bold mb-4 flex items-center gap-3">
                                        <Upload className="w-5 h-5 text-primary-gold" /> {activeTab === 'home' ? 'Hero Update' : 'Upload New Work'}
                                    </h3>

                                    <label className="block w-full aspect-square bg-[#0A0A0B] rounded-3xl cursor-pointer relative overflow-hidden group/upload border-2 border-dashed border-white/5 hover:border-primary-gold/20 transition-all">
                                        {uploadPreview ? (
                                            <Image src={uploadPreview} alt="Preview" fill className="object-cover scale-105 group-hover/upload:scale-100 transition-transform duration-700" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                                                    <Plus className="w-8 h-8 text-white/20 group-hover/upload:text-primary-gold transition-colors" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Select Visual Asset</p>
                                                    <p className="text-[10px] text-white/20 italic">JPG, PNG up to 5MB</p>
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            name="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setUploadPreview(URL.createObjectURL(file));
                                            }}
                                            required
                                        />
                                    </label>

                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder={activeTab === 'home' ? "Slide Name (Hero Background)" : "Asset Title (e.g., Summer Cut)"}
                                            className="w-full bg-[#0A0A0B]/60 border border-white/5 rounded-2xl p-4 text-sm font-medium outline-none focus:border-primary-gold/40 transition-all"
                                            required
                                        />
                                        <select
                                            name="category"
                                            className="w-full bg-[#0A0A0B]/60 border border-white/5 rounded-2xl p-4 text-sm font-medium outline-none focus:border-primary-gold/40 transition-all uppercase tracking-widest"
                                            defaultValue={activeTab === 'home' ? 'home_hero' : 'hair'}
                                        >
                                            {activeTab === 'home' ? (
                                                <option value="home_hero">Homepage Hero</option>
                                            ) : (
                                                <>
                                                    <option value="hair">Hair Design</option>
                                                    <option value="nails">Artistic Nails</option>
                                                    <option value="makeup">Facial Bloom</option>
                                                    <option value="bridals">Bridal Couture</option>
                                                    <option value="interior">Interior Aesthetic</option>
                                                </>
                                            )}
                                        </select>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isUploading || !uploadPreview}
                                        className="w-full h-14 bg-primary-gold text-primary-charcoal hover:bg-white transition-all font-black"
                                    >
                                        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : activeTab === 'home' ? "SWAP HERO IMAGE" : "PUBLISH TO GALLERY"}
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Gallery List */}
                        <div className="lg:col-span-8">
                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 min-h-[600px]">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-fraunces text-2xl font-bold flex items-center gap-3">
                                        <ImageIcon className="w-5 h-5 text-white/40" /> Active Assets
                                    </h3>
                                    <div className="text-[10px] uppercase font-bold text-white/20 tracking-widest">
                                        {gallery.length} Images Loaded
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="flex py-20 items-center justify-center">
                                        <Loader2 className="w-10 h-10 text-primary-gold/20 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {gallery.map((item) => (
                                            <div key={item.id} className="group/item relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/5 border border-white/5 hover:border-red-500/30 transition-all">
                                                <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover/item:scale-110 transition-all duration-1000 group-hover/item:brightness-50" />

                                                <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 group-hover/item:opacity-100 transition-all z-20">
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={() => handleDeletePhoto(item.id, item.public_id)}
                                                            className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold text-primary-gold uppercase tracking-widest bg-primary-gold/10 px-2 py-0.5 rounded-full w-fit">
                                                            {item.category}
                                                        </p>
                                                        <p className="text-sm font-bold text-white truncate">{item.title}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {gallery.length === 0 && (
                                            <div className="col-span-full py-40 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-white/20 italic">
                                                <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                                                Your masterpiece collection is empty.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'services' && (
                    <motion.div
                        key="services"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                <div className="space-y-2">
                                    <h3 className="font-fraunces text-3xl font-bold flex items-center gap-4">
                                        <Scissors className="w-6 h-6 text-primary-gold" /> Ritual Archive
                                    </h3>
                                    <p className="text-white/40 text-sm italic">Control the pricing and availability of your salon experiences.</p>
                                </div>
                                <Button className="bg-primary-gold text-primary-charcoal rounded-2xl h-14 px-8 flex items-center gap-3">
                                    <Plus className="w-5 h-5" /> EXPAND RITUALS
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {services.map((service) => (
                                    <div key={service.id} className={`p-8 bg-white/5 border rounded-[3rem] transition-all group ${service.is_active ? 'border-white/5 hover:border-primary-gold/20' : 'border-red-500/20 opacity-60'}`}>
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="space-y-1">
                                                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary-gold/60">{service.category}</span>
                                                <h4 className="font-fraunces text-2xl font-bold text-white group-hover:text-primary-gold transition-colors">{service.title}</h4>
                                            </div>
                                            <button
                                                onClick={() => toggleServiceStatus(service.id, service.is_active)}
                                                className={`w-14 h-8 rounded-full border transition-all flex items-center px-1 ${service.is_active ? 'bg-primary-gold border-primary-gold justify-end' : 'bg-red-500/10 border-red-500/20 justify-start'
                                                    }`}
                                            >
                                                <div className={`w-6 h-6 rounded-full shadow-lg ${service.is_active ? 'bg-primary-charcoal' : 'bg-red-500'}`} />
                                            </button>
                                        </div>

                                        <div className="flex items-end justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">Starts At</p>
                                                <p className="text-3xl font-bold text-white tracking-tight">₹{service.starting_price}</p>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button variant="outline" className="w-12 h-12 rounded-2xl border-white/5 p-0 hover:bg-white/5">
                                                    <Edit3 className="w-4 h-4 text-white/40" />
                                                </Button>
                                                <Button variant="outline" className="w-12 h-12 rounded-2xl border-white/5 p-0 hover:bg-white/5">
                                                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-primary-gold" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
