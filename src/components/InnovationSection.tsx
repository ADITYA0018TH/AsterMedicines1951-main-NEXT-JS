"use client";

import Link from "next/link";
import { ArrowRight, Microscope, Dna } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const InnovationSection = () => {
    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from(".innovation-content", {
            scrollTrigger: {
                trigger: ".innovation-section",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    }, []);

    return (
        <section className="innovation-section py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Image/Visual Side */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 aspect-square lg:aspect-[4/5]">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-white opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                                <Microscope className="w-24 h-24 text-slate-300" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/90 backdrop-blur-md border-t border-white/50">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Dna className="w-5 h-5 text-brand-accent" />
                                    </div>
                                    <span className="font-bold text-slate-900">Genomic Research</span>
                                </div>
                                <p className="text-sm text-slate-600">Leading the way in personalized medicine.</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 innovation-content">
                        <span className="text-brand-accent font-semibold tracking-wider uppercase mb-4 block text-sm">Innovation</span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
                            Advancing Healthcare Through Science
                        </h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Our state-of-the-art research facilities and dedicated team of scientists are constantly pushing the boundaries of what's possible in pharmaceutical medicine.
                        </p>

                        <div className="space-y-6 mb-10">
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-brand-accent" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">Advanced R&D</h4>
                                    <p className="text-slate-600">Cutting-edge laboratories focused on drug discovery.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">Quality Assurance</h4>
                                    <p className="text-slate-600">Rigorous testing protocols meeting global standards.</p>
                                </div>
                            </div>
                        </div>

                        <Link href="/about">
                            <Button className="h-12 px-8 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                                Discover Our Process <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InnovationSection;
