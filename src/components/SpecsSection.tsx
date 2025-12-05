import React from "react";
import ScrollReveal from "./ScrollReveal";

const SpecsSection = () => {
  return (
    <section
      className="w-full py-6 sm:py-10 bg-white dark:bg-black animate-on-scroll opacity-0"
      id="specifications"
    >
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          {/* Header with badge and line */}
          <div className="flex items-center gap-6 mb-12 sm:mb-20">
            <div className="hidden sm:block h-[1px] w-12 bg-gray-300 dark:bg-slate-700"></div>
            <div className="pulse-chip-clean">
              <span className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">03 — Quality Standards</span>
            </div>
            <div className="flex-1 h-[1px] bg-gray-300 dark:bg-slate-700"></div>
          </div>

          {/* Main content with text mask image - responsive text sizing */}
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display leading-[1.1] tracking-tight mb-8 sm:mb-12 text-center">
              <span className="block text-slate-900 dark:text-white mb-4">
                Uncompromising Quality.
              </span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-pulse-500 to-orange-400 bg-cover bg-center font-bold pb-2">
                <ScrollReveal
                  baseOpacity={1}
                  enableBlur={true}
                  baseRotation={5}
                  blurStrength={10}
                >
                  Global Standards.
                </ScrollReveal>
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-center text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Aster Medicines works with healthcare professionals worldwide, ensuring every medicine meets the highest quality standards. Through rigorous testing and advanced manufacturing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecsSection;
