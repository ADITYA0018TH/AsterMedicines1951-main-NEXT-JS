"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Activity,
    ArrowRight,
    BarChart3,
    Bell,
    Box,
    LogOut,
    MessageSquare,
    Newspaper,
    RefreshCw,
    Settings,
    ShieldCheck,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
    products: number;
    messages: number;
    visitors: number;
    maintenanceMode: boolean;
    updatedAt: string;
}

const DEFAULT_STATS: DashboardStats = {
    products: 0,
    messages: 0,
    visitors: 0,
    maintenanceMode: false,
    updatedAt: "",
};

const AdminDashboardContent = () => {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
    const [loadingStats, setLoadingStats] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastOpenedAt, setLastOpenedAt] = useState("");

    const modules = useMemo(
        () => [
            {
                href: "/admin/products",
                title: "Manage Products",
                description: "Add, edit, or delete products. Manage inventory.",
                icon: Box,
                countLabel: `${stats.products} items`,
            },
            {
                href: "/admin/messages",
                title: "View Messages",
                description: "Read customer inquiries from the contact form.",
                icon: MessageSquare,
                countLabel: `${stats.messages} messages`,
            },
            {
                href: "/admin/visitors",
                title: "Visitor Logs",
                description: "Track website traffic and view visitor details.",
                icon: Users,
                countLabel: `${stats.visitors} visits`,
            },
            {
                href: "/admin/analytics",
                title: "Product Analytics",
                description: "View most viewed products and traffic insights.",
                icon: BarChart3,
                countLabel: "View insights",
            },
            {
                href: "/admin/settings",
                title: "Site Settings",
                description: "Manage contact info, social links, and maintenance mode.",
                icon: Settings,
                countLabel: stats.maintenanceMode ? "Maintenance On" : "Maintenance Off",
            },
            {
                href: "/admin/blog",
                title: "Blog Manager",
                description: "Write, edit, publish and manage knowledge hub articles.",
                icon: Newspaper,
                countLabel: "Manage posts",
            },
        ],
        [stats]
    );

    useEffect(() => {
        fetchStats(true);

        const now = new Date().toISOString();
        const previous = localStorage.getItem("admin_dashboard_last_open") || "";
        setLastOpenedAt(previous);
        localStorage.setItem("admin_dashboard_last_open", now);
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

            if (event.key === "1") router.push("/admin/products");
            if (event.key === "2") router.push("/admin/messages");
            if (event.key === "3") router.push("/admin/visitors");
            if (event.key === "4") router.push("/admin/settings");
            if (event.key.toLowerCase() === "r") fetchStats(false);
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [router]);

    const getCollectionTotal = (payload: any, collectionKey: string) => {
        if (typeof payload?.pagination?.total === "number") return payload.pagination.total;
        if (Array.isArray(payload?.[collectionKey])) return payload[collectionKey].length;
        if (Array.isArray(payload)) return payload.length;
        return 0;
    };

    const fetchStats = async (initial = false) => {
        if (initial) {
            setLoadingStats(true);
        } else {
            setIsRefreshing(true);
        }

        try {
            const [productsRes, messagesRes, visitorsRes, settingsRes] = await Promise.allSettled([
                fetch("/api/products?page=1&limit=1"),
                fetch("/api/contact?page=1&limit=1"),
                fetch("/api/admin/visitors?page=1&limit=1&excludeBots=true"),
                fetch("/api/settings"),
            ]);

            const productsJson =
                productsRes.status === "fulfilled" && productsRes.value.ok
                    ? await productsRes.value.json()
                    : null;

            const messagesJson =
                messagesRes.status === "fulfilled" && messagesRes.value.ok
                    ? await messagesRes.value.json()
                    : null;

            const visitorsJson =
                visitorsRes.status === "fulfilled" && visitorsRes.value.ok
                    ? await visitorsRes.value.json()
                    : null;

            const settingsJson =
                settingsRes.status === "fulfilled" && settingsRes.value.ok
                    ? await settingsRes.value.json()
                    : null;

            setStats({
                products: getCollectionTotal(productsJson, "products"),
                messages: getCollectionTotal(messagesJson, "messages"),
                visitors: getCollectionTotal(visitorsJson, "visitors"),
                maintenanceMode: Boolean(settingsJson?.maintenanceMode),
                updatedAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load dashboard stats");
        } finally {
            setLoadingStats(false);
            setIsRefreshing(false);
        }
    };

    const handleLogout = () => {
        document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        localStorage.removeItem("isAuthenticated");
        toast.success("Logged out successfully");
        router.push("/7061452180");
    };

    return (
        <div
            className="min-h-screen flex flex-col bg-background"
        >

            <Navbar />

            <main id="main-content" className="flex-grow pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="glass-card p-8 hover:scale-[1.001] transition-all duration-500 animate-enter">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                            <h1 className="text-3xl font-display font-bold text-foreground">
                                Admin <span className="text-pulse-500">Dashboard</span>
                            </h1>

                            <div className="flex flex-wrap items-center gap-2">
                                <Button variant="outline" onClick={() => fetchStats(false)} disabled={isRefreshing || loadingStats} className="gap-2">
                                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                                    Refresh Stats
                                </Button>
                                <Button variant="destructive" onClick={handleLogout} className="gap-2">
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        </div>

                        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                            <p>Welcome to the admin panel. Choose an option below to get started.</p>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-card">
                                    Last update: {stats.updatedAt ? new Date(stats.updatedAt).toLocaleTimeString("en-IN") : "--"}
                                </Badge>
                                <Badge variant={stats.maintenanceMode ? "destructive" : "secondary"}>
                                    {stats.maintenanceMode ? "Maintenance On" : "Maintenance Off"}
                                </Badge>
                            </div>
                        </div>

                        <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 animate-enter-delayed">
                                <p className="text-[11px] uppercase tracking-wide text-primary">Products</p>
                                <p className="text-2xl font-bold text-foreground">{loadingStats ? "--" : stats.products}</p>
                            </div>
                            <div className="rounded-xl border border-border bg-card/70 px-4 py-3 animate-enter-delayed-2">
                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Messages</p>
                                <p className="text-2xl font-bold text-foreground">{loadingStats ? "--" : stats.messages}</p>
                            </div>
                            <div className="rounded-xl border border-border bg-card/70 px-4 py-3 animate-enter-delayed-3">
                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Visitors</p>
                                <p className="text-2xl font-bold text-foreground">{loadingStats ? "--" : stats.visitors}</p>
                            </div>
                            <div className="rounded-xl border border-border bg-card/70 px-4 py-3 animate-enter-delayed-4">
                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Security</p>
                                <p className="text-sm font-semibold text-foreground mt-1 inline-flex items-center gap-1">
                                    <ShieldCheck className="h-4 w-4" />
                                    Auth Active
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 rounded-xl border border-border bg-muted/40 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Activity className="h-4 w-4" />
                                <span>
                                    Previous visit: {lastOpenedAt ? new Date(lastOpenedAt).toLocaleString("en-IN") : "First session"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Bell className="h-4 w-4" />
                                <span>Shortcuts: 1 Products, 2 Messages, 3 Visitors, 4 Settings, R Refresh</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {modules.map((module, index) => {
                                const Icon = module.icon;
                                return (
                                    <Link key={module.href} href={module.href}>
                                        <div
                                            className="glass-card p-8 hover:scale-[1.02] transition-all duration-300 cursor-pointer group h-full border border-border/50 animate-row-enter"
                                            style={{ animationDelay: `${Math.min(index * 70, 280)}ms` }}
                                        >
                                            <div className="flex flex-col items-center text-center space-y-4 h-full">
                                                <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="h-10 w-10 text-primary" />
                                                </div>
                                                <h2 className="text-xl font-bold text-foreground">{module.title}</h2>
                                                <Badge variant="outline" className="text-xs bg-card text-muted-foreground">
                                                    {module.countLabel}
                                                </Badge>
                                                <p className="text-muted-foreground text-sm">{module.description}</p>
                                                <div className="button-primary mt-auto inline-flex items-center gap-2">
                                                    Open
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
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

export default AdminDashboardContent;
