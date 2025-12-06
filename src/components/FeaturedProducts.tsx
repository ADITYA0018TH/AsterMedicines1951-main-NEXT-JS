"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const products = [
    {
        id: 1,
        name: "Cardiology",
        image: "/My-uploads/cardiology.png",
        description: "Advanced solutions for heart health and cardiovascular care."
    },
    {
        id: 2,
        name: "Neurology",
        image: "/My-uploads/neurology.png",
        description: "Pioneering treatments for neurological disorders."
    },
    {
        id: 3,
        name: "Oncology",
        image: "/My-uploads/oncology.png",
        description: "Targeted therapies for effective cancer treatment."
    }
];

const FeaturedProducts = () => {
    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from(".product-card", {
            scrollTrigger: {
                trigger: ".products-grid",
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: "power3.out"
        });
    }, []);

    return (
        <section className="featured-section py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-slate-100 pb-8">
                    <div>
                        <span className="text-brand-accent font-semibold tracking-wider uppercase mb-2 block text-sm">Our Expertise</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
                            Therapeutic Areas
                        </h2>
                    </div>
                    <Link href="/products">
                        <Button variant="ghost" className="text-brand-accent hover:text-brand-primary hover:bg-blue-50">
                            View All Products <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <div className="products-grid grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="product-card group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                            <div className="h-48 overflow-hidden bg-slate-50 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-accent transition-colors">{product.name}</h3>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    {product.description}
                                </p>
                                <div className="flex items-center text-sm font-medium text-brand-accent opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                    Learn more <ArrowRight className="ml-1 w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
