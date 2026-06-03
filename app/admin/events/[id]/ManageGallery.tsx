"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Trash2, Plus, X } from "lucide-react";
import { addToGallery, deleteFromGallery } from "../actions";

type GalleryImage = {
    id: number;
    event_id: number;
    image_base64: string;
    caption: string;
    created_at: string;
};

type Event = {
    id: number;
    artist: string;
    date: string;
};

interface ManageGalleryProps {
    id: string;
    event: Event | null;
    gallery: GalleryImage[];
}

export default function ManageGallery({ id, event, gallery: initialGallery }: ManageGalleryProps) {
    const [gallery, setGallery] = useState<GalleryImage[]>(initialGallery);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const router = useRouter();

    useEffect(() => {
        setGallery(initialGallery);
    }, [initialGallery]);

    async function handleAddImage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setIsUploading(true);

        const formData = new FormData(e.currentTarget);
        const res = await addToGallery(parseInt(id), formData);

        if (res.success) {
            (e.target as HTMLFormElement).reset();
            setPreviewUrl(null);
            router.refresh();
        } else {
            setError(res.message || res.error || "Failed to add image");
        }
        setIsUploading(false);
    }

    async function handleDeleteImage(imageId: number) {
        if (!confirm("Are you sure you want to delete this image?")) return;
        const res = await deleteFromGallery(imageId, parseInt(id));
        if (res.success) {
            setSelectedImage(null);
            router.refresh();
        } else {
            alert(res.message || "Failed to delete image");
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    if (!event) {
        return (
            <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4">
                <p className="text-neutral-400 uppercase tracking-widest text-sm">Event not found</p>
                <Link href="/admin/events" className="text-xs font-bold uppercase tracking-widest underline">
                    Back to Events
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-inter">
            {/* Header */}
            <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/events" className="p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <span className="font-syne font-bold text-xl tracking-tight block">
                                EVENT GALLERY
                            </span>
                            <span className="text-xs text-neutral-500 uppercase tracking-widest">
                                {event.artist} - {new Date(event.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                    <Link
                        href={`/events/${id}`}
                        target="_blank"
                        className="text-xs font-bold uppercase tracking-widest text-orange-600 hover:underline"
                    >
                        View Event Page
                    </Link>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-12 max-w-6xl mx-auto w-full">

                {/* Upload Section */}
                <div className="bg-white border border-neutral-200 p-8 mb-12 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-orange-400"></div>

                    <h2 className="font-syne font-bold text-2xl uppercase mb-8 flex items-center gap-3">
                        <Plus className="w-6 h-6 text-orange-600" />
                        Add Photo to Gallery
                    </h2>

                    <form onSubmit={handleAddImage} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> Photo
                                </label>
                                <input
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full text-xs text-neutral-500 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-xs file:font-bold file:uppercase file:bg-neutral-100 file:text-black hover:file:bg-black hover:file:text-white transition-all cursor-pointer border border-neutral-200 p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                                    Caption (optional)
                                </label>
                                <input
                                    name="caption"
                                    type="text"
                                    placeholder="e.g. Opening set"
                                    className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600 transition-colors"
                                />
                            </div>
                        </div>

                        {previewUrl && (
                            <div className="relative w-48 h-48 border border-neutral-200 bg-neutral-100">
                                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isUploading}
                                className="px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                {isUploading ? "Uploading..." : "Add to Gallery"}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-600 text-sm font-bold uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}
                </div>

                {/* Gallery Grid */}
                <div>
                    <h3 className="font-syne font-bold text-xl uppercase mb-6">
                        Gallery ({gallery.length} {gallery.length === 1 ? 'photo' : 'photos'})
                    </h3>

                    {gallery.length === 0 ? (
                        <div className="text-center py-12 text-neutral-400 text-sm border border-dashed border-neutral-300">
                            No photos in gallery yet. Add some photos above!
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {gallery.map((image) => (
                                <div
                                    key={image.id}
                                    className="group relative aspect-square bg-neutral-100 cursor-pointer overflow-hidden"
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <Image
                                        src={image.image_base64}
                                        alt={image.caption || "Gallery image"}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteImage(image.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {image.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                                            <p className="text-white text-xs truncate">{image.caption}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 text-white hover:text-orange-600 transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative max-w-4xl max-h-[80vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={selectedImage.image_base64}
                            alt={selectedImage.caption || "Gallery image"}
                            fill
                            className="object-contain"
                        />
                    </div>

                    {selectedImage.caption && (
                        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/50 px-4 py-2 rounded">
                            {selectedImage.caption}
                        </p>
                    )}

                    <button
                        className="absolute bottom-8 right-8 px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
                        onClick={() => handleDeleteImage(selectedImage.id)}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
