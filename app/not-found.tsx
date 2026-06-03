
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBrands } from "./admin/brands/actions";

export default async function NotFound() {
    const { brands } = await getBrands();

    return (
        <main className="w-full min-h-screen bg-black text-white pt-20 flex flex-col">
            <Navbar theme="dark" brands={brands || []} />

            <section className="flex-1 w-full px-6 md:px-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center gap-8">
                    <p className="text-sm font-bold tracking-[0.3em] text-orange-600 uppercase">
                        // Error 404
                    </p>
                    <h1 className="font-syne font-black text-[30vw] md:text-[20vw] leading-[0.8] tracking-tighter text-white opacity-90 select-none">
                        LOST
                    </h1>
                    <p className="font-inter text-neutral-400 text-lg md:text-xl max-w-md">
                        The page you are looking for has been consumed by the void.
                    </p>

                    <Link href="/" className="mt-8 inline-flex items-center gap-2 font-syne font-bold uppercase text-lg hover:text-orange-600 transition-colors border-b-2 border-white hover:border-orange-600 pb-1">
                        <ArrowLeft className="w-5 h-5" /> Return Home
                    </Link>
                </div>

                {/* Background Noise/Effect */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>
            </section>

            <Footer />
        </main>
    );
}
