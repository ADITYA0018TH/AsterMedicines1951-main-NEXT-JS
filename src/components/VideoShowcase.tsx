"use client";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder video data - you can replace these with your actual YouTube video IDs
const videos = [
    {
        id: "1",
        title: "नन्हे सितारों की कोमल त्वचा के लिए... Aster का स्पर्श",
        thumbnail: "https://img.youtube.com/vi/bJf-X2QSWdw/hqdefault.jpg",
        videoId: "bJf-X2QSWdw",
        desc: "Gentle care for soft skin - Aster Medicines"
    },
    {
        id: "2",
        title: "BABY CARE ASTER AD OIL",
        thumbnail: "https://img.youtube.com/vi/kiS6EiIzNhA/hqdefault.jpg",
        videoId: "kiS6EiIzNhA",
        desc: "Protecting your baby's delicate skin"
    },
    {
        id: "3",
        title: "Aster Medicines - Latest Update",
        thumbnail: "https://img.youtube.com/vi/iizGan_HXj8/hqdefault.jpg",
        videoId: "iizGan_HXj8",
        desc: "Highlights from our recent journey"
    }
];

const VideoShowcase = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative py-20 lg:py-32 overflow-hidden bg-slate-50 dark:bg-black/50"
            id="media"
        >
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <motion.div
                    style={{ opacity, y: useTransform(scrollYProgress, [0, 0.2], [50, 0]) }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-slate-900 dark:text-white mb-6">
                        See Us in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Action</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Discover how we're transforming healthcare through innovation and dedication.
                        Watch our latest updates and behind-the-scenes content.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800"
                        >
                            <div className="aspect-video relative overflow-hidden bg-slate-900">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                                <button
                                    onClick={() => setActiveVideo(video.videoId)}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:bg-white/20 group-hover:w-20 group-hover:h-20"
                                >
                                    <Play className="w-6 h-6 fill-current ml-1" />
                                </button>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                                    {video.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    {video.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                        onClick={() => setActiveVideo(null)}
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveVideo(null);
                            }}
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-800"
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

export default VideoShowcase;
