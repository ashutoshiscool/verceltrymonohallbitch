"use client";

import Link from "next/link";
import { Instagram, Facebook, ArrowUpRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-black text-white pt-24 pb-0 px-6 md:px-12 flex flex-col overflow-hidden relative">

            <div className="w-full max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24 relative z-10">
                {/* Brand - Span 4 */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="space-y-4">
                        <h2 className="font-syne font-bold text-2xl uppercase tracking-wider text-orange-600">// Monohall</h2>
                        <p className="font-inter text-neutral-400 text-lg leading-relaxed max-w-sm">
                            The brutallist shrine to sound.
                            Where industrial architecture meets electronic culture in the heart of Tbilisi.
                        </p>
                    </div>
                </div>

                {/* Links - Span 2 */}
                <div className="lg:col-span-2 lg:col-start-6 flex flex-col gap-6">
                    <h3 className="text-xs font-bold font-inter tracking-[0.2em] text-neutral-600 uppercase">Explore</h3>
                    <nav className="flex flex-col gap-4">
                        {["Events", "About", "Contact", "FAQ"].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase()}`} className="font-syne text-xl font-bold uppercase hover:text-orange-600 transition-colors w-fit">
                                {item}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Contact - Span 3 */}
                <div className="lg:col-span-3 lg:col-start-8 flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold font-inter tracking-[0.2em] text-neutral-600 uppercase">Locate Us</h3>
                        <div className="space-y-2">
                            <p className="font-syne text-xl leading-snug">
                                2 Dzmebi Kakabadzeebi St,<br /> Tbilisi, Georgia
                            </p>
                            <a href="https://maps.google.com/?q=2+Dzmebi+Kakabadzeebi+St,+Tbilisi" target="_blank" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-orange-600 transition-colors pt-2">
                                Get Directions <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold font-inter tracking-[0.2em] text-neutral-600 uppercase">Contact</h3>
                        <div className="flex flex-col gap-1">
                            <a href="tel:+995577777949" className="font-syne text-xl hover:text-orange-600 transition-colors">
                                +995 577 77 79 49
                            </a>
                            <a href="mailto:info@monohall.com" className="font-syne text-xl hover:text-orange-600 transition-colors">
                                info@monohall.com
                            </a>
                        </div>
                    </div>
                </div>

                {/* Socials - Span 2 */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <h3 className="text-xs font-bold font-inter tracking-[0.2em] text-neutral-600 uppercase">Social</h3>
                    <div className="flex gap-4">
                        <a href="https://www.instagram.com/monohall_tbilisi/?hl=en" target="_blank" className="w-12 h-12 border border-neutral-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="https://www.facebook.com/monohall/" target="_blank" className="w-12 h-12 border border-neutral-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                            <Facebook className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="w-full border-t border-neutral-900 pt-8 pb-12 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                <p className="text-neutral-600 text-[10px] uppercase tracking-widest font-bold">
                    &copy; {new Date().getFullYear()} Monohall.
                </p>
                <div className="flex gap-8">
                    <Link href="/privacy" className="text-neutral-600 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="text-neutral-600 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-colors">Terms & Conditions</Link>
                </div>
            </div>

            {/* Massive Background Text */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none select-none z-0">
                <h1 className="text-[20vw] leading-[0.7] font-syne font-black text-neutral-900/40 uppercase text-center translate-y-[20%]">
                    Monohall
                </h1>
            </div>
        </footer>
    );
}
