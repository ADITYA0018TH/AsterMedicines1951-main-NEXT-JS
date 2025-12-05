"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { ContainerScroll } from "@/components/container-scroll-animation";

// --- ContainerScroll, Header, Card components ---
export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-5xl mx-auto text-center rounded-3xl"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full p-2 md:p-6 bg-white dark:bg-slate-900 rounded-[30px] shadow-2xl relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-pulse-500 to-orange-500 rounded-[30px] blur opacity-20 dark:opacity-40 -z-10"></div>
      <div className="h-full w-full overflow-hidden rounded-[24px] bg-gray-100 dark:bg-zinc-900 md:rounded-[24px] md:p-4">
        {children}
      </div>
    </motion.div>
  );
};
// --- End ContainerScroll, Header, Card ---

const ImageShowcaseSection = () => {
  return (
    <section className="h-screen w-full pt-0 pb-8 sm:pb-12 bg-white dark:bg-black rounded-3xl animate-on-scroll opacity-0" id="showcase">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto rounded-3xl">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-8">
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

            <div className="bg-white dark:bg-black p-8 sm:p-10 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-xl max-w-xl mr-auto -ml-4 sm:-ml-6 lg:-ml-8 relative overflow-hidden group hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors">
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
          <div className="w- lg:w-1/2 h-[60rem] relative">
            <ContainerScroll
              titleComponent={
                <div className="sr-only">Image Showcase</div> // Hidden title for accessibility as visual title is now on the left
              }
            >
              <div className="h-full flex flex-col rounded-3xl">
                <img
                  src="/lovable-uploads/AD_OIL_170.png"
                  alt="Advanced pharmaceutical manufacturing facility with modern equipment"
                  className="w-full h-full object-cover rounded-[30px]"
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