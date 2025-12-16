"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const AboutContent = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredValue, setHoveredValue] = useState<number | null>(null);

    useGSAP(() => {
        const ctx = gsap.context(() => {

            // --- 1. PREMIUM HERO SEQUENCE ---
            const tl = gsap.timeline();

            // A. Main Title Reveal
            tl.from(".hero-line-inner", {
                yPercent: 100,
                duration: 1.2,
                stagger: 0.15,
                ease: "power4.out",
                delay: 0.2
            });

            // B. Vertical Line Grows Down
            tl.from(".hero-separator", {
                scaleY: 0,
                transformOrigin: "top",
                duration: 0.8,
                ease: "power3.inOut"
            }, "-=0.8");

            // C. Description Text Slides Up (Line by Line)
            tl.from(".hero-desc-line", {
                yPercent: 100,
                duration: 0.8,
                stagger: 0.05,
                ease: "power3.out"
            }, "-=0.6");

            // D. Meta Info / Scroll Arrow
            tl.from(".hero-meta", {
                opacity: 0,
                y: 20,
                duration: 1,
                ease: "power3.out"
            }, "-=0.5");


            // --- 2. The Manifesto (Text Highlighting) ---
            const words = gsap.utils.toArray(".manifesto-word");
            gsap.to(words, {
                scrollTrigger: {
                    trigger: ".manifesto-section",
                    start: "top 60%",
                    end: "bottom 60%",
                    scrub: 0.5,
                },
                color: "inherit",
                opacity: 1,
                stagger: 0.1
            });

            // --- 3. Founder Section (Pin & Reveal) ---
            const founderTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".founder-section",
                    start: "top top",
                    end: "+=150%",
                    pin: true,
                    scrub: true,
                    anticipatePin: 1
                }
            });

            founderTl.to(".founder-img-mask", {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 1,
                ease: "power2.inOut"
            })
                .to(".founder-text-content", {
                    opacity: 1,
                    y: 0,
                    duration: 0.5
                }, "-=0.3");

            // --- 4. Stats Animation ---
            gsap.from(".stat-item", {
                scrollTrigger: {
                    trigger: ".stats-section",
                    start: "top 80%",
                },
                y: 60,
                opacity: 0,
                scale: 0.8,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.7)"
            });

            // --- 5. Stats Counter Animation ---
            const counters = document.querySelectorAll(".stat-counter");
            counters.forEach((counter) => {
                const target = parseInt(counter.getAttribute("data-value") || "0");
                const suffix = counter.getAttribute("data-suffix") || "";
                const obj = { value: 0 };

                gsap.to(obj, {
                    value: target,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".stats-section",
                        start: "top 80%",
                    },
                    onUpdate: () => {
                        counter.textContent = Math.round(obj.value) + suffix;
                    }
                });
            });

        }, containerRef);
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="bg-background text-foreground selection:bg-brand-accent selection:text-white">
            <Navbar />

            {/* --- 1. REVISED HERO SECTION --- */}
            <section className="min-h-screen relative flex flex-col justify-center px-4 md:px-12 pt-16 md:pt-20 overflow-hidden">
                <div className="absolute top-0 right-0 p-6 md:p-12 hero-meta hidden md:block">
                    <div className="text-xs md:text-sm font-mono tracking-widest uppercase opacity-60 text-right">
                        ( Est. 1993 ) <br /> Global Excellence
                    </div>
                </div>

                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

                    {/* Big Title */}
                    <div className="lg:col-span-8">
                        <h1 className="text-[15vw] md:text-[13vw] lg:text-[10vw] leading-[0.9] lg:leading-[0.8] font-display font-bold uppercase tracking-tighter">
                            <div className="overflow-hidden"><span className="hero-line-inner block">Beyond</span></div>
                            <div className="overflow-hidden"><span className="hero-line-inner block text-brand-accent">Chemistry</span></div>
                            <div className="overflow-hidden"><span className="hero-line-inner block">We Engineer</span></div>
                            <div className="overflow-hidden"><span className="hero-line-inner block">Life.</span></div>
                        </h1>
                    </div>

                    {/* The Animated Description */}
                    <div className="lg:col-span-4 flex flex-row lg:flex-col items-start gap-4 md:gap-6 pb-2 lg:pb-4 mt-8 lg:mt-0">
                        <div className="hero-separator w-[2px] h-24 lg:h-32 bg-brand-accent hidden lg:block" />

                        <div className="space-y-1">
                            <div className="overflow-hidden">
                                <p className="hero-desc-line text-lg md:text-2xl font-light leading-tight block">
                                    <span className="font-medium text-brand-accent">Aster Medicines </span>bridges the gap
                                </p>
                            </div>
                            <div className="overflow-hidden">
                                <p className="hero-desc-line text-xl md:text-2xl font-light leading-tight block">
                                    between <span className="font-medium text-brand-accent">scientific breakthrough</span>
                                </p>
                            </div>
                            <div className="overflow-hidden">
                                <p className="hero-desc-line text-xl md:text-2xl font-light leading-tight block">
                                    and human compassion.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="hero-meta absolute bottom-8 left-6 md:left-12 flex items-center gap-4 opacity-50">
                    <div className="w-10 h-10 rounded-full border border-foreground/30 flex items-center justify-center animate-bounce">
                        <ArrowDown className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest">Scroll to Explore</span>
                </div>

                {/* Subtle Grain Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            </section>

            {/* --- 2. The Manifesto --- */}
            <section className="manifesto-section min-h-[60vh] md:min-h-[80vh] flex items-center justify-center px-4 md:px-20 py-16 md:py-24 bg-white dark:bg-black">
                <div className="max-w-4xl text-black dark:text-white">
                    <p className="text-2xl md:text-5xl lg:text-6xl font-display font-medium leading-[1.3] text-center md:text-left">
                        {`Healthcare is a right, not a privilege. For over 18 years, our mission has been singular: to democratize access to world-class medicine. We don't just treat symptoms; we treat people. Every pill, every protocol, every innovation is designed with one metric in mind—human impact.`.split(" ").map((word, i) => (
                            <span key={i} className="manifesto-word opacity-20 transition-colors inline-block mr-[0.25em]">
                                {word}
                            </span>
                        ))}
                    </p>
                </div>
            </section>

            {/* --- 3. Founder Section --- */}
            <section className="founder-section min-h-screen w-full relative overflow-hidden flex flex-col md:flex-row bg-white dark:bg-black text-black dark:text-white">
                <div className="w-full md:w-1/2 h-[50vh] md:h-full relative flex items-center justify-center p-6 md:p-10">
                    <div
                        className="founder-img-mask w-full h-full relative overflow-hidden rounded-2xl md:rounded-none"
                        style={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1.1 }}
                    >
                        <Image
                            src="/My-uploads/DP.webp"
                            alt="Rupesh Anand"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover opacity-90 grayscale hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute bottom-8 left-8 p-4 rounded-xl border border-orange-500/30 bg-black/50 backdrop-blur-sm">
                            <h3 className="text-4xl font-display font-bold text-orange-500">Rupesh Anand</h3>
                            <p className="text-white/60 font-mono text-sm mt-2">FOUNDER & CHAIRMAN</p>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 h-full flex items-center px-6 md:px-20 py-10 md:py-0">
                    <div className="founder-text-content opacity-0 translate-y-10 space-y-6 md:space-y-8">
                        <div className="w-16 h-1 bg-brand-accent mb-6 md:mb-8" />
                        <h2 className="text-4xl md:text-7xl font-display font-bold leading-tight">
                            The Architect <br /> of Care.
                        </h2>
                        <p className="text-lg md:text-xl opacity-70 leading-relaxed font-light max-w-md">
                            "I founded Aster with a simple belief: that quality healthcare should not be determined by geography. Three decades later, that belief has become a global reality."
                        </p>

                        <div className="pt-8 grid grid-cols-2 gap-8 border-t border-black/20 dark:border-white/20">
                            <div>
                                <span className="block text-3xl font-bold text-brand-accent">1993</span>
                                <span className="text-sm opacity-50 uppercase tracking-wider">Inception</span>
                            </div>
                            <div>
                                <span className="block text-3xl font-bold text-brand-accent">25K+</span>
                                <span className="text-sm opacity-50 uppercase tracking-wider">Staff Guided</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 4. Values List --- */}
            <section className="py-16 md:py-32 px-4 md:px-12">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20">
                        <h2 className="text-3xl md:text-4xl font-display font-bold">Our Core <span className="text-brand-accent">DNA</span></h2>
                        <p className="opacity-50 mt-4 md:mt-0 max-w-md text-left md:text-right text-sm md:text-base">
                            The non-negotiable principles that drive our research, operations, and patient care.
                        </p>
                    </div>

                    <div className="flex flex-col divide-y divide-foreground/10 border-t border-b border-foreground/10">
                        {[
                            { title: "Global Accessibility", id: "01", desc: "Breaking barriers of cost and geography." },
                            { title: "Radical Innovation", id: "02", desc: "Pioneering treatments for the incurable." },
                            { title: "Holistic Compassion", id: "03", desc: "Treating the soul, not just the body." },
                            { title: "Ethical Integrity", id: "04", desc: "Transparency in every trial and transaction." }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="group py-8 md:py-12 flex flex-col md:flex-row items-baseline justify-between cursor-pointer transition-all hover:px-4 hover:bg-foreground/5"
                                onMouseEnter={() => setHoveredValue(index)}
                                onMouseLeave={() => setHoveredValue(null)}
                            >
                                <div className="flex items-baseline gap-4 md:gap-12">
                                    <span className="font-mono text-sm opacity-40">{item.id}</span>
                                    <h3 className="text-2xl md:text-5xl font-display font-bold group-hover:translate-x-2 transition-transform duration-300">
                                        {item.title}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-4 mt-4 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-sm uppercase tracking-widest">{item.desc}</span>
                                    <ArrowUpRight className="w-6 h-6" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 5. Stats --- */}
            <section className="stats-section pb-16 md:pb-32 px-4 md:px-6">
                <div className="container mx-auto border border-foreground/10 rounded-3xl p-6 md:p-24 bg-white dark:bg-black text-black dark:text-white">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
                        {[
                            { label: "Facilities", value: 400, suffix: "+" },
                            { label: "Countries", value: 12, suffix: "+" },
                            { label: "Patients", value: 15, suffix: "M" },
                            { label: "Years", value: 18, suffix: "" },
                        ].map((stat, i) => (
                            <div key={i} className="stat-item flex flex-col items-center group">
                                <span
                                    className="stat-counter text-4xl md:text-6xl lg:text-8xl font-display font-bold tracking-tighter mb-2 md:mb-4 group-hover:scale-110 group-hover:text-brand-accent transition-all duration-300"
                                    data-value={stat.value}
                                    data-suffix={stat.suffix}
                                >
                                    0{stat.suffix}
                                </span>
                                <span className="text-sm font-mono uppercase tracking-widest opacity-70">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutContent;