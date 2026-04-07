"use client";

import { Fragment, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    ArrowLeft,
    Bot,
    ChevronDown,
    ChevronUp,
    Clock,
    Download,
    Globe,
    Laptop,
    MapPin,
    Monitor,
    RefreshCw,
    Search,
    SlidersHorizontal,
    Smartphone,
    Sparkles,
    Trash2,
    ArrowUpDown,
    Check,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import StatsCards from "@/components/StatsCards";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import VisitorMap from "@/components/VisitorMap";


interface Visitor {
    _id: string;
    ip: string;
    userAgent: string;
    path: string;
    visitedAt: string;
    createdAt: string;
    location?: {
        city?: string;
        country?: string;
        region?: string;
    };
    coordinates?: {
        lat: number;
        lon: number;
    };
    referrer?: string;
    isp?: string;
    screenResolution?: string;
    language?: string;
    device?: string;
    browser?: {
        name: string;
        version: string;
    };
    os?: {
        name: string;
        version: string;
    };
    deviceType?: string;
    timeSpent?: number;
    isBot?: boolean;
}

interface Stats {
    total: number;
    today: number;
    topCountry: string;
    topPage: string;
    avgTime?: number;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

type SortBy = "recent" | "oldest" | "duration";
type QuickFilter = "all" | "mobile" | "desktop" | "bot" | "location";

const VisitorsContent = () => {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [chartsData, setChartsData] = useState<any>(null);

    // Filter States
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [excludeBots, setExcludeBots] = useState(true);
    const [liveMode, setLiveMode] = useState(false);
    const [isExcluded, setIsExcluded] = useState(false);
    const [sortBy, setSortBy] = useState<SortBy>("recent");
    const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    const [lastUpdated, setLastUpdated] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsExcluded(localStorage.getItem("exclude_me") === "true");
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 350);

        return () => clearTimeout(timeout);
    }, [search]);

    const toggleExcludeMe = () => {
        const newState = !isExcluded;
        setIsExcluded(newState);
        if (newState) {
            localStorage.setItem("exclude_me", "true");
        } else {
            localStorage.removeItem("exclude_me");
        }
    };

    const fetchVisitors = async (page = 1, silent = false) => {
        if (!silent && !liveMode) setLoading(true);
        setIsRefreshing(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "20",
                search: debouncedSearch,
                excludeBots: excludeBots.toString(),
            });

            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);

            const res = await fetch(`/api/admin/visitors?${params.toString()}`);
            const data = await res.json();

            if (data.visitors) {
                setVisitors(data.visitors);
                setPagination(data.pagination);
                setStats(data.stats);
                setChartsData(data.charts);
                setLastUpdated(new Date().toISOString());
            }
        } catch (error) {
            console.error("Failed to fetch visitors", error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchVisitors(1);
    }, [debouncedSearch, startDate, endDate, excludeBots]);

    // Live Mode Logic
    useEffect(() => {
        if (liveMode) {
            intervalRef.current = setInterval(() => {
                fetchVisitors(pagination?.page || 1, true);
            }, 5000); // Poll every 5 seconds
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [liveMode, pagination?.page, debouncedSearch, startDate, endDate, excludeBots]);

    const toggleRowDetails = (id: string) => {
        setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const resetFilters = () => {
        setSearch("");
        setStartDate("");
        setEndDate("");
        setExcludeBots(true);
        setQuickFilter("all");
        setSortBy("recent");
    };

    const processedVisitors = useMemo(() => {
        let list = [...visitors];

        if (quickFilter === "mobile") {
            list = list.filter((v) => {
                const deviceText = `${v.device || ""} ${v.deviceType || ""} ${v.userAgent || ""}`.toLowerCase();
                return deviceText.includes("mobile") || deviceText.includes("android") || deviceText.includes("iphone");
            });
        }

        if (quickFilter === "desktop") {
            list = list.filter((v) => {
                const deviceText = `${v.device || ""} ${v.deviceType || ""} ${v.userAgent || ""}`.toLowerCase();
                const isMobile = deviceText.includes("mobile") || deviceText.includes("android") || deviceText.includes("iphone");
                return !isMobile && !v.isBot;
            });
        }

        if (quickFilter === "bot") {
            list = list.filter((v) => !!v.isBot);
        }

        if (quickFilter === "location") {
            list = list.filter((v) => !!v.location?.country);
        }

        if (sortBy === "recent") {
            list.sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime());
        }

        if (sortBy === "oldest") {
            list.sort((a, b) => new Date(a.visitedAt).getTime() - new Date(b.visitedAt).getTime());
        }

        if (sortBy === "duration") {
            list.sort((a, b) => (b.timeSpent || 0) - (a.timeSpent || 0));
        }

        return list;
    }, [visitors, quickFilter, sortBy]);

    const overview = useMemo(() => {
        const visibleCount = processedVisitors.length;
        const countryCount = new Set(
            processedVisitors
                .map((v) => v.location?.country)
                .filter((country): country is string => Boolean(country))
        ).size;

        const botCount = processedVisitors.filter((v) => v.isBot).length;
        const botRate = visibleCount > 0 ? Math.round((botCount / visibleCount) * 100) : 0;

        const durations = processedVisitors
            .map((v) => v.timeSpent)
            .filter((time): time is number => typeof time === "number" && time > 0);
        const avgDuration = durations.length
            ? Math.round(durations.reduce((total, value) => total + value, 0) / durations.length)
            : 0;

        return {
            visibleCount,
            countryCount,
            botRate,
            avgDuration,
        };
    }, [processedVisitors]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this log?")) return;

        try {
            const res = await fetch(`/api/admin/visitors?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setVisitors((prev) => prev.filter((v) => v._id !== id));
                setPagination((prev) => prev ? { ...prev, total: prev.total - 1 } : null);
            }
        } catch (error) {
            console.error("Failed to delete visitor", error);
        }
    };

    const handleClearAll = async () => {
        if (!confirm("Are you sure you want to delete ALL visitor logs? This cannot be undone.")) return;

        try {
            const res = await fetch(`/api/admin/visitors?all=true`, {
                method: "DELETE",
            });
            if (res.ok) {
                setVisitors([]);
                setPagination(null);
                setStats(null);
                fetchVisitors(1, true);
            }
        } catch (error) {
            console.error("Failed to clear logs", error);
        }
    };

    const exportToCSV = () => {
        if (processedVisitors.length === 0) return;

        const headers = [
            "IP",
            "Bot",
            "Country",
            "Region",
            "City",
            "Path",
            "Visited At",
            "Browser",
            "OS",
            "Device",
            "Language",
            "Referrer",
            "Time Spent (s)",
        ];
        const csvContent = [
            headers.join(","),
            ...processedVisitors.map((v) =>
                [
                    v.ip,
                    v.isBot ? "Yes" : "No",
                    v.location?.country || "-",
                    v.location?.region || "-",
                    v.location?.city || "-",
                    v.path,
                    new Date(v.visitedAt).toISOString(),
                    v.browser?.name || "-",
                    v.os?.name || "-",
                    v.device || "-",
                    v.language || "-",
                    v.referrer || "Direct",
                    v.timeSpent || 0,
                ]
                    .map((field) => `"${field}"`)
                    .join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `visitor_logs_filtered_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatUserAgent = (ua: string) => {
        if (!ua) return "Unknown";
        if (ua.includes("Mobile")) return "Mobile Device";
        if (ua.includes("Macintosh")) return "Mac OS";
        if (ua.includes("Windows")) return "Windows";
        if (ua.includes("Linux")) return "Linux";
        return "Desktop";
    };

    const formatTimeSpent = (seconds?: number) => {
        if (!seconds) return "0s";
        if (seconds < 60) return `${Math.floor(seconds)}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}m ${remainingSeconds}s`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const quickFilterButtons: { id: QuickFilter; label: string; icon: ReactNode }[] = [
        { id: "all", label: "All", icon: <Sparkles className="h-3.5 w-3.5" /> },
        { id: "mobile", label: "Mobile", icon: <Smartphone className="h-3.5 w-3.5" /> },
        { id: "desktop", label: "Desktop", icon: <Laptop className="h-3.5 w-3.5" /> },
        { id: "bot", label: "Bots", icon: <Bot className="h-3.5 w-3.5" /> },
        { id: "location", label: "Located", icon: <MapPin className="h-3.5 w-3.5" /> },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="relative flex-grow overflow-hidden pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-32 -left-16 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl animate-float-slow" />
                    <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-pink-200/30 blur-3xl animate-float-slower" />
                </div>

                <div className="container relative z-10 mx-auto max-w-7xl">
                    <div className="glass-card p-6 sm:p-8 animate-enter">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                            <div className="flex items-center gap-4">
                                <Link href="/admin/dashboard" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                                </Link>
                                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                                    Visitor <span className="text-pulse-500">Analytics</span>
                                </h1>
                            </div>
                            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                                <div className="text-sm text-gray-500 dark:text-gray-400 font-mono rounded-lg bg-gray-100/80 dark:bg-gray-800/70 px-3 py-1.5">
                                    Visible: {processedVisitors.length}
                                </div>
                                <button
                                    onClick={() => fetchVisitors(pagination?.page || 1, true)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/70 text-gray-700 hover:bg-white rounded-lg transition-colors border border-gray-200 dark:bg-gray-900/70 dark:text-gray-200 dark:border-gray-700"
                                >
                                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                                    Refresh
                                </button>
                                <button
                                    onClick={() => setLiveMode(!liveMode)}
                                    className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors border ${liveMode ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                                >
                                    <ActivityIcon className={`h-4 w-4 ${liveMode ? 'animate-pulse' : ''}`} />
                                    {liveMode ? 'Live' : 'Go Live'}
                                </button>
                                <button
                                    onClick={toggleExcludeMe}
                                    className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors border ${isExcluded ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                                >
                                    <Monitor className="h-4 w-4" />
                                    {isExcluded ? 'Ignoring Me' : 'Exclude Me'}
                                </button>
                                <button
                                    onClick={exportToCSV}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                                >
                                    <Download className="h-4 w-4" />
                                    Export
                                </button>
                                {processedVisitors.length > 0 && (
                                    <button
                                        onClick={handleClearAll}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="mb-8 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>
                                Last updated: {lastUpdated ? formatDate(lastUpdated) : "--"}
                            </span>
                            <span>
                                Server total: {pagination?.total || 0} entries
                            </span>
                        </div>

                        {/* Filters */}
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-white/30 dark:border-white/5">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search IP, City, Path..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-pulse-500"
                                />
                            </div>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-pulse-500"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-pulse-500"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="excludeBots"
                                    checked={excludeBots}
                                    onChange={(e) => setExcludeBots(e.target.checked)}
                                    className="rounded border-gray-300 text-pulse-500 focus:ring-pulse-500"
                                />
                                <label htmlFor="excludeBots" className="text-sm text-gray-600 dark:text-gray-300 select-none cursor-pointer">
                                    Exclude Bots
                                </label>
                            </div>
                        </div>

                        <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="rounded-xl border border-cyan-200/60 bg-cyan-50/70 px-4 py-3 animate-enter-delayed dark:border-cyan-900/40 dark:bg-cyan-950/30">
                                <p className="text-[11px] uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Visible Logs</p>
                                <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">{overview.visibleCount}</p>
                            </div>
                            <div className="rounded-xl border border-indigo-200/60 bg-indigo-50/70 px-4 py-3 animate-enter-delayed-2 dark:border-indigo-900/40 dark:bg-indigo-950/30">
                                <p className="text-[11px] uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Countries</p>
                                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{overview.countryCount}</p>
                            </div>
                            <div className="rounded-xl border border-rose-200/60 bg-rose-50/70 px-4 py-3 animate-enter-delayed-3 dark:border-rose-900/40 dark:bg-rose-950/30">
                                <p className="text-[11px] uppercase tracking-wide text-rose-700 dark:text-rose-300">Bot Rate</p>
                                <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">{overview.botRate}%</p>
                            </div>
                            <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/70 px-4 py-3 animate-enter-delayed-4 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                                <p className="text-[11px] uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Avg Duration</p>
                                <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{formatTimeSpent(overview.avgDuration)}</p>
                            </div>
                        </div>

                        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 px-4 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    Quick Filters
                                </div>
                                {quickFilterButtons.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setQuickFilter(option.id)}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all ${
                                            quickFilter === option.id
                                                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        {option.icon}
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                                        <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                                        {sortBy === "recent" ? "Most Recent" : sortBy === "oldest" ? "Oldest First" : "Longest Duration"}
                                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {(["recent", "oldest", "duration"] as const).map((option) => (
                                            <DropdownMenuItem
                                                key={option}
                                                onClick={() => setSortBy(option)}
                                                className="flex items-center justify-between gap-6 cursor-pointer"
                                            >
                                                <span>{option === "recent" ? "Most Recent" : option === "oldest" ? "Oldest First" : "Longest Duration"}</span>
                                                {sortBy === option && <Check className="w-3.5 h-3.5 text-brand-accent" />}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <button
                                    onClick={resetFilters}
                                    className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        {loading && !liveMode ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pulse-500"></div>
                            </div>
                        ) : (
                            <>
                                <StatsCards stats={stats} />

                                {chartsData && (
                                    <>
                                        <AnalyticsCharts data={chartsData} />
                                        {/* Map - Only show if we have location data */}
                                        {/* Simplified map data prep for demo */}
                                        {processedVisitors.some(v => v.location) && (
                                            <VisitorMap locations={processedVisitors
                                                .filter(v => v.location && v.location.city && !v.isBot)
                                                .map(v => ({
                                                    city: v.location!.city!,
                                                    country: v.location!.country!,
                                                    lat: v.coordinates?.lat || 0,
                                                    lon: v.coordinates?.lon || 0,
                                                    count: 1
                                                }))}
                                            />
                                        )}
                                    </>
                                )}

                                <div className="overflow-x-auto rounded-xl border border-gray-200/70 dark:border-gray-800">
                                    <table className="w-full text-left border-collapse bg-white/80 dark:bg-gray-900/60">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                                <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Time</th>
                                                <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">IP / ISP</th>
                                                <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Location</th>
                                                <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Page / Duration</th>
                                                <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Device</th>
                                                <th className="p-4 font-semibold text-gray-700 dark:text-gray-200 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                            {processedVisitors.map((visitor, index) => (
                                                <Fragment key={visitor._id}>
                                                    <tr
                                                        className={`animate-row-enter hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all ${visitor.isBot ? "opacity-60 bg-gray-50/50" : ""}`}
                                                        style={{ animationDelay: `${Math.min(index * 35, 450)}ms` }}
                                                    >
                                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-gray-400" />
                                                                {formatDate(visitor.visitedAt)}
                                                            </div>
                                                            {visitor.isBot && <span className="text-[10px] bg-gray-200 text-gray-600 px-1 rounded ml-6">BOT</span>}
                                                        </td>
                                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300 font-mono">
                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin className="h-4 w-4 text-gray-400" />
                                                                    {visitor.ip}
                                                                </div>
                                                                {visitor.isp && (
                                                                    <div className="text-xs text-gray-500 pl-6">
                                                                        {visitor.isp}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                                                            {visitor.location ? (
                                                                <span>{visitor.location.city}, {visitor.location.country}</span>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-2">
                                                                    <Globe className="h-4 w-4 text-gray-400" />
                                                                    <span className="font-medium truncate max-w-[150px]" title={visitor.path}>{visitor.path}</span>
                                                                </div>
                                                                {visitor.timeSpent !== undefined && (
                                                                    <div className="text-xs text-gray-500 pl-6">
                                                                        Duration: {formatTimeSpent(visitor.timeSpent)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-2">
                                                                    <Laptop className="h-4 w-4 text-gray-400" />
                                                                    <span title={visitor.userAgent} className="font-medium text-gray-900 dark:text-gray-100">
                                                                        {visitor.device || formatUserAgent(visitor.userAgent)}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-gray-400 pl-6 mt-1 flex flex-wrap gap-2">
                                                                    {visitor.browser?.name && (
                                                                        <span title={`${visitor.browser.name} ${visitor.browser.version}`} className="bg-blue-50 text-blue-600 px-1.5 rounded">
                                                                            {visitor.browser.name}
                                                                        </span>
                                                                    )}
                                                                    {visitor.os?.name && (
                                                                        <span title={`${visitor.os.name} ${visitor.os.version}`} className="bg-green-50 text-green-600 px-1.5 rounded">
                                                                            {visitor.os.name}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-sm text-right">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <button
                                                                    onClick={() => toggleRowDetails(visitor._id)}
                                                                    className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                                                    title={expandedRows[visitor._id] ? "Hide Details" : "Show Details"}
                                                                >
                                                                    {expandedRows[visitor._id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(visitor._id)}
                                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                                    title="Delete Log"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    {expandedRows[visitor._id] && (
                                                        <tr className="bg-gray-50/70 dark:bg-gray-800/30 animate-expand-row">
                                                            <td colSpan={6} className="px-4 pb-4">
                                                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                                                                    <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-2.5">
                                                                        <p className="text-gray-400">Referrer</p>
                                                                        <p className="text-gray-700 dark:text-gray-200 truncate" title={visitor.referrer || "Direct"}>{visitor.referrer || "Direct"}</p>
                                                                    </div>
                                                                    <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-2.5">
                                                                        <p className="text-gray-400">Language</p>
                                                                        <p className="text-gray-700 dark:text-gray-200">{visitor.language || "-"}</p>
                                                                    </div>
                                                                    <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-2.5">
                                                                        <p className="text-gray-400">Screen</p>
                                                                        <p className="text-gray-700 dark:text-gray-200">{visitor.screenResolution || "-"}</p>
                                                                    </div>
                                                                    <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-2.5">
                                                                        <p className="text-gray-400">User Agent</p>
                                                                        <p className="text-gray-700 dark:text-gray-200 truncate" title={visitor.userAgent}>{visitor.userAgent || "-"}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Fragment>
                                            ))}
                                            {processedVisitors.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <p>No visits match current filters.</p>
                                                            <button
                                                                onClick={resetFilters}
                                                                className="text-xs rounded-lg border border-gray-300 px-2.5 py-1.5 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                                                            >
                                                                Reset Filters
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {/* Pagination Controls */}
                        {pagination && pagination.pages > 1 && (
                            <div className="flex justify-center mt-8 gap-2">
                                <button
                                    onClick={() => fetchVisitors(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-800 rounded-3xl disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => fetchVisitors(pagination.page + 1)}
                                    disabled={pagination.page === pagination.pages}
                                    className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-800 rounded-3xl disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main >

            <Footer />

            <style jsx>{`
                .animate-enter {
                    animation: fade-in-up 0.45s ease-out both;
                }

                .animate-enter-delayed {
                    animation: fade-in-up 0.45s ease-out 0.06s both;
                }

                .animate-enter-delayed-2 {
                    animation: fade-in-up 0.45s ease-out 0.12s both;
                }

                .animate-enter-delayed-3 {
                    animation: fade-in-up 0.45s ease-out 0.18s both;
                }

                .animate-enter-delayed-4 {
                    animation: fade-in-up 0.45s ease-out 0.24s both;
                }

                .animate-row-enter {
                    opacity: 0;
                    transform: translateY(8px);
                    animation: row-reveal 0.35s ease forwards;
                }

                .animate-expand-row {
                    animation: fade-in-up 0.25s ease-out both;
                }

                .animate-float-slow {
                    animation: drift 9s ease-in-out infinite;
                }

                .animate-float-slower {
                    animation: drift 12s ease-in-out infinite reverse;
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes row-reveal {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes drift {
                    0%,
                    100% {
                        transform: translate3d(0, 0, 0);
                    }
                    50% {
                        transform: translate3d(0, -14px, 0);
                    }
                }
            `}</style>
        </div >
    );
};

const ActivityIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className={className}
    >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

export default VisitorsContent;
