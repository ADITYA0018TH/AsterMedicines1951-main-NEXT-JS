"use client";

import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send, Loader2, Globe, Building2 } from "lucide-react";
import { submitContactForm } from "@/services/api";
import Button3D from "@/components/ui/Button3D";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, useScroll, useTransform } from "framer-motion";

const ContactContent = () => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Refs for animations
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const infoRef = useRef(null);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'mobileNumber') {
            const numericValue = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const promise = submitContactForm(formData);

        toast.promise(promise, {
            loading: 'Sending message...',
            success: () => {
                setFormData({
                    firstName: "", lastName: "", email: "", mobileNumber: "", subject: "", message: ""
                });
                return 'Message sent successfully! We will get back to you soon.';
            },
            error: (error: any) => {
                return error.message || 'Failed to connect to the server.';
            },
        });

        try {
            await promise;
        } catch (error) {
            // Error is handled by toast
        } finally {
            setIsSubmitting(false);
        }
    };

    // GSAP Animations
    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline();

        // Hero Intro
        tl.from(".hero-text-reveal", {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out"
        })
            .from(".hero-subtext", {
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.5");

        // Card Stagger - Replaced with Framer Motion in JSX for better reliability
        // gsap.from(".info-card-item", { ... }); // Removed to prevent visibility race conditions

        // Form Animation
        gsap.from(formRef.current, {
            scrollTrigger: {
                trigger: formRef.current,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden selection:bg-orange-500/30">
            <Navbar />

            <main className="relative pt-24 lg:pt-32 pb-32 mb:pb-40">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -z-10 w-[50vw] h-[50vw] bg-orange-500/10 rounded-full blur-[100px] opacity-60 hidden md:block animate-pulse" />
                <div className="absolute bottom-0 left-0 -z-10 w-[40vw] h-[40vw] bg-blue-500/10 rounded-full blur-[100px] opacity-60 hidden md:block" />

                <div className="container mx-auto px-4 md:px-6 lg:px-12">
                    {/* Hero Section */}
                    <div className="text-center mb-12 lg:mb-24 space-y-4 md:space-y-6">
                        <div className="overflow-hidden pt-4">
                            <h1 className="hero-text-reveal text-4xl md:text-7xl lg:text-8xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                                Let's Start a <br />
                                <span className="text-transparent bg-clip-text bg-orange-500"> Conversation.</span>
                            </h1>
                        </div>
                        <p className="hero-subtext text-base md:text-xl text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed px-4">
                            Whether you need precision manufacturing or have a question about our global standards, our team is here to listen and deliver.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Contact Info & Map */}
                        <div ref={infoRef} className="lg:col-span-5 space-y-6 md:space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <Globe className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                                    Get in Touch
                                </h3>

                                {[{
                                    icon: <Mail className="w-5 h-5" />,
                                    label: "Email Us",
                                    value: "accounts@astermedicines.com, hr@astermedicines.com, astermedicinespvtltd@gmail.com",
                                    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                }, {
                                    icon: <Phone className="w-5 h-5" />,
                                    label: "Call Us",
                                    value: "+91 7909071165",
                                    color: "bg-green-500/10 text-green-600 dark:text-green-400"
                                }, {
                                    icon: <MapPin className="w-5 h-5" />,
                                    label: "Visit HQ",
                                    value: "E-4 Part, Phase-2, Industrial Area, Hajipur, Vaishali, Bihar-844102",
                                    color: "bg-red-500/10 text-red-600 dark:text-red-400"
                                }, {
                                    icon: <Clock className="w-5 h-5" />,
                                    label: "Working Hours",
                                    value: "Mon - Sat: 9AM - 6PM",
                                    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                }].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                        className="info-card-item group p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm hover:bg-white dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-4 shadow-sm hover:shadow-md"
                                    >
                                        <div className={`p-3 rounded-xl ${item.color}`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">{item.label}</p>
                                            <p className="text-sm md:text-lg font-semibold text-slate-900 dark:text-slate-200 break-words">{item.value}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Map Card */}
                            <div className="info-card-item relative group overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg h-[250px] md:h-[300px]">
                                <div className="absolute inset-0 z-0 bg-slate-200 dark:bg-neutral-800" />
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14381.04147794262!2d85.242669!3d25.695802!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed5dc20dd92747%3A0x1099ecc93f65d691!2sASTER%20MEDICINES%20PVT%20LTD!5e0!3m2!1sen!2sus!4v1753964078498!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{
                                        filter: mounted && resolvedTheme === 'dark' ? 'invert(90%) hue-rotate(180deg) contrast(90%)' : 'none',
                                        border: 0
                                    }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition-all duration-700 ease-in-out relative z-10"
                                />
                                <div className="absolute bottom-4 left-4 z-20 bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 shadow-lg flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-orange-500" />
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">Manufacturing Plant</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Contact Form */}
                        <div className="lg:col-span-1 hidden lg:block" /> {/* Spacer */}

                        <div ref={formRef} className="lg:col-span-6 w-full">
                            <div className="relative p-6 md:p-10 rounded-3xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-xl">

                                <div className="mb-8">
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">Send a Message</h2>
                                    <p className="text-slate-500 dark:text-neutral-400 text-sm md:text-base">Fill in the form below and our team will get back to you within 24 hours.</p>
                                </div>



                                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-slate-700 dark:text-neutral-300 ml-1 transition-colors group-focus-within:text-orange-600 dark:group-focus-within:text-orange-500">First Name</label>
                                            <input
                                                type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                                                className="w-full px-4 md:px-5 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-neutral-600"
                                                placeholder="Aster"
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-slate-700 dark:text-neutral-300 ml-1 transition-colors group-focus-within:text-orange-600 dark:group-focus-within:text-orange-500">Last Name</label>
                                            <input
                                                type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                                                className="w-full px-4 md:px-5 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-neutral-600"
                                                placeholder="Medicines"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-slate-700 dark:text-neutral-300 ml-1 transition-colors group-focus-within:text-orange-500 dark:group-focus-within:text-orange-500">Email Address</label>
                                            <input
                                                type="email" name="email" value={formData.email} onChange={handleChange} required
                                                className="w-full px-4 md:px-5 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-neutral-600"
                                                placeholder="aster@astermedicines.com"
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-slate-700 dark:text-neutral-300 ml-1 transition-colors group-focus-within:text-orange-500 dark:group-focus-within:text-orange-500">Phone</label>
                                            <input
                                                type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required
                                                className="w-full px-4 md:px-5 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-neutral-600"
                                                placeholder="+91 **********"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-sm font-medium text-slate-700 dark:text-neutral-300 ml-1 transition-colors group-focus-within:text-orange-600 dark:group-focus-within:text-orange-500">Subject</label>
                                        <input
                                            type="text" name="subject" value={formData.subject} onChange={handleChange}
                                            className="w-full px-4 md:px-5 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-neutral-600"
                                            placeholder="How can we help you?"
                                        />
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-sm font-medium text-slate-700 dark:text-neutral-300 ml-1 transition-colors group-focus-within:text-orange-600 dark:group-focus-within:text-orange-500">Message</label>
                                        <textarea
                                            name="message" value={formData.message} onChange={handleChange} required rows={4}
                                            className="w-full px-4 md:px-5 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-neutral-600 resize-none"
                                            placeholder="Tell us more about your requirements..."
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <Button3D
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full group"
                                            variant="primary"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Sending...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    Send Message
                                                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </span>
                                            )}
                                        </Button3D>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ContactContent;