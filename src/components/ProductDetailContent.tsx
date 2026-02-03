"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, Shield, AlertTriangle, ShieldCheck, Microscope, FlaskConical, Stethoscope, FileText, ArrowRight, Award } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Product } from "@/types/product";

interface ProductDetailContentProps {
    product: Product;
}

const ProductDetailContent = ({ product }: ProductDetailContentProps) => {

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline();

        // Staggered entry
        tl.from(".gsap-fade-in", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        });

    }, { dependencies: [product] });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black text-foreground selection:bg-orange-500/30">
            <Navbar />

            <main className="pt-24 lg:pt-32 pb-20">
                {/* Breadcrumb / Navigation */}
                <div className="container mx-auto px-4 lg:px-6 mb-8 gsap-fade-in relative z-20">
                    <Link href="/products">
                        <Button variant="ghost" size="sm" className="group text-muted-foreground hover:text-brand-accent pl-0 hover:bg-transparent">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Catalog
                        </Button>
                    </Link>
                </div>

                <div className="container mx-auto px-4 lg:px-6">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                        {/* LEFT COLUMN: Sticky Product Imagery */}
                        <div className="lg:col-span-5 lg:sticky lg:top-32 gsap-fade-in">
                            <div className="bg-white dark:bg-neutral-900 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden relative group">
                                {/* Decorative Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-transparent dark:from-white/5 dark:to-transparent opacity-50" />

                                <Carousel className="w-full relative z-10" opts={{ loop: true }}>
                                    <CarouselContent>
                                        {(product.images && product.images.length > 0 ? product.images : ["/placeholder.png"]).map((img, index) => (
                                            <CarouselItem key={index}>
                                                <div className="aspect-square flex items-center justify-center p-4 sm:p-8 lg:p-12">
                                                    <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                                                        <Image
                                                            src={img}
                                                            alt={`${product.name} view ${index + 1}`}
                                                            fill
                                                            className="object-contain"
                                                            priority={index === 0}
                                                            sizes="(max-width: 768px) 100vw, 50vw"
                                                        />
                                                    </div>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>

                                    {product.images?.length > 1 && (
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                            <CarouselPrevious className="static translate-y-0 h-10 w-10 border-0 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:text-white" />
                                            <CarouselNext className="static translate-y-0 h-10 w-10 border-0 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:text-white" />
                                        </div>
                                    )}
                                </Carousel>
                            </div>

                            {/* Verification Badges */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6">
                                {[
                                    { label: "Quality Assured", icon: ShieldCheck, active: product.isQualityAssured, color: "text-emerald-500 bg-emerald-500/10" },
                                    { label: "GMP Certified", icon: Award, active: product.isGmpCertified, color: "text-blue-500 bg-blue-500/10" },
                                    { label: "WHO Approved", icon: CheckCircle2, active: product.isWhoApproved, color: "text-purple-500 bg-purple-500/10" },
                                ].filter(b => b.active).map((badge, i) => (
                                    <div key={i} className={`flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 dark:border-white/5 ${badge.color} bg-opacity-10 backdrop-blur-sm text-center`}>
                                        <badge.icon className="w-6 h-6 mb-2 opacity-80" />
                                        <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider opacity-75">{badge.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Product Details & Tabs */}
                        <div className="lg:col-span-7 space-y-8 gsap-fade-in">

                            {/* Header Section */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Badge variant="outline" className="text-brand-accent border-brand-accent/30 bg-brand-accent/5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                        {product.category}
                                    </Badge>
                                    {product.availability === "In Stock" && (
                                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 px-3 py-1 rounded-full text-xs">
                                            Available
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                                    {product.name}
                                </h1>
                                <p className="text-xl text-slate-700 dark:text-slate-200 leading-relaxed font-light">
                                    {product.description}
                                </p>
                            </div>

                            <Separator className="bg-slate-200 dark:bg-white/10" />

                            {/* Information Tabs */}
                            <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm p-1">
                                <Tabs defaultValue="overview" className="w-full">
                                    <TabsList className="w-full justify-start h-auto p-1 bg-slate-100/50 dark:bg-black/40 rounded-xl space-x-1 overflow-x-auto">
                                        <TabsTrigger value="overview" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm transition-all duration-300">
                                            <FileText className="w-4 h-4 mr-2 opacity-70" />
                                            Overview
                                        </TabsTrigger>
                                        <TabsTrigger value="clinical" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm transition-all duration-300">
                                            <Stethoscope className="w-4 h-4 mr-2 opacity-70" />
                                            Clinical Info
                                        </TabsTrigger>
                                        <TabsTrigger value="safety" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm transition-all duration-300">
                                            <Shield className="w-4 h-4 mr-2 opacity-70" />
                                            Safety Profile
                                        </TabsTrigger>
                                    </TabsList>

                                    <div className="p-6 md:p-8 min-h-[400px]">

                                        {/* TAB 1: OVERVIEW */}
                                        <TabsContent value="overview" className="mt-0 space-y-8 animate-in slide-in-from-bottom-2 fade-in duration-500">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                                                    <Microscope className="w-5 h-5 mr-2 text-brand-accent" />
                                                    Product Description
                                                </h3>
                                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                    {product.detailedDescription || product.description}
                                                </p>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Key Features</h4>
                                                    <ul className="space-y-3">
                                                        {product.features.filter(f => !f.toLowerCase().includes("price")).map((feature, idx) => (
                                                            <li key={idx} className="flex items-start text-slate-800 dark:text-slate-200">
                                                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
                                                                <span>{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-6 border border-slate-100 dark:border-white/5">
                                                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Specifications</h4>
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                                                            <span className="text-slate-500 dark:text-slate-400">Dosage Form</span>
                                                            <span className="font-medium">{product.dosage}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                                                            <span className="text-slate-500 dark:text-slate-400">Administration</span>
                                                            <span className="font-medium">Oral / Injection</span>
                                                        </div>
                                                        <div className="flex justify-between pb-2">
                                                            <span className="text-slate-500 dark:text-slate-400">Shelf Life</span>
                                                            <span className="font-medium">24 - 36 Months</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        {/* TAB 2: CLINICAL */}
                                        <TabsContent value="clinical" className="mt-0 space-y-8 animate-in slide-in-from-bottom-2 fade-in duration-500">
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                                                        <FlaskConical className="w-5 h-5 mr-2 text-blue-500" />
                                                        Composition
                                                    </h3>
                                                    <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                                        {product.composition || "Standard pharmaceutical composition."}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Therapeutic Indications</h3>
                                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                                        {product.indications || "Indicated for standard treatment protocols as directed by a physician."}
                                                    </p>
                                                </div>
                                            </div>

                                            <Separator className="bg-slate-200 dark:bg-white/10" />

                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Dosage Instructions</h3>
                                                <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-xl border-l-4 border-brand-accent">
                                                    <p className="text-slate-700 dark:text-slate-300 italic">
                                                        " {product.dosageInstructions || "As prescribed by the registered medical practitioner."} "
                                                    </p>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        {/* TAB 3: SAFETY */}
                                        <TabsContent value="safety" className="mt-0 space-y-8 animate-in slide-in-from-bottom-2 fade-in duration-500">
                                            {product.sideEffects && (
                                                <div>
                                                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center">
                                                        <AlertTriangle className="w-5 h-5 mr-2" />
                                                        Potential Side Effects
                                                    </h3>
                                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        {product.sideEffects}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-xl border border-amber-100 dark:border-amber-800/30">
                                                <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-4 flex items-center">
                                                    <Shield className="w-5 h-5 mr-2" />
                                                    Precautions & Warnings
                                                </h3>
                                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                    {product.precautions || "Keep out of reach of children. Store in a cool, dry place."}
                                                </p>
                                            </div>
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </div>

                            {/* Call to Action Bar */}
                            <div className="sticky bottom-4 sm:bottom-6 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border border-slate-200 dark:border-white/10 p-3 sm:p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="hidden sm:block">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Interested in this product?</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Bulk orders available</p>
                                </div>
                                <div className="flex w-full sm:w-auto gap-2 sm:gap-3">
                                    <Link href="/contact" className="w-full sm:w-auto">
                                        <Button size="lg" className="w-full sm:w-auto bg-brand-accent hover:bg-brand-accent/90 text-white shadow-lg shadow-brand-accent/25 rounded-xl">
                                            Enquire Now <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                    <Link href="/contact" className="w-full sm:w-auto">
                                        <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl">
                                            Request Sample
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetailContent;