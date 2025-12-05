"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Hero from "@/components/Hero";
import PharmaceuticalSection from "@/components/HumanoidSection";
import SpecsSection from "@/components/SpecsSection";
import DetailsSection from "@/components/DetailsSection";
import ImageShowcaseSection from "@/components/ImageShowcaseSection";
import Features from "@/components/Features";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const HomeContent = () => {
    // Initialize intersection observer to detect when elements enter viewport
    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Global animation for sections
        const elements = document.querySelectorAll(".animate-on-scroll");
        elements.forEach((el) => {
            gsap.fromTo(
                el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse", // Animates in when scrolling down, out when scrolling up
                    },
                }
            );
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href')?.substring(1);
                if (!targetId) return;
                const targetElement = document.getElementById(targetId);
                if (!targetElement) return;
                const offset = window.innerWidth < 768 ? 100 : 80;
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
            });
        });
    }, []);

    return (
        <div className="h-screen cursor-none">
            <CustomCursor />
            <Navbar />
            <main className="space-y-4 sm:space-y-8">
                <Hero />
                <PharmaceuticalSection />
                <SpecsSection />
                <DetailsSection />
                <ImageShowcaseSection />
                <Features />
                <Newsletter />
            </main>
            <Footer />
        </div>
    );
};

export default HomeContent;
