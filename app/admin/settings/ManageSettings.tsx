"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sliders, Monitor, Smartphone, LayoutTemplate } from "lucide-react";
import { updateSettings } from "./actions";

type Settings = {
    hero_layout: "TOP-R" | "BOTTOM-M";
    brand_size: string;
    brand_spacing: string;
};

interface ManageSettingsProps {
    settings: Settings;
}

export default function ManageSettings({ settings: initialSettings }: ManageSettingsProps) {
    const defaultSettings: Settings = {
        hero_layout: "TOP-R",
        brand_size: "90",
        brand_spacing: "24",
    };

    const [settings, setSettings] = useState<Settings>(initialSettings || defaultSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (initialSettings) {
            setSettings(initialSettings);
        }
    }, [initialSettings]);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage("");
        const res = await updateSettings(settings);
        if (res.success) {
            setMessage("Settings updated successfully!");
            router.refresh(); // Refresh server data
        } else {
            setMessage("Failed to update settings.");
        }
        setIsSaving(false);
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-inter">
            {/* Header */}
            <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <span className="font-syne font-bold text-xl tracking-tight">
                            SITE CONFIGURATION
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto w-full">
                <div className="bg-white border border-neutral-200 p-8 shadow-sm">

                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-neutral-100">
                        <Sliders className="w-6 h-6 text-orange-600" />
                        <h2 className="font-syne font-bold text-2xl uppercase">Hero / Brands Layout</h2>
                    </div>

                    <div className="space-y-8">
                        {/* Layout Selection */}
                        <div>
                            <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-4">
                                Brand Logos Position
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setSettings({ ...settings, hero_layout: "TOP-R" })}
                                    className={`relative p-6 border-2 flex flex-col items-center gap-4 transition-all ${settings.hero_layout === "TOP-R"
                                        ? "border-orange-600 bg-orange-50 text-orange-900"
                                        : "border-neutral-200 hover:border-neutral-300 text-neutral-500"
                                        }`}
                                >
                                    <div className="w-full h-32 bg-neutral-200 relative border border-neutral-300">
                                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                                            <div className="w-4 h-2 bg-neutral-400"></div>
                                            <div className="w-4 h-2 bg-neutral-400"></div>
                                            <div className="w-4 h-2 bg-neutral-400"></div>
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-neutral-400 opacity-50">HERO</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Monitor className="w-4 h-4" />
                                        <span className="font-bold uppercase tracking-wider text-sm">TOP-R (Desktop Right)</span>
                                    </div>
                                    {settings.hero_layout === "TOP-R" && <div className="absolute top-4 right-4 w-3 h-3 bg-orange-600 rounded-full"></div>}
                                </button>

                                <button
                                    onClick={() => setSettings({ ...settings, hero_layout: "BOTTOM-M" })}
                                    className={`relative p-6 border-2 flex flex-col items-center gap-4 transition-all ${settings.hero_layout === "BOTTOM-M"
                                        ? "border-orange-600 bg-orange-50 text-orange-900"
                                        : "border-neutral-200 hover:border-neutral-300 text-neutral-500"
                                        }`}
                                >
                                    <div className="w-full h-32 bg-neutral-200 relative border border-neutral-300 flex flex-col justify-end">
                                        <div className="w-full h-8 bg-neutral-300 flex items-center justify-center gap-2">
                                            <div className="w-4 h-2 bg-neutral-500"></div>
                                            <div className="w-4 h-2 bg-neutral-500"></div>
                                            <div className="w-4 h-2 bg-neutral-500"></div>
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-neutral-400 opacity-50">HERO</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LayoutTemplate className="w-4 h-4" />
                                        <span className="font-bold uppercase tracking-wider text-sm">BOTTOM-M (Bottom Bar)</span>
                                    </div>
                                    {settings.hero_layout === "BOTTOM-M" && <div className="absolute top-4 right-4 w-3 h-3 bg-orange-600 rounded-full"></div>}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Logo Size */}
                            <div>
                                <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2">
                                    Logo Max Width (px)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        value={settings.brand_size}
                                        onChange={(e) => setSettings({ ...settings, brand_size: e.target.value })}
                                        className="flex-1 bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600 transition-colors"
                                    />
                                    <span className="text-sm font-bold text-neutral-400 w-12 text-center">{settings.brand_size}px</span>
                                </div>
                            </div>

                            {/* Spacing */}
                            <div>
                                <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2">
                                    Gap Between Logos (px)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        value={settings.brand_spacing}
                                        onChange={(e) => setSettings({ ...settings, brand_spacing: e.target.value })}
                                        className="flex-1 bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600 transition-colors"
                                    />
                                    <span className="text-sm font-bold text-neutral-400 w-12 text-center">{settings.brand_spacing}px</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-neutral-100 pt-8 flex items-center justify-between">
                            {message && <span className="text-sm font-bold text-orange-600 uppercase tracking-wider animate-pulse">{message}</span>}
                            {!message && <span></span>}

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? "Saving..." : "Save Configuration"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
