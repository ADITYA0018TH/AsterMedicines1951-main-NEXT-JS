"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pill, GitCompare, Send, Loader2, Search } from "lucide-react";
import { Product } from "@/data/products";
import { fetchProducts, fetchCategories } from "@/services/api";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Dynamic Imports for Heavy Components
const ProductComparison = dynamic(() => import("@/components/ProductComparison"), { ssr: false });
const BulkInquiryForm = dynamic(() => import("@/components/BulkInquiryForm"), { ssr: false });

// Helper Component to handle Image Errors
const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
    const [error, setError] = useState(false);

    if (error || !src) {
        return <Pill className="w-20 h-20 text-muted-foreground/20 group-hover:text-brand-accent/50 transition-colors" />;
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            onError={() => setError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain group-hover:scale-110 transition-transform duration-500 p-4"
        />
    );
};

const ProductsContent = () => {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    // Dummy Data Fallback
    const dummyProducts: Product[] = [
        {
            id: 1,
            name: "Paracetamol 500mg",
            description: "Effective pain relief and fever reducer. Suitable for headaches, muscle aches, arthritis, backache, toothaches, colds, and fevers.",
            category: "Analgesics",
            dosage: "500mg",
            images: ["/images/paracetamol.webp"],
            features: ["Fast Action", "Safety Sealed", "Easy to Swallow"]
        },
        {
            id: 2,
            name: "Amoxicillin Capsules",
            description: "Broad-spectrum antibiotic used to treat a wide variety of bacterial infections.",
            category: "Antibiotics",
            dosage: "250mg",
            images: [],
            features: ["Broad Spectrum", "High Efficacy"]
        },
        {
            id: 3,
            name: "Vitamin C Syrup",
            description: "Immunity boosting syrup for children and adults. Rich in antioxidants.",
            category: "Supplements",
            dosage: "100ml",
            images: [],
            features: ["Sugar Free", "Orange Flavor"]
        },
        {
            id: 4,
            name: "Cetirizine Tablets",
            description: "Relief from allergy symptoms such as watery eyes, runny nose, itching eyes/nose, and sneezing.",
            category: "Antihistamines",
            dosage: "10mg",
            images: [],
            features: ["Non-drowsy", "24hr Relief"]
        },
        {
            id: 5,
            name: "Ibuprofen 400mg",
            description: "Non-steroidal anti-inflammatory drug (NSAID). Relieves pain, inflammation, and fever.",
            category: "Analgesics",
            dosage: "400mg",
            images: [],
            features: ["Anti-inflammatory", "Pain Relief"]
        },
        {
            id: 6,
            name: "Cough Syrup",
            description: "Effective relief from dry and chesty coughs. Soothes the throat.",
            category: "Respiratory",
            dosage: "100ml",
            images: [],
            features: ["Alcohol Free", "Honey & Lemon"]
        }
    ];

    // Data Fetching
    const { data: fetchedProducts = [], isLoading: isLoadingProducts } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });

    const products = fetchedProducts.length > 0 ? fetchedProducts : dummyProducts;

    const { data: categories = ["All"], isLoading: isLoadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    // Filter Logic
    const filteredProducts = React.useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    // Selection Logic
    const handleProductSelect = (product: Product, checked: boolean) => {
        if (checked) {
            if (selectedProducts.length >= 10) {
                toast.warning("Selection Limit Reached", {
                    description: "You can compare or inquire about up to 10 products at a time."
                });
                return;
            }
            setSelectedProducts(prev => [...prev, product]);
        } else {
            setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
        }
    };

    const handleRemoveFromComparison = (productId: number) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    };

    // GSAP Animations
    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.from(".hero-content", {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power3.out"
        });
    }, []);

    useGSAP(() => {
        // Grid Animation
        if (filteredProducts.length > 0) {
            gsap.fromTo(".product-card",
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    stagger: 0.05,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".products-grid",
                        start: "top 90%",
                    }
                }
            );
        }
    }, [filteredProducts]);

    useGSAP(() => {
        // Floating Bar Animation
        if (selectedProducts.length > 0) {
            gsap.fromTo(".floating-bar",
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
            );
        }
    }, [selectedProducts.length]);

    return (
        <div className="min-h-screen bg-background text-foreground relative">
            <Navbar />

            <main>
                {/* Hero Section containing Search & Filters */}
                <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent pointer-events-none" />
                    
                    <div className="container mx-auto text-center relative z-10">
                        <div className="hero-content">
                            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 subpixel-antialiased">
                                Our <span className="text-brand-accent">Products</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                                Explore our comprehensive range of pharmaceutical solutions, engineered for precision and efficacy.
                            </p>
                        </div>

                        {/* Search Bar - Centered in Hero */}
                        <div className="max-w-2xl mx-auto relative mb-8">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <input
                                type="text"
                                id="product-search"
                                placeholder="Search products..."
                                aria-label="Search products"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-secondary border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all shadow-sm"
                            />
                        </div>

                        {/* Category Filters - Centered in Hero */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={cn(
                                        "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                        selectedCategory === category
                                            ? "bg-brand-accent text-white shadow-[0_0_15px_rgba(255,107,0,0.3)]"
                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-foreground border border-border"
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="pb-24 px-6 min-h-[50vh]">
                    <div className="container mx-auto">
                        {isLoadingProducts ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-10 h-10 text-brand-accent animate-spin" />
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                                    <Search className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No products found</h3>
                                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                            </div>
                        ) : (
                            <div className="products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => {
                                    const isSelected = selectedProducts.some(p => p.id === product.id);
                                    return (
                                        <div
                                            key={product.id}
                                            className="product-card group relative"
                                        >
                                            <div className="absolute top-4 left-4 z-20">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={(checked) => handleProductSelect(product, checked as boolean)}
                                                    className="border-border bg-background/50 backdrop-blur-sm data-[state=checked]:bg-brand-accent data-[state=checked]:text-white"
                                                    aria-label={`Select ${product.name}`}
                                                />
                                            </div>

                                            <Link
                                                href={`/products/${product.id}`}
                                                className="h-full bg-card border border-border rounded-2xl overflow-hidden hover:border-brand-accent/50 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_10px_40px_-10px_rgba(255,107,0,0.1)] transition-all duration-300 cursor-pointer flex flex-col"
                                            >
                                                {/* Image Container with Fallback */}
                                                <div className="aspect-square bg-secondary/30 p-8 flex items-center justify-center relative overflow-hidden">
                                                    <ProductImage
                                                        src={product.images?.[0] || ""}
                                                        alt={product.name}
                                                    />

                                                    <div className="absolute top-4 right-4">
                                                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-md text-brand-accent border border-brand-accent/20">
                                                            {product.category}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="p-6 flex flex-col flex-grow">
                                                    <h2 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-brand-accent transition-colors">
                                                        {product.name}
                                                    </h2>
                                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
                                                        {product.description}
                                                    </p>

                                                    <div className="space-y-3 pt-4 border-t border-border mt-auto">
                                                        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide">
                                                            <span className="text-muted-foreground">Dosage</span>
                                                            <span className="text-foreground">{product.dosage}</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {product.features.slice(0, 3).map((feature, i) => (
                                                                <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-secondary text-muted-foreground border border-border">
                                                                    {feature}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Floating Action Bar */}
            {selectedProducts.length > 0 && (
                <div className="floating-bar fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
                    <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-full shadow-2xl p-2 pl-6 flex items-center justify-between gap-4 ring-1 ring-black/5 dark:ring-white/10">
                        <div className="flex items-center gap-3">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                            </span>
                            <span className="text-sm font-medium text-foreground">
                                <span className="font-bold text-brand-accent">{selectedProducts.length}</span> Selected
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <ProductComparison
                                products={selectedProducts.slice(0, 3)}
                                onRemove={handleRemoveFromComparison}
                                disabled={selectedProducts.length < 2 || selectedProducts.length > 3}
                                triggerClassName={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground hover:text-foreground")}
                                trigger={
                                    <>
                                        <GitCompare className="w-4 h-4 mr-2" />
                                        Compare
                                    </>
                                }
                            />

                            <div className="h-4 w-px bg-border mx-1"></div>

                            <BulkInquiryForm
                                selectedProducts={selectedProducts}
                                triggerClassName={cn(buttonVariants({ size: "sm" }), "rounded-full bg-brand-accent hover:bg-brand-accent/90 text-white px-6")}
                                trigger={
                                    <>
                                        <Send className="w-3 h-3 mr-2" />
                                        Inquiry
                                    </>
                                }
                            />

                            <Button
                                onClick={() => setSelectedProducts([])}
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-8 w-8 ml-1 hover:bg-destructive/10 hover:text-destructive"
                            >
                                <span className="sr-only">Clear</span>
                                <span className="text-lg">×</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ProductsContent;