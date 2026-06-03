
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { getBrands } from "../admin/brands/actions";

export default async function ContactPage() {
    const { brands } = await getBrands();

    return (
        <main className="w-full min-h-screen bg-white text-black pt-20">
            <Navbar brands={brands || []} />

            {/* Header */}
            <section className="w-full px-6 md:px-12 py-12 md:py-24 bg-neutral-100">
                <div className="max-w-[90rem] mx-auto">
                    <p className="text-xs font-bold tracking-[0.2em] text-orange-600 uppercase mb-4">
                        // Get in Touch
                    </p>
                    <h1 className="font-syne font-black text-6xl md:text-8xl uppercase tracking-tighter text-black">
                        Contact<br />Us
                    </h1>
                </div>
            </section>

            <section className="w-full px-6 md:px-12 py-24">
                <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Contact Info */}
                    <div className="flex flex-col gap-12">
                        <div className="space-y-6">
                            <h2 className="font-syne font-bold text-3xl uppercase">Venue Info</h2>
                            <p className="font-inter text-neutral-600 text-lg leading-relaxed">
                                Whether you're interested in booking the venue, have questions about an upcoming event, or just want to say hello, we're here to listen.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-orange-600 mb-1">
                                    <MapPin className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Address</span>
                                </div>
                                <p className="font-syne text-xl font-bold">
                                    2 Dzmebi Kakabadzeebi St,<br /> Tbilisi, Georgia
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-orange-600 mb-1">
                                    <Phone className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Phone</span>
                                </div>
                                <a href="tel:+995577777949" className="font-syne text-xl font-bold hover:text-orange-600 transition-colors">
                                    +995 577 77 79 49
                                </a>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-orange-600 mb-1">
                                    <Mail className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Email</span>
                                </div>
                                <a href="mailto:info@monohall.com" className="font-syne text-xl font-bold hover:text-orange-600 transition-colors">
                                    info@monohall.com
                                </a>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-orange-600 mb-1">
                                    <Clock className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Box Office</span>
                                </div>
                                <p className="font-syne text-xl font-bold">
                                    Mon - Fri: 12:00 - 20:00<br />
                                    Event Days: 18:00 - Late
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-[#111] p-8 md:p-12 text-white">
                        <h3 className="font-syne font-bold text-2xl uppercase mb-8">Send a Message</h3>
                        <form className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Name</label>
                                    <input type="text" className="bg-transparent border-b border-neutral-700 py-2 focus:border-orange-600 focus:outline-none transition-colors font-inter" placeholder="Your Name" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Email</label>
                                    <input type="email" className="bg-transparent border-b border-neutral-700 py-2 focus:border-orange-600 focus:outline-none transition-colors font-inter" placeholder="email@example.com" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Subject</label>
                                <select className="bg-transparent border-b border-neutral-700 py-2 focus:border-orange-600 focus:outline-none transition-colors font-inter appearance-none rounded-none">
                                    <option className="bg-neutral-900">General Inquiry</option>
                                    <option className="bg-neutral-900">Booking Request</option>
                                    <option className="bg-neutral-900">Lost & Found</option>
                                    <option className="bg-neutral-900">Press / Media</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Message</label>
                                <textarea className="bg-transparent border-b border-neutral-700 py-2 focus:border-orange-600 focus:outline-none transition-colors font-inter min-h-[120px] resize-none" placeholder="How can we help?"></textarea>
                            </div>

                            <button type="submit" className="mt-4 bg-white text-black font-syne font-bold uppercase py-4 px-8 w-fit hover:bg-orange-600 hover:text-white transition-colors">
                                Send Message
                            </button>
                        </form>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
