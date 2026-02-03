"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Loader2, ChevronLeft, ChevronRight, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import Navbar from "@/components/Navbar";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setIsSuccess(true);
            toast.success("Reset Link Sent", {
                description: "Check your email for the password reset link.",
            });
        } catch (error: any) {
            toast.error("Request Failed", {
                description: error.message || "Failed to send reset email.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden font-sans">
            {/* Background */}
            <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-black" />

            {/* Scanning Lines */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <svg className="w-full h-full opacity-20">
                    <line x1="0" y1="20%" x2="100%" y2="20%" stroke="currentColor" strokeWidth="1" className="text-pulse-500 animate-dash" strokeDasharray="10, 20" />
                    <line x1="0" y1="80%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="1" className="text-pulse-500 animate-dash" strokeDasharray="10, 20" />
                </svg>
            </div>

            {/* Mobile Navbar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
                <Navbar />
            </div>

            {/* Desktop Theme Toggle */}
            <div className="hidden lg:block fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            <main className="relative z-10 w-full max-w-[1100px] px-6 py-12 pt-24 lg:pt-12 flex flex-col items-center">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-12"
                >
                    <Image
                        src="/uploads/logo.webp"
                        alt="Aster Medicines Logo"
                        width={180}
                        height={120}
                        className="h-24 w-auto mb-6"
                        priority
                    />
                    <div className="flex items-center gap-3 bg-secondary px-4 py-1.5 rounded-full border border-border">
                        <div className="w-2 h-2 rounded-full bg-pulse-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            Password Recovery
                        </span>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-0 w-full max-w-4xl rounded-[var(--radius)] overflow-hidden border border-border shadow-2xl">
                    {/* Left Panel */}
                    <div className="hidden lg:flex lg:col-span-5 bg-secondary/50 backdrop-blur-sm p-10 flex-col justify-between border-r border-border">
                        <div className="space-y-6">
                            <Fingerprint className="w-12 h-12 text-pulse-500" />
                            <h2 className="text-3xl font-bold leading-tight">
                                Account <br />
                                <span className="text-pulse-500">Recovery</span>
                            </h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Enter your admin email address and we'll send you a secure link to reset your password.
                            </p>
                        </div>

                        <Link href="/login" className="group flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-pulse-500 transition-colors">
                            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>
                    </div>

                    {/* Right Panel: Form */}
                    <div className="col-span-12 lg:col-span-7 bg-card p-10 sm:p-14 relative">
                        {!isSuccess ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                            Admin Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="email@astermedicines.com"
                                                className="w-full bg-background border border-border focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 py-3.5 pl-12 pr-4 rounded-[var(--radius)] outline-none transition-all text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-pulse-500 hover:bg-pulse-500/90 text-white font-bold py-4 rounded-[var(--radius)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <span className="text-sm uppercase tracking-[0.1em]">Send Reset Link</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>

                                <Link
                                    href="/login"
                                    className="lg:hidden w-full text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-pulse-500 transition-colors block"
                                >
                                    Back to Login
                                </Link>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6"
                            >
                                <div className="w-16 h-16 mx-auto rounded-full bg-pulse-500/10 flex items-center justify-center">
                                    <Mail className="w-8 h-8 text-pulse-500" />
                                </div>
                                <h3 className="text-xl font-bold">Check Your Email</h3>
                                <p className="text-muted-foreground text-sm">
                                    If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-pulse-500 text-sm font-bold hover:underline"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-40">
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Encryption</span>
                        <span className="text-xs font-mono text-foreground">AES-256</span>
                    </div>
                    <div className="flex flex-col items-center border-l border-border pl-8">
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Link Expiry</span>
                        <span className="text-xs font-mono text-foreground">1 HOUR</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
