"use client";

import { useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Event = {
    id: number;
    artist: string;
    subtitle: string;
    date: string;
    price: string;
    status: string;
    ticket_url: string;
    image_url: string;
    brand_name?: string;
};

export default function FeaturedEvents({ events = [] }: { events: Event[] }) {
    const [activeEvent, setActiveEvent] = useState(0);

    const getMonth = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('default', { month: 'short' }).toUpperCase();
    };

    const getDay = (dateString: string) => {
        const date = new Date(dateString);
        return date.getDate().toString().padStart(2, '0');
    };

    return (
        <section id="featured-events" className="relative w-full bg-white py-16 md:py-24 lg:py-32 px-6 md:px-12 text-black">
            <div className="max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-12 xl:gap-24">

                {/* Scrollable List */}
                <div className="flex-1 w-full">
                    <div className="flex justify-between items-end mb-12 md:mb-16">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="w-5 h-5 text-orange-600 fill-orange-600" />
                                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Pinned</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-syne font-bold uppercase tracking-tight leading-none">
                                Featured<br />Shows
                            </h2>
                        </div>
                        <Link href="/events" className="hidden md:flex text-xs font-bold font-inter tracking-widest uppercase items-center gap-2 border-b border-black pb-1 hover:text-orange-600 hover:border-orange-600 transition-colors">
                            All Events <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="flex flex-col w-full">
                        {events.length === 0 ? (
                            <div className="py-12 text-center text-neutral-400 font-inter uppercase tracking-widest text-sm">
                                No featured shows yet. Check all events.
                            </div>
                        ) : events.map((event, index) => (
                            <Link
                                key={event.id}
                                href={`/events/${event.id}`}
                                onMouseEnter={() => setActiveEvent(index)}
                                className="group relative border-t border-neutral-200 py-6 md:py-10 lg:py-12 cursor-pointer transition-all duration-300 hover:border-black block"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    {/* Date */}
                                    <div className="flex flex-col items-center flex-shrink-0 w-14 md:w-20">
                                        <span className="text-xs md:text-sm font-bold tracking-widest text-neutral-400 group-hover:text-orange-600 transition-colors">
                                            {getMonth(event.date)}
                                        </span>
                                        <span className="text-xl md:text-2xl lg:text-4xl font-syne font-bold">
                                            {getDay(event.date)}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 pl-3 md:pl-8 min-w-0">
                                        <h3 className="text-lg md:text-2xl lg:text-3xl font-syne font-bold uppercase mb-2 group-hover:translate-x-2 transition-transform duration-300 truncate md:whitespace-normal">
                                            {event.artist}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm font-inter font-medium text-neutral-500">
                                            <span className="uppercase tracking-wider whitespace-nowrap">{event.subtitle}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest text-white whitespace-nowrap ${event.status === "Sold Out" ? "bg-neutral-800" : "bg-orange-600"}`}>
                                                {event.status}
                                            </span>
                                            {event.brand_name && (
                                                <span className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">
                                                    {event.brand_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action - Desktop */}
                                    <div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-[10px] uppercase font-bold tracking-widest underline decoration-orange-600 decoration-2 underline-offset-4">
                                            View Details
                                        </span>
                                    </div>

                                    {/* Action - Mobile Arrow */}
                                    <div className="md:hidden">
                                        <ArrowUpRight className="w-5 h-5 text-neutral-400" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <Link href="/events" className="md:hidden mt-8 flex w-full justify-center text-xs font-bold font-inter tracking-widest uppercase items-center gap-2 border border-black py-4 hover:bg-black hover:text-white transition-colors">
                        View All Events
                    </Link>
                </div>

                {/* Sticky Preview Card - Hidden on Mobile/Tablet */}
                <div className="hidden lg:block w-full max-w-[400px] xl:max-w-[500px] h-[500px] xl:h-[600px] sticky top-32 flex-shrink-0">
                    <div className="relative w-full h-full overflow-hidden rounded-sm bg-neutral-100">
                        {events.length > 0 && events.map((event, index) => (
                            <Link
                                key={event.id}
                                href={`/events/${event.id}`}
                                className={`absolute inset-0 transition-opacity duration-500 flex items-center justify-center ${activeEvent === index ? "opacity-100 z-10" : "opacity-0 z-0"
                                    }`}
                            >
                                {/* Image Background */}
                                <div className="absolute inset-0 w-full h-full">
                                    {event.image_url && (
                                        <Image
                                            src={event.image_url}
                                            alt={event.artist}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
                                </div>

                                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                                    <h4 className="text-4xl md:text-5xl font-syne font-bold uppercase mb-2 drop-shadow-lg leading-none">{event.artist}</h4>
                                    <p className="font-inter text-sm tracking-widest uppercase opacity-90 drop-shadow-md">{event.subtitle}</p>
                                    <span className="inline-block mt-6 px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-orange-600 hover:text-white transition-colors">
                                        View Event
                                    </span>
                                </div>
                            </Link>
                        ))}
                        {events.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-neutral-400 uppercase tracking-widest text-xs">
                                No featured events
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
}
