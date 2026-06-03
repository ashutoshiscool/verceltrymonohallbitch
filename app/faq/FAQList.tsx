"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        question: "What is the dress code?",
        answer: "Monohall encourages freedom of expression. We have no strict dress code, but we ask guests to respect the vibe of the event. Casual, rave, or avant-garde — wear what makes you feel comfortable and confident."
    },
    {
        question: "Are there age restrictions?",
        answer: "Most events at Monohall are 18+. Please check the specific event details on our calendar as some shows may have different age requirements. Valid ID is required for entry."
    },
    {
        question: "Can I buy tickets at the door?",
        answer: "If the event is not sold out, tickets will be available at the box office. However, we strongly recommend purchasing in advance online to guarantee entry and secure the best price."
    },
    {
        question: "Is there a coat check?",
        answer: "Yes, we provide a secure coat check service for a small fee. We recommend checking large bags and heavy coats so you can enjoy the music freely."
    },
    {
        question: "Is the venue accessible?",
        answer: "Monohall is committed to accessibility. We have ramp access and dedicated viewing areas. Please contact us in advance if you have specific requirements so we can assist you."
    }
];

export default function FAQList() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="w-full px-6 md:px-12 py-24">
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-neutral-200 pb-4">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex justify-between items-center py-4 text-left group"
                        >
                            <span className={`font-syne font-bold text-xl md:text-3xl uppercase transition-colors ${openIndex === index ? "text-orange-600" : "text-black group-hover:text-neutral-600"}`}>
                                {faq.question}
                            </span>
                            <div className={`transform transition-transform duration-300 ${openIndex === index ? "rotate-180" : "rotate-0"}`}>
                                {openIndex === index ? <Minus className="w-6 h-6 text-orange-600" /> : <Plus className="w-6 h-6 text-black" />}
                            </div>
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                                }`}
                        >
                            <p className="font-inter text-neutral-600 text-lg leading-relaxed pt-2 pb-6">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
