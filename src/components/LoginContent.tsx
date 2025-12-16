"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { Eye, EyeOff } from "lucide-react";
import Button3D from "@/components/ui/Button3D";

const LoginContent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Set cookie for middleware
                document.cookie = "isAuthenticated=true; path=/; max-age=86400; SameSite=Strict";
                localStorage.setItem("isAuthenticated", "true");
                toast.success("Logged in successfully");
                router.push("/admin/dashboard");
            } else {
                const data = await response.json();
                toast.error(data.message || "Invalid email or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred during login");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = () => {
        console.log("Forgot password clicked");
        toast.error("Please contact the system administrator to reset your password.");
    };

    return (
        <div
            className="min-h-screen flex flex-col bg-background"
        >
            <CustomCursor />
            <Navbar />

            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-40 pb-24">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left Column: Logo and Welcome Text */}
                        <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
                            <div className="flex justify-center lg:justify-start">
                                <img
                                    src="/My-uploads/logo.png"
                                    alt="Aster Medicines Logo"
                                    className="h-32 w-auto drop-shadow-2xl"
                                    style={{ filter: "drop-shadow(0 0 15px rgba(254,92,2,0.3))" }}
                                />
                            </div>
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
                                    Welcome <span className="text-pulse-500">Back</span>
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0">
                                    Sign in to access the administrative dashboard and manage your messages.
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Login Form */}
                        <div className="glass-card p-8 sm:p-12 hover:scale-[1.01] transition-all duration-500">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">Admin Login</h2>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg glass-card focus:ring-2 focus:ring-pulse-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                        placeholder="astermedicinespvtltd@gmail.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 pr-12 rounded-lg glass-card focus:ring-2 focus:ring-pulse-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-pulse-500 transition-colors duration-300 focus:outline-none"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <Button3D
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full"
                                        variant="primary"
                                    >
                                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                                    </Button3D>
                                </div>

                                <div className="text-center mt-6">
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-pulse-500 transition-colors duration-300 hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LoginContent;
