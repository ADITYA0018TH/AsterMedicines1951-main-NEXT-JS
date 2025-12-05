"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pill, Shield, Award, CheckCircle, GitCompare, Send, Loader2, Search } from "lucide-react";
import { Product } from "@/data/products";
import { fetchProducts, fetchCategories } from "@/services/api";
import ProductComparison from "@/components/ProductComparison";
import BulkInquiryForm from "@/components/BulkInquiryForm";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const ProductsContent = () => {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = React.useState("All");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedProducts, setSelectedProducts] = React.useState<Product[]>([]);
    const [showComparison, setShowComparison] = React.useState(false);
    const [showInquiryForm, setShowInquiryForm] = React.useState(false);

    const { data: products = [], isLoading: isLoadingProducts } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });

    const { data: categories = ["All"], isLoading: isLoadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    const filteredProducts = React.useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    const handleProductSelect = (product: Product, checked: boolean) => {
        if (checked) {
            if (selectedProducts.length >= 10) return;
            setSelectedProducts(prev => [...prev, product]);
        } else {
            setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
        }
    };

    const handleCompare = () => {
        if (selectedProducts.length < 2) return;
        setShowComparison(true);
    };

    const handleRemoveFromComparison = (productId: number) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    };

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Animation - Runs once
        gsap.from(".hero-content", {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power3.out"
        });
    }, []);

    useGSAP(() => {
        // Products Grid Animation
        if (filteredProducts.length > 0) {
            gsap.from(".product-card", {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                stagger: 0.05,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".products-grid",
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        }

        // Floating Bar Animation
        if (selectedProducts.length > 0) {
            gsap.fromTo(".floating-bar",
                { y: 100 },
                { y: 0, duration: 0.4, ease: "power3.out" }
            );
        }
    }, [filteredProducts, selectedProducts.length]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Hero Section */}
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

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative mb-12">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-secondary border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category
                                    ? "bg-brand-accent text-white shadow-[0_0_15px_rgba(0,210,255,0.3)]"
                                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground border border-border"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="pb-24 px-6">
                <div className="container mx-auto">
                    {isLoadingProducts ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-brand-accent animate-spin" />
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            No products found.
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
                                                className="border-border data-[state=checked]:bg-brand-accent data-[state=checked]:text-white"
                                            />
                                        </div>

                                        <div
                                            onClick={() => router.push(`/products/${product.id}`)}
                                            className="h-full bg-card border border-border rounded-2xl overflow-hidden hover:border-brand-accent/50 hover:shadow-[0_0_20px_rgba(0,210,255,0.1)] transition-all duration-300 cursor-pointer flex flex-col"
                                        >
                                            <div className="aspect-square bg-secondary/50 p-6 flex items-center justify-center relative overflow-hidden">
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <Pill className="w-20 h-20 text-muted-foreground/20 group-hover:text-brand-accent/50 transition-colors" />
                                                )}
                                                <div className="absolute top-4 right-4">
                                                    <Badge variant="secondary" className="bg-background/50 backdrop-blur-md text-brand-accent border border-brand-accent/20">
                                                        {product.category}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="p-6 flex flex-col flex-grow">
                                                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-brand-accent transition-colors">
                                                    {product.name}
                                                </h3>
                                                <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
                                                    {product.description}
                                                </p>

                                                <div className="space-y-3 pt-4 border-t border-border">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">Dosage</span>
                                                        <span className="text-foreground font-medium">{product.dosage}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.features.slice(0, 2).map((feature, i) => (
                                                            <span key={i} className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground border border-border">
                                                                {feature}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Floating Action Bar */}
            {selectedProducts.length > 0 && (
                <div className="floating-bar fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-6">
                    <div className="bg-background/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold">
                                {selectedProducts.length}
                            </div>
                            <span className="text-foreground font-medium hidden sm:inline">Selected</span>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleCompare}
                                disabled={selectedProducts.length < 2 || selectedProducts.length > 3}
                                variant="outline"
                                className="border-border text-foreground hover:bg-secondary hover:text-foreground"
                            >
                                <GitCompare className="w-4 h-4 mr-2" />
                                Compare
                            </Button>
                            <Button
                                onClick={() => setShowInquiryForm(true)}
                                className="bg-brand-accent text-white hover:bg-foreground hover:text-background"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Inquiry
                            </Button>
                            <Button
                                onClick={() => setSelectedProducts([])}
                                variant="ghost"
                                className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <ProductComparison
                products={selectedProducts.slice(0, 3)}
                onRemove={handleRemoveFromComparison}
                onClose={() => setShowComparison(false)}
                open={showComparison}
            />

            <BulkInquiryForm
                selectedProducts={selectedProducts}
                onClose={() => setShowInquiryForm(false)}
                open={showInquiryForm}
            />

            <Footer />
        </div>
    );
};

export default ProductsContent;
