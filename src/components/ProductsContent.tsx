"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import {
    GitCompare, Send, Loader2, Search, Filter, X,
    Check, ArrowUpRight, FlaskConical, Microscope, Atom
} from "lucide-react";
import { Product } from "@/data/products";
import { fetchProducts, fetchCategories } from "@/services/api";
import { cn } from "@/lib/utils";
import { getProductPath } from "@/lib/productSlug";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Dynamic Imports
const ProductComparison = dynamic(() => import("@/components/ProductComparison"), { ssr: false });
const BulkInquiryForm = dynamic(() => import("@/components/BulkInquiryForm"), { ssr: false });

// --- Sub-Component: Technical Image Placeholder ---
const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/20 border border-dashed border-border/50 text-muted-foreground/40">
                <FlaskConical className="w-10 h-10 mb-2 opacity-50" />
                <span className="text-[10px] font-mono uppercase tracking-widest">No Preview</span>
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            onError={() => setError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-110"
        />
    );
};

// --- Sub-Component: Minimalist Sidebar ---
const FilterSidebar = ({
    categories,
    selectedCategory,
    onSelect
}: {
    categories: string[],
    selectedCategory: string,
    onSelect: (c: string) => void
}) => (
    <div className="space-y-8">
        <div>
            <h3 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                <Filter className="w-3 h-3" />
                Classification
            </h3>
            <div className="space-y-1 border-l border-border/50 ml-1.5">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onSelect(category)}
                        className={cn(
                            "group flex items-center justify-between w-full text-left pl-4 pr-2 py-2 text-sm transition-all duration-300 border-l -ml-px",
                            selectedCategory === category
                                ? "border-brand-accent text-brand-accent font-medium bg-brand-accent/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                        )}
                    >
                        {category}
                        {selectedCategory === category && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                        )}
                    </button>
                ))}
            </div>
        </div>

        <div className="p-5 bg-card border border-border rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-foreground">
                <Microscope className="w-4 h-4" />
                <h4 className="text-sm font-semibold">Lab Services</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Require a custom compound? We offer white-label manufacturing and custom dosage formulation.
            </p>
            <Button variant="outline" size="sm" className="w-full text-xs h-8 border-border hover:bg-secondary">
                Request Formulary
            </Button>
        </div>
    </div>
);

