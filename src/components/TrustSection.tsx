"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Users, Globe, Award, FlaskConical } from "lucide-react";

const stats = [
    {
        icon: <Users className="w-6 h-6 text-brand-accent" />,
        value: "50M+",
        label: "Patients Served",
        description: "Touching lives globally"
    },
    {
        icon: <Globe className="w-6 h-6 text-brand-accent" />,
        value: "25+",
        label: "Countries",
        description: "International presence"
    },
    {
        icon: <Award className="w-6 h-6 text-brand-accent" />,
        value: "70+",
        label: "Years Legacy",
        description: "Since 1951"
    },
    {
        icon: <FlaskConical className="w-6 h-6 text-brand-accent" />,
        value: "200+",
        label: "Products",
        description: "Diverse portfolio"
    }
];

const TrustSection = () => {
    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from(".trust-item", {
            scrollTrigger: {
                trigger: ".trust-section",
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        });
    }, []);

    return (
        <section className="trust-section py-20 bg-slate-50 border-y border-slate-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="trust-item text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm mb-4">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                            <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-1">{stat.label}</p>
                            <p className="text-sm text-slate-500">{stat.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
