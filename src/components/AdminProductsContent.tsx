"use client";


import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Plus, Pencil, Trash2, MessageSquare, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminProductForm from "@/components/AdminProductForm";

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

    const { data: products, isLoading } = useQuery({
        queryKey: ["admin-products"],
        queryFn: async () => {
            const response = await fetch("/api/products");
            if (!response.ok) throw new Error("Failed to fetch products");
            return response.json() as Promise<Product[]>;
        },
    });



    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/products/${id}`, {
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



    return (
        <div
            className="min-h-screen flex flex-col bg-background"
        >

            <Navbar />

            <main id="main-content" className="flex-grow pt-32 pb-12 px-4 sm:px-6 lg:px-8">
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
                                <AdminProductForm
                                    triggerClassName={cn(buttonVariants(), "button-primary flex items-center justify-center gap-2 w-full sm:w-auto")}
                                    trigger={
                                        <>
                                            <Plus className="h-4 w-4" />
                                            <span className="hidden sm:inline">Add Product</span>
                                            <span className="sm:hidden">Add</span>
                                        </>
                                    }
                                />
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
                                                    <Image
                                                        src={product.images?.[0] || '/placeholder.svg'}
                                                        alt={product.name}
                                                        width={64}
                                                        height={64}
                                                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                                                    />
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
                                                        <AdminProductForm
                                                            product={product}
                                                            triggerClassName="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 min-w-[44px] min-h-[44px] h-10 w-10"
                                                            trigger={<Pencil className="h-4 w-4" />}
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
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
