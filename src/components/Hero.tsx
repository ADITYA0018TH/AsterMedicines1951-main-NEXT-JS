"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Microscope, ChevronRight } from "lucide-react";


const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    // Cache bounds to avoid layout thrashing
    let bounds = { left: 0, top: 0, width: 0, height: 0 };
    const updateBounds = () => {
      if (containerRef.current) {
        bounds = containerRef.current.getBoundingClientRect();
      }
    };

    // Initial measure
    updateBounds();
    window.addEventListener("resize", updateBounds);
    window.addEventListener("scroll", updateBounds); // Update on scroll as position changes

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current || bounds.width === 0) return;

      // Use cached bounds - no reflow!
      const x = (e.clientX - bounds.left) / bounds.width - 0.5;
      const y = (e.clientY - bounds.top) / bounds.height - 0.5;

      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        if (imageRef.current) {
          imageRef.current.style.transform = `perspective(1000px) rotateY(${x * 2.5}deg) rotateX(${-y * 2.5}deg) scale3d(1.02, 1.02, 1.02)`;
        }
      });
    };

    const handleMouseLeave = () => {
      if (!imageRef.current) return;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        if (imageRef.current) {
          imageRef.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)";
        }
      });
    };

    const container = containerRef.current;
    container?.addEventListener("mousemove", handleMouseMove);
    container?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds);
      container?.removeEventListener("mousemove", handleMouseMove);
      container?.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const elements = document.querySelectorAll(".parallax");
      elements.forEach((el) => {
        const element = el as HTMLElement;
        const speed = parseFloat(element.dataset.speed || "0.1");
        const yPos = -scrollY * speed;
        element.style.setProperty("--parallax-y", `${yPos}px`);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <section
      className="relative w-full min-h-screen flex items-center bg-white dark:bg-black overflow-hidden"
      id="hero"
    >
      {/* 1. Technical Data Grid Overlay - Very subtle */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-black/50 dark:to-black"></div>

        {/* Animated Flowing Lines - Heartbeat / ECG Pattern */}
        {!isMobile && (
          <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-40" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            {/* Line 1: Top - User requested FAST and LIGHT */}
            <path d="M0 200 L100 200 L115 170 L130 230 L145 200 L250 200 L265 150 L280 250 L295 200 L400 200 L415 170 L430 230 L445 200 L550 200 L565 150 L580 250 L595 200 L700 200 L715 170 L730 230 L745 200 L850 200 L865 150 L880 250 L895 200 L1000 200 L1015 170 L1030 230 L1045 200 L1150 200 L1165 150 L1180 250 L1195 200 L1300 200 L1315 170 L1330 230 L1345 200 L1440 200" stroke="currentColor" strokeWidth="1.5" className="text-slate-300 dark:text-white/40 animate-dash" strokeDasharray="300 20" style={{ animationDuration: "5s" }} />

            {/* Line 2: Middle - Very Fast */}
            <path d="M0 400 L150 400 L170 380 L190 400 L205 400 L215 320 L225 480 L235 400 L250 400 L270 370 L290 400 L440 400 L460 380 L480 400 L495 400 L505 320 L515 480 L525 400 L540 400 L560 370 L580 400 L730 400 L750 380 L770 400 L785 400 L795 320 L805 480 L815 400 L830 400 L850 370 L870 400 L1020 400 L1040 380 L1060 400 L1075 400 L1085 320 L1095 480 L1105 400 L1120 400 L1140 370 L1160 400 L1310 400 L1330 380 L1350 400 L1365 400 L1375 320 L1385 480 L1395 400 L1410 400 L1440 400" stroke="currentColor" strokeWidth="2" className="text-slate-300 dark:text-white/60 animate-dash" strokeDasharray="500 50" style={{ animationDuration: "3s" }} />

            {/* Line 3: Bottom - Varying speed */}
            <path d="M0 600 L200 600 L215 630 L230 570 L245 600 L450 600 L465 630 L480 570 L495 600 L700 600 L715 630 L730 570 L745 600 L950 600 L965 630 L980 570 L995 600 L1200 600 L1215 630 L1230 570 L1245 600 L1440 600" stroke="currentColor" strokeWidth="1.5" className="text-slate-300 dark:text-white/40 animate-dash" strokeDasharray="300 30" style={{ animationDuration: "7s", animationDirection: "reverse" }} />
          </svg>
        )}
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto h-full flex flex-col justify-center py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 3xl:gap-16 items-center">

          {/* Left Column: Typography (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Clinical Label */}
            <div className="flex items-center gap-3 mb-8 3xl:mb-12">
              <div className="h-[1px] w-12 3xl:w-20 bg-pulse-500"></div>
              <span className="text-xs 3xl:text-sm font-mono tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
                Est. 1991
              </span>
            </div>

            <h1 className="font-display font-medium tracking-tight text-slate-900 dark:text-white leading-[0.9]">
              <span className="block text-[3.5rem] sm:text-[5rem] lg:text-[7rem] 3xl:text-[8rem] 4xl:text-[9.5rem] font-bold text-slate-900 dark:text-white leading-none mb-2 -ml-1">
                Aster Medicines
              </span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl 3xl:text-6xl 4xl:text-[4.5rem] font-medium text-transparent bg-clip-text bg-gradient-to-r from-pulse-500 to-orange-400 animate-gradient-x mt-2">
                Precision
              </span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl 3xl:text-6xl 4xl:text-[4.5rem] font-light mt-1 normal-case leading-tight font-sans tracking-normal text-slate-400 dark:text-slate-500">
                in every dose.
              </span>
            </h1>

            <p className="mt-8 sm:mt-12 3xl:mt-16 text-lg sm:text-xl 3xl:text-2xl 4xl:text-3xl text-slate-600 dark:text-slate-400 max-w-xl 3xl:max-w-2xl 4xl:max-w-3xl leading-relaxed font-light border-l border-slate-200 dark:border-slate-800 pl-6 3xl:pl-10">
              Pioneering pharmaceutical manufacturing with state-of-the-art automation and unyielding quality control standards.
            </p>

            <div className="mt-10 sm:mt-16 3xl:mt-20 flex flex-wrap gap-5">
              <a
                href="/contact"
                className="group inline-flex items-center justify-between gap-4 px-6 py-4 3xl:px-8 3xl:py-6 text-white bg-gradient-to-r from-[#FE5C02] to-[#FE5C02] rounded-full shadow-[inset_2px_2px_6px_rgba(255,255,255,0.2),_inset_-2px_-2px_6px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-105 active:scale-95 active:shadow-[inset_1px_1px_4px_rgba(0,0,0,0.2)] animate-bounce hover:animate-none"
              >
                <span className="text-lg 3xl:text-xl 4xl:text-2xl font-medium">Contact Us</span>
                <span className="flex items-center justify-center w-10 h-10 3xl:w-12 3xl:h-12 bg-white rounded-full transition-all duration-300 group-hover:translate-x-1 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] group-hover:animate-pulse shadow-[inset_2px_2px_5px_rgba(255,255,255,0.4),_inset_-2px_-2px_5px_rgba(0,0,0,0.1)] active:shadow-inner active:scale-90">
                  <ChevronRight className="text-[#FE5C02] w-5 h-5 3xl:w-6 3xl:h-6" />
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Anchor (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 p-8 3xl:p-12">
              {/* Decorative Glass Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-white/20 dark:from-slate-800/50 dark:to-black/20 backdrop-blur-3xl rounded-[3rem] -z-10 border border-white/20 dark:border-white/10"></div>

              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-pulse-500/10 group aspect-[4/3] 3xl:aspect-[5/4]">
                <Image
                  ref={imageRef as any}
                  src="/My-uploads/Ondansetron.webp"
                  alt="Precision Pharmaceutical Manufacturing"
                  fill
                  sizes="(max-width: 1024px) 100vw, (min-width: 1800px) 50vw, 42vw"
                  className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 3xl:-bottom-10 3xl:-left-10 bg-white dark:bg-black p-4 md:p-6 3xl:p-8 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 md:gap-4 3xl:gap-6 animate-bounce-slow transform transition-all z-20">
                <div className="w-10 h-10 md:w-12 md:h-12 3xl:w-16 3xl:h-16 bg-pulse-50 rounded-full flex items-center justify-center text-pulse-500">
                  <Microscope className="w-5 h-5 md:w-6 md:h-6 3xl:w-8 3xl:h-8" />
                </div>
                <div>
                  <div className="text-xl md:text-2xl 3xl:text-4xl font-bold text-slate-900 dark:text-white">99.9%</div>
                  <div className="text-[10px] md:text-xs 3xl:text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Purity Grade</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
