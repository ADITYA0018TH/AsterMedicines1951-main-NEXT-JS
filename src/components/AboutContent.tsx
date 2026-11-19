"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSettings } from "@/context/SettingsContext";
import {
    ArrowRight,
    MapPin,
    Factory,
    Syringe,
    FlaskConical,
    ShieldCheck,
    Microscope,
    Activity,
    Layers
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Safe Registration
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const AboutContent = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { settings } = useSettings();

    // The Text
    // The Text & Highlights
    const manifestoSegments = [
        { text: "Aster Medicines", highlight: true },
        { text: "was born from a singular vision: to put" },
        { text: "Bihar", highlight: true },
        { text: "on the national pharmaceutical map. Incorporated in" },
        { text: "2008,", highlight: true },
        { text: "we have evolved from a local unit into a high-volume manufacturing powerhouse, serving over" },
        { text: "12 states", highlight: true },
        { text: "with" },
        { text: "GMP CERTIFIED", highlight: true },
        { text: "injectables." }
    ];

    useGSAP(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {

            // --- 1. HERO LOAD ---
            const heroTl = gsap.timeline();
            heroTl.from(".hero-line", {
                yPercent: 100,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "power4.out",
                delay: 0.2
            });

            // --- 2. MANIFESTO: MULTI-STYLE WORD ANIMATIONS ---

            // Style 1: Fade Up
            gsap.utils.toArray(".anim-fade-up").forEach((el: any) => {
                gsap.from(el, {
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        end: "bottom 75%",
                        scrub: 1
                    }
                });
            });

            // Style 2: Blur Reveal
            gsap.utils.toArray(".anim-blur").forEach((el: any) => {
                gsap.fromTo(el,
                    { filter: "blur(10px)", opacity: 0 },
                    {
                        filter: "blur(0px)",
                        opacity: 1,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 80%",
                            end: "bottom 70%",
                            scrub: 1
                        }
                    }
                );
            });

            // Style 3: Scale In
            gsap.utils.toArray(".anim-scale").forEach((el: any) => {
                gsap.from(el, {
                    scale: 2,
                    opacity: 0,
                    duration: 1,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        end: "bottom 75%",
                        scrub: 1
                    }
                });
            });

            // Style 4: Rotate In
            gsap.utils.toArray(".anim-rotate").forEach((el: any) => {
                gsap.from(el, {
                    rotationX: 90,
                    opacity: 0,
                    y: -20,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 80%",
                        end: "bottom 70%",
                        scrub: 1
                    }
                });
            });

            // --- 3. HORIZONTAL FACTORY SCROLL ---
            const scrollContainer = scrollContainerRef.current;
            const panels = gsap.utils.toArray<HTMLElement>(".factory-panel");

            if (scrollContainer && panels.length) {
                gsap.to(panels, {
                    xPercent: -100 * (panels.length - 1),
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".factory-section",
                        pin: true,
                        scrub: 1,
                        snap: 1 / (panels.length - 1),
                        end: () => "+=" + scrollContainer.offsetWidth
                    }
                });
            }

            // --- 4. PARALLAX IMAGES ---
            const leaderImg = document.querySelector(".parallax-img");
            if (leaderImg) {
                gsap.to(leaderImg, {
                    yPercent: 15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".leadership-section",
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }

        }, containerRef);
        return () => ctx.revert();
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="bg-background text-foreground font-sans selection:bg-primary selection:text-white">
            <Navbar />

            <main>

                {/* --- 1. HERO: THE DASHBOARD --- */}
                <section className="relative min-h-[90vh] pt-24 flex flex-col border-b border-border">
                    {/* Background Grid */}
                    <div className="absolute inset-0 flex justify-between pointer-events-none px-6 md:px-12 select-none">
                        <div className="grid-line w-px h-full bg-border/50"></div>
                        <div className="grid-line w-px h-full bg-border/50"></div>
                        <div className="grid-line w-px h-full bg-border/50 hidden md:block"></div>
                        <div className="grid-line w-px h-full bg-border/50"></div>
                    </div>

                    <div className="container mx-auto px-6 md:px-12 flex-grow flex flex-col justify-center relative z-10">
                        <div className="max-w-5xl">
                            <div className="inline-flex items-center gap-2 mb-8 border border-primary/20 bg-primary/5 px-4 py-1.5 rounded-full text-xs font-bold uppercase text-primary tracking-widest">
                                <Activity className="w-4 h-4" />
                                System Operational • Est 2008
                            </div>

                            <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter uppercase mb-8 text-foreground overflow-hidden">
                                <div className="hero-line block">Precision</div>
                                <div className="hero-line block text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Bio-Engineered.</div>
                            </h1>

                            <div className="flex flex-col md:flex-row gap-8 md:gap-16 border-l-2 border-primary pl-8">
                                <div>
                                    <p className="text-xs font-mono text-muted-foreground uppercase mb-2">Facility Location</p>
                                    <p className="text-lg font-bold">Hajipur Industrial Area, <br />Phase-II, Bihar</p>
                                </div>
                                <div>
                                    <p className="text-xs font-mono text-muted-foreground uppercase mb-2">Core Output</p>
                                    <p className="text-lg font-bold">Critical Care Injectables <br />& Dry Syrups</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ticker Tape */}
                    <div className="border-t border-border py-4 bg-secondary/50 backdrop-blur-sm relative z-10">
                        <div className="flex gap-12 text-xs font-mono uppercase text-muted-foreground overflow-hidden">
                            <div className="animate-marquee flex gap-12 whitespace-nowrap">
                                <span>{"///"} Third Party Manufacturing</span>
                                <span>{"///"} GMP CERTIFIED</span>
                                <span>{"///"} GLP Lab</span>
                                <span>{"///"} 12+ States Served</span>
                                <span>{"///"} 1.5M Daily Output</span>
                                <span>{"///"} Third Party Manufacturing</span>
                                <span>{"///"} GMP CERTIFIED</span>
                            </div>
                        </div>
                    </div>
                </section>


                {/* --- 2. MANIFESTO (Crash Fixed & Animated) --- */}
                <section className="manifesto-section py-32 px-6 md:px-12 bg-background border-b border-border">
                    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-4">
                            <div className="sticky top-32">
                                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6">
                                    <Layers className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-widest mb-2">The Mission</h3>
                                <p className="text-muted-foreground text-sm font-mono">Doc Ref: ASM-2025-V1</p>
                            </div>
                        </div>
                        <div className="lg:col-span-8">
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.3] tracking-tight">
                                {manifestoSegments.map((segment, i) => (
                                    <React.Fragment key={i}>
                                        {segment.text.split(" ").map((word, j) => {
                                            // Calculate global index for varied animation if needed, or just random/cyclic
                                            const animIndex = i * 10 + j;
                                            const animClass =
                                                animIndex % 4 === 0 ? "anim-fade-up" :
                                                    animIndex % 4 === 1 ? "anim-blur" :
                                                        animIndex % 4 === 2 ? "anim-scale" :
                                                            "anim-rotate";

                                            return (
                                                <span
                                                    key={`${i}-${j}`}
                                                    className={`manifesto-word inline-block mr-[0.25em] ${animClass} ${segment.highlight ? 'text-orange-500' : ''}`}
                                                >
                                                    {word}
                                                </span>
                                            );
                                        })}
                                        {/* Add space between segments if not last */}
                                        <span className="inline-block mr-[0.25em]"></span>
                                    </React.Fragment>
                                ))}
                            </h2>
                        </div>
                    </div>
                </section>


                {/* --- 3. HORIZONTAL SCROLL (Factory Line) --- */}
                <section className="factory-section h-screen bg-secondary overflow-hidden flex flex-col border-b border-border">
                    <div className="px-6 md:px-12 py-6 border-b border-border bg-background z-20 flex justify-between items-center">
                        <h2 className="text-xl font-bold uppercase flex items-center gap-3">
                            <Factory className="w-5 h-5 text-primary" /> Infrastructure
                        </h2>
                        <div className="text-[10px] font-mono text-muted-foreground hidden md:block border border-border px-2 py-1 rounded">SCROLL TO INSPECT FLOW -</div>
                    </div>

                    <div ref={scrollContainerRef} className="flex-grow flex h-full w-full">

                        {/* Panel 1: Start */}
                        <div className="factory-panel min-w-[100vw] h-full flex items-center justify-center p-12 border-r border-border bg-secondary relative">
                            <div className="text-center max-w-4xl relative z-10">
                                <div className="text-[10rem] md:text-[15rem] leading-none font-black text-foreground opacity-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">01</div>
                                <h3 className="text-5xl md:text-8xl font-black uppercase mb-6">Production<br />Flow.</h3>

                                <p className="text-xl text-muted-foreground mt-6">A walkthrough of our Hajipur Unit.</p>
                            </div>
                        </div>

                        {/* Panel 2: Injectables */}
                        <div className="factory-panel min-w-[100vw] h-full grid grid-cols-1 md:grid-cols-2 border-r border-border bg-background">
                            <div className="p-12 md:p-20 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
                                <Syringe className="w-12 h-12 text-primary mb-8" />
                                <h3 className="text-3xl md:text-5xl font-bold uppercase mb-6">Injectables Block</h3>
                                <p className="text-lg text-muted-foreground mb-8">
                                    A sterile fortress. We utilize automated washing, sterilization, and filling tunnels for <strong>Liquid Vials</strong> and <strong>Dry Powder</strong> injections.
                                </p>
                                <ul className="space-y-3 font-mono text-sm">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Beta-Lactam Compatible</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Nitrogen Purging</li>
                                </ul>
                            </div>
                            <div className="relative h-full bg-secondary/50 flex items-center justify-center p-12">

                                <Image src="/uploads/injectable_vial.webp" alt="Aster Medicines Injectable Manufacturing Unit in Bihar" width={500} height={500} className="object-contain drop-shadow-2xl" />
                            </div>
                        </div>

                        {/* Panel 3: Orals */}
                        <div className="factory-panel min-w-[100vw] h-full grid grid-cols-1 md:grid-cols-2 border-r border-border bg-background">
                            <div className="p-12 md:p-20 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
                                <FlaskConical className="w-12 h-12 text-primary mb-8" />
                                <h3 className="text-3xl md:text-5xl font-bold uppercase mb-6">Liquid Orals</h3>
                                <p className="text-lg text-muted-foreground mb-8">
                                    High-volume output. Our oral liquid section handles formulation, filling, and sealing for <strong>Dry Syrups</strong> and <strong>Paediatric Drops</strong>.
                                </p>
                                <ul className="space-y-3 font-mono text-sm">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div> 100+ Formulations</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Auto-Labeling</li>
                                </ul>
                            </div>
                            <div className="relative h-full bg-secondary/50 flex items-center justify-center p-12">

                                <Image src="/uploads/syrup_bottle.webp" alt="Oral Liquid Manufacturing - Syrup Bottles" width={500} height={500} className="object-contain drop-shadow-2xl" />
                            </div>
                        </div>

                        {/* Panel 4: QC Lab */}
                        <div className="factory-panel min-w-[100vw] h-full grid grid-cols-1 md:grid-cols-2 border-r border-border bg-background">
                            <div className="p-12 md:p-20 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
                                <Microscope className="w-12 h-12 text-primary mb-8" />
                                <h3 className="text-3xl md:text-5xl font-bold uppercase mb-6">GLP Laboratory</h3>
                                <p className="text-lg text-muted-foreground mb-8">
                                    The brain of the operation. Our in-house Good Laboratory Practice (GLP) certified lab conducts rigorous testing: Sterility, Pyrogen, and Chemical Analysis.
                                </p>
                                <ul className="space-y-3 font-mono text-sm">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Microbiology Section</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div> HPLC Instrumentation</li>
                                </ul>
                            </div>
                            <div className="relative h-full bg-secondary/50 flex items-center justify-center p-12">

                                <Image src="/uploads/lab_microscope.webp" alt="GLP Certified Quality Control Lab at Aster Medicines" width={500} height={500} className="object-contain drop-shadow-2xl" />
                            </div>
                        </div>

                    </div>
                </section>


                {/* --- 4. LEADERSHIP (Dossier) --- */}
                <section className="leadership-section py-32 px-6 md:px-12 bg-background border-b border-border">
                    <div className="container mx-auto">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="w-full lg:w-5/12 relative">
                                <div className="aspect-[3/4] relative border border-border bg-secondary p-2">
                                    <div className="absolute top-4 right-4 z-20 bg-primary text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                        Founder
                                    </div>
                                    <div className="relative w-full h-full overflow-hidden bg-muted">
                                        <Image
                                            src={settings.about?.founderImage || "/uploads/DP.webp"}
                                            alt="Late Mr. Raj Kumar - Founder of Aster Medicines Pvt Ltd"
                                            fill
                                            className="parallax-img object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                        />
                                    </div>
                                    {/* Tech Decors */}
                                    <div className="absolute -bottom-4 -right-4 w-16 h-16 border-r-2 border-b-2 border-primary"></div>
                                    <div className="absolute -top-4 -left-4 w-16 h-16 border-l-2 border-t-2 border-primary"></div>
                                </div>
                            </div>

                            <div className="w-full lg:w-7/12">
                                <h2 className="text-4xl md:text-6xl font-black uppercase mb-8">Leadership <br />Profile.</h2>
                                <h3 className="text-3xl font-bold text-foreground mb-2">Late Mr. Raj Kumar</h3>
                                <p className="text-primary font-mono text-sm uppercase tracking-widest mb-8">Founder & Director</p>

                                <div className="prose prose-lg text-muted-foreground mb-12">
                                    <p>
                                        &quot;Our vision is not just to manufacture medicine, but to engineer trust. Aster Medicines was founded on the belief that Bihar can be a hub for world-class pharmaceutical manufacturing. Since 2008, we have relentlessly pursued this goal through automation, strict compliance, and uncompromised quality.&quot;
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 border-t border-border pt-8">
                                    <div>
                                        <div className="text-3xl font-black text-foreground">2008</div>
                                        <div className="text-xs font-mono uppercase text-muted-foreground mt-1">Incorporation</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-foreground">Hajipur</div>
                                        <div className="text-xs font-mono uppercase text-muted-foreground mt-1">Base of Ops</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* --- 5. STATS GRID --- */}
                <section className="stats-section bg-secondary py-24 px-6 md:px-12 border-b border-border">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
                            {[
                                { val: "17+", label: "Years Experience" },
                                { val: "100+", label: "Formulations" },
                                { val: "1.5M", label: "Daily Output" },
                                { val: "12+", label: "States Served" }
                            ].map((stat, i) => (
                                <div key={i} className="stat-block bg-background p-12 flex flex-col items-center justify-center text-center hover:bg-secondary transition-colors">
                                    <div className="text-5xl md:text-6xl font-black text-primary mb-4">{stat.val}</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* --- 6. LOCATIONS --- */}
                <section className="py-24 px-6 md:px-12 bg-background">
                    <div className="container mx-auto max-w-6xl">
                        <div className="flex items-center gap-3 mb-12">
                            <MapPin className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold uppercase tracking-widest">Operational Coordinates</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* HQ */}
                            <div className="border border-border rounded-3xl p-10 relative overflow-hidden group hover:border-primary transition-colors bg-card">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <ShieldCheck className="w-32 h-32" />
                                </div>
                                <h3 className="text-2xl font-bold uppercase mb-4 text-foreground">Patna (HQ)</h3>
                                <p className="text-muted-foreground mb-8 font-mono text-sm leading-relaxed">
                                    North of Janta Hotel, 1st Floor,<br />
                                    Govind Mitra Road, Patna - 800004
                                </p>
                                <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase text-primary border border-primary/20 px-2 py-1 rounded">
                                    Administration / Sales
                                </div>
                            </div>

                            {/* Plant */}
                            <div className="border border-border rounded-3xl p-10 relative overflow-hidden group hover:border-primary transition-colors bg-card">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Factory className="w-32 h-32" />
                                </div>
                                <h3 className="text-2xl font-bold uppercase mb-4 text-foreground">Hajipur (Plant)</h3>
                                <p className="text-muted-foreground mb-8 font-mono text-sm leading-relaxed">
                                    Plot No. E/4, Industrial Area,<br />
                                    Vaishali, Hajipur - 844101
                                </p>
                                <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase text-primary border border-primary/20 px-2 py-1 rounded">
                                    Production / Logistics
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 7. FOOTER CTA --- */}
                <section className="bg-primary py-32 px-6 text-center text-primary-foreground">
                    <h2 className="text-4xl md:text-7xl font-black uppercase mb-12 tracking-tight">
                        Start Production.
                    </h2>
                    <Link href="/contact" className="inline-flex h-20 px-12 bg-background text-foreground rounded-full border-2 border-transparent hover:border-foreground transition-colors font-bold text-xl items-center gap-3 uppercase tracking-widest">
                        Initialize Quote <ArrowRight className="w-6 h-6" />
                    </Link>
                </section>

            </main>
            <Footer />
        </div>
    );
};

export default AboutContent;