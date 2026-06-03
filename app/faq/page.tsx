
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FAQList from "./FAQList";
import { getBrands } from "../admin/brands/actions";

export default async function FAQPage() {
    const { brands } = await getBrands();

    return (
        <main className="w-full min-h-screen bg-white text-black pt-20">
            <Navbar brands={brands || []} />

            {/* Header */}
            <section className="w-full px-6 md:px-12 py-12 md:py-24 bg-neutral-100">
                <div className="max-w-[90rem] mx-auto">
                    <p className="text-xs font-bold tracking-[0.2em] text-orange-600 uppercase mb-4">
                        // Help Center
                    </p>
                    <h1 className="font-syne font-black text-6xl md:text-8xl uppercase tracking-tighter text-black">
                        FAQ
                    </h1>
                </div>
            </section>

            <FAQList />

            <Footer />
        </main>
    );
}
