"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Shield, Zap, Heart, Globe } from "lucide-react";

const values = [
    {
        icon: <Shield className="w-8 h-8" />,
        title: "Quality First",
        description: "Every product undergoes rigorous testing to ensure the highest standards.",
        color: "text-blue-500",
        bgColor: "bg-blue-50"
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: "Innovation",
        description: "Continuously advancing our research to develop breakthrough treatments.",
        color: "text-amber-500",
        bgColor: "bg-amber-50"
    },
    {
        icon: <Heart className="w-8 h-8" />,
        title: "Patient Care",
        description: "Our mission centers on improving lives through accessible healthcare.",
        color: "text-rose-500",
        bgColor: "bg-rose-50"
    },
    {
        icon: <Globe className="w-8 h-8" />,
        title: "Global Impact",
        description: "Reaching patients in over 25 countries with life-saving medicines.",
        color: "text-emerald-500",
        bgColor: "bg-emerald-50"
    }
];

const WhyChooseUs = () => {
    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Animate header
        gsap.from(".why-header", {
            scrollTrigger: {
                trigger: ".why-section",
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });

        // Staggered cards with rotation
        gsap.from(".value-card", {
            scrollTrigger: {
                trigger: ".values-grid",
                start: "top 85%",
            },
            y: 80,
            opacity: 0,
            rotateY: 15,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        });

        // Parallax background elements
        gsap.to(".why-bg-circle", {
            scrollTrigger: {
                trigger: ".why-section",
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: -100,
            ease: "none"
        });
    }, []);

    return (
        <section className="why-section py-24 bg-white relative overflow-hidden">
            {/* Decorative background */}
            <div className="why-bg-circle absolute -top-32 -right-32 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
            <div className="why-bg-circle absolute -bottom-32 -left-32 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-50" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="why-header text-center mb-16">
                    <span className="text-brand-accent font-semibold tracking-wider uppercase mb-4 block text-sm">Why Choose Us</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
                        Built on Trust, Driven by Excellence
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        For over 70 years, we have been committed to delivering pharmaceutical solutions that make a difference.
                    </p>
                </div>

                <div className="values-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="value-card group p-8 bg-white rounded-2xl border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${value.bgColor} ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
