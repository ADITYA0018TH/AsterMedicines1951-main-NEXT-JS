"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, MessageSquare, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
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
}

const AdminProductsContent = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        images: [] as string[],
        stock: "",
        featured: false,
    });

    const { data: products, isLoading } = useQuery({
        queryKey: ["admin-products"],
        queryFn: async () => {
            const response = await fetch("http://localhost:3000/api/products");
            if (!response.ok) throw new Error("Failed to fetch products");
            return response.json() as Promise<Product[]>;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch("http://localhost:3000/api/products", {
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
            toast.success("Product created successfully");
            handleCloseDialog();
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await fetch(`http://localhost:3000/api/products/${id}`, {
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            toast.success("Product updated successfully");
            handleCloseDialog();
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete product");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            toast.success("Product deleted successfully");
        },
        onError: () => toast.error("Failed to delete product"),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
        };

        console.log('Submitting product data:', data);
        if (editingProduct) {
            updateMutation.mutate({ id: editingProduct._id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            images: product.images || [],
            stock: product.stock.toString(),
            featured: product.featured,
        });
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingProduct(null);
        setFormData({
            name: "",
            description: "",
            price: "",
            category: "",
            images: [],
            stock: "",
            featured: false,
        });
    };

    return (
        <div
            className="min-h-screen flex flex-col bg-background"
        >
            <CustomCursor />
            <Navbar />

            <main className="flex-grow pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="glass-card p-4 sm:p-6 md:p-8 hover:scale-[1.001] transition-all duration-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
                                Product <span className="text-pulse-500">Management</span>
                            </h1>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <Button
                                    variant="outline"
                                    className="flex items-center justify-center gap-2 w-full sm:w-auto"
                                    onClick={() => router.push('/admin/dashboard')}
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span className="hidden sm:inline">Back to Dashboard</span>
                                    <span className="sm:hidden">Dashboard</span>
                                </Button>
                                <Link href="/admin/messages" className="w-full sm:w-auto">
                                    <Button variant="outline" className="flex items-center justify-center gap-2 w-full">
                                        <MessageSquare className="h-4 w-4" />
                                        <span className="hidden sm:inline">View Messages</span>
                                        <span className="sm:hidden">Messages</span>
                                    </Button>
                                </Link>
                                <Dialog open={isDialogOpen} onOpenChange={(open) => open ? setIsDialogOpen(true) : handleCloseDialog()}>
                                    <DialogTrigger asChild>
                                        <Button className="button-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                                            <Plus className="h-4 w-4" />
                                            <span className="hidden sm:inline">Add Product</span>
                                            <span className="sm:hidden">Add</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden w-[95vw] sm:w-full rounded-2xl backdrop-blur-xl bg-background/95 border-brand-accent/20 shadow-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:my-4 [&::-webkit-scrollbar-thumb]:bg-orange-500 [&::-webkit-scrollbar-thumb]:rounded-full">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-display font-bold text-brand-accent">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <Label htmlFor="name" className="text-sm font-medium text-muted-foreground mb-2 block">Product Name</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    required
                                                    className="w-full px-4 py-3 h-auto rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="description" className="text-sm font-medium text-muted-foreground mb-2 block">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    required
                                                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground resize-none"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <Label htmlFor="price" className="text-sm font-medium text-muted-foreground mb-2 block">Price</Label>
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
                                                    <Label htmlFor="stock" className="text-sm font-medium text-muted-foreground mb-2 block">Stock</Label>
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
                                            <div>
                                                <Label htmlFor="category" className="text-sm font-medium text-muted-foreground mb-2 block">Category</Label>
                                                <Input
                                                    id="category"
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    required
                                                    className="w-full px-4 py-3 h-auto rounded-lg bg-secondary border border-border text-foreground focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all outline-none placeholder:text-muted-foreground"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Product Images</Label>
                                                <ImageDropzone
                                                    onImagesUploaded={(urls) => setFormData({ ...formData, images: urls })}
                                                    existingImages={formData.images}
                                                    maxFiles={10}
                                                />
                                            </div>
                                            <div className="flex items-center space-x-2 bg-secondary/30 p-4 rounded-lg border border-border/50">
                                                <input
                                                    type="checkbox"
                                                    id="featured"
                                                    checked={formData.featured}
                                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                                    className="rounded border-border text-brand-accent focus:ring-brand-accent"
                                                />
                                                <Label htmlFor="featured" className="text-sm font-medium text-foreground cursor-pointer">Featured Product</Label>
                                            </div>
                                            <div className="flex gap-4 justify-end pt-4">
                                                <Button type="button" variant="outline" onClick={handleCloseDialog} className="px-6 h-12 border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                                                    Cancel
                                                </Button>
                                                <Button type="submit" className="px-6 h-12 bg-brand-accent hover:bg-brand-accent/90 text-white font-medium rounded-lg shadow-lg hover:shadow-brand-accent/25 transition-all duration-300">
                                                    {editingProduct ? "Update" : "Create"} Product
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12">Loading products...</div>
                        ) : products && products.length > 0 ? (
                            <div className="rounded-lg overflow-x-auto glass-card">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-white/10 dark:hover:bg-white/5">
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Image</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Name</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold hidden md:table-cell">Category</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Price</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold hidden lg:table-cell">Stock</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.map((product) => (
                                            <TableRow key={product._id} className="border-b border-gray-200/30 dark:border-gray-700/30 hover:bg-white/10 dark:hover:bg-white/5 transition-colors">
                                                <TableCell>
                                                    <img src={product.images?.[0] || '/placeholder.svg'} alt={product.name} className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded" />
                                                </TableCell>
                                                <TableCell className="text-gray-800 dark:text-gray-200 font-medium">
                                                    <div className="min-w-[100px] max-w-[150px] sm:max-w-none">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 md:hidden">
                                                        {product.category}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-800 dark:text-gray-200 hidden md:table-cell">{product.category}</TableCell>
                                                <TableCell className="text-gray-800 dark:text-gray-200 whitespace-nowrap">₹{product.price}</TableCell>
                                                <TableCell className="text-gray-800 dark:text-gray-200 hidden lg:table-cell">{product.stock}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1 sm:gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(product)}
                                                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 min-w-[44px] min-h-[44px]"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                                                    deleteMutation.mutate(product._id);
                                                                }
                                                            }}
                                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 min-w-[44px] min-h-[44px]"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12 glass-card rounded-lg">
                                <p className="text-gray-600 dark:text-gray-400 text-lg">No products yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminProductsContent;
