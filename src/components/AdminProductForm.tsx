"use client";

import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    MorphingDialog,
    MorphingDialogTrigger,
    MorphingDialogContent,
    MorphingDialogTitle,
    MorphingDialogClose,
    MorphingDialogContainer,
    useMorphingDialog
} from "@/components/ui/morphing-dialog";
import { Loader2, Package, FileText, IndianRupee, Layers, LayoutGrid, Image as ImageIcon, Star, Save } from "lucide-react";
import NeonCheckbox from "@/components/ui/NeonCheckbox";
import { toast } from "sonner";
import ImageDropzone from "@/components/ImageDropzone";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    featured: boolean;
    composition?: string;
    dosageInstructions?: string;
    indications?: string;
    sideEffects?: string;
    precautions?: string;
    isQualityAssured?: boolean;
    isGmpCertified?: boolean;
    isWhoApproved?: boolean;
}

interface AdminProductFormProps {
    product?: Product; // If provided, we are in Edit mode
    trigger: React.ReactNode;
    triggerClassName?: string;
    triggerStyle?: React.CSSProperties;
}

const ProductFormContent = ({ product }: { product?: Product }) => {
    const { setIsOpen } = useMorphingDialog();
    const queryClient = useQueryClient();

    // Initial state based on product prop (if editing)
    const [formData, setFormData] = useState({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price.toString() || "",
        category: product?.category || "",
        images: product?.images || [] as string[],
        stock: product?.stock.toString() || "",
        featured: product?.featured || false,
        composition: product?.composition || "",
        dosageInstructions: product?.dosageInstructions || "",
        indications: product?.indications || "",
        sideEffects: product?.sideEffects || "",
        precautions: product?.precautions || "",
        isQualityAssured: product?.isQualityAssured || false,
        isGmpCertified: product?.isGmpCertified || false,
        isWhoApproved: product?.isWhoApproved || false,
        // Auto-generated SEO fields
        metaTitle: product ? `${product.name} | Aster Medicines Pvt Ltd`.slice(0, 70) : "",
        metaDescription: product
            ? `Buy ${product.name} (${product.category}) from Aster Medicines — GMP CERTIFIED manufacturer in Bihar. Bulk orders & third party manufacturing available.`.slice(0, 160)
            : "",
    });

    const handleNameChange = (name: string) => {
        setFormData((f) => ({
            ...f,
            name,
            metaTitle: `${name} | Aster Medicines Pvt Ltd`.slice(0, 70),
            metaDescription: `Buy ${name}${f.category ? ` (${f.category})` : ""} from Aster Medicines — GMP CERTIFIED manufacturer in Bihar. Bulk orders & third party manufacturing available.`.slice(0, 160),
        }));
    };

    const handleCategoryChange = (category: string) => {
        setFormData((f) => ({
            ...f,
            category,
            metaDescription: `Buy ${f.name}${category ? ` (${category})` : ""} from Aster Medicines — GMP CERTIFIED manufacturer in Bihar. Bulk orders & third party manufacturing available.`.slice(0, 160),
        }));
    };

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create product");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product created successfully");
            setIsOpen(false);
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update product");
            }
            return response.json();
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
            toast.success("Product updated successfully");
            setIsOpen(false);
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
        };

        if (product) {
            updateMutation.mutate({ id: product._id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="relative">
            <MorphingDialogClose className="z-50" />
            <MorphingDialogTitle className="text-2xl font-display font-bold text-brand-accent mb-6">
                {product ? "Edit Product" : "Add New Product"}
            </MorphingDialogTitle>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="name" className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                            <Package className="w-4 h-4" />
                            Product Name
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            required
                            className="w-full px-4 py-3 h-auto rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground"
                        />
                    </div>
                    <div>
                        <Label htmlFor="category" className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                            <LayoutGrid className="w-4 h-4" />
                            Category
                        </Label>
                        <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            required
                            className="w-full px-4 py-3 h-auto rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground"
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="description" className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        Description
                    </Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground resize-none"
                    />
                </div>

                {/* New Fields Section */}
                <div className="space-y-6 border-t border-border pt-6">
                    <div>
                        <Label htmlFor="composition" className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            Composition
                        </Label>
                        <Textarea
                            id="composition"
                            value={formData.composition}
                            onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground resize-none"
                            placeholder="Enter product composition..."
                        />
                    </div>
                    <div>
                        <Label htmlFor="dosageInstructions" className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            Dosage Instructions
                        </Label>
                        <Textarea
                            id="dosageInstructions"
                            value={formData.dosageInstructions}
                            onChange={(e) => setFormData({ ...formData, dosageInstructions: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground resize-none"
                            placeholder="Enter dosage instructions..."
                        />
                    </div>
                    <div>
                        <Label htmlFor="indications" className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            Indications
                        </Label>
                        <Textarea
                            id="indications"
                            value={formData.indications}
                            onChange={(e) => setFormData({ ...formData, indications: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground resize-none"
                            placeholder="Enter indications..."
                        />
                    </div>
                    <div>
                        <Label htmlFor="sideEffects" className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            Side Effects
                        </Label>
                        <Textarea
                            id="sideEffects"
                            value={formData.sideEffects}
                            onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground resize-none"
                            placeholder="Enter side effects..."
                        />
                    </div>
                    <div>
                        <Label htmlFor="precautions" className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            Precautions
                        </Label>
                        <Textarea
                            id="precautions"
                            value={formData.precautions}
                            onChange={(e) => setFormData({ ...formData, precautions: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground resize-none"
                            placeholder="Enter precautions..."
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="price" className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                            <IndianRupee className="w-4 h-4" />
                            Price
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                            className="w-full px-4 py-3 h-auto rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground"
                        />
                    </div>
                    <div>
                        <Label htmlFor="stock" className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                            <Layers className="w-4 h-4" />
                            Stock
                        </Label>
                        <Input
                            id="stock"
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            required
                            className="w-full px-4 py-3 h-auto rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground"
                        />
                    </div>
                </div>

                <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                    <Label className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground">
                        <ImageIcon className="w-4 h-4" />
                        Product Images
                    </Label>
                    <ImageDropzone
                        onImagesUploaded={(urls) => setFormData({ ...formData, images: urls })}
                        existingImages={formData.images}
                        maxFiles={10}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className="flex items-center space-x-2 bg-secondary/50 p-4 rounded-xl border border-border">
                        <NeonCheckbox
                            id="isQualityAssured"
                            checked={formData.isQualityAssured || false}
                            onChange={(checked) => setFormData({ ...formData, isQualityAssured: checked })}
                        />
                        <Label htmlFor="isQualityAssured" className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                            Quality Assured
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-secondary/50 p-4 rounded-xl border border-border">
                        <NeonCheckbox
                            id="isGmpCertified"
                            checked={formData.isGmpCertified || false}
                            onChange={(checked) => setFormData({ ...formData, isGmpCertified: checked })}
                        />
                        <Label htmlFor="isGmpCertified" className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                            GMP Certified
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-secondary/50 p-4 rounded-xl border border-border">
                        <NeonCheckbox
                            id="isWhoApproved"
                            checked={formData.isWhoApproved || false}
                            onChange={(checked) => setFormData({ ...formData, isWhoApproved: checked })}
                        />
                        <Label htmlFor="isWhoApproved" className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                            WHO Approved
                        </Label>
                    </div>
                </div>

                <div className="flex items-center space-x-2 bg-secondary/50 p-4 rounded-xl border border-border">
                    <NeonCheckbox
                        id="featured"
                        checked={formData.featured}
                        onChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                    <Label htmlFor="featured" className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                        <Star className={`w-4 h-4 ${formData.featured ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                        Featured Product
                    </Label>
                </div>
                <div className="flex gap-4 justify-end pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="px-6 h-12 border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="px-6 h-12 bg-brand-accent hover:bg-brand-accent/90 text-white font-medium rounded-lg shadow-lg hover:shadow-brand-accent/25 transition-all duration-300 group">
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        )}
                        {product ? "Update" : "Create"} Product
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default function AdminProductForm({ product, trigger, triggerClassName, triggerStyle }: AdminProductFormProps) {
    return (
        <MorphingDialog transition={{ type: 'spring', bounce: 0.05, duration: 0.25 }}>
            <MorphingDialogTrigger className={triggerClassName} style={triggerStyle}>
                {trigger}
            </MorphingDialogTrigger>
            <MorphingDialogContainer>
                <MorphingDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden w-[95vw] sm:w-full rounded-2xl backdrop-blur-xl bg-background/95 border-brand-accent/20 shadow-2xl p-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:my-4 [&::-webkit-scrollbar-thumb]:bg-orange-500 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <ProductFormContent product={product} />
                </MorphingDialogContent>
            </MorphingDialogContainer>
        </MorphingDialog>
    );
}
