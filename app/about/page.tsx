
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import About from "../components/About";
import Image from "next/image";
import { getBrands } from "../admin/brands/actions";

export default async function AboutPage() {
    const { brands } = await getBrands();

    return (
        <main className="w-full min-h-screen bg-[#111111] text-white pt-20">
            <Navbar theme="dark" brands={brands || []} />

            {/* Page Header */}
            <section className="w-full px-6 md:px-12 py-12 md:py-24 bg-[#111111] border-b border-neutral-800">
                <div className="max-w-[90rem] mx-auto">
                    <p className="text-xs font-bold tracking-[0.2em] text-orange-600 uppercase mb-4">
                         // The Venue
                    </p>
                    <h1 className="font-syne font-black text-6xl md:text-8xl uppercase tracking-tighter text-white">
                        About<br />Monohall
                    </h1>
                </div>
            </section>

            {/* Reuse Main About Section */}
            <About />

            {/* Additional Content - History/Philosophy */}
            <section className="w-full py-24 px-6 md:px-12 bg-white text-black">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="space-y-6">
                        <h2 className="font-syne font-bold text-4xl md:text-5xl uppercase">Our Philosophy</h2>
                        <p className="font-inter text-lg md:text-xl text-neutral-600 leading-relaxed">
                            We believe that a venue is more than just a space—it is a living, breathing entity that shapes the experience of sound. Monohall was conceived as a reaction against the sterile, corporate venues that dominate the modern landscape. We wanted to build something raw, something real.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="relative h-80 w-full overflow-hidden bg-neutral-200">
                            <Image
                                src="/technical-excellence.png"
                                alt="Funktion-One Sound System"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="flex flex-col justify-center gap-6">
                            <h3 className="font-syne font-bold text-2xl uppercase">Technical Excellence</h3>
                            <p className="font-inter text-neutral-600">
                                Equipped with a custom-tuned Funktion-One sound system, Monohall delivers audio with surgical precision. Every corner of the room is acoustically treated to ensure that the bass hits your chest, not the walls.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
