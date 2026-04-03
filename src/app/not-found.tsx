"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Home, Search, Mail, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { findSimilarProducts, FuzzyMatchResult } from "@/lib/fuzzyMatch";
import { getProductPath } from "@/lib/productSlug";

const NotFound = () => {
    const pathname = usePathname();
    const [suggestions, setSuggestions] = useState<FuzzyMatchResult | null>(null);

    // Extract potential product slug from pathname
    const potentialSlug = useMemo(() => {
        if (pathname.startsWith("/products/")) {
            return pathname.replace("/products/", "").split("/")[0];
        }
        // Also check for any path that might be a product
        const lastSegment = pathname.split("/").filter(Boolean).pop();
        return lastSegment || "";
    }, [pathname]);

    useEffect(() => {
        // Log 404 errors
        console.log(`404 Error: User attempted to access ${pathname}`);

        // Find similar products if we have a potential slug
        if (potentialSlug) {
            const matches = findSimilarProducts(potentialSlug, products, 4);
            setSuggestions(matches);
        }
    }, [pathname, potentialSlug]);

    const hasSuggestions = suggestions && (suggestions.exactMatch || suggestions.suggestions.length > 0);
    const isProductRoute = pathname.startsWith("/products/");

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background text-foreground selection:bg-orange-500 selection:text-white">

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Ambient Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl w-full mx-4 text-center">

                {/* 404 Glitch Effect */}
                <div className="mb-8 relative inline-block group cursor-default">
                    <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute top-0 left-0 w-full h-full text-9xl md:text-[12rem] font-black text-orange-500 opacity-0 group-hover:opacity-10 group-hover:translate-x-1 transition-all duration-200 pointer-events-none leading-none">
                        404
                    </div>
                </div>

                <h2 className="text-2xl md:text-4xl font-bold mb-4 font-display">
                    {isProductRoute ? "Product Not Found" : "Out of Stock?"}
                </h2>

                <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                    {isProductRoute 
                        ? "We couldn't find the product you're looking for. It may have been discontinued or moved."
                        : "The page you are looking for seems to have been discontinued or moved."
                    }
                </p>

                {/* Did You Mean Section */}
                {hasSuggestions && (
                    <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <p className="text-sm text-muted-foreground mb-4 font-medium">
                            Did you mean one of these products?
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                            {suggestions.exactMatch && (
                                <Link 
                                    href={getProductPath({ name: suggestions.exactMatch.name, slug: suggestions.exactMatch.slug })}
                                    className="col-span-full"
                                >
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 transition-all group">
                                        <Package className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                        <div className="text-left flex-1 min-w-0">
                                            <p className="font-semibold text-foreground truncate group-hover:text-orange-500 transition-colors">
                                                {suggestions.exactMatch.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{suggestions.exactMatch.category}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            )}
                            {suggestions.suggestions.map((product) => (
                                <Link 
                                    key={product.id}
                                    href={getProductPath({ name: product.name, slug: product.slug })}
                                >
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border hover:bg-secondary hover:border-orange-500/30 transition-all group">
                                        <Package className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                        <div className="text-left flex-1 min-w-0">
                                            <p className="font-medium text-sm text-foreground truncate group-hover:text-orange-500 transition-colors">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{product.category}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Smart Recovery Links */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                    <Link href="/">
                        <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold gap-2 px-8">
                            <Home className="w-4 h-4" />
                            Return Home
                        </Button>
                    </Link>

                    <Link href="/products">
                        <Button size="lg" variant="outline" className="rounded-full border-border hover:bg-secondary gap-2 px-8">
                            <Search className="w-4 h-4" />
                            Browse Products
                        </Button>
                    </Link>
                </div>

                {/* Footer Help Link */}
                <div className="mt-12 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    Need urgent assistance? <Link href="/contact" className="text-orange-500 hover:underline font-medium inline-flex items-center gap-1">Contact Support <Mail className="w-3 h-3" /></Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;