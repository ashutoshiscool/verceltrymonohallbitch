"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

interface HeroProps {
    brands?: { id: number; name: string; logo_url: string }[];
    settings?: { hero_layout?: string; brand_size?: string; brand_spacing?: string };
}

export default function Hero({ brands = [], settings = {} }: HeroProps) {
    const containerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const bottomTextRef = useRef<HTMLDivElement>(null);

    const layout = settings.hero_layout || "TOP-R";
    const size = parseInt(settings.brand_size || "90");
    const spacing = parseInt(settings.brand_spacing || "24");

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Initial setup
        gsap.set(contentRef.current?.children || [], { y: 20, opacity: 0 });
        gsap.set(bottomTextRef.current, { y: 50, opacity: 0 });

        // Animation sequence
        tl.to(contentRef.current?.children || [], {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            delay: 0.2
        })
            .to(bottomTextRef.current, {
                y: 0,
                opacity: 1,
                duration: 1
            }, "-=0.5");

    }, []);

    return (
        <section ref={containerRef} className="relative min-h-[100dvh] w-full flex flex-col overflow-hidden bg-white">
            {/* Background Image Container */}
            {/* Background Image/Video Container */}
            <div className="absolute inset-0 z-0 w-full h-full bg-black">
                <div className="relative w-full h-full">
                    {/* Fallback Image - Always present behind/during load or if video fails */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/hero-bg.png"
                            alt="Monohall Background"
                            fill
                            className="object-cover grayscale contrast-125 brightness-110 opacity-20"
                            priority
                            quality={100}
                        />
                    </div>

                    {/* Video Background */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-10 opacity-80"
                        poster="/hero-bg.png"
                    >
                        <source src="/Newspaper_Logo_Construction_Feedback.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Gradient Overlay for Text Readability - Updated for video */}
                    {/* A combination of general darkening and a bottom gradient for the text */}
                    <div className="absolute inset-0 z-20 bg-black/40 mix-blend-multiply pointer-events-none"></div>
                    <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none"></div>
                </div>
            </div>

            {/* Spacer for Navbar */}
            <div className="h-20 md:h-32 lg:h-40 shrink-0"></div>

            {/* Main Content - Flex Grow to fill space and center content */}
            <div ref={contentRef} className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-12 flex-1 flex flex-col justify-center lg:justify-start lg:pt-16 xl:pt-24 pb-12 md:pb-32">
                {/* Top Label */}
                <p className="text-[11px] md:text-xs font-inter font-bold tracking-[0.25em] text-white uppercase mb-4 md:mb-6">
                    Since 2020 • Tbilisi
                </p>

                {/* Main Heading - Massive on mobile */}
                <h1 ref={headingRef} className="font-syne font-black text-[18vw] sm:text-8xl md:text-9xl lg:text-[10rem] leading-[0.8] tracking-tighter text-white uppercase break-words w-full">
                    <div>Mono</div>
                    <div>Hall</div>
                </h1>

                {/* Separator */}
                <div className="h-[3px] w-16 md:w-24 bg-orange-600 my-6 md:my-10"></div>

                {/* Description */}
                <div className="space-y-2 mb-8 md:mb-12">
                    <p className="text-lg md:text-3xl font-inter text-white font-bold leading-tight">
                        The Pulse of Georgia.
                    </p>
                    <p className="text-lg md:text-3xl font-inter text-white font-medium leading-tight">
                        Where sound meets architecture.
                    </p>
                </div>

                {/* CTA Button */}
                <Link
                    href="/events"
                    className="group inline-flex items-center gap-2 text-xs md:text-sm font-bold tracking-widest uppercase border-b-2 border-white text-white pb-1 w-fit hover:opacity-70 transition-opacity"
                >
                    View Upcoming Shows
                    <ArrowDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Desktop Vertical Brands - Right Side (Under Menu) - Only if TOP-R */}
            {brands.length > 0 && layout === "TOP-R" && (
                <div
                    className="hidden md:flex flex-col absolute right-12 top-32 z-30 items-center w-24"
                    style={{ gap: `${spacing}px` }}
                >
                    {brands.map((brand) => (
                        <Link key={`desktop-${brand.id}`} href={`/brands/${brand.id}`} className="relative block shrink-0 opacity-50 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110">
                            <img
                                src={brand.logo_url}
                                alt={brand.name}
                                style={{
                                    maxWidth: `${size}px`,
                                    maxHeight: `${size * 0.8}px`
                                }}
                                className="w-auto object-contain"
                            />
                        </Link>
                    ))}
                </div>
            )}

            {/* Bottom Bar - Pushed to bottom by flex-1 above */}
            <div ref={bottomTextRef} className="relative z-20 w-full bg-white flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-6 border-t-4 border-orange-600 shrink-0 gap-4">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full md:w-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-black rounded-full shrink-0"></div>
                        <h2 className="text-xs md:text-base font-bold font-inter text-black uppercase tracking-widest whitespace-nowrap">
                            Live Music <span className="font-light text-neutral-400 mx-1 md:mx-2">|</span> Electronic Arts
                        </h2>
                    </div>

                    {/* Brands - Mobile (Always) OR Desktop (If BOTTOM-M) */}
                    {brands.length > 0 && (
                        <div className={`flex items-center gap-6 overflow-x-auto max-w-[200px] md:max-w-md no-scrollbar ${layout === "TOP-R" ? "md:hidden" : ""}`}>
                            {layout === "BOTTOM-M" && <div className="h-8 w-[1px] bg-neutral-200 hidden md:block"></div>}
                            <div className="flex items-center" style={{ gap: `${spacing}px` }}>
                                {brands.map((brand) => (
                                    <Link key={`mobile-${brand.id}`} href={`/brands/${brand.id}`} className="relative block shrink-0 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all">
                                        <img
                                            src={brand.logo_url}
                                            alt={brand.name}
                                            style={{
                                                height: layout === "BOTTOM-M" ? '40px' : '32px',
                                                width: 'auto'
                                            }}
                                            className="object-contain"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => {
                        const featuredSection = document.getElementById('featured-events');
                        if (featuredSection) {
                            featuredSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                    className="hidden md:flex items-center gap-4 cursor-pointer group"
                >
                    <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 group-hover:text-orange-600 transition-colors">Scroll Down</span>

                    <div className="w-8 h-8 md:w-10 md:h-10 border border-neutral-200 rounded-full flex items-center justify-center text-black shrink-0 relative group-hover:border-orange-600 group-hover:text-orange-600 transition-colors">
                        <ArrowDown className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1} />
                    </div>
                </button>
            </div>
        </section>
    );
}
