"use client";

import { motion } from "framer-motion";
import { Hammer, Settings } from "lucide-react";

export default function MaintenancePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative mb-8"
            >
                <div className="flex items-center justify-center gap-4 text-brand-accent">
                    <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                        <Hammer size={64} />
                    </motion.div>
                    <Settings size={48} className="animate-spin-slow opacity-50" />
                </div>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl"
            >
                Under Maintenance
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 max-w-md text-muted-foreground"
            >
                We're currently updating our website to serve you better.
                Please check back soon.
            </motion.p>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-muted-foreground"
            >
                &copy; {new Date().getFullYear()} Aster Medicines Pvt Ltd
            </motion.div>
        </div>
    );
}
