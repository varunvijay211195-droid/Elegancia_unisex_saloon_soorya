import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFAB from "@/components/ui/WhatsAppFAB";
import FloatingBookingBar from "@/components/ui/FloatingBookingBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Elegancia Unisex Salon | Slay Every Look in Ernakulam",
  description: "Elegancia Unisex Salon & Makeover Studio. Premium hair styling, beauty treatments, and bridal artistry in Amballur, Ernakulam.",
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
      </body>
    </html>
  );
}
