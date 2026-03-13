"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Pencil,
    Trash2,
    MessageSquare,
    ArrowLeft,
    Download,
    Upload,
    ChevronLeft,
    ChevronRight,
    Search,
    RefreshCw,
    SlidersHorizontal,
    AlertTriangle,
    PackageCheck,
} from "lucide-react";
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

type SortBy = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "stock-asc" | "stock-desc";
type StockFilter = "all" | "in" | "low" | "out";
type ExportMode = "all" | "visible" | "selected";

const CSV_HEADERS = ["Name", "Category", "Price", "Stock", "Featured", "Description"];

const AdminProductsContent = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [importing, setImporting] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [stockFilter, setStockFilter] = useState<StockFilter>("all");
    const [sortBy, setSortBy] = useState<SortBy>("name-asc");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search.trim().toLowerCase());
        }, 250);
        return () => clearTimeout(timeout);
    }, [search]);

    const { data: responseData, isLoading, isFetching, refetch, dataUpdatedAt } = useQuery({
        queryKey: ["admin-products", page, limit],
        queryFn: async () => {
            const response = await fetch(`/api/products?page=${page}&limit=${limit}`);
            if (!response.ok) throw new Error("Failed to fetch products");
            return response.json();
        },
    });

    const products: Product[] = responseData?.products || [];
    const pagination = responseData?.pagination;

    const categories = useMemo<string[]>(() => {
        const categorySet = new Set<string>();
        products.forEach((product) => {
            if (typeof product.category === "string" && product.category.trim()) {
                categorySet.add(product.category);
            }
        });

        return Array.from(categorySet).sort((a, b) => a.localeCompare(b));
    }, [products]);

    const displayedProducts = useMemo(() => {
        let list = [...products] as Product[];

        if (debouncedSearch) {
            list = list.filter((product) => {
                const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase();
                return haystack.includes(debouncedSearch);
            });
        }

        if (categoryFilter !== "all") {
            list = list.filter((product) => product.category === categoryFilter);
        }

        if (stockFilter === "in") {
            list = list.filter((product) => product.stock > 0);
        }

        if (stockFilter === "low") {
            list = list.filter((product) => product.stock > 0 && product.stock < 10);
        }

        if (stockFilter === "out") {
            list = list.filter((product) => product.stock <= 0);
        }

        if (sortBy === "name-asc") {
            list.sort((a, b) => a.name.localeCompare(b.name));
        }
        if (sortBy === "name-desc") {
            list.sort((a, b) => b.name.localeCompare(a.name));
        }
        if (sortBy === "price-asc") {
            list.sort((a, b) => a.price - b.price);
        }
        if (sortBy === "price-desc") {
            list.sort((a, b) => b.price - a.price);
        }
        if (sortBy === "stock-asc") {
            list.sort((a, b) => a.stock - b.stock);
        }
        if (sortBy === "stock-desc") {
            list.sort((a, b) => b.stock - a.stock);
        }

        return list;
    }, [products, debouncedSearch, categoryFilter, stockFilter, sortBy]);

    const metrics = useMemo(() => {
        const total = displayedProducts.length;
        const lowStock = displayedProducts.filter((product) => product.stock > 0 && product.stock < 10).length;
        const outOfStock = displayedProducts.filter((product) => product.stock <= 0).length;
        const featured = displayedProducts.filter((product) => product.featured).length;

        return { total, lowStock, outOfStock, featured };
    }, [displayedProducts]);

    useEffect(() => {
        setSelectedIds((prev) => {
            const next = prev.filter((id) => displayedProducts.some((product) => product._id === id));
            if (next.length === prev.length && next.every((id, index) => id === prev[index])) {
                return prev;
            }
            return next;
        });
    }, [displayedProducts]);

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

    const handleSelectAll = (checked: boolean | "indeterminate") => {
        if (checked === true) {
            setSelectedIds(displayedProducts.map((product) => product._id));
            return;
        }
        setSelectedIds([]);
    };

    const handleSelectOne = (checked: boolean | "indeterminate", id: string) => {
        if (checked === true) {
            setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
            return;
        }
        setSelectedIds((prev) => prev.filter((prevId) => prevId !== id));
    };

    const handleResetFilters = () => {
        setSearch("");
        setCategoryFilter("all");
        setStockFilter("all");
        setSortBy("name-asc");
    };

    const toCsv = (items: Product[]) => {
        const escape = (value: string | number | boolean | null | undefined) => {
            const text = String(value ?? "").replace(/"/g, '""');
            return `"${text}"`;
        };

        return [
            CSV_HEADERS.join(","),
            ...items.map((product) => [
                escape(product.name),
                escape(product.category),
                product.price,
                product.stock,
                product.featured ? "Yes" : "No",
                escape(product.description),
            ].join(",")),
        ].join("\n");
    };

    const downloadCsv = (content: string, fileName: string) => {
        const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const fetchAllProducts = async () => {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products for export");
        const data = await response.json();

        if (Array.isArray(data)) return data as Product[];
        if (Array.isArray(data?.products)) return data.products as Product[];
        return [];
    };

    const handleExport = async (mode: ExportMode) => {
        try {
            let source: Product[] = [];
            let label = "all";

            if (mode === "all") {
                source = await fetchAllProducts();
            }

            if (mode === "visible") {
                source = displayedProducts;
                label = "visible";
            }

            if (mode === "selected") {
                source = displayedProducts.filter((product) => selectedIds.includes(product._id));
                label = "selected";
            }

            if (source.length === 0) {
                toast.info("No products to export");
                return;
            }

            const csvContent = toCsv(source);
            const date = new Date().toISOString().split("T")[0];
            downloadCsv(csvContent, `products_${label}_export_${date}.csv`);
            toast.success(`Exported ${source.length} products`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to export products");
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected products?`)) return;

        try {
            const results = await Promise.allSettled(
                selectedIds.map((id) =>
                    fetch(`/api/products/${id}`, {
                        method: "DELETE",
                    })
                )
            );

            const successCount = results.filter(
                (result) => result.status === "fulfilled" && result.value.ok
            ).length;
            const failedCount = selectedIds.length - successCount;

            if (successCount > 0) {
                toast.success(`Deleted ${successCount} products`);
            }
            if (failedCount > 0) {
                toast.error(`${failedCount} deletions failed`);
            }

            setSelectedIds([]);
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
        } catch (error) {
            console.error(error);
            toast.error("Bulk delete failed");
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
                const rows = text.split("\n").slice(1).filter((row) => row.trim());

                const newProducts = rows.map((row) => {
                    const regex = /(?:^|,)(?:"([^"]*)"|([^,]*))/g;
                    const matches: string[] = [];
                    let match;
                    while ((match = regex.exec(row))) {
                        matches.push(match[1] || match[2] || "");
                    }
                    const values = matches.filter((item) => item !== undefined);
                    const simpleValues = row.split(",").map((value) => value.replace(/^"|"$/g, "").replace(/""/g, '"'));
                    const data = values.length >= 5 ? values : simpleValues;

                    const featuredToken = (data[4] || "").toLowerCase();

                    return {
                        name: data[0] || "New Product",
                        category: data[1] || "Uncategorized",
                        price: parseFloat(data[2]) || 0,
                        stock: parseInt(data[3]) || 0,
                        featured: featuredToken === "yes" || featuredToken === "true" || featuredToken === "1",
                        description: data[5] || data[4] || "",
                        images: ["/placeholder.svg"],
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
                toast.error("Failed to import CSV. Format: Name,Category,Price,Stock,Featured,Description");
            } finally {
                setImporting(false);
                event.target.value = "";
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
                    <div className="glass-card p-4 sm:p-6 md:p-8 hover:scale-[1.001] transition-all duration-500 animate-enter">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                                Product <span className="text-pulse-500">Management</span>
                            </h1>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
                                <Button
                                    variant="outline"
                                    className="flex items-center justify-center gap-2 w-full sm:w-auto"
                                    onClick={() => router.push("/admin/dashboard")}
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
                                <Button
                                    variant="outline"
                                    onClick={() => refetch()}
                                    className="gap-2"
                                    disabled={isFetching}
                                    title="Refresh"
                                >
                                    <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                                    Refresh
                                </Button>
                                <Button variant="outline" onClick={() => handleExport("visible")} className="gap-2 hidden md:flex">
                                    <Download className="h-4 w-4" />
                                    Export Visible
                                </Button>
                                <Button variant="outline" onClick={() => handleExport("all")} className="gap-2 hidden md:flex">
                                    <Download className="h-4 w-4" />
                                    Export All
                                </Button>
                                <div className="relative">
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

                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground mb-4">
                            <span>Last updated: {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString("en-IN") : "--"}</span>
                            <span>Selected: {selectedIds.length}</span>
                        </div>

                        <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 animate-enter-delayed">
                                <p className="text-[11px] uppercase tracking-wide text-primary">Visible</p>
                                <p className="text-2xl font-bold text-foreground">{metrics.total}</p>
                            </div>
                            <div className="rounded-xl border border-border bg-card/70 px-4 py-3 animate-enter-delayed-2">
                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Featured</p>
                                <p className="text-2xl font-bold text-foreground">{metrics.featured}</p>
                            </div>
                            <div className="rounded-xl border border-border bg-card/70 px-4 py-3 animate-enter-delayed-3">
                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Low Stock</p>
                                <p className="text-2xl font-bold text-foreground">{metrics.lowStock}</p>
                            </div>
                            <div className="rounded-xl border border-border bg-card/70 px-4 py-3 animate-enter-delayed-4">
                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Out Of Stock</p>
                                <p className="text-2xl font-bold text-foreground">{metrics.outOfStock}</p>
                            </div>
                        </div>

                        <div className="mb-6 rounded-xl border border-border bg-muted/40 p-4 flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                Product Controls
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                                <div className="relative xl:col-span-2">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search name, category, description"
                                        className="pl-9"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>{category}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={stockFilter} onValueChange={(value) => setStockFilter(value as StockFilter)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Stock" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Stock</SelectItem>
                                        <SelectItem value="in">In Stock</SelectItem>
                                        <SelectItem value="low">Low Stock (&lt;10)</SelectItem>
                                        <SelectItem value="out">Out of Stock</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sort" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="name-asc">Name A-Z</SelectItem>
                                        <SelectItem value="name-desc">Name Z-A</SelectItem>
                                        <SelectItem value="price-asc">Price Low-High</SelectItem>
                                        <SelectItem value="price-desc">Price High-Low</SelectItem>
                                        <SelectItem value="stock-asc">Stock Low-High</SelectItem>
                                        <SelectItem value="stock-desc">Stock High-Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={String(limit)}
                                        onValueChange={(value) => {
                                            setLimit(parseInt(value));
                                            setPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Page size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10 / page</SelectItem>
                                            <SelectItem value="20">20 / page</SelectItem>
                                            <SelectItem value="50">50 / page</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
                                </div>

                                {selectedIds.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" onClick={() => handleExport("selected")}>Export Selected</Button>
                                        <Button variant="destructive" onClick={handleBulkDelete}>Delete Selected</Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12 text-muted-foreground">Loading products...</div>
                        ) : displayedProducts.length > 0 ? (
                            <div className="rounded-lg overflow-x-auto glass-card border border-border/40">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-border/60 hover:bg-accent/40">
                                            <TableHead className="w-[40px]">
                                                <Checkbox
                                                    checked={selectedIds.length === displayedProducts.length && displayedProducts.length > 0}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead className="text-foreground font-semibold">Image</TableHead>
                                            <TableHead className="text-foreground font-semibold">Name</TableHead>
                                            <TableHead className="text-foreground font-semibold hidden md:table-cell">Category</TableHead>
                                            <TableHead className="text-foreground font-semibold">Price</TableHead>
                                            <TableHead className="text-foreground font-semibold hidden lg:table-cell">Stock</TableHead>
                                            <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {displayedProducts.map((product, index) => (
                                            <TableRow
                                                key={product._id}
                                                className="border-b border-border/40 hover:bg-accent/30 transition-colors animate-row-enter"
                                                style={{ animationDelay: `${Math.min(index * 35, 350)}ms` }}
                                            >
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedIds.includes(product._id)}
                                                        onCheckedChange={(checked) => handleSelectOne(checked, product._id)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Image
                                                        src={product.images?.[0] || "/placeholder.svg"}
                                                        alt={product.name}
                                                        width={64}
                                                        height={64}
                                                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-foreground font-medium">
                                                    <div className="min-w-[100px] max-w-[150px] sm:max-w-none">
                                                        {product.name}
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        {product.featured && (
                                                            <Badge variant="secondary" className="text-[10px] uppercase">Featured</Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1 md:hidden">
                                                        {product.category}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-foreground hidden md:table-cell">{product.category}</TableCell>
                                                <TableCell className="text-foreground whitespace-nowrap">₹{product.price}</TableCell>
                                                <TableCell className="text-foreground hidden lg:table-cell">
                                                    {product.stock <= 0 ? (
                                                        <Badge variant="destructive" className="inline-flex items-center gap-1">
                                                            <AlertTriangle className="h-3 w-3" />
                                                            Out
                                                        </Badge>
                                                    ) : product.stock < 10 ? (
                                                        <Badge variant="secondary" className="inline-flex items-center gap-1 bg-primary/15 text-primary hover:bg-primary/15">
                                                            <AlertTriangle className="h-3 w-3" />
                                                            Low ({product.stock})
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="inline-flex items-center gap-1">
                                                            <PackageCheck className="h-3 w-3" />
                                                            {product.stock}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1 sm:gap-2">
                                                        <AdminProductForm
                                                            product={product}
                                                            triggerClassName="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground text-primary hover:text-primary min-w-[44px] min-h-[44px] h-10 w-10"
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
                                                            disabled={deleteMutation.isPending}
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 min-w-[44px] min-h-[44px]"
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
                                <p className="text-muted-foreground text-lg">No products match current filters</p>
                                <Button className="mt-4" variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {pagination && pagination.pages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/60">
                                <div className="text-sm text-muted-foreground">
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

            <style jsx>{`
                .animate-enter {
                    animation: fade-up 0.35s ease-out both;
                }

                .animate-enter-delayed {
                    animation: fade-up 0.35s ease-out 0.05s both;
                }

                .animate-enter-delayed-2 {
                    animation: fade-up 0.35s ease-out 0.1s both;
                }

                .animate-enter-delayed-3 {
                    animation: fade-up 0.35s ease-out 0.15s both;
                }

                .animate-enter-delayed-4 {
                    animation: fade-up 0.35s ease-out 0.2s both;
                }

                .animate-row-enter {
                    opacity: 0;
                    transform: translateY(6px);
                    animation: row-up 0.28s ease forwards;
                }

                @keyframes fade-up {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes row-up {
                    from {
                        opacity: 0;
                        transform: translateY(6px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminProductsContent;
