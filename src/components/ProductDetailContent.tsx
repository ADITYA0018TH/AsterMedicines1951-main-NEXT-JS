"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowLeft, CheckCircle, Shield, AlertCircle, Loader2 } from "lucide-react";
import { fetchProductById } from "@/services/api";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const ProductDetailContent = () => {
    const params = useParams();
    const id = params.id as string;

    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProductById(id!),
        enabled: !!id,
    });

    // GSAP Animations
    useGSAP(() => {
        if (!product) return;

        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline();

        // Initial load animation
        tl.from(".product-image-container", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        })
            .from(".product-info-container", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.6");

        // Scroll animations for detail cards
        gsap.utils.toArray<HTMLElement>(".detail-card").forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 0.6,
                delay: i * 0.1,
                ease: "power3.out"
            });
        });

    }, [product]);

    if (isLoading) {
        return (
            <div className="min-h-screen cursor-none bg-cover bg-center bg-no-repeat">
                <CustomCursor />
                <Navbar />
                <div className="container mx-auto px-4 py-24 text-center flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-brand-accent animate-spin mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900">Loading product details...</h1>
                </div>
                <Footer />
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="min-h-screen cursor-none bg-cover bg-center bg-no-repeat">
                <CustomCursor />
                <Navbar />
                <div className="container mx-auto px-4 py-24 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                    <Link href="/products">
                        <Button variant="default" className="mt-4">
                            <ArrowLeft className="mr-2" /> Back to Products
                        </Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen cursor-none bg-cover bg-center bg-no-repeat bg-background text-foreground">
            <CustomCursor />
            <Navbar />

            {/* Breadcrumb */}
            <section className="pt-24 pb-8 px-4">
                <div className="container mx-auto">
                    <Link href="/products">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="mr-2" /> Back to Products
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Product Details */}
            <section className="pb-16 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Product Images */}
                        <div className="product-image-container bg-card/80 backdrop-blur-sm rounded-lg p-6 border border-border">
                            <Carousel className="w-full" opts={{ loop: true }}>
                                <CarouselContent>
                                    {product.images.map((img, index) => (
                                        <CarouselItem key={index}>
                                            <div className="aspect-square bg-background flex items-center justify-center p-8 rounded-md">
                                                <img
                                                    src={img}
                                                    alt={`${product.name} - ${product.category} - Detailed view ${index + 1}`}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {product.images.length > 1 && (
                                    <>
                                        <CarouselPrevious className="left-4" />
                                        <CarouselNext className="right-4" />
                                    </>
                                )}
                            </Carousel>
                        </div>

                        {/* Product Info */}
                        <div className="product-info-container space-y-6">
                            <div>
                                <Badge variant="secondary" className="bg-brand-accent/10 text-brand-accent mb-4">
                                    {product.category}
                                </Badge>
                                <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>
                                <p className="text-xl text-muted-foreground mb-6">{product.description}</p>
                                <div className="flex items-center gap-2 mb-6">
                                    <Shield className="w-5 h-5 text-green-500" />
                                    <span className="text-sm text-muted-foreground">Quality Assured Product</span>
                                </div>
                            </div>

                            <Card className="bg-card/80 backdrop-blur-sm border-border">
                                <CardHeader>
                                    <CardTitle>Dosage</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-brand-accent font-medium">{product.dosage}</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/80 backdrop-blur-sm border-border">
                                <CardHeader>
                                    <CardTitle>Key Features</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {product.features.map((feature, index) => (
                                            <div key={index} className="flex items-center text-muted-foreground">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Detailed Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                        {product.detailedDescription && (
                            <Card className="detail-card bg-card/80 backdrop-blur-sm border-border">
                                <CardHeader>
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{product.detailedDescription}</p>
                                </CardContent>
                            </Card>
                        )}

                        {product.composition && (
                            <Card className="detail-card bg-card/80 backdrop-blur-sm border-border">
                                <CardHeader>
                                    <CardTitle>Composition</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{product.composition}</p>
                                </CardContent>
                            </Card>
                        )}

                        {product.indications && (
                            <Card className="detail-card bg-card/80 backdrop-blur-sm border-border">
                                <CardHeader>
                                    <CardTitle>Indications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{product.indications}</p>
                                </CardContent>
                            </Card>
                        )}

                        {product.dosageInstructions && (
                            <Card className="detail-card bg-card/80 backdrop-blur-sm border-border">
                                <CardHeader>
                                    <CardTitle>Dosage Instructions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{product.dosageInstructions}</p>
                                </CardContent>
                            </Card>
                        )}

                        {product.sideEffects && (
                            <Card className="detail-card bg-card/80 backdrop-blur-sm border-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-brand-accent" />
                                        Side Effects
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{product.sideEffects}</p>
                                </CardContent>
                            </Card>
                        )}

                        {product.precautions && (
                            <Card className="detail-card bg-card/80 backdrop-blur-sm border-red-200 dark:border-red-900/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                        Precautions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{product.precautions}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ProductDetailContent;