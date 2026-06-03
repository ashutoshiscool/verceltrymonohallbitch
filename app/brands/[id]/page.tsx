import { getBrand } from "../actions";
import { getEventsByBrand } from "../../admin/events/actions";
import { getBrands } from "../../admin/brands/actions";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, ArrowUpRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

interface Props {
    params: Promise<{ id: string }>;
}

type Event = {
    id: number;
    artist: string;
    subtitle: string;
    date: string;
    status: string;
    ticket_url: string;
    image_base64: string;
};

export default async function BrandPage({ params }: Props) {
    const { id } = await params;
    const { brand } = await getBrand(id);
    const { events } = await getEventsByBrand(id);
    const { brands } = await getBrands();

    if (!brand) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <h1 className="text-4xl font-syne font-bold text-neutral-300 uppercase">Brand Not Found</h1>
                <Link href="/" className="mt-4 text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-1">
                    Return Home
                </Link>
            </div>
        );
    }

    const allEvents: Event[] = events || [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcomingEvents = allEvents.filter(e => new Date(e.date) >= now);
    const pastEvents = allEvents.filter(e => new Date(e.date) < now).reverse();

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
        <div className="min-h-screen bg-white text-black font-inter selection:bg-orange-600 selection:text-white">
            <Navbar brands={brands || []} />

            {/* Hero Section */}
            <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-12 bg-neutral-100">
                <div className="max-w-[90rem] mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 group mb-8"
                    >
                        <div className="w-10 h-10 border border-neutral-200 bg-white rounded-full flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300 shadow-sm">
                            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-bold tracking-widest uppercase text-neutral-500">
                            Back to Home
                        </span>
                    </Link>

                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                        {/* Brand Logo */}
                        <div className="relative w-32 h-24 md:w-48 md:h-32 grayscale hover:grayscale-0 transition-all duration-700">
                            {brand.logo_base64 && (
                                <Image
                                    src={brand.logo_base64}
                                    alt={brand.name}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            )}
                        </div>

                        <div>
                            <h1 className="font-syne font-black text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter text-center md:text-left">
                                {brand.name}
                            </h1>
                            <div className="h-1 w-24 bg-orange-600 mt-4 mx-auto md:mx-0"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand Description */}
            {brand.description && (
                <section className="w-full py-12 md:py-16 px-6 md:px-12 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <ReactMarkdown
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                h1: ({ node, ...props }) => <h1 className="font-syne font-black text-3xl md:text-5xl uppercase mb-6 mt-10 first:mt-0" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="font-syne font-bold text-2xl md:text-3xl uppercase mb-4 mt-8" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="font-syne font-bold text-xl md:text-2xl uppercase mb-3 mt-6" {...props} />,
                                p: ({ node, ...props }) => <p className="font-inter text-neutral-600 text-base md:text-lg leading-relaxed mb-6" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-6 space-y-2 font-inter text-neutral-600" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-6 space-y-2 font-inter text-neutral-600" {...props} />,
                                li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                                a: ({ node, ...props }) => <a className="text-orange-600 hover:underline font-bold transition-colors" {...props} />,
                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-orange-600 pl-6 py-2 my-6 font-syne font-bold text-xl md:text-2xl italic text-neutral-800 bg-neutral-50" {...props} />,
                                img: ({ node, ...props }) => <img className="rounded-lg w-full h-auto my-8" {...props} />,
                                code: ({ node, ...props }) => <code className="bg-neutral-100 px-2 py-1 rounded text-sm font-mono text-orange-600" {...props} />,
                            }}
                        >
                            {brand.description}
                        </ReactMarkdown>
                    </div>
                </section>
            )}

            {/* Upcoming Events Section */}
            <section className="w-full py-12 md:py-16 px-6 md:px-12 bg-neutral-50">
                <div className="max-w-[90rem] mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <Calendar className="w-6 h-6 text-orange-600" />
                        <h2 className="text-2xl md:text-4xl font-syne font-bold uppercase tracking-tight">
                            Upcoming Events
                        </h2>
                        <span className="text-sm font-bold text-neutral-400">({upcomingEvents.length})</span>
                    </div>

                    {upcomingEvents.length === 0 ? (
                        <div className="py-12 text-center text-neutral-400 font-inter uppercase tracking-widest text-sm border border-dashed border-neutral-300 bg-white">
                            No upcoming events for {brand.name} yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="group relative bg-white hover:bg-neutral-100 transition-colors overflow-hidden"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        {event.image_base64 && (
                                            <Image
                                                src={event.image_base64}
                                                alt={event.artist}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                        <div className="absolute top-4 left-4 bg-white px-3 py-2 text-center">
                                            <span className="block text-xs font-bold text-orange-600 tracking-widest">{getMonth(event.date)}</span>
                                            <span className="block text-2xl font-syne font-bold leading-none">{getDay(event.date)}</span>
                                        </div>

                                        <span className={`absolute top-4 right-4 px-3 py-1 text-[10px] uppercase tracking-widest font-bold ${event.status === "Sold Out" ? "bg-neutral-800 text-white" : "bg-orange-600 text-white"}`}>
                                            {event.status}
                                        </span>

                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h3 className="text-2xl font-syne font-bold uppercase text-white leading-tight">
                                                {event.artist}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-2">{event.subtitle}</p>
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

            {/* Past Events Section */}
            {pastEvents.length > 0 && (
                <section className="w-full py-12 md:py-16 px-6 md:px-12 bg-white">
                    <div className="max-w-[90rem] mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <Clock className="w-6 h-6 text-neutral-400" />
                            <h2 className="text-2xl md:text-4xl font-syne font-bold uppercase tracking-tight text-neutral-600">
                                Past Events
                            </h2>
                            <span className="text-sm font-bold text-neutral-400">({pastEvents.length})</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {pastEvents.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="group relative bg-neutral-50 hover:bg-neutral-100 transition-colors overflow-hidden"
                                >
                                    <div className="relative aspect-square overflow-hidden">
                                        {event.image_base64 && (
                                            <Image
                                                src={event.image_base64}
                                                alt={event.artist}
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <span className="block text-[10px] text-white/70 font-bold tracking-widest mb-1">
                                                {getMonth(event.date)} {getDay(event.date)}, {getYear(event.date)}
                                            </span>
                                            <h3 className="text-lg font-syne font-bold uppercase text-white leading-tight">
                                                {event.artist}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
}
