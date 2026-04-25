import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFAB from "@/components/ui/WhatsAppFAB";
import FloatingBookingBar from "@/components/ui/FloatingBookingBar";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Elegancia Unisex Salon & Makeover Studio | Slay Every Look",
  description: "Elegancia Unisex Salon & Makeover Studio. Where Elegance Meets Style. Unisex Salon | Hair • Beauty • Bridal. Located near More Super Market, Kesavanpady, Amballur, Ernakulam 682305.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Elegancia",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${fraunces.variable} font-inter antialiased bg-background text-foreground`}
      >
        <Navbar />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
        <WhatsAppFAB />
        <FloatingBookingBar />
        <Toaster position="top-right" richColors theme="dark" />
      </body>
    </html>
  );
}
