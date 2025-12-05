"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const partners = [
    { name: "WHO", logo: "WHO" },
    { name: "FDA", logo: "FDA" },
    { name: "GMP", logo: "GMP" },
    { name: "ISO", logo: "ISO" },
    { name: "DCGI", logo: "DCGI" },
    { name: "USFDA", logo: "USFDA" },
    { name: "WHO", logo: "WHO" },
    { name: "FDA", logo: "FDA" },
];

const PartnerLogos = () => {
    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Infinite scroll animation for logos
        gsap.to(".logos-track", {
            xPercent: -50,
            duration: 20,
            ease: "none",
            repeat: -1,
        });

        // Fade in the section
        gsap.from(".partners-section", {
            scrollTrigger: {
                trigger: ".partners-section",
                start: "top 90%",
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out"
        });
    }, []);

    return (
        <section className="partners-section py-16 bg-slate-50 border-y border-slate-100 overflow-hidden">
            <div className="container mx-auto px-6 mb-8">
                <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Trusted & Certified By
                </p>
            </div>

            <div className="relative">
                {/* Gradient overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10" />

                {/* Scrolling logos */}
                <div className="logos-track flex items-center gap-16 w-max">
                    {[...partners, ...partners].map((partner, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center w-32 h-16 bg-white rounded-xl border border-slate-200 shadow-sm px-6"
                        >
                            <span className="text-xl font-bold text-slate-400">{partner.logo}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PartnerLogos;
