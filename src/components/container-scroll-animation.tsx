"use client";
import React, { useRef } from "react";
import { useTransform, motion, MotionValue } from "framer-motion";

interface ContainerScrollProps {
  children: React.ReactNode;
  scrollYProgress: MotionValue<number>;
}

export const ContainerScroll = ({
  children,
  scrollYProgress,
}: ContainerScrollProps) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.75, 1] : [0.85, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [25, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translateY = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 1]);

  return (
    <div className="h-full w-full flex items-center justify-center relative">
      <div
        className="w-full relative"
        style={{
          perspective: "1200px",
        }}
      >
        <motion.div
          style={{
            rotateX: rotate,
            scale,
            translateY,
            opacity,
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
          className="w-full h-[280px] sm:h-[320px] md:h-[400px] lg:h-[480px] bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-2xl md:rounded-3xl p-1.5 md:p-2 border border-zinc-700/50"
        >
          {/* Screen bezel effect */}
          <div className="h-full w-full overflow-hidden rounded-xl md:rounded-2xl bg-zinc-950 relative">
            {/* Camera notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-zinc-800 rounded-full z-10" />
            {/* Screen content */}
            <div className="h-full w-full relative">
              {children}
            </div>
            {/* Screen glare effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none rounded-xl md:rounded-2xl" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
