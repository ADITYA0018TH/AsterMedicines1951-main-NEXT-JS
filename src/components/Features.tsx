import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { MagicBentoGrid, MagicBentoCard } from "@/components/ui/MagicBento";
import ScrollFloat from "@/components/ScrollFloat";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  className?: string; // Add className prop for grid positioning
}

const FeatureCard = ({ icon, title, description, index, className }: FeatureCardProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => {
      if (wrapperRef.current) {
        observer.unobserve(wrapperRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={cn("opacity-0 transition-opacity duration-700 h-full", className)} // Wrapper handles layout and fade-in
      style={{ animationDelay: `${0.1 * index}s` }}
    >
      <MagicBentoCard
        className="magic-bento-card h-full p-8 rounded-3xl bg-white dark:bg-black border border-gray-100 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl"
        glowColor="255, 165, 0" // Orange color
        enableStars={false} // Stars might be too noisy for features, let's keep it clean or enable if requested. User snippet had it enabled. Let's enable it but maybe subtle. Actually user snippet had enableStars={true}. I will use true.
        enableTilt={false}
        enableMagnetism={false}
        particleCount={8} // Slightly reduced count for cleaner look
      >
        <div className="flex flex-col justify-between h-full relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center mb-4 group-hover:bg-pulse-500 group-hover:text-white transition-colors duration-300">
            {icon}
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </MagicBentoCard>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      title: "Quality Control",
      description: "Advanced testing ensures every medicine meets international standards.",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 3v18h18"></path><path d="M18.7 8a3 3 0 0 0-5.4 0"></path><path d="M9 17h8"></path><circle cx="9" cy="9" r="2"></circle><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path></svg>
    },
    {
      title: "R&D",
      description: "Continuous innovation in pharmaceutical formulations.",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
    },
    {
      title: "Precision",
      description: "Automated systems provide consistent, accurate dosing.",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M6 8.5L12 5l6 3.5v7L12 19l-6-3.5v-7z"></path><circle cx="12" cy="12" r="2"></circle></svg>
    },
    {
      title: "Compliance",
      description: "Full compliance with FDA, WHO, and international standards.",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m9 12 2 2 4-4"></path></svg>
    },
    {
      title: "Global Distribution",
      description: "Efficient supply chain management ensures timely delivery worldwide.",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
    },
    {
      title: "Innovation",
      description: "Developing next-generation medicines across multiple therapeutic areas.",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>
    }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-black relative overflow-hidden animate-on-scroll opacity-0" id="features">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <div className="pulse-chip-clean mb-6 mx-auto w-fit">
            <span className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">Our Capabilities</span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-x-4 mb-6 text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="my-0"
              textClassName="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white"
            >
              Engineered for
            </ScrollFloat>
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="my-0"
              textClassName="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-pulse-500"
            >
              Excellence.
            </ScrollFloat>
          </div>
          <p className="text-lg text-slate-600 dark:text-gray-400">
            Innovative solutions for complex healthcare challenges.
          </p>
        </div>

        <MagicBentoGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
              className={index === 0 || index === 3 ? "md:col-span-2" : "md:col-span-1"}
            />
          ))}
        </MagicBentoGrid>
      </div>
    </section>
  );
};

export default Features;
