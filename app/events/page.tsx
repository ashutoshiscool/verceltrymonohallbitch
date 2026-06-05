import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getEvents } from "../admin/events/actions";
import { getBrands } from "../admin/brands/actions";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";

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

export default async function EventsPage() {
    const { events } = await getEvents();
    const { brands } = await getBrands();
    const allEvents: Event[] = events || [];

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcomingEvents = allEvents.filter(e => new Date(e.date) >= now);
    const pastEvents = allEvents.filter(e => new Date(e.date) < now).reverse(); // Most recent first

    const getMonth = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('default', { month: 'short' }).toUpperCase();
    };

    const getDay = (dateString: string) => {
        const date = new Date(dateString);
        return date.getDate().toString().padStart(2, '0');
    };

    const getYear = (dateString: string) => {
        const date = new Date(dateString);
        return date.getFullYear();
    };

    return (
        <main className="w-full min-h-screen bg-white text-black pt-20">
            <Navbar brands={brands || []} />

            {/* Page Header */}
            <section className="w-full px-6 md:px-12 py-12 md:py-24 bg-neutral-100 mb-12">
                <div className="max-w-[90rem] mx-auto">
                    <p className="text-xs font-bold tracking-[0.2em] text-orange-600 uppercase mb-4">
                        // Full Calendar
                    </p>
                    <h1 className="font-syne font-black text-6xl md:text-8xl uppercase tracking-tighter text-black">
                        All<br />Events
                    </h1>
                </div>
            </section>

            {/* Upcoming Events Section */}
            <section className="w-full px-6 md:px-12 pb-16 md:pb-24">
                <div className="max-w-[90rem] mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <Calendar className="w-6 h-6 text-orange-600" />
                        <h2 className="text-2xl md:text-4xl font-syne font-bold uppercase tracking-tight">
                            Upcoming Events
                        </h2>
                        <span className="text-sm font-bold text-neutral-400">({upcomingEvents.length})</span>
                    </div>

                    {upcomingEvents.length === 0 ? (
                        <div className="py-12 text-center text-neutral-400 font-inter uppercase tracking-widest text-sm border border-dashed border-neutral-300">
                            No upcoming events scheduled yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="group relative bg-neutral-50 hover:bg-neutral-100 transition-colors overflow-hidden"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        {event.image_url && (
                                            <Image
                                                src={event.image_url}
                                                alt={event.artist}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                        {/* Date Badge */}
                                        <div className="absolute top-4 left-4 bg-white px-3 py-2 text-center">
                                            <span className="block text-xs font-bold text-orange-600 tracking-widest">{getMonth(event.date)}</span>
                                            <span className="block text-2xl font-syne font-bold leading-none">{getDay(event.date)}</span>
                                        </div>

                                        {/* Status Badge */}
                                        <span className={`absolute top-4 right-4 px-3 py-1 text-[10px] uppercase tracking-widest font-bold ${event.status === "Sold Out" ? "bg-neutral-800 text-white" : "bg-orange-600 text-white"}`}>
                                            {event.status}
                                        </span>

                                        {/* Title on Image */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h3 className="text-2xl font-syne font-bold uppercase text-white leading-tight">
                                                {event.artist}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-2">{event.subtitle}</p>
                                        {event.brand_name && (
                                            <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">
                                                {event.brand_name}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 group-hover:text-orange-600 transition-colors">
                                                View Details
                                            </span>
                                            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-orange-600 transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Divider */}
            <div className="w-full px-6 md:px-12">
                <div className="max-w-[90rem] mx-auto border-t border-neutral-200"></div>
            </div>

            {/* Past Events Section */}
            <section className="w-full px-6 md:px-12 py-16 md:py-24">
                <div className="max-w-[90rem] mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <Clock className="w-6 h-6 text-neutral-400" />
                        <h2 className="text-2xl md:text-4xl font-syne font-bold uppercase tracking-tight text-neutral-600">
                            Past Events
                        </h2>
                        <span className="text-sm font-bold text-neutral-400">({pastEvents.length})</span>
                    </div>

                    {pastEvents.length === 0 ? (
                        <div className="py-12 text-center text-neutral-400 font-inter uppercase tracking-widest text-sm border border-dashed border-neutral-300">
                            No past events yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {pastEvents.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="group relative bg-neutral-50 hover:bg-neutral-100 transition-colors overflow-hidden"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square overflow-hidden">
                                        {event.image_url && (
                                            <Image
                                                src={event.image_url}
                                                alt={event.artist}
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                                        {/* Title on Image */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <span className="block text-[10px] text-white/70 font-bold tracking-widest mb-1">
                                                {getMonth(event.date)} {getDay(event.date)}, {getYear(event.date)}
                                            </span>
                                            <h3 className="text-lg font-syne font-bold uppercase text-white leading-tight">
                                                {event.artist}
                                            </h3>
                                            {event.brand_name && (
                                                <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mt-1">
                                                    {event.brand_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
