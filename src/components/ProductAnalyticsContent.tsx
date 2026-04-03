"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowUpRight,
    BarChart3,
    Eye,
    Loader2,
    Monitor,
    RefreshCw,
    Smartphone,
    Tablet,
    TrendingUp,
    Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ProductViewStats {
    _id: string;
    productName: string;
    productSlug: string;
    category: string;
    views: number;
    uniqueVisitors: number;
    lastViewed: string;
}

interface AnalyticsData {
    mostViewed: ProductViewStats[];
    totalViews: number;
    byCategory: Array<{ _id: string; views: number }>;
    byDevice: Array<{ _id: string; views: number }>;
    dailyViews: Array<{ _id: string; views: number }>;
    period: string;
}

const ProductAnalyticsContent = () => {
    const router = useRouter();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState("7d");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAnalytics = async (selectedPeriod: string = period) => {
        try {
            const response = await fetch(`/api/analytics/product-views?period=${selectedPeriod}&limit=10`);
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const handlePeriodChange = (value: string) => {
        setPeriod(value);
        setIsLoading(true);
        fetchAnalytics(value);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchAnalytics();
    };

    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType) {
            case "mobile":
                return <Smartphone className="w-4 h-4" />;
            case "tablet":
                return <Tablet className="w-4 h-4" />;
            default:
                return <Monitor className="w-4 h-4" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const maxDailyViews = data?.dailyViews?.length
        ? Math.max(...data.dailyViews.map((d) => d.views))
        : 0;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="pt-24 lg:pt-32 pb-20">
                <div className="container mx-auto px-4 lg:px-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <Link href="/admin">
                                <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <BarChart3 className="w-8 h-8 text-brand-accent" />
                                Product Analytics
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Track which products get the most views
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Select value={period} onValueChange={handlePeriodChange}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="24h">Last 24 hours</SelectItem>
                                    <SelectItem value="7d">Last 7 days</SelectItem>
                                    <SelectItem value="30d">Last 30 days</SelectItem>
                                    <SelectItem value="90d">Last 90 days</SelectItem>
                                    <SelectItem value="all">All time</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                            >
                                <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="h-96 flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 text-brand-accent animate-spin mb-4" />
                            <p className="text-sm text-muted-foreground">Loading analytics...</p>
                        </div>
                    ) : data ? (
                        <div className="space-y-8">
                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-card border border-border rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-muted-foreground">Total Views</span>
                                        <Eye className="w-5 h-5 text-brand-accent" />
                                    </div>
                                    <p className="text-3xl font-bold">{data.totalViews.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        in selected period
                                    </p>
                                </div>

                                <div className="bg-card border border-border rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-muted-foreground">Products Viewed</span>
                                        <Package className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <p className="text-3xl font-bold">{data.mostViewed.length}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        unique products
                                    </p>
                                </div>

                                <div className="bg-card border border-border rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-muted-foreground">Categories</span>
                                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <p className="text-3xl font-bold">{data.byCategory.length}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        with traffic
                                    </p>
                                </div>
                            </div>

                            {/* Daily Views Chart */}
                            {data.dailyViews.length > 0 && (
                                <div className="bg-card border border-border rounded-2xl p-6">
                                    <h2 className="text-lg font-semibold mb-4">Views Over Time (Last 7 Days)</h2>
                                    <div className="flex items-end gap-2 h-40">
                                        {data.dailyViews.map((day, index) => (
                                            <div
                                                key={day._id}
                                                className="flex-1 flex flex-col items-center gap-2"
                                            >
                                                <div
                                                    className="w-full bg-brand-accent/20 hover:bg-brand-accent/30 transition-colors rounded-t-lg relative group"
                                                    style={{
                                                        height: `${maxDailyViews > 0 ? (day.views / maxDailyViews) * 100 : 0}%`,
                                                        minHeight: "4px",
                                                    }}
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        {day.views} views
                                                    </div>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(day._id).toLocaleDateString("en-US", { weekday: "short" })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Most Viewed Products */}
                                <div className="bg-card border border-border rounded-2xl p-6">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-brand-accent" />
                                        Most Viewed Products
                                    </h2>
                                    {data.mostViewed.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Eye className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                            <p>No product views recorded yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {data.mostViewed.map((product, index) => (
                                                <div
                                                    key={product._id}
                                                    className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                                                >
                                                    <span className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                                                        index === 0 && "bg-yellow-500/20 text-yellow-600",
                                                        index === 1 && "bg-slate-400/20 text-slate-500",
                                                        index === 2 && "bg-amber-600/20 text-amber-600",
                                                        index > 2 && "bg-secondary text-muted-foreground"
                                                    )}>
                                                        {index + 1}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium truncate group-hover:text-brand-accent transition-colors">
                                                            {product.productName}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {product.category}
                                                        </p>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="font-semibold text-brand-accent">
                                                            {product.views.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {product.uniqueVisitors} unique
                                                        </p>
                                                    </div>
                                                    <Link href={`/products/${product.productSlug}`}>
                                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <ArrowUpRight className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Views by Category & Device */}
                                <div className="space-y-6">
                                    {/* By Category */}
                                    <div className="bg-card border border-border rounded-2xl p-6">
                                        <h2 className="text-lg font-semibold mb-4">Views by Category</h2>
                                        {data.byCategory.length === 0 ? (
                                            <p className="text-muted-foreground text-sm">No data available</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {data.byCategory.slice(0, 5).map((cat) => (
                                                    <div key={cat._id} className="flex items-center gap-3">
                                                        <div className="flex-1">
                                                            <div className="flex justify-between text-sm mb-1">
                                                                <span>{cat._id}</span>
                                                                <span className="text-muted-foreground">{cat.views}</span>
                                                            </div>
                                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-brand-accent rounded-full transition-all"
                                                                    style={{
                                                                        width: `${data.totalViews > 0 ? (cat.views / data.totalViews) * 100 : 0}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* By Device */}
                                    <div className="bg-card border border-border rounded-2xl p-6">
                                        <h2 className="text-lg font-semibold mb-4">Views by Device</h2>
                                        {data.byDevice.length === 0 ? (
                                            <p className="text-muted-foreground text-sm">No data available</p>
                                        ) : (
                                            <div className="flex gap-4">
                                                {data.byDevice.map((device) => (
                                                    <div
                                                        key={device._id}
                                                        className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30"
                                                    >
                                                        {getDeviceIcon(device._id)}
                                                        <span className="text-sm capitalize">{device._id || "Unknown"}</span>
                                                        <Badge variant="secondary">{device.views}</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 text-muted-foreground">
                            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p>Failed to load analytics data</p>
                            <Button variant="outline" className="mt-4" onClick={handleRefresh}>
                                Try Again
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductAnalyticsContent;
