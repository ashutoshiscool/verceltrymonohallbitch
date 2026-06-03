"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Plus, Upload, Type, PenLine } from "lucide-react";
import { createBrand, deleteBrand } from "./actions";

type Brand = {
    id: number;
    name: string;
    logo_base64: string;
    description: string;
    created_at: string;
};

interface ManageBrandsProps {
    brands: Brand[];
}

export default function ManageBrands({ brands: initialBrands }: ManageBrandsProps) {
    const [brands, setBrands] = useState<Brand[]>(initialBrands);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setBrands(initialBrands);
    }, [initialBrands]);

    async function handleAddBrand(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setIsCreating(true);

        const formData = new FormData(e.currentTarget);
        const res = await createBrand(formData);

        if (res.success) {
            (e.target as HTMLFormElement).reset();
            setPreviewUrl(null);
            router.refresh();
        } else {
            setError(res.message || res.error || "Failed to create brand");
        }
        setIsCreating(false);
    }

    async function handleDeleteBrand(id: number) {
        if (!confirm("Are you sure you want to delete this brand?")) return;
        const res = await deleteBrand(id);
        if (res.success) {
            router.refresh();
        } else {
            alert(res.message || "Failed to delete brand");
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-inter">
            {/* Header */}
            <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <span className="font-syne font-bold text-xl tracking-tight">
                            MANAGE BRANDS
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">

                {/* Create Brand Section */}
                <div className="bg-white border border-neutral-200 p-8 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-orange-400"></div>

                    <h2 className="font-syne font-bold text-2xl uppercase mb-6 flex items-center gap-3">
                        <Plus className="w-6 h-6 text-orange-600" />
                        Add New Partner
                    </h2>

                    <form onSubmit={handleAddBrand} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2 flex items-center gap-2">
                                        <Type className="w-4 h-4" /> Brand Name
                                    </label>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="e.g. Red Bull"
                                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600 transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2 flex items-center gap-2">
                                        <Upload className="w-4 h-4" /> Logo Upload
                                    </label>
                                    <div className="relative group">
                                        <input
                                            name="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-neutral-100 file:text-black hover:file:bg-black hover:file:text-white transition-all cursor-pointer border border-neutral-200 p-2"
                                            required
                                        />
                                    </div>
                                    {previewUrl && (
                                        <div className="mt-4 relative w-32 h-16 border border-neutral-200 flex items-center justify-center bg-neutral-50">
                                            <Image src={previewUrl} alt="Preview" fill className="object-contain p-2" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2 flex items-center gap-2">
                                    <PenLine className="w-4 h-4" /> Description (Markdown)
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="# About the Brand&#10;Enter details here..."
                                    className="w-full h-48 bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-mono focus:outline-none focus:border-orange-600 transition-colors resize-none"
                                ></textarea>
                                <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider text-right">Supports Markdown</p>
                            </div>
                        </div>

                        <div className="border-t border-neutral-100 pt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                {isCreating ? "Adding..." : "Add Brand"}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-600 text-sm font-bold uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}
                </div>

                {/* Brands List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brands.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-neutral-400 text-sm">
                            No brands found.
                        </div>
                    ) : (
                        brands.map((brand) => (
                            <div key={brand.id} className="group bg-white border border-neutral-200 p-6 flex flex-col gap-4 hover:border-orange-200 transition-colors relative">
                                <div className="h-24 relative w-full flex items-center justify-center bg-neutral-50 border border-neutral-100 p-4 grayscale group-hover:grayscale-0 transition-all duration-500">
                                    {brand.logo_base64 && (
                                        <Image
                                            src={brand.logo_base64}
                                            alt={brand.name}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-syne font-bold text-lg uppercase mb-1">{brand.name}</h3>
                                    <p className="text-xs text-neutral-400 font-mono line-clamp-2">
                                        {brand.description}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleDeleteBrand(brand.id)}
                                    className="absolute top-4 right-4 p-2 text-neutral-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete Brand"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
