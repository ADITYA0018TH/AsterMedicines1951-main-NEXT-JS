"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const CallToAction = () => {
    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Split text animation
        gsap.from(".cta-title", {
            scrollTrigger: {
                trigger: ".cta-section",
                start: "top 80%",
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        gsap.from(".cta-subtitle", {
            scrollTrigger: {
                trigger: ".cta-section",
                start: "top 80%",
            },
            y: 40,
            opacity: 0,
            duration: 1,
            delay: 0.2,
            ease: "power3.out"
        });

        gsap.from(".cta-buttons", {
            scrollTrigger: {
                trigger: ".cta-section",
                start: "top 80%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.4,
            ease: "power3.out"
        });

        // Floating shapes animation
        gsap.to(".cta-shape-1", {
            y: -20,
            rotation: 5,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to(".cta-shape-2", {
            y: 20,
            rotation: -5,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }, []);

    return (
        <section className="cta-section py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Animated shapes */}
            <div className="cta-shape-1 absolute top-10 left-10 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl" />
            <div className="cta-shape-2 absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "40px 40px"
            }} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="cta-title text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
                        Ready to Partner with a <span className="text-brand-accent">Trusted Leader</span> in Pharma?
                    </h2>
                    <p className="cta-subtitle text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                        Connect with our team to explore collaboration opportunities, product inquiries, or distribution partnerships.
                    </p>

                    <div className="cta-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/contact">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-brand-accent hover:bg-brand-primary text-white shadow-lg shadow-brand-accent/30 transition-all duration-300">
                                Get in Touch <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="tel:+919876543210">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-600 text-white hover:bg-slate-800 transition-all duration-300">
                                <Phone className="mr-2 w-5 h-5" /> Call Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
