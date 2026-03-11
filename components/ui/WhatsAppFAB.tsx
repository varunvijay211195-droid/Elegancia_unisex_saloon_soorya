"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppFAB() {
    const whatsappNumber = "919605550666";
    const message = "Hi! I'd like to book an appointment at Elegancia Unisex Salon & Makeover Studio in Amballur.";
    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
        >
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
                aria-label="Contact on WhatsApp"
            >
                <MessageCircle className="w-8 h-8 text-white fill-white" />

                {/* Tooltip */}
                <span className="absolute right-full mr-3 px-3 py-1 bg-primary-charcoal text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Book on WhatsApp
                </span>
            </a>
        </motion.div>
    );
}
