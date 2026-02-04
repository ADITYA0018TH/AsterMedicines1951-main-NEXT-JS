"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Loader2, ChevronRight, Eye, EyeOff, ShieldCheck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import Navbar from "@/components/Navbar";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid Reset Link", {
                description: "The reset link is missing or invalid.",
            });
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords Don't Match", {
                description: "Please make sure both passwords are identical.",
            });
            return;
        }

        if (password.length < 6) {
            toast.error("Password Too Short", {
                description: "Password must be at least 6 characters.",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setIsSuccess(true);
            toast.success("Password Reset Successfully", {
                description: "You can now login with your new password.",
            });

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/7061452180");
            }, 3000);
        } catch (error: any) {
            toast.error("Reset Failed", {
                description: error.message || "Failed to reset password.",
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
                            Create New Password
                        </span>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-0 w-full max-w-4xl rounded-[var(--radius)] overflow-hidden border border-border shadow-2xl">
                    {/* Left Panel */}
                    <div className="hidden lg:flex lg:col-span-5 bg-secondary/50 backdrop-blur-sm p-10 flex-col justify-between border-r border-border">
                        <div className="space-y-6">
                            <ShieldCheck className="w-12 h-12 text-pulse-500" />
                            <h2 className="text-3xl font-bold leading-tight">
                                Secure <br />
                                <span className="text-pulse-500">Reset</span>
                            </h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Choose a strong password with at least 6 characters. We recommend using a mix of letters, numbers, and symbols.
                            </p>
                        </div>

                        <Link href="/7061452180" className="group flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-pulse-500 transition-colors">
                            Return to Login
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Right Panel: Form */}
                    <div className="col-span-12 lg:col-span-7 bg-card p-10 sm:p-14 relative">
                        {!token ? (
                            <div className="text-center space-y-6">
                                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                                    <Lock className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold">Invalid Reset Link</h3>
                                <p className="text-muted-foreground text-sm">
                                    This password reset link is invalid or has expired. Please request a new one.
                                </p>
                                <Link
                                    href="/forgot-password"
                                    className="inline-flex items-center gap-2 text-pulse-500 text-sm font-bold hover:underline"
                                >
                                    Request New Link
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : !isSuccess ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    {/* New Password */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-background border border-border focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 py-3.5 pl-12 pr-12 rounded-[var(--radius)] outline-none transition-all text-sm"
                                                required
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-pulse-500 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-background border border-border focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 py-3.5 pl-12 pr-12 rounded-[var(--radius)] outline-none transition-all text-sm"
                                                required
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-pulse-500 transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
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
                                                <span className="text-sm uppercase tracking-[0.1em]">Reset Password</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6"
                            >
                                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold">Password Reset Complete</h3>
                                <p className="text-muted-foreground text-sm">
                                    Your password has been successfully updated. Redirecting you to login...
                                </p>
                                <Link
                                    href="/7061452180"
                                    className="inline-flex items-center gap-2 text-pulse-500 text-sm font-bold hover:underline"
                                >
                                    Go to Login
                                    <ChevronRight className="w-4 h-4" />
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
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Hash</span>
                        <span className="text-xs font-mono text-foreground">BCRYPT</span>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-pulse-500" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
