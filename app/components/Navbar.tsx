"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, Menu, X, Instagram, Facebook, MapPin, Phone, ArrowRight, TrendingUp, ChevronRight } from "lucide-react";

type Brand = {
    id: number;
    name: string;
    logo_base64: string;
};

export default function Navbar({ theme = "light", brands = [] }: { theme?: "light" | "dark"; brands?: Brand[] }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Determine text color based on scroll state and theme
    // If scrolled -> Always black text (on white bg)
    // If not scrolled -> Always white text (on video bg)
    const textColor = scrolled ? "text-black" : "text-white";

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll
    useEffect(() => {
        if (menuOpen || searchOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [menuOpen, searchOpen]);

    // Focus input on search open & Handle Escape
    useEffect(() => {
        if (searchOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSearchOpen(false);
                setMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [searchOpen]);

    const navLinks = [
        { name: "Events", href: "/events" },
        { name: "About", href: "/about" },
        { name: "Faq", href: "/faq" },
    ];

    const popularSearches = ["Techno", "Live Band", "Electronic", "Jazz Night", "Weekend Pass"];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 md:py-6 flex justify-between items-center transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
                    }`}
            >
                {/* Logo */}
                <Link href="/" className="z-50 relative" onClick={() => { setMenuOpen(false); setSearchOpen(false); }}>
                    <span className={`font-syne font-bold text-2xl md:text-3xl tracking-tighter uppercase transition-colors ${textColor}`}>
                        Monohall
                    </span>
                </Link>

                {/* Brands (Desktop) */}
                <div className="hidden md:flex items-center gap-6 mr-6 ml-auto z-50 relative">
                    {brands.map((brand) => (
                        <Link
                            key={brand.id}
                            href={`/brands/${brand.id}`}
                            className="group relative overflow-hidden transition-transform hover:scale-105"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={brand.logo_base64}
                                alt={brand.name}
                                className={`h-8 w-auto object-contain transition-all duration-300 ${scrolled ? "brightness-0" : (theme === "dark" ? "brightness-0 invert" : "brightness-0")}`}
                            />
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className={`flex items-center gap-4 md:gap-6 z-50 relative ${textColor}`}>
                    <button
                        aria-label="Search"
                        className="hover:text-orange-600 transition-colors p-2"
                        onClick={() => setSearchOpen(true)}
                    >
                        <Search className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button
                        aria-label="Menu"
                        className="hover:text-orange-600 transition-colors p-2"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X className="w-6 h-6 md:w-8 md:h-8" /> : <Menu className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />}
                    </button>
                </div>
            </nav>

            {/* SEARCH OVERLAY */}
            <div
                className={`fixed inset-0 z-50 bg-white/95 backdrop-blur-xl transition-all duration-500 flex flex-col items-center justify-center px-6 ${searchOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                    }`}
            >
                <div className="w-full max-w-4xl relative">
                    <button
                        onClick={() => setSearchOpen(false)}
                        className="absolute -top-24 right-0 p-2 hover:text-orange-600 transition-colors"
                    >
                        <X className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />
                    </button>

                    <p className="text-orange-600 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-8 text-center">
                        What are you looking for?
                    </p>

                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search Events..."
                        className="w-full bg-transparent border-b-2 border-neutral-200 text-3xl md:text-5xl lg:text-7xl font-syne font-bold text-black placeholder:text-neutral-300 focus:outline-none focus:border-black pb-4 md:pb-8 text-center transition-colors"
                    />

                    {/* Quick Tags */}
                    <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-2 md:gap-4">
                        <div className="flex items-center gap-2 text-neutral-400 mr-2 w-full md:w-auto justify-center mb-2 md:mb-0">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-medium">Trending:</span>
                        </div>
                        {popularSearches.map((tag) => (
                            <button
                                key={tag}
                                className="px-3 py-1 md:px-4 md:py-2 rounded-full border border-neutral-200 text-xs md:text-sm lg:text-base font-inter text-neutral-600 hover:border-orange-600 hover:text-orange-600 transition-all duration-300"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* FUCKING CRAZY MENU OVERLAY */}
            <div
                className={`fixed inset-0 bg-white z-40 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] overflow-y-auto ${menuOpen ? "clip-path-open" : "clip-path-closed pointer-events-none"
                    }`}
                style={{
                    clipPath: menuOpen ? "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" : "polygon(0 0, 100% 0, 100% 0, 0 0)"
                }}
            >
                <div className="min-h-full container mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-12 flex flex-col md:flex-row">

                    {/* Left Col: Monster Links */}
                    <div className="flex-1 flex flex-col justify-center space-y-2 md:space-y-6 shrink-0">
                        {navLinks.map((item, index) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center gap-4 text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-syne font-black uppercase tracking-tighter text-black transition-all duration-300 transform ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                                    }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                                onClick={() => setMenuOpen(false)}
                            >
                                <span className="group-hover:text-orange-600 transition-colors duration-300">{item.name}</span>
                                <ArrowRight className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-orange-600 hidden sm:block" />
                            </Link>
                        ))}

                        {/* Brands Section */}
                        {brands.length > 0 && (
                            <div
                                className={`mt-6 pt-6 border-t border-neutral-200 transition-all duration-300 transform ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                                style={{ transitionDelay: `${navLinks.length * 100}ms` }}
                            >
                                <span className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4 block">
                                    Our Brands
                                </span>
                                <div className="flex flex-col gap-2">
                                    {brands.map((brand, idx) => (
                                        <Link
                                            key={brand.id}
                                            href={`/brands/${brand.id}`}
                                            className="group flex items-center gap-3 text-xl md:text-2xl lg:text-3xl font-syne font-bold uppercase tracking-tight text-neutral-600 hover:text-orange-600 transition-colors"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-orange-600" />
                                            <span>{brand.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Col: Info & Details */}
                    <div className="flex-1 md:flex-[0.4] flex flex-col justify-end md:justify-center md:pl-12 gap-8 md:gap-12 mt-12 md:mt-0 pb-12 md:pb-0 shrink-0">
                        {/* Address Block */}
                        <div
                            className={`transform transition-all duration-500 delay-300 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                        >
                            <div className="flex items-start gap-4 mb-2 text-neutral-400">
                                <MapPin className="w-5 h-5 mt-1" />
                                <span className="text-xs font-bold tracking-widest uppercase">Location</span>
                            </div>
                            <p className="text-lg md:text-xl lg:text-2xl font-inter font-medium text-black max-w-md">
                                2 Dzmebi Kakabadzeebi St,<br /> Tbilisi, Georgia
                            </p>
                        </div>

                        {/* Contact Block */}
                        <div
                            className={`transform transition-all duration-500 delay-500 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                        >
                            <div className="flex items-start gap-4 mb-2 text-neutral-400">
                                <Phone className="w-5 h-5 mt-1" />
                                <span className="text-xs font-bold tracking-widest uppercase">Contact</span>
                            </div>
                            <a href="tel:+995577777949" className="text-lg md:text-xl lg:text-2xl font-inter font-medium text-black hover:text-orange-600 transition-colors">
                                +995 577 77 79 49
                            </a>
                        </div>

                        {/* Socials Block */}
                        <div
                            className={`transform transition-all duration-500 delay-700 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                        >
                            <div className="flex gap-4 md:gap-6">
                                <a
                                    href="https://www.instagram.com/monohall_tbilisi/?hl=en"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 md:w-12 md:h-12 border border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
                                >
                                    <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                                </a>
                                <a
                                    href="https://www.facebook.com/monohall/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 md:w-12 md:h-12 border border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
                                >
                                    <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
