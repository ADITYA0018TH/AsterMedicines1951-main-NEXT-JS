"use client";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// YOUR ORIGINAL VIDEO DATA PRESERVED
const videos = [
    {
        id: "1",
        title: "नन्हे सितारों की कोमल त्वचा के लिए... Aster का स्पर्श",
        thumbnail: "https://img.youtube.com/vi/bJf-X2QSWdw/hqdefault.jpg",
        videoId: "bJf-X2QSWdw",
        desc: "Aster Baby Care Ad - Gentle Protection",
        className: "lg:col-span-2 lg:row-span-2", // Bento: Main Large Item
    },
    {
        id: "2",
        title: "BABY CARE ASTER AD OIL",
        thumbnail: "https://img.youtube.com/vi/kiS6EiIzNhA/hqdefault.jpg",
        videoId: "kiS6EiIzNhA",
        desc: "Essential Care for Delicate Skin",
        className: "lg:col-span-1 lg:row-span-1", // Bento: Stacked Item 1
    },
    {
        id: "3",
        title: "Aster Medicines - Latest Update",
        thumbnail: "https://img.youtube.com/vi/iizGan_HXj8/hqdefault.jpg",
        videoId: "iizGan_HXj8",
        desc: "Corporate Highlights & Updates",
        className: "lg:col-span-1 lg:row-span-1", // Bento: Stacked Item 2
    }
];

const VideoShowcase = () => {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    return (
        <section className="relative py-24 lg:py-32 bg-white dark:bg-black overflow-hidden" id="media">

            {/* Minimalist Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-slate-100/50 dark:bg-zinc-900/50 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="container px-4 md:px-6 mx-auto">

                {/* Header */}
                <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-bold font-display tracking-tighter text-slate-900 dark:text-white mb-4"
                        >
                            Visual <span className="text-orange-500">Stories.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-slate-500 dark:text-slate-400 font-light"
                        >
                            See how we are redefining pharmaceutical excellence, one frame at a time.
                        </motion.p>
                    </div>

                    <a
                        href="https://www.youtube.com/@astermedicines13"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-zinc-800 text-sm font-medium hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300 group"
                        >
                            View All Media <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                        </motion.button>
                    </a>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-[300px] lg:auto-rows-[250px] gap-4">
                    {videos.map((video) => (
                        <SpotlightCard
                            key={video.id}
                            className={video.className}
                            onClick={() => setActiveVideo(video.videoId)}
                        >
                            <div className="relative w-full h-full group overflow-hidden">
                                {/* Thumbnail Image */}
                                <Image
                                    src={video.thumbnail}
                                    alt={video.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

                                {/* Content Overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end items-start h-full">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <button
                                            aria-label={`Play video: ${video.title}`}
                                            className="mb-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-white group-hover:text-black transition-all duration-300"
                                        >
                                            <Play className="w-5 h-5 ml-1 fill-current" />
                                        </button>
                                        <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-2">
                                            {video.title}
                                        </h3>
                                        <p className="text-sm text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 line-clamp-2">
                                            {video.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>

                {/* Mobile Button */}
                <div className="mt-8 md:hidden flex justify-center">
                    <a
                        href="https://www.youtube.com/@astermedicines13"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-zinc-800 text-sm font-medium hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300 group"
                    >
                        View All Media <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                    </a>
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
                        onClick={() => setActiveVideo(null)}
                    >
                        <motion.button
                            aria-label="Close video modal"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute top-6 right-6 p-3 rounded-full bg-zinc-800/50 text-white hover:bg-zinc-700 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveVideo(null);
                            }}
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black ring-1 ring-zinc-800"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

const SpotlightCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
                "relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-transparent cursor-pointer group",
                className
            )}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`,
                }}
            />
            <div
                className="absolute inset-0 rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,107,0,0.15), transparent 40%)`,
                }}
            />
            {children}
        </motion.div>
    );
};

export default VideoShowcase;