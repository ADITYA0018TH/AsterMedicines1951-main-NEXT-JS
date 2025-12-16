"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const TimelineSection = () => {
    const containerRef = useRef(null);

    const milestones = [
        { year: "1951", title: "Founded", description: "Aster Medicines was established with a vision to provide quality pharmaceutical products." },
        { year: "1975", title: "First Export", description: "Began exporting to international markets, expanding our global footprint." },
        { year: "1995", title: "R&D Center", description: "Opened our state-of-the-art research and development facility." },
        { year: "2010", title: "WHO Certified", description: "Achieved WHO-GMP certification for all manufacturing units." },
        { year: "2024", title: "Global Leader", description: "Serving over 50 million patients across 25+ countries worldwide." }
    ];

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Animate the timeline line
        gsap.from(".timeline-line", {
            scrollTrigger: {
                trigger: ".timeline-section",
                start: "top 70%",
                end: "bottom 70%",
                scrub: 1
            },
            scaleY: 0,
            transformOrigin: "top center",
            ease: "none"
        });

        // Animate each milestone
        gsap.utils.toArray(".milestone-item").forEach((item: any, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                },
                x: i % 2 === 0 ? -50 : 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        });

        // Animate the dots
        gsap.utils.toArray(".milestone-dot").forEach((dot: any) => {
            gsap.from(dot, {
                scrollTrigger: {
                    trigger: dot,
                    start: "top 85%",
                },
                scale: 0,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="timeline-section py-24 bg-white relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <span className="text-brand-accent font-semibold tracking-wider uppercase mb-4 block text-sm">Our Journey</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
                        70+ Years of Excellence
                    </h2>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Timeline line */}
                    <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-accent via-blue-300 to-brand-accent -translate-x-1/2" />

                    {/* Milestones */}
                    <div className="space-y-16">
                        {milestones.map((milestone, index) => (
                            <div
                                key={index}
                                className={`milestone-item flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                            >
                                <div className={`w-1/2 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                                    <span className="text-4xl font-bold text-brand-accent">{milestone.year}</span>
                                    <h3 className="text-xl font-bold text-slate-900 mt-2">{milestone.title}</h3>
                                    <p className="text-slate-600 mt-2">{milestone.description}</p>
                                </div>

                                <div className="milestone-dot relative z-10 w-4 h-4 bg-brand-accent rounded-full ring-4 ring-white shadow-lg" />

                                <div className="w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TimelineSection;
