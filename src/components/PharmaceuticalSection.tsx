"use client";

import React, { useRef } from "react";
import { Factory, Pipette, ShieldCheck, ArrowRight, Activity, Globe } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

import { useIsMobile } from "@/hooks/use-mobile";

const PharmaceuticalSection = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // We use the scroll progress of the container to drive the horizontal, animation
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map vertical scroll (0 to 1) to horizontal translation
  // We want to move the track leftwards as we scroll down
  // Increased to -87% for mobile to ensure the last card and CTA are fully visible
  const x = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "-87%" : "-65%"]);

  // Parallax background movement - moves slower than the foreground
  const bgX = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  // Text reveal opacity based on scroll
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  const cards = [
    {
      id: 1,
      title: "Third Party Manufacturing",
      subtitle: "Injection Manufacturing",
      description: "Scalable contract manufacturing for Beta-Lactam & Non-Beta Lactam injections. We handle complex production of critical care medicines for global brands.",
      icon: <Factory className="w-8 h-8 text-orange-600 dark:text-orange-500" />,
      stats: ["1M+ Vials/Month", "99.9% On-Time"],
      color: "from-orange-500/10 to-orange-600/5 dark:from-orange-500/20 dark:to-orange-600/5",
    },
    {
      id: 2,
      title: "Product Portfolio",
      subtitle: "Meropenem & Ceftriaxone",
      description: "A comprehensive catalog of high-demand formulations including Meropenem, Ceftriaxone, Piperacillin Tazobactam, and specialized dry powder injections.",
      icon: <Pipette className="w-8 h-8 text-blue-600 dark:text-blue-500" />,
      stats: ["50+ Formulations", "Critical Care"],
      color: "from-blue-500/10 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-600/5",
    },
    {
      id: 3,
      title: "GMP Certified",
      subtitle: "Quality Standards",
      description: "Our WHO-GMP & ISO 9001:2015 certified plant in Hajipur, Bihar sets the industry benchmark. Rigorous quality control for every liquid and dry injection.",
      icon: <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-500" />,
      stats: ["ISO 9001:2015", "GLP Certified"],
      color: "from-green-500/10 to-green-600/5 dark:from-green-500/20 dark:to-green-600/5",
    },
    {
      id: 4,
      title: "R&D Innovation",
      subtitle: "New Formulations",
      description: "Continuous investment in research to develop effective antibiotic combinations and stable injectable formulations for the Indian market.",
      icon: <Activity className="w-8 h-8 text-purple-600 dark:text-purple-500" />,
      stats: ["Modern Lab", "Expert Team"],
      color: "from-purple-500/10 to-purple-600/5 dark:from-purple-500/20 dark:to-purple-600/5",
    },
    {
      id: 5,
      title: "Global Reach",
      subtitle: "Export & PAN India",
      description: "Connecting healthcare providers across India with an efficient online distributor network. We ensure urgent medicine delivery for critical care across Bihar, West Bengal, and beyond.",
      icon: <Globe className="w-8 h-8 text-cyan-600 dark:text-cyan-500" />,
      stats: ["Pan-India Supply", "Export Quality"],
      color: "from-cyan-500/10 to-cyan-600/5 dark:from-cyan-500/20 dark:to-cyan-600/5",
    }
  ];

  return (
    // The container height determines the "duration" of the scroll effect
    <section ref={targetRef} className="relative h-[300vh] bg-slate-50 dark:bg-neutral-950 transition-colors duration-500">

      {/* Sticky Viewport */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">

        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950 transition-colors duration-500" />
          <motion.div
            style={{ x: bgX }}
            className="absolute top-1/2 left-0 w-[200vw] h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 dark:via-orange-500/50 to-transparent blur-sm"
          />
          {/* Grid Pattern: Dark vs Light opacity handled via class */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-100 dark:opacity-100" />
        </div>

        {/* Introductory Heading - Fades out as you scroll horizontal */}
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="absolute top-24 left-8 md:left-24 z-20 max-w-2xl pointer-events-none"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-12 bg-orange-500"></div>
            <span className="text-orange-600 dark:text-orange-500 font-bold tracking-widest uppercase text-sm">Our Expertise</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white leading-tight transition-colors duration-500">
            Manufacturing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              Critical Care Injections.
            </span>
          </h2>
          <p className="mt-6 text-slate-600 dark:text-neutral-400 text-lg md:text-xl max-w-lg transition-colors duration-500">
            Scroll to explore our comprehensive pharmaceutical capabilities, from contract manufacturing to global quality standards.
          </p>
        </motion.div>

        {/* Horizontal Track */}
        <motion.div style={{ x }} className="flex gap-8 px-8 md:px-24 items-center relative z-10 pt-32 md:pt-0">

          {/* Spacer to push first card past the header initially if needed, or just start right away. 
              We'll add a 'ghost' title card to occupy the first slot effectively. */}
          <div className="flex-shrink-0 w-[80vw] md:w-[40vw] h-[60vh] flex flex-col justify-end pb-12 p-8">
            {/* Empty start block to align with the text */}
            <div className="text-slate-400 dark:text-neutral-500 text-sm animate-pulse tracking-widest">
              &larr; SCROLL TO EXPLORE
            </div>
          </div>

          {cards.map((card) => {
            return (
              <div
                key={card.id}
                className="group relative h-[55vh] md:h-[65vh] w-[85vw] md:w-[35vw] max-w-[500px] flex-shrink-0 rounded-3xl bg-white/60 dark:bg-neutral-900/50 border border-slate-200 dark:border-white/10 backdrop-blur-md overflow-hidden hover:bg-white dark:hover:bg-neutral-900/80 transition-all duration-500 shadow-sm hover:shadow-xl dark:shadow-none"
              >
                {/* Hover Gradient Bloom */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm dark:shadow-none group-hover:scale-110 transition-transform duration-500">
                        {card.icon}
                      </div>
                      <span className="text-7xl font-display font-bold text-slate-200 dark:text-white/5 group-hover:text-slate-300 dark:group-hover:text-white/10 transition-colors select-none">
                        0{card.id}
                      </span>
                    </div>

                    <h4 className="text-orange-600 dark:text-orange-400 text-sm font-bold uppercase tracking-wider mb-2">
                      {card.subtitle}
                    </h4>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-6">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 dark:text-neutral-400 text-lg leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-200 dark:border-white/10 pt-6">
                    <div className="flex flex-wrap gap-4 mb-6">
                      {card.stats.map((stat, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-xs text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/5 font-medium">
                          {stat}
                        </span>
                      ))}
                    </div>
                    <button className="flex items-center gap-2 text-slate-900 dark:text-white font-medium group/btn group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Final CTA Card */}
          <div className="flex-shrink-0 h-[55vh] md:h-[65vh] w-[85vw] md:w-[30vw] flex flex-col justify-center items-center p-12 rounded-3xl bg-orange-600 text-center shadow-lg transform transition-transform hover:scale-[1.02]">
            <h3 className="text-4xl font-display font-bold text-white mb-6">Ready to Partner?</h3>
            <p className="text-orange-100 mb-8 max-w-sm">Join hands with Aster Medicines for world-class pharmaceutical manufacturing.</p>
            <button className="px-8 py-4 bg-white text-orange-600 rounded-full font-bold hover:bg-orange-50 transition-colors shadow-xl">
              Contact Us Now
            </button>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default PharmaceuticalSection;