"use client";

import { SessionProvider } from "next-auth/react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoadingProvider } from "@/components/LoadingProvider";
import { useState } from "react";

import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <TooltipProvider>
                        <LoadingProvider>
                            {children}
                            <Toaster />
                            <Sonner />
                        </LoadingProvider>
                    </TooltipProvider>
                </ThemeProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
}
