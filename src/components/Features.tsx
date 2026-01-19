"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { MagicBentoGrid, MagicBentoCard } from "@/components/ui/MagicBento";
import ScrollFloat from "@/components/ScrollFloat";
import { 
  Coins, 
  FileText, 
  Truck, 
  TrendingUp, 
  PackageCheck, 
  Users 
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ElementType; // Changed to allow Lucide icons
  title: string;
  description: string;
  index: number;
  className?: string;
}

const FeatureCard = ({ icon: Icon, title, description, index, className }: FeatureCardProps) => {
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
      className={cn("opacity-0 transition-opacity duration-700 h-full", className)}
      style={{ animationDelay: `${0.1 * index}s` }}
    >
      <MagicBentoCard
        className="magic-bento-card h-full p-8 rounded-3xl bg-white dark:bg-black border border-gray-100 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl group"
        glowColor="255, 107, 0" // Primary Orange
        enableStars={false}
        enableTilt={false}
        enableMagnetism={false}
        particleCount={6}
      >
        <div className="flex flex-col justify-between h-full relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-orange-100 dark:border-orange-500/20">
            <Icon size={28} strokeWidth={1.5} />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
              {description}
            </p>
          </div>
        </div>
      </MagicBentoCard>
    </div>
  );
};

const Features = () => {
  // SEO STRATEGY: High-Value B2B Keywords
  const features = [
    {
      title: "Cost-Effective Manufacturing",
      description: "Reduce your CAPEX. We provide end-to-end contract manufacturing solutions with competitive pricing for bulk injection orders.",
      icon: Coins,
      className: "md:col-span-2", // Large Card
    },
    {
      title: "Regulatory Support",
      description: "Full assistance with COPP, GMP certification, and dossier preparation for government tenders.",
      icon: FileText,
      className: "md:col-span-1",
    },
    {
      title: "24/7 Logistics Network",
      description: "Seamless cold-chain delivery across Bihar, Jharkhand, and UP with real-time tracking.",
      icon: Truck,
      className: "md:col-span-1",
    },
    {
      title: "Scalable Production",
      description: "High-speed lines capable of producing 1 Million+ ampoules per shift to meet sudden market demands.",
      icon: TrendingUp,
      className: "md:col-span-2", // Large Card
    },
    {
      title: "Export Quality Packaging",
      description: "Premium Alu-Alu and Blister packaging that meets international shelf-life standards.",
      icon: PackageCheck,
      className: "md:col-span-1",
    },
    {
      title: "PCD Franchise Support",
      description: "Monopoly rights, marketing materials (LBL, Visual Aids), and low MOQ for new partners.",
      icon: Users,
      className: "md:col-span-2", // Large Card (Changed to large to balance grid)
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-black relative overflow-hidden animate-on-scroll opacity-0" id="why-choose-us">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <div className="pulse-chip-clean mb-6 mx-auto w-fit">
            <span className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">Why Choose Aster</span>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-2 mb-6 text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white leading-tight">
            <span>Your Growth.</span>
            <div className="flex items-center gap-3">
              <span>Our</span>
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.03}
                containerClassName="my-0"
                textClassName="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-orange-500"
              >
                Infrastructure.
              </ScrollFloat>
            </div>
          </div>
          
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-xl mx-auto">
            We handle the manufacturing complexities so you can focus on building your pharmaceutical brand.
          </p>
        </div>

        <MagicBentoGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
              className={feature.className}
            />
          ))}
        </MagicBentoGrid>
      </div>
    </section>
  );
};

export default Features;