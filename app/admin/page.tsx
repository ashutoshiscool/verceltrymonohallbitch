"use client";

import { useActionState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { loginAction } from "./actions";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [state, action, isPending] = useActionState(loginAction, null);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push("/admin/dashboard");
        }
    }, [state, router]);

    return (
        <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-white">
            {/* Background Image Container (consistent with Hero) */}
            <div className="absolute inset-0 z-0 w-full h-full">
                <div className="relative w-full h-full">
                    <Image
                        src="/hero-bg.png"
                        alt="Monohall Background"
                        fill
                        className="object-cover grayscale contrast-125 brightness-110 opacity-20 blur-md"
                        priority
                        quality={100}
                    />
                    <div className="absolute inset-0 bg-white/20"></div>
                </div>
            </div>

            {/* Login Container */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="mb-12 text-center">
                    <p className="text-[11px] md:text-xs font-inter font-bold tracking-[0.25em] text-orange-600 uppercase mb-4">
                        Restricted Access
                    </p>
                    <h1 className="font-syne font-black text-5xl md:text-7xl leading-[0.8] tracking-tighter text-black uppercase">
                        Mono<br />Hall
                    </h1>
                </div>

                <form action={action} className="space-y-8">
                    <div className="space-y-1">
                        <label
                            htmlFor="username"
                            className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="w-full bg-transparent border-b-2 border-neutral-200 py-3 text-lg font-inter font-medium text-black focus:outline-none focus:border-orange-600 transition-colors placeholder:text-neutral-500"
                            placeholder="ENTER USERNAME"
                            autoComplete="off"
                        />
                    </div>

                    <div className="space-y-1">
                        <label
                            htmlFor="password"
                            className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full bg-transparent border-b-2 border-neutral-200 py-3 text-lg font-inter font-medium text-black focus:outline-none focus:border-orange-600 transition-colors placeholder:text-neutral-500"
                            placeholder="ENTER PASSWORD"
                        />
                    </div>

                    {state?.message && !state.success && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest text-center">
                            {state.message}
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="group w-full flex items-center justify-between bg-black text-white py-4 px-6 hover:bg-orange-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="font-syne font-bold text-xl uppercase tracking-wide">
                                {isPending ? "Authenticating..." : "Login Access"}
                            </span>
                            {isPending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-12 text-center">
                    <Link
                        href="/"
                        className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 hover:text-black transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-600"></div>
        </section>
    );
}