// --- Main Component ---
const ProductsContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize state from URL params
    const initialQuery = searchParams.get("q") || "";
    const initialCategory = searchParams.get("category") || "All";

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    // Sync URL with state changes
    const updateURL = useCallback((query: string, category: string) => {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (category && category !== "All") params.set("category", category);
        
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.replace(newUrl, { scroll: false });
    }, [pathname, router]);

    // Update URL when search or category changes
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            updateURL(searchQuery, selectedCategory);
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery, selectedCategory, updateURL]);

    // Sync state from URL when navigating
    useEffect(() => {
        const urlQuery = searchParams.get("q") || "";
        const urlCategory = searchParams.get("category") || "All";
        if (urlQuery !== searchQuery) setSearchQuery(urlQuery);
        if (urlCategory !== selectedCategory) setSelectedCategory(urlCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Fallback Data
    const dummyProducts: Product[] = [
        { id: 1, name: "Paracetamol 500mg", description: "Standard analgesic and antipyretic agent.", category: "Analgesics", dosage: "500mg", images: ["/images/paracetamol.webp"], features: ["Fast Action", "Safety Sealed"] },
        { id: 2, name: "Amoxicillin Capsules", description: "Broad-spectrum beta-lactam antibiotic.", category: "Antibiotics", dosage: "250mg", images: [], features: ["Broad Spectrum"] },
        { id: 3, name: "Vitamin C Complex", description: "Ascorbic acid syrup with antioxidants.", category: "Supplements", dosage: "100ml", images: [], features: ["Sugar Free", "Orange Flavor"] },
        { id: 4, name: "Cetirizine HCl", description: "Second-generation antihistamine.", category: "Antihistamines", dosage: "10mg", images: [], features: ["Non-drowsy"] },
        { id: 5, name: "Ibuprofen", description: "Non-steroidal anti-inflammatory drug (NSAID).", category: "Analgesics", dosage: "400mg", images: [], features: ["Anti-inflammatory"] },
        { id: 6, name: "Dextromethorphan", description: "Antitussive cough suppressant syrup.", category: "Respiratory", dosage: "100ml", images: [], features: ["Alcohol Free"] }
    ];

    const { data: fetchedProducts = [], isLoading: isLoadingProducts } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });
    const products = fetchedProducts.length > 0 ? fetchedProducts : dummyProducts;

    const { data: categories = ["All"] } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    const toggleProductSelection = (product: Product) => {
        const isSelected = selectedProducts.some(p => p.id === product.id);
        if (isSelected) {
            setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
        } else {
            if (selectedProducts.length >= 10) {
                toast.warning("Capacity Reached", { description: "Maximum 10 items allowed for analysis." });
                return;
            }
            setSelectedProducts(prev => [...prev, product]);
        }
    };

    // --- GSAP Animations ---
    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        // 1. Grid Entry Animation
        if (!isLoadingProducts && filteredProducts.length > 0) {
            gsap.fromTo(".product-card",
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".products-grid",
                        start: "top 90%",
                    }
                }
            );
        }
    }, [filteredProducts, isLoadingProducts]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* --- Section 1: Sticky "Curtain" Hero (Fixed at back) --- */}
            {/* We use 'sticky top-0' and a defined height. 
                The next section will scroll OVER this one because of z-index stacking context 
                if we manipulate it right, or we just rely on the visual sticky behavior. 
            */}
            <section className="sticky top-0 z-0 h-[85vh] w-full overflow-hidden bg-background flex flex-col justify-center border-b border-border/10">
                {/* Abstract Background Elements */}
                <div className="absolute inset-0 z-[-1]">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">


                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8">
                        Precision <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-brand-accent/80 to-brand-accent/50">
                            Pharmacopeia
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-light">
                        Advanced search for global pharmaceutical standards. <br />
                        Explore our index of high-efficacy formulations.
                    </p>

                    {/* Main Search Input */}
                    <div className="max-w-xl mx-auto">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search by generic name, brand, or CAS number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-14 pl-14 pr-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-border/50 backdrop-blur-xl shadow-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all text-lg placeholder:text-muted-foreground/60"
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-brand-accent transition-colors" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted/50 rounded-full"
                                >
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Section 2: Scrollable Product Layer (The Curtain) --- */}
            <main className="relative z-10 bg-background min-h-screen border-t border-border shadow-[0_-50px_100px_rgba(0,0,0,0.1)] rounded-t-[3rem] mt-[-5vh]">
                <div className="container mx-auto px-6 py-20">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Sidebar */}
                        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-32 self-start h-[calc(100vh-10rem)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                            <FilterSidebar
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onSelect={setSelectedCategory}
                            />
                        </aside>

                        {/* Mobile Header */}
                        <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Atom className="w-5 h-5 text-brand-accent" />
                                <span className="font-semibold">{filteredProducts.length} Compounds</span>
                            </div>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Filter className="w-4 h-4" /> Filter
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left">
                                    <SheetHeader className="mb-8">
                                        <SheetTitle>Catalog Filters</SheetTitle>
                                    </SheetHeader>
                                    <FilterSidebar
                                        categories={categories}
                                        selectedCategory={selectedCategory}
                                        onSelect={setSelectedCategory}
                                    />
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Product Grid */}
                        <div className="flex-1">
                            {isLoadingProducts ? (
                                <div className="h-96 flex flex-col items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-brand-accent animate-spin mb-4" />
                                    <p className="text-sm text-muted-foreground font-mono">RETRIEVING DATA...</p>
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="h-96 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-secondary/5">
                                    <div className="p-4 bg-secondary rounded-full mb-4">
                                        <Search className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium">No results found</h3>
                                    <Button variant="link" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                                        Reset Search Criteria
                                    </Button>
                                </div>
                            ) : (
                                <div className="products-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                                    {filteredProducts.map((product) => {
                                        const isSelected = selectedProducts.some(p => p.id === product.id);
                                        return (
                                            <div
                                                key={product.id}
                                                className="product-card group flex flex-col"
                                            >
                                                <div className="relative mb-4">
                                                    {/* Card Image Area */}
                                                    <Link
                                                        href={getProductPath(product)}
                                                        className="block aspect-[4/3] bg-white dark:bg-secondary/10 border border-border/60 rounded-xl overflow-hidden relative shadow-sm transition-all duration-500 hover:shadow-xl hover:border-brand-accent/30"
                                                    >
                                                        <ProductImage src={product.images?.[0] || ""} alt={product.name} />

                                                        {/* Category Badge */}
                                                        <div className="absolute top-4 left-4">
                                                            <Badge variant="secondary" className="bg-background/90 backdrop-blur-md border-border shadow-sm text-xs font-normal">
                                                                {product.category}
                                                            </Badge>
                                                        </div>

                                                        {/* Hover Details Overlay */}
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                                <Button variant="secondary" size="sm" className="rounded-full gap-2">
                                                                    View Analysis <ArrowUpRight className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Link>

                                                    {/* Selection Action Button (Floating outside card) */}
                                                    <button
                                                        onClick={() => toggleProductSelection(product)}
                                                        className={cn(
                                                            "absolute -bottom-3 right-4 z-20 h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border",
                                                            isSelected
                                                                ? "bg-brand-accent text-white border-brand-accent rotate-0 scale-110"
                                                                : "bg-background text-muted-foreground border-border hover:text-foreground hover:scale-110"
                                                        )}
                                                        title={isSelected ? "Remove" : "Select for Compare"}
                                                    >
                                                        {isSelected ? <Check className="w-5 h-5" /> : <span className="text-xl">+</span>}
                                                    </button>
                                                </div>

                                                {/* Card Content */}
                                                <div className="px-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <Link href={getProductPath(product)} className="font-bold text-lg text-foreground hover:text-brand-accent transition-colors line-clamp-1">
                                                            {product.name}
                                                        </Link>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
                                                        {product.description}
                                                    </p>

                                                    <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] uppercase text-muted-foreground font-mono">Dosage</span>
                                                            <span className="text-xs font-semibold">{product.dosage}</span>
                                                        </div>
                                                        <div className="w-px h-6 bg-border/60" />
                                                        <div className="flex gap-1 flex-wrap">
                                                            {product.features.filter(f => !f.toLowerCase().includes("price")).slice(0, 2).map((f, i) => (
                                                                <span key={i} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                                                                    {f}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* --- Section 3: Floating Command Center --- */}
            <div className={cn(
                "fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-500",
                selectedProducts.length > 0 ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
            )}>
                <div className="pointer-events-auto bg-foreground/95 backdrop-blur-xl text-background rounded-2xl shadow-2xl p-2 pl-4 pr-2 flex items-center gap-4 border border-white/10 ring-1 ring-black/10 max-w-[90vw]">
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 pl-2">
                        <span className="text-[10px] uppercase tracking-wider opacity-60 font-mono hidden md:block">Selection</span>
                        <div className="flex items-center gap-2">
                            <Badge variant="default" className="bg-brand-accent hover:bg-brand-accent text-white h-5 px-1.5">
                                {selectedProducts.length}
                            </Badge>
                            <span className="text-sm font-semibold">Products</span>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-background/20 hidden md:block"></div>

                    <div className="flex items-center gap-1">
                        <ProductComparison
                            products={selectedProducts.slice(0, 3)}
                            onRemove={(id) => setSelectedProducts(prev => prev.filter(p => p.id !== id))}
                            disabled={selectedProducts.length < 2 || selectedProducts.length > 3}
                            triggerClassName={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-background/90 hover:text-white hover:bg-white/10 h-10 px-4 rounded-xl")}
                            trigger={
                                <span className="flex items-center gap-2">
                                    <GitCompare className="w-4 h-4" /> Compare
                                </span>
                            }
                        />

                        <BulkInquiryForm
                            selectedProducts={selectedProducts}
                            triggerClassName={cn(buttonVariants({ size: "sm" }), "bg-brand-accent hover:bg-brand-accent/90 text-white h-10 px-6 rounded-xl shadow-lg shadow-brand-accent/20")}
                            trigger={
                                <span className="flex items-center gap-2">
                                    <Send className="w-4 h-4" /> Inquire
                                </span>
                            }
                        />

                        <Button
                            onClick={() => setSelectedProducts([])}
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-background/40 hover:text-red-400 hover:bg-red-400/10 rounded-xl ml-1"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductsContent;