"use client";

import { useState } from "react";


import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Plus, Pencil, Trash2, MessageSquare, ArrowLeft, Download, Upload, ChevronLeft, ChevronRight } from "lucide-react";
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
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [importing, setImporting] = useState(false);

    const { data: responseData, isLoading } = useQuery({
        queryKey: ["admin-products", page, limit],
        queryFn: async () => {
            const response = await fetch(`/api/products?page=${page}&limit=${limit}`);
            if (!response.ok) throw new Error("Failed to fetch products");
            return response.json();
        },
    });

    const products = responseData?.products || [];
    const pagination = responseData?.pagination;



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


    const handleExport = async () => {
        try {
            // Fetch all products for export
            const res = await fetch("/api/products");
            const allProducts = await res.json();

            if (!Array.isArray(allProducts)) return;

            const headers = ["Name", "Category", "Price", "Stock", "Description", "Features"];
            const csvContent = [
                headers.join(","),
                ...allProducts.map((p: any) => [
                    `"${p.name.replace(/"/g, '""')}"`,
                    `"${p.category}"`,
                    p.price,
                    p.stock,
                    `"${p.description.replace(/"/g, '""')}"`,
                    `"${(p.isQualityAssured ? "Quality Assured" : "")} ${(p.isGmpCertified ? "GMP" : "")}"`.trim()
                ].join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `products_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            toast.error("Failed to export products");
        }
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImporting(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                // Simple CSV parser assuming standard format (Name, Description, Price, Category, Stock)
                // Skipping header row
                const rows = text.split('\n').slice(1).filter(row => row.trim());

                const newProducts = rows.map(row => {
                    // Handle quoted strings loosely
                    const regex = /(?:^|,)(?:"([^"]*)"|([^,]*))/g;
                    const matches = [];
                    let match;
                    while ((match = regex.exec(row))) {
                        matches.push(match[1] || match[2] || '');
                    }
                    // Clean up matches
                    const values = matches.filter(m => m !== undefined);

                    // Fallback to simple split if regex fails or structure is simple
                    const simpleValues = row.split(',').map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
                    const data = values.length >= 5 ? values : simpleValues;

                    return {
                        name: data[0] || "New Product",
                        category: data[1] || "Uncategorized",
                        price: parseFloat(data[2]) || 0,
                        stock: parseInt(data[3]) || 0,
                        description: data[4] || "",
                        images: ["/placeholder.svg"] // Default image
                    };
                });

                if (newProducts.length === 0) throw new Error("No valid products found");

                const response = await fetch("/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newProducts),
                });

                if (!response.ok) throw new Error("Failed to import products");

                toast.success(`Successfully imported ${newProducts.length} products`);
                queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            } catch (error) {
                console.error(error);
                toast.error("Failed to import CSV. Ensure format: Name,Category,Price,Stock,Description");
            } finally {
                setImporting(false);
                // Reset input
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    };


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
                                <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block" />
                                <Button
                                    variant="outline"
                                    onClick={handleExport}
                                    className="gap-2 hidden md:flex"
                                    title="Export CSV"
                                >
                                    <Download className="h-4 w-4" />
                                    Export
                                </Button>
                                <div className="relative hidden md:block">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleImport}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={importing}
                                    />
                                    <Button
                                        variant="outline"
                                        className="gap-2"
                                        disabled={importing}
                                        title="Import CSV"
                                    >
                                        {importing ? <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Upload className="h-4 w-4" />}
                                        Import
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12">Loading products...</div>
                        ) : products.length > 0 ? (
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

                        {/* Pagination Controls */}
                        {pagination && pagination.pages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> products
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                            // Simple logic to show current page surroundings
                                            let p = i + 1;
                                            if (pagination.pages > 5 && page > 3) {
                                                p = page - 2 + i;
                                                if (p > pagination.pages) p -= (p - pagination.pages);
                                            }
                                            return (
                                                <Button
                                                    key={p}
                                                    variant={page === p ? "default" : "ghost"}
                                                    size="sm"
                                                    onClick={() => setPage(p)}
                                                    className={`h-8 w-8 p-0 ${page === p ? "bg-pulse-500 hover:bg-pulse-600" : ""}`}
                                                >
                                                    {p}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                        disabled={page === pagination.pages}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
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
