"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const NotFound = () => {
    const pathname = usePathname();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            pathname
        );
    }, [pathname]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-orange-50/50 via-white/50 to-orange-100/50">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

                {/* Floating Medical Elements */}
                <div className="absolute top-20 right-20 animate-medicine-float opacity-20">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-orange-500">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12h8" />
                        <path d="M12 8v8" />
                    </svg>
                </div>
                <div className="absolute bottom-20 left-20 animate-pill-float opacity-20">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-500">
                        <rect x="2" y="6" width="20" height="12" rx="6" />
                    </svg>
                </div>
            </div>

            <div className="relative z-10 glass-card p-12 md:p-16 max-w-2xl w-full mx-4 text-center border border-white/40 shadow-2xl">
                <div className="mb-8 relative inline-block">
                    <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 animate-fade-in">
                        404
                    </h1>
                    <div className="absolute -top-4 -right-4 animate-bounce">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border border-orange-200">
                            <span className="text-orange-500 text-xl">?</span>
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-display animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    Page Not Found
                </h2>

                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <Link
                        href="/"
                        className="button-primary inline-flex items-center gap-2 group"
                    >
                        <svg
                            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
