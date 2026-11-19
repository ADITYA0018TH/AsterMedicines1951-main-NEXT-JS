"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, FileCheck, ShieldAlert, Microscope } from "lucide-react";

const stats = [
  {
    id: 1,
    value: 100,
    suffix: "%",
    label: "Sterile Manufacturing",
    desc: "Zero-contamination zones for injectables.",
    icon: ShieldAlert,
  },
  {
    id: 2,
    value: 3,
    suffix: "-Stage",
    label: "Quality Checks",
    desc: "Raw Material, In-Process, & Finished Goods.",
    icon: FileCheck,
  },
  {
    id: 3,
    value: 99.9,
    suffix: "%",
    label: "Purity Standards",
    desc: "Adhering to IP / BP / USP Pharmacopoeia.",
    icon: Microscope,
  },
  {
    id: 4,
    value: 24,
    suffix: "/7",
    label: "Lab Operations",
    desc: "Continuous monitoring by QC experts.",
    icon: CheckCircle2,
  },
];

const SpecsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Animate the Title
    gsap.fromTo(
      ".specs-title",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    // 2. Animate the Cards & Counters
    const statCards = document.querySelectorAll(".stat-card");
    statCards.forEach((card, index) => {
      // Fade In
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // Counter Animation
      const counterElement = card.querySelector(".counter-value");
      if (counterElement) {
        const targetValue = parseFloat(counterElement.getAttribute("data-target") || "0");

        gsap.to(counterElement, {
          innerText: targetValue,
          duration: 2,
          snap: { innerText: 0.1 },
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
          onUpdate: function () {
            const current = parseFloat(this.targets()[0].innerText);
            if (Number.isInteger(targetValue)) {
              this.targets()[0].innerText = Math.round(current);
            } else {
              this.targets()[0].innerText = current.toFixed(1);
            }
          },
        });
      }
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 lg:py-32 bg-background relative overflow-hidden"
      id="specifications"
    >
      {/* Background Technical Grid (Matches your border color) */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
          <div className="max-w-3xl specs-title opacity-0">
            <div className="flex items-center gap-4 mb-6">
              {/* Using Primary Orange for the line */}
              <span className="h-[2px] w-12 bg-primary"></span>
              <span className="text-primary font-bold tracking-widest uppercase text-sm">
                03 — Compliance
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-foreground leading-[1.1]">
              Certified for <br />
              {/* Using your specific 'text-gradient' utility here */}
              <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">
                Global Standards.
              </span>
            </h2>
          </div>

          <div className="md:max-w-xs specs-title opacity-0 text-muted-foreground text-lg leading-relaxed text-left md:text-right">
            We adhere to strict WHO-GMP & GLP guidelines to ensure safety in every vial.
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              // Applied your 'glass-card' utility
              className="stat-card glass-card group relative p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Icon color: Muted by default, Primary on hover */}
              <div className="absolute top-8 right-8 text-muted-foreground/20 group-hover:text-primary/20 transition-colors">
                <stat.icon size={48} strokeWidth={1} />
              </div>

              <div className="relative z-10 mt-12">
                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    className="counter-value text-5xl md:text-6xl font-display font-bold text-foreground"
                    data-target={stat.value}
                  >
                    0
                  </span>
                  {/* Suffix in Primary Orange */}
                  <span className="text-2xl font-medium text-primary">
                    {stat.suffix}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2">
                  {stat.label}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM TICKER - "The Stamp of Approval" */}
        <div className="mt-20 pt-10 border-t border-border flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
          {[
            "GMP CERTIFIED",
            "ISO 9001:2015",
            "GLP Compliant Labs",
            "Indian Pharmacopoeia (IP)",
            "British Pharmacopoeia (BP)"
          ].map((cert, i) => (
            <div key={i} className="flex items-center gap-3 text-foreground font-semibold uppercase tracking-wider text-sm">
              <CheckCircle2 size={16} className="text-primary" />
              {cert}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SpecsSection;