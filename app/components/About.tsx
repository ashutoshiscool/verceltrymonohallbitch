"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const containerRef = useRef(null);
    const leftTextRef = useRef(null);
    const rightImageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Text Animation
            gsap.from(leftTextRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%", // Trigger earlier
                }
            });

            // Image Animation - Parallax Effect
            gsap.fromTo(rightImageRef.current,
                { scale: 1.1 },
                {
                    scale: 1,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full bg-[#111111] text-white">
            {/* 
               Responsive Layout:
               - Mobile/Tablet: Flex Column (Image First, Text Second) 
               - Desktop (lg+): Two Column Grid (Text Left, Image Right)
            */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 w-full min-h-screen">

                {/* Left Column: Text Content */}
                {/* Order-2 on mobile ensures it comes after the image visually if we want Image Top approach. 
                    However, usually 'About' implies reading first. Let's stick to standard flow or explicit order.
                    User code had Image 'order-1' on mobile. We will keep that.
                */}
                <div className="relative order-2 lg:order-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-32 py-16 md:py-24 lg:py-0 w-full bg-[#111111] z-10">
                    <div ref={leftTextRef} className="flex flex-col gap-8 w-full max-w-2xl mx-auto lg:mx-0">
                        {/* Headers */}
                        <div className="space-y-4">
                            <h2 className="text-xs md:text-sm font-bold tracking-[0.2em] text-orange-500 uppercase">
                                // EST. 2020 Tbilisi
                            </h2>
                            <h3 className="font-syne font-black text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] text-white uppercase tracking-tighter break-words hyphens-auto">
                                Sonic<br />Cathedral
                            </h3>
                        </div>

                        {/* Description */}
                        <div className="space-y-6 text-neutral-400 font-inter text-base md:text-lg lg:text-xl leading-relaxed">
                            <p>
                                Monohall is a brutalist shrine to sound.
                                Carved from concrete and powered by Funktion-One acoustics,
                                we exist at the intersection of industrial architecture and electronic culture.
                            </p>
                            <p className="text-neutral-500 font-light">
                                Hosting the underground's pivotal moments,
                                transforming nights into collective memories.
                                Where Tbilisi breathes.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-800">
                            <div>
                                <p className="text-2xl md:text-3xl lg:text-4xl font-syne font-bold text-white">2.5k</p>
                                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-2">Capacity</p>
                            </div>
                            <div>
                                <p className="text-2xl md:text-3xl lg:text-4xl font-syne font-bold text-white">150+</p>
                                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-2">Events</p>
                            </div>
                            <div>
                                <p className="text-2xl md:text-3xl lg:text-4xl font-syne font-bold text-white">∞KB</p>
                                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-2">Power</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Image */}
                <div className="relative order-1 lg:order-2 w-full h-[50vh] min-h-[400px] lg:h-auto lg:min-h-screen overflow-hidden">
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            ref={rightImageRef}
                            src="/about-venue.png"
                            alt="Monohall Interior"
                            fill
                            className="object-cover grayscale opacity-80"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority={false}
                        />
                        <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
                    </div>
                </div>

            </div>
        </section>
    );
}
