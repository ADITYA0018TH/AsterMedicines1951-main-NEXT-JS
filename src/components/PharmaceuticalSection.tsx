"use client";

import React, { useEffect, useRef, useState } from "react";
import { Factory, Pipette, ShieldCheck } from "lucide-react"; // Added icons for visual context

const PharmaceuticalSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ticking = useRef(false);
  const lastScrollY = useRef(0);

  const cardStyle = {
    height: '60vh',
    maxHeight: '600px',
    borderRadius: '20px',
    transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
    willChange: 'transform, opacity'
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleScroll = () => {
      if (!ticking.current) {
        lastScrollY.current = window.scrollY;

        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;

          const sectionRect = sectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const totalScrollDistance = viewportHeight * 2;

          let progress = 0;
          if (sectionRect.top <= 0) {
            progress = Math.min(1, Math.max(0, Math.abs(sectionRect.top) / totalScrollDistance));
          }

          if (progress >= 0.66) {
            setActiveCardIndex(2);
          } else if (progress >= 0.33) {
            setActiveCardIndex(1);
          } else {
            setActiveCardIndex(0);
          }

          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const isFirstCardVisible = isIntersecting;
  const isSecondCardVisible = activeCardIndex >= 1;
  const isThirdCardVisible = activeCardIndex >= 2;

  // Background style (kept your original)
  const backgroundContent = (
    <>
      <div
        className="absolute inset-0 z-0 dark:hidden"
        style={{
          backgroundColor: 'orange',
          opacity: 1,
          width: '100%',
          height: '100%',
          backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, #FF6B00 30px), repeating-linear-gradient(#FFFFFF, #FFFFFF)`
        }}
      />
      <div
        className="absolute inset-0 z-0 hidden dark:block"
        style={{
          backgroundColor: 'black',
          opacity: 1,
          width: '100%',
          height: '100%',
          backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, black 30px), repeating-linear-gradient(#333333, #666666)`
        }}
      />
    </>
  );

  return (
    <div
      ref={sectionRef}
      className="relative animate-on-scroll opacity-0"
      style={{ height: '300vh' }}
    >
      <section className="w-full h-screen py-10 md:py-16 sticky top-0 overflow-hidden bg-background" id="why-pharmaceutical">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30 dark:opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="container px-4 sm:px-6 lg:px-8 mx-auto mt-10">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex items-center gap-6 mb-2 sm:mb-6">
              <div className="hidden sm:block h-[1px] w-12 bg-gray-300 dark:bg-slate-700"></div>
              <div className="pulse-chip-clean">
                <span className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">02 — Expertise</span>
              </div>
              <div className="flex-1 h-[1px] bg-gray-300 dark:bg-slate-700"></div>
            </div>

            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-1 md:mb-2 text-foreground">
              Manufacturing <span className="text-orange-500">Excellence</span>
            </h2>
          </div>

          <div ref={cardsContainerRef} className="relative flex-1 perspective-1000">
            
            {/* CARD 1: THIRD PARTY MANUFACTURING (The Money Maker) */}
            <div
              className={`absolute inset-0 overflow-hidden shadow-xl ${isFirstCardVisible ? 'animate-card-enter' : ''}`}
              style={{
                ...cardStyle,
                zIndex: 10,
                transform: `translateY(${isFirstCardVisible ? '90px' : '200px'}) scale(0.9)`,
                opacity: isFirstCardVisible ? 0.9 : 0
              }}
            >
              {backgroundContent}
              <div className="absolute top-4 right-4 z-20">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white dark:text-white dark:border-white/10 gap-2">
                   <Factory className="w-4 h-4" />
                   <span className="text-sm font-medium">B2B Services</span>
                </div>
              </div>
              <div className="relative z-10 p-5 sm:p-6 md:p-8 h-full flex items-center">
                <div className="max-w-lg">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-display text-black dark:text-white font-bold leading-tight mb-4">
                    Reliable <span className="text-black dark:text-brand-accent">Third Party Manufacturing</span> Partner.
                  </h3>
                  <p className="text-lg text-black/80 dark:text-white/80 font-medium">
                    We offer contract manufacturing services for pharmaceutical injections and syrups with on-time delivery guarantees.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 2: PRODUCT RANGE (The Specifics) */}
            <div
              className={`absolute inset-0 overflow-hidden shadow-xl ${isSecondCardVisible ? 'animate-card-enter' : ''}`}
              style={{
                ...cardStyle,
                zIndex: 20,
                transform: `translateY(${isSecondCardVisible ? activeCardIndex === 1 ? '55px' : '45px' : '200px'}) scale(0.95)`,
                opacity: isSecondCardVisible ? 1 : 0,
                pointerEvents: isSecondCardVisible ? 'auto' : 'none'
              }}
            >
              {backgroundContent}
              <div className="absolute top-4 right-4 z-20">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white dark:text-white dark:border-white/10 gap-2">
                  <Pipette className="w-4 h-4" />
                  <span className="text-sm font-medium">Product Range</span>
                </div>
              </div>
              <div className="relative z-10 p-5 sm:p-6 md:p-8 h-full flex items-center">
                <div className="max-w-lg">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-display text-black dark:text-white font-bold leading-tight mb-4">
                    Premium Quality <br /> <span className="text-black dark:text-brand-accent">Injections & Syrups</span>
                  </h3>
                  <p className="text-lg text-black/80 dark:text-white/80 font-medium">
                    Specializing in Liquid Injections (Meropenem, Ondansetron), Dry Powder Injections, and Oral Suspensions.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 3: QUALITY/GMP (The Trust Factor) */}
            <div
              className={`absolute inset-0 overflow-hidden shadow-xl ${isThirdCardVisible ? 'animate-card-enter' : ''}`}
              style={{
                ...cardStyle,
                zIndex: 30,
                transform: `translateY(${isThirdCardVisible ? activeCardIndex === 2 ? '15px' : '0' : '200px'}) scale(1)`,
                opacity: isThirdCardVisible ? 1 : 0,
                pointerEvents: isThirdCardVisible ? 'auto' : 'none'
              }}
            >
              {backgroundContent}
              <div className="absolute top-4 right-4 z-20">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white dark:text-white dark:border-white/10 gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm font-medium">Quality Assurance</span>
                </div>
              </div>
              <div className="relative z-10 p-5 sm:p-6 md:p-8 h-full flex items-center">
                <div className="max-w-lg">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-display text-black dark:text-white font-bold leading-tight mb-4">
                    WHO-GMP & ISO <span className="text-black dark:text-brand-accent">Certified Facility</span>
                  </h3>
                  <p className="text-lg text-black/80 dark:text-white/80 font-medium">
                    Our state-of-the-art manufacturing unit in Hajipur adheres to strict international quality standards.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default PharmaceuticalSection;