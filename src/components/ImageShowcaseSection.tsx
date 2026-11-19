"use client";
import React, { useRef } from "react";
import { homepageImage } from "@/data/homepageImages";
import { useSettings } from "@/context/SettingsContext";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ContainerScroll } from "@/components/ContainerScrollAnimation";
import { Zap, Shield, ArrowRight, Droplets } from "lucide-react";

const ImageShowcaseSection = () => {
  const { settings } = useSettings();
  const photo = homepageImage(settings.homepageImages, "manufacturing");
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // REAL DATA based on your Google Profile (Injectables & Hajipur Plant)
  const features = [
    {
      icon: Shield,
      // "Class 100" is the specific keyword for sterile manufacturing zones
      title: "Class 100 Clean Rooms",
      desc: "HEPA-filtered sterile zones ensuring zero-contamination for liquid vials.",
    },
    {
      icon: Droplets,
      // Buyers judge a factory by its Water System (WFI)
      title: "WFI Generation Plant",
      desc: "Double Pass RO + EDI systems producing IP/BP grade Water For Injection.",
    },
    {
      icon: Zap,
      title: "High-Speed Vial Lines",
      desc: "Automated filling for Meropenem, Amikacin, and Dry Powder Injections.",
    },
  ];

  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [30, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-auto lg:h-[200vh] bg-gradient-to-b from-white via-slate-50 to-white dark:from-black dark:via-zinc-950 dark:to-black py-8 lg:py-0"
      id="technology-showcase"
    >
      <div className="relative lg:sticky top-0 h-auto lg:h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative h-full px-4 sm:px-6 lg:px-8 mx-auto flex items-center">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full pt-20 lg:pt-0">

            {/* Left Side: Text Content */}
            <motion.div
              style={{ opacity: textOpacity, y: textY }}
              className="w-full lg:w-1/2 flex flex-col gap-6 lg:gap-8"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs lg:text-sm font-semibold tracking-wide w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                GMP CERTIFIED UNIT
              </div>

              {/* Headline: Optimized for 'Sterile Manufacturing' */}
              <div className="space-y-3 lg:space-y-4">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Advanced <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-700 to-orange-600">
                    Sterile Manufacturing
                  </span>
                </h2>
                <p className="text-sm sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                  Located in <span className="font-semibold text-slate-900 dark:text-white">Industrial Area E/4, Hajipur</span>, our facility specializes in Liquid Injections, Dry Powders, and Oral Suspensions.
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-3 mt-1 lg:mt-2">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 backdrop-blur-sm hover:border-orange-500/40 transition-all duration-300 group cursor-default"
                  >
                    <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-brand-accent flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                      <feature.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                    <div>
                      {/* Semantic H3 for SEO */}
                      <h3 className="font-semibold text-sm lg:text-base text-slate-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href="/infrastructure"
                className="inline-flex items-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:scale-105 active:scale-95 transition-transform w-fit shadow-lg shadow-black/20 dark:shadow-white/10"
              >
                View Infrastructure
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Right Side: Image with SEO Alt Tag */}
            <div className="w-full lg:w-1/2 mt-0 hover:scale-[1.02] transition-transform duration-500">
              <ContainerScroll scrollYProgress={scrollYProgress}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-slate-400 dark:text-slate-600">
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