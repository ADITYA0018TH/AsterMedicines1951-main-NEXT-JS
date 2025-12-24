"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { submitContactForm } from "@/services/api";
import SuccessNotification from "@/components/SuccessNotification";
import Button3D from "@/components/ui/Button3D";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const ContactContent = () => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

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
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // For mobileNumber, allow only numeric characters
        if (name === 'mobileNumber') {
            const numericValue = value.replace(/\D/g, ''); // Remove non-digits
            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: null, message: '' });

        try {
            await submitContactForm(formData);

            setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                mobileNumber: "",
                subject: "",
                message: ""
            });
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Failed to connect to the server. Please try again later.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Animation
        gsap.from(".hero-content", {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power3.out"
        });

        // Contact Info Animation
        gsap.from(".contact-info", {
            scrollTrigger: {
                trigger: ".contact-grid",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            x: -50,
            duration: 0.6,
            ease: "power3.out"
        });

        // Contact Form Animation
        gsap.from(".contact-form-container", {
            scrollTrigger: {
                trigger: ".contact-grid",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            x: 50,
            duration: 0.6,
            ease: "power3.out"
        });

    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground">
            {status.message && status.type === 'success' && (
                <SuccessNotification
                    title="Message Sent Successfully!"
                    description="We will get back to you soon."
                    onClose={() => setStatus({ type: null, message: '' })}
                />
            )}
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-accent/5 blur-3xl pointer-events-none" />
                    <div className="container mx-auto text-center relative z-10">
                        <div className="hero-content">
                            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
                                Contact <span className="text-brand-accent">Us</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                                Get in touch with our team to learn more about our pharmaceutical solutions and how we can help advance healthcare together.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="pb-24 px-6">
                    <div className="container mx-auto">
                        <div className="contact-grid grid lg:grid-cols-2 gap-12">
                            {/* Contact Information */}
                            <div className="contact-info space-y-8">
                                <div className="bg-card border border-border rounded-2xl p-8 backdrop-blur-sm">
                                    <h2 className="text-2xl font-bold text-foreground mb-8">Get in Touch</h2>

                                    <div className="space-y-6">
                                        {[
                                            {
                                                icon: <Mail className="w-6 h-6 text-brand-accent" />,
                                                title: "Email",
                                                content: ["contact@astermedicines.com", "info@astermedicines.com"]
                                            },
                                            {
                                                icon: <Phone className="w-6 h-6 text-brand-orange" />,
                                                title: "Phone",
                                                content: ["+91 7061452180", "+91 7061452180"]
                                            },
                                            {
                                                icon: <MapPin className="w-6 h-6 text-red-400" />,
                                                title: "Address",
                                                content: ["E-4 Part, Phase-2, Industrial Area, Hajipur, Vaishali, Bihar-844102"]
                                            },
                                            {
                                                icon: <Clock className="w-6 h-6 text-purple-400" />,
                                                title: "Business Hours",
                                                content: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 4:00 PM"]
                                            }
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors duration-300">
                                                <div className="p-3 bg-background rounded-lg">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                                                    {item.content.map((line, i) => (
                                                        <p key={i} className="text-muted-foreground text-sm">{line}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Map */}
                                <div className="bg-card border border-border rounded-2xl p-2 h-[300px] overflow-hidden">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14381.04147794262!2d85.242669!3d25.695802!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed5dc20dd92747%3A0x1099ecc93f65d691!2sASTER%20MEDICINES%20PVT%20LTD!5e0!3m2!1sen!2sus!4v1753964078498!5m2!1sen!2sus"
                                        width="100%"
                                        height="100%"
                                        style={{
                                            border: 0,
                                            filter: mounted && resolvedTheme === 'dark' ? 'invert(90%) hue-rotate(180deg)' : 'none',
                                            willChange: 'filter',
                                            transform: 'translateZ(0)',
                                            backfaceVisibility: 'hidden'
                                        }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Aster Medicines Location"
                                        className="rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="contact-form-container">
                                <div className="bg-card border border-border rounded-2xl p-8 backdrop-blur-sm h-full">
                                    <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>

                                    {status.message && status.type === 'error' && (
                                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                                            {status.message}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="firstName" className="text-sm font-medium text-muted-foreground">First Name</label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground"
                                                    placeholder="Aditya"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="lastName" className="text-sm font-medium text-muted-foreground">Last Name</label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground"
                                                    placeholder="Raj"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                autoComplete="email"
                                                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground"
                                                placeholder="aster@example.com"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="mobileNumber" className="text-sm font-medium text-muted-foreground">Mobile Number</label>
                                            <input
                                                type="tel"
                                                id="mobileNumber"
                                                name="mobileNumber"
                                                value={formData.mobileNumber}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground"
                                                placeholder="+91 **********"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium text-muted-foreground">Subject</label>
                                            <input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground"
                                                placeholder="How can we help you?"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium text-muted-foreground">Message</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={5}
                                                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground resize-none"
                                                placeholder="Tell us about your inquiry..."
                                            ></textarea>
                                        </div>

                                        <Button3D
                                            type="submit"
                                            disabled={isSubmitting}
                                            variant="primary"
                                            className="w-full"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send className="h-5 w-5" />
                                                </>
                                            )}
                                        </Button3D>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ContactContent;
