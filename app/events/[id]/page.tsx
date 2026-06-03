import { getEvent, getEventGallery } from "../../admin/events/actions";
import { getBrands } from "../../admin/brands/actions";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: Props) {
    const { id } = await params;
    const { event } = await getEvent(id);
    const { gallery } = await getEventGallery(id);
    const { brands } = await getBrands();

    if (!event) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <h1 className="text-4xl font-syne font-bold text-neutral-300 uppercase">Event Not Found</h1>
                <Link href="/events" className="mt-4 text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-1">
                    View All Events
                </Link>
            </div>
        );
    }

    const eventDate = new Date(event.date);
    const isPast = eventDate < new Date();

    return (
        <main className="w-full min-h-screen bg-white text-black">
            <Navbar theme="dark" brands={brands || []} />

            {/* Hero Section */}
            <section className="relative w-full h-[70vh] min-h-[500px]">
                <div className="absolute inset-0">
                    {event.image_base64 && (
                        <Image
                            src={event.image_base64}
                            alt={event.artist}
                            fill
                            className="object-cover"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                </div>

                {/* Back Button */}
                <Link
                    href="/events"
                    className="absolute top-24 left-6 md:left-12 z-10 inline-flex items-center gap-2 group"
                >
                    <div className="w-10 h-10 border border-white/30 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors duration-300">
                        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <span className="hidden md:block text-xs font-bold tracking-widest uppercase text-white">
                        All Events
                    </span>
                </Link>

                {/* Event Info */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="max-w-[90rem] mx-auto">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2 text-white/70">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-bold tracking-widest uppercase">
                                    {eventDate.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${isPast ? 'bg-neutral-600 text-white' : event.status === 'Sold Out' ? 'bg-neutral-800 text-white' : 'bg-orange-600 text-white'}`}>
                                {isPast ? 'Past Event' : event.status}
                            </span>
                        </div>

                        <h1 className="font-syne font-black text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter text-white mb-2">
                            {event.artist}
                        </h1>

                        {event.subtitle && (
                            <p className="text-lg md:text-xl text-white/70 font-inter uppercase tracking-wider mb-6">
                                {event.subtitle}
                            </p>
                        )}

                        {event.brand_name && (
                            <p className="text-sm text-orange-400 font-bold uppercase tracking-widest mb-6">
                                Presented by {event.brand_name}
                            </p>
                        )}

                        {event.ticket_url && !isPast && (
                            <a
                                href={event.ticket_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-orange-600 hover:text-white transition-colors"
                            >
                                Get Tickets
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            {gallery && gallery.length > 0 && (
                <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-neutral-50">
                    <div className="max-w-[90rem] mx-auto">
                        <h2 className="text-3xl md:text-5xl font-syne font-bold uppercase tracking-tight mb-12">
                            Event Gallery
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {gallery.map((image: { id: number; image_base64: string; caption: string }) => (
                                <div key={image.id} className="group relative aspect-square overflow-hidden bg-neutral-200">
                                    <Image
                                        src={image.image_base64}
                                        alt={image.caption || event.artist}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {image.caption && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <p className="text-white text-sm font-medium">{image.caption}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* No Gallery Message for Past Events */}
            {isPast && (!gallery || gallery.length === 0) && (
                <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-neutral-50">
                    <div className="max-w-[90rem] mx-auto text-center">
                        <p className="text-neutral-400 uppercase tracking-widest text-sm">
                            Gallery photos coming soon
                        </p>
                    </div>
                </section>
            )}

            <Footer />
        </main>
    );
}
