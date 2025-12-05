"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, Users, Globe, Building2, Heart, Lightbulb, Shield } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const AboutContent = () => {
    const router = useRouter();

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Animation
        gsap.from(".hero-content", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out"
        });

        // Mission & Values Stagger
        gsap.from(".mission-card", {
            scrollTrigger: {
                trigger: ".mission-grid",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.2,
            ease: "power3.out"
        });

        // Founder Section
        gsap.from(".founder-text", {
            scrollTrigger: {
                trigger: ".founder-section",
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: "power3.out"
        });

        gsap.from(".founder-image", {
            scrollTrigger: {
                trigger: ".founder-section",
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            ease: "power3.out"
        });

        // Stats Stagger
        gsap.from(".stat-item", {
            scrollTrigger: {
                trigger: ".stats-grid",
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out"
        });

    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-brand-accent/5 blur-3xl pointer-events-none" />
                <div className="container mx-auto text-center relative z-10">
                    <div className="hero-content">
                        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
                            About <span className="text-brand-accent">Aster Medicines</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Leading healthcare innovation with compassionate care and cutting-edge pharmaceutical solutions for over three decades.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-20 px-6 bg-secondary/30">
                <div className="container mx-auto">
                    <div className="mission-grid grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Globe className="w-10 h-10 text-brand-accent" />,
                                title: "Our Mission",
                                description: "To provide world-class healthcare services that are accessible, affordable, and delivered with compassion."
                            },
                            {
                                icon: <Lightbulb className="w-10 h-10 text-brand-orange" />,
                                title: "Innovation",
                                description: "Continuously advancing medical technology and pharmaceutical research to develop breakthrough treatments."
                            },
                            {
                                icon: <Heart className="w-10 h-10 text-red-500" />,
                                title: "Compassion",
                                description: "Treating every patient with dignity, respect, and empathy, ensuring holistic care for their wellbeing."
                            }
                        ].map((item, index) => (
                            <div key={index} className="mission-card">
                                <Card className="bg-card border-border hover:border-brand-accent/50 transition-all duration-300 h-full">
                                    <CardHeader>
                                        <div className="mb-4 p-3 bg-secondary rounded-xl w-fit">
                                            {item.icon}
                                        </div>
                                        <CardTitle className="text-2xl text-foreground">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-muted-foreground text-base leading-relaxed">
                                            {item.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Founder Section */}
            <section className="founder-section py-20 px-6">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="founder-text">
                            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                                Meet Our <span className="text-brand-accent">Founder</span>
                            </h2>
                            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                                <p>
                                    Rupesh Anand is the visionary founder and Chairman of Aster Medicines. With over three decades of experience, he has been instrumental in revolutionizing medical care across multiple countries.
                                </p>
                                <p>
                                    Under his leadership, Aster has grown from a single clinic to a global network of hospitals, clinics, and pharmacies, serving millions of patients with world-class healthcare services.
                                </p>
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="h-px bg-border flex-grow" />
                                    <span className="text-brand-accent font-display font-bold text-xl">Rupesh Anand</span>
                                </div>
                            </div>
                        </div>
                        <div className="founder-image relative">
                            <div className="absolute inset-0 bg-brand-accent/20 blur-3xl rounded-full" />
                            <div className="relative bg-card border border-border rounded-2xl p-8 backdrop-blur-sm">
                                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-secondary relative">
                                    {/* Placeholder for Founder Image */}
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                        <Users className="w-20 h-20 opacity-20" />
                                    </div>
                                    <img
                                        src="/lovable-uploads/7d9319f2-3afe-40b4-9c44-963d708b81b9.png"
                                        alt="Rupesh Anand"
                                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-6 bg-brand-accent/5 border-y border-border">
                <div className="container mx-auto">
                    <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: "30+", label: "Years of Excellence", color: "text-brand-accent" },
                            { value: "400+", label: "Healthcare Facilities", color: "text-brand-orange" },
                            { value: "15M+", label: "Patients Served", color: "text-green-400" },
                            { value: "25K+", label: "Professionals", color: "text-purple-400" }
                        ].map((stat, index) => (
                            <div key={index} className="stat-item text-center">
                                <div className={`text-4xl md:text-6xl font-bold mb-2 ${stat.color}`}>
                                    {stat.value}
                                </div>
                                <div className="text-muted-foreground font-medium">
                                    {stat.label}
                                </div>
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
