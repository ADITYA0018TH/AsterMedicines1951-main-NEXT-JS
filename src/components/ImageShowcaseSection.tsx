"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { ContainerScroll } from "@/components/container-scroll-animation";

// --- ContainerScroll, Header, Card components imported from @/components/container-scroll-animation ---

const ImageShowcaseSection = () => {
  return (
    <section className="h-screen w-full pt-0 pb-8 sm:pb-12 bg-white dark:bg-black rounded-3xl animate-on-scroll opacity-0 relative" id="showcase">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto rounded-3xl relative">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-8 relative">
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-12 sticky top-32">
            <div className="max-w-xl animate-on-scroll rounded-3xl">
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white mb-1 sm:mb-2 rounded-3xl">
                Advanced Pharmaceutical Manufacturing
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 rounded-3xl">
                Our state-of-the-art manufacturing facilities are designed to produce
                high-quality medicines that meet global healthcare standards.
              </p>
            </div>

            <div className="bg-white dark:bg-black p-8 sm:p-10 rounded-xl border border-gray-100 dark:border-slate-800 shadow-xl max-w-xl mr-auto -ml-4 sm:-ml-6 lg:-ml-8 relative overflow-hidden group hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold mb-4 rounded-3xl text-slate-900 dark:text-white">
                <span className="text-orange-500">Next Gen</span> Manufacturing
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Built with precision engineering and cutting-edge technology, our manufacturing
                facilities seamlessly integrate quality control systems, from research labs to
                distribution centers.
              </p>
            </div>
          </div>

          {/* Right Side: Container Scroll Animation */}
          <div className="w-full lg:w-1/2 h-[60rem] relative">
            <ContainerScroll
              titleComponent={
                <div className="sr-only">Image Showcase</div> // Hidden title for accessibility as visual title is now on the left
              }
            >
              <div className="h-full w-full relative flex flex-col rounded-3xl">
                <Image
                  src="/My-uploads/AD_OIL_170.png"
                  alt="Advanced pharmaceutical manufacturing facility with modern equipment"
                  fill
                  className="object-cover rounded-[30px]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </ContainerScroll>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageShowcaseSection;