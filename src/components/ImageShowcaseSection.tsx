"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ContainerScroll } from "@/components/container-scroll-animation";
import { Sparkles, Zap, Shield, ArrowRight } from "lucide-react";

const ImageShowcaseSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Automated production lines with real-time monitoring.",
    },
    {
      icon: Shield,
      title: "Zero Tolerance",
      desc: "AI-powered quality inspection at every stage.",
    },
    {
      icon: Sparkles,
      title: "Precision Grade",
      desc: "99.9% purity standards across all products.",
    },
  ];

  // Animate text elements based on scroll
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [30, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh] bg-gradient-to-b from-white via-slate-50 to-white dark:from-black dark:via-zinc-950 dark:to-black"
      id="showcase"
    >
      {/* This is the sticky container that stays on screen */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative h-full px-4 sm:px-6 lg:px-8 mx-auto flex items-center">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full">
            {/* Left Side: Text Content */}
            <motion.div
              style={{ opacity: textOpacity, y: textY }}
              className="w-full lg:w-1/2 flex flex-col gap-8"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-semibold tracking-wide w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                NEXT-GEN MANUFACTURING
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  The Future of{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500">
                    Pharma Production
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                  Experience state-of-the-art facilities where precision engineering meets AI-driven quality control.
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-3 mt-2">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 backdrop-blur-sm hover:border-orange-500/40 transition-all duration-300 group cursor-default"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <a
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:scale-105 active:scale-95 transition-transform w-fit shadow-lg shadow-slate-900/20 dark:shadow-white/10"
              >
                Explore Products
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Right Side: Scroll Animation */}
            <div className="w-full lg:w-1/2">
              <ContainerScroll scrollYProgress={scrollYProgress}>
                <Image
                  src="/My-uploads/AD_OIL_170.webp"
                  alt="Advanced pharmaceutical manufacturing interface"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </ContainerScroll>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-600">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 border-2 border-slate-300 dark:border-slate-700 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-slate-400 dark:bg-slate-600 rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ImageShowcaseSection;