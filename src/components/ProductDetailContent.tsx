"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, Shield, AlertTriangle, ShieldCheck, Microscope, FlaskConical, Stethoscope, FileText, ArrowRight, Award, Download, Loader2, ZoomIn } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Product } from "@/types/product";
import { getProductPath, getProductSlug } from "@/lib/productSlug";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useTrackProductView } from "@/hooks/useTrackProductView";

const ImageLightbox = dynamic(() => import("@/components/ImageLightbox"), { ssr: false });

interface ProductDetailContentProps {
    product: Product;
    relatedProducts: Product[];
}

const ProductDetailContent = ({ product, relatedProducts }: ProductDetailContentProps) => {
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Track product view for analytics
    const productViewData = useMemo(() => ({
        productId: product.id,
        productSlug: product.slug || getProductSlug({ name: product.name }),
        productName: product.name,
        category: product.category,
    }), [product]);
    
    useTrackProductView(productViewData);

    const handleDownloadPDF = useCallback(async () => {
        setIsGeneratingPDF(true);
        try {
            const { generateProductPDF } = await import("@/lib/generateProductPDF");
            await generateProductPDF(product);
            toast.success("PDF Downloaded", {
                description: "Product specification sheet has been generated.",
            });
        } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error("Download Failed", {
                description: "Unable to generate PDF. Please try again.",
            });
        } finally {
            setIsGeneratingPDF(false);
        }
    }, [product]);

    const openLightbox = useCallback((index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    }, []);

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
                                                <button
                                                    onClick={() => openLightbox(index)}
                                                    className="aspect-square flex items-center justify-center p-4 sm:p-8 lg:p-12 w-full cursor-zoom-in"
                                                >
                                                    <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                                                        <Image
                                                            src={img}
                                                            alt={`${product.name} view ${index + 1}`}
                                                            fill
                                                            className="object-contain"
                                                            priority={index === 0}
                                                            sizes="(max-width: 768px) 100vw, 50vw"
                                                        />
                                                        {/* Zoom indicator */}
                                                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                            <ZoomIn className="w-3 h-3" />
                                                            Click to zoom
                                                        </div>
                                                    </div>
                                                </button>
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
                                                        {product.shelfLife && (
                                                            <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                                                                <span className="text-slate-500 dark:text-slate-400">Shelf Life</span>
                                                                <span className="font-medium">{product.shelfLife}</span>
                                                            </div>
                                                        )}
                                                        {product.storageConditions && (
                                                            <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                                                                <span className="text-slate-500 dark:text-slate-400">Storage</span>
                                                                <span className="font-medium text-right max-w-[55%]">{product.storageConditions}</span>
                                                            </div>
                                                        )}
                                                        {product.strengthVariants && product.strengthVariants.length > 0 && (
                                                            <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                                                                <span className="text-slate-500 dark:text-slate-400">Strengths</span>
                                                                <span className="font-medium text-right">{product.strengthVariants.join(", ")}</span>
                                                            </div>
                                                        )}
                                                        {product.packagingOptions && product.packagingOptions.length > 0 && (
                                                            <div className="flex justify-between pb-2">
                                                                <span className="text-slate-500 dark:text-slate-400">Packaging</span>
                                                                <span className="font-medium text-right">{product.packagingOptions.join(", ")}</span>
                                                            </div>
                                                        )}
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
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={handleDownloadPDF}
                                        disabled={isGeneratingPDF}
                                        className="border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl"
                                    >
                                        {isGeneratingPDF ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4 mr-2" />
                                        )}
                                        <span className="hidden sm:inline">Spec Sheet</span>
                                        <span className="sm:hidden">PDF</span>
                                    </Button>
                                    <Link href="/contact" className="flex-1 sm:flex-none">
                                        <Button size="lg" className="w-full sm:w-auto bg-brand-accent hover:bg-brand-accent/90 text-white shadow-lg shadow-brand-accent/25 rounded-xl">
                                            Enquire Now <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                    <Link href="/contact" className="hidden md:block">
                                        <Button variant="outline" size="lg" className="border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl">
                                            Request Sample
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            {/* RELATED PRODUCTS SECTION */}
            <section className="py-20 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black relative z-10">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                Related Products
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                More {product.category} solutions from our catalog
                            </p>
                        </div>
                        <Link href="/products" className="hidden md:flex items-center text-brand-accent font-semibold hover:underline">
                            View All Products <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <Link
                                href={getProductPath(relatedProduct)}
                                key={relatedProduct.id}
                                className="group block bg-slate-50 dark:bg-neutral-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 hover:border-brand-accent/50 dark:hover:border-brand-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-accent/5"
                            >
                                <div className="aspect-[4/3] relative p-6 bg-white dark:bg-white/5 flex items-center justify-center">
                                    <Image
                                        src={relatedProduct.images[0]}
                                        alt={relatedProduct.name}
                                        fill
                                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                    />
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center shadow-lg">
                                            <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-brand-accent transition-colors">
                                        {relatedProduct.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                        {relatedProduct.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                        {/* Fallback if no related products found */}
                        {relatedProducts.length === 0 && (
                            <div className="col-span-full text-center py-10 text-slate-500 dark:text-slate-400">
                                <p>View our full catalog for more medicines.</p>
                                <Link href="/products" className="inline-block mt-4 text-brand-accent hover:underline">Browse Catalog</Link>
                            </div>
                        )}
                    </div>
                    <Link href="/products" className="md:hidden flex items-center justify-center mt-8 text-brand-accent font-semibold hover:underline">
                        View All Products <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            </section>

            {/* Image Lightbox */}
            <ImageLightbox
                images={product.images && product.images.length > 0 ? product.images : ["/placeholder.png"]}
                initialIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                alt={product.name}
            />
        </div>
    );
};

export default ProductDetailContent;