import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import FeaturedEvents from "./components/FeaturedEvents";
import Footer from "./components/Footer";
import { getBrands } from "./admin/brands/actions";
import { getFeaturedEvents } from "./admin/events/actions";
import { getSettings } from "./admin/settings/actions";

export default async function Home() {
    const { brands } = await getBrands();
    const { events: featuredEvents } = await getFeaturedEvents();
    const settings = await getSettings();

    return (
        <main className="w-full min-h-screen bg-white text-white">
            <Navbar brands={brands || []} />
            <Hero brands={brands} settings={settings} />
            <FeaturedEvents events={featuredEvents || []} />
            <About />
            <Footer />
        </main>
    );
}
