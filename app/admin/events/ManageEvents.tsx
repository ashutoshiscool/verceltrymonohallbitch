"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Plus, Upload, Calendar, Star, Edit2, X } from "lucide-react";
import { createEvent, deleteEvent, updateEvent } from "./actions";

type Event = {
    id: number;
    artist: string;
    subtitle: string;
    date: string;
    price: string;
    status: string;
    ticket_url: string;
    image_base64: string;
    brand_id: number | null;
    brand_name: string | null;
    is_featured: number;
};

type Brand = {
    id: number;
    name: string;
    logo_base64: string;
};

interface ManageEventsProps {
    events: Event[];
    brands: Brand[];
}

export default function ManageEvents({ events: initialEvents, brands }: ManageEventsProps) {
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isFeatured, setIsFeatured] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setEvents(initialEvents);
    }, [initialEvents]);

    async function handleAddEvent(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setIsCreating(true);

        const formData = new FormData(e.currentTarget);
        formData.set("is_featured", isFeatured ? "true" : "false");
        const res = await createEvent(formData);

        if (res.success) {
            (e.target as HTMLFormElement).reset();
            setPreviewUrl(null);
            setIsFeatured(false);
            router.refresh();
        } else {
            setError(res.message || res.error || "Failed to create event");
        }
        setIsCreating(false);
    }

    async function handleUpdateEvent(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!editingEvent) return;
        setError("");

        const formData = new FormData(e.currentTarget);
        formData.set("is_featured", (e.currentTarget.querySelector('[name="edit_is_featured"]') as HTMLInputElement)?.checked ? "true" : "false");

        const res = await updateEvent(editingEvent.id, formData);

        if (res.success) {
            setEditingEvent(null);
            setEditPreviewUrl(null);
            router.refresh();
        } else {
            setError(res.message || res.error || "Failed to update event");
        }
    }

    async function handleDeleteEvent(id: number) {
        if (!confirm("Are you sure you want to delete this event?")) return;
        const res = await deleteEvent(id);
        if (res.success) {
            router.refresh();
        } else {
            alert(res.message || "Failed to delete event");
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setEditPreviewUrl(url);
        }
    };

    const featuredCount = events.filter(e => e.is_featured).length;

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-inter">
            {/* Header */}
            <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <span className="font-syne font-bold text-xl tracking-tight">
                            MANAGE EVENTS
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-12 max-w-6xl mx-auto w-full">

                {/* Create Event Section */}
                <div className="bg-white border border-neutral-200 p-8 mb-12 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-orange-400"></div>

                    <h2 className="font-syne font-bold text-2xl uppercase mb-8 flex items-center gap-3">
                        <Plus className="w-6 h-6 text-orange-600" />
                        Add New Event
                    </h2>

                    <form onSubmit={handleAddEvent} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Artist / Title */}
                            <div>
                                <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2">
                                    Artist Name (Title)
                                </label>
                                <input
                                    name="artist"
                                    type="text"
                                    placeholder="e.g. Ben Böhmer"
                                    className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600 transition-colors"
                                    required
                                />
                            </div>

                            {/* Subtitle / Genre */}
                            <div>
                                <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2">
                                    Subtitle / Genre
                                </label>
                                <input
                                    name="subtitle"
                                    type="text"
                                    placeholder="e.g. Live at Monohall / Melodic House"
                                    className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600 transition-colors"
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Date
                                </label>
                                <input
                                    name="date"
                                    type="date"
                                    className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600 transition-colors"
                                    required
                                />
                            </div>

                            {/* Brand */}
                            <div>
                                <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2">
                                    Brand
                                </label>
                                <select
                                    name="brand_id"
                                    className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600 transition-colors appearance-none"
                                >
                                    <option value="">No Brand</option>
                                    {brands.map(brand => (
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600 transition-colors appearance-none"
                                >
                                    <option value="Selling Fast">Selling Fast</option>
                                    <option value="Early Bird">Early Bird</option>
                                    <option value="Just Announced">Just Announced</option>
                                    <option value="Sold Out">Sold Out</option>
                                </select>
                            </div>

                            {/* Ticket URL */}
                            <div>
                                <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2">
                                    Ticket URL
                                </label>
                                <input
                                    name="ticket_url"
                                    type="url"
                                    placeholder="https://tkt.ge/..."
                                    className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600 transition-colors"
                                />
                            </div>

                            {/* Hidden price field for backwards compatibility */}
                            <input type="hidden" name="price" value="" />
                        </div>

                        {/* Featured Toggle */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsFeatured(!isFeatured)}
                                className={`flex items-center gap-2 px-4 py-2 border transition-colors ${isFeatured ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:border-orange-600'}`}
                            >
                                <Star className={`w-4 h-4 ${isFeatured ? 'fill-white' : ''}`} />
                                <span className="text-xs font-bold uppercase tracking-widest">Featured Event</span>
                            </button>
                            {isFeatured && featuredCount >= 5 && (
                                <span className="text-xs text-orange-600 font-medium">Warning: Already 5 featured events</span>
                            )}
                        </div>

                        {/* Image Upload - Full Width */}
                        <div>
                            <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2 flex items-center gap-2">
                                <Upload className="w-4 h-4" /> Cover Image (For Homepage Card)
                            </label>
                            <div className="flex gap-6 items-start">
                                <input
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full max-w-md text-xs text-neutral-500 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-xs file:font-bold file:uppercase file:bg-neutral-100 file:text-black hover:file:bg-black hover:file:text-white transition-all cursor-pointer border border-neutral-200 p-2"
                                    required
                                />
                                {previewUrl && (
                                    <div className="relative w-32 h-32 border border-neutral-200 bg-neutral-100 shrink-0">
                                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-neutral-100 pt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                {isCreating ? "Creating Event..." : "Create Event"}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-600 text-sm font-bold uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}
                </div>

                {/* Events List */}
                <div className="space-y-4">
                    <h3 className="font-syne font-bold text-xl uppercase mb-6">Existing Events</h3>

                    {events.length === 0 ? (
                        <div className="text-center py-12 text-neutral-400 text-sm border border-dashed border-neutral-300">
                            No events scheduled.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {events.map((event) => (
                                <div key={event.id} className="group bg-white border border-neutral-200 p-4 flex flex-col md:flex-row items-center gap-6 hover:border-orange-200 transition-all">

                                    {/* Image Preview */}
                                    <div className="w-full md:w-32 h-32 md:h-24 relative bg-neutral-100 shrink-0">
                                        {event.image_base64 && (
                                            <Image
                                                src={event.image_base64}
                                                alt={event.artist}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                        {event.is_featured === 1 && (
                                            <div className="absolute top-1 left-1 bg-orange-600 text-white p-1 rounded">
                                                <Star className="w-3 h-3 fill-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                                                {new Date(event.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full text-white uppercase font-bold tracking-widest w-fit mx-auto md:mx-0 ${event.status === 'Sold Out' ? 'bg-neutral-800' : 'bg-green-600'}`}>
                                                {event.status}
                                            </span>
                                            {event.brand_name && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-600 uppercase font-bold tracking-widest w-fit mx-auto md:mx-0">
                                                    {event.brand_name}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-syne font-bold text-lg uppercase">{event.artist}</h4>
                                        <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">{event.subtitle}</p>
                                    </div>

                                    <div className="flex flex-col gap-2 w-full md:w-auto">
                                        {event.ticket_url && (
                                            <a href={event.ticket_url} target="_blank" rel="noreferrer" className="text-[10px] text-center font-bold uppercase tracking-widest text-neutral-400 hover:text-orange-600 underline">
                                                Check Link
                                            </a>
                                        )}
                                        <Link
                                            href={`/admin/events/${event.id}`}
                                            className="px-4 py-2 bg-neutral-100 text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors text-center"
                                        >
                                            Gallery
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setEditingEvent(event);
                                                setEditPreviewUrl(null);
                                            }}
                                            className="px-4 py-2 bg-neutral-100 text-blue-600 text-xs font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEvent(event.id)}
                                            className="px-4 py-2 bg-neutral-100 text-red-600 text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Edit Modal */}
            {editingEvent && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
                        <button
                            onClick={() => setEditingEvent(null)}
                            className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="font-syne font-bold text-2xl uppercase mb-8 flex items-center gap-3">
                            <Edit2 className="w-6 h-6 text-orange-600" />
                            Edit Event
                        </h2>

                        <form onSubmit={handleUpdateEvent} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Artist Name</label>
                                    <input
                                        name="artist"
                                        type="text"
                                        defaultValue={editingEvent.artist}
                                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Subtitle</label>
                                    <input
                                        name="subtitle"
                                        type="text"
                                        defaultValue={editingEvent.subtitle}
                                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Date</label>
                                    <input
                                        name="date"
                                        type="date"
                                        defaultValue={editingEvent.date?.split('T')[0]}
                                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Brand</label>
                                    <select
                                        name="brand_id"
                                        defaultValue={editingEvent.brand_id || ""}
                                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600 appearance-none"
                                    >
                                        <option value="">No Brand</option>
                                        {brands.map(brand => (
                                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Status</label>
                                    <select
                                        name="status"
                                        defaultValue={editingEvent.status}
                                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600 appearance-none"
                                    >
                                        <option value="Selling Fast">Selling Fast</option>
                                        <option value="Early Bird">Early Bird</option>
                                        <option value="Just Announced">Just Announced</option>
                                        <option value="Sold Out">Sold Out</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Ticket URL</label>
                                    <input
                                        name="ticket_url"
                                        type="url"
                                        defaultValue={editingEvent.ticket_url}
                                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600"
                                    />
                                </div>
                            </div>

                            <input type="hidden" name="price" value="" />

                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="edit_is_featured"
                                        defaultChecked={editingEvent.is_featured === 1}
                                        className="w-4 h-4 accent-orange-600"
                                    />
                                    <span className="text-xs font-bold uppercase tracking-widest">Featured Event</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">New Image (optional)</label>
                                <div className="flex gap-4 items-start">
                                    <input
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleEditFileChange}
                                        className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:uppercase file:bg-neutral-100 file:text-black"
                                    />
                                    <div className="relative w-24 h-24 border border-neutral-200 bg-neutral-100 shrink-0">
                                        <Image
                                            src={editPreviewUrl || editingEvent.image_base64}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setEditingEvent(null)}
                                    className="px-6 py-2 border border-neutral-200 text-sm font-bold uppercase tracking-widest hover:bg-neutral-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-orange-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
