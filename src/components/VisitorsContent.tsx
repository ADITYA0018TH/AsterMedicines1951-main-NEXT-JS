"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Clock, Globe, Laptop, MapPin, Monitor, Trash2 } from "lucide-react";
import Link from "next/link";
import StatsCards from "@/components/StatsCards";

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

const VisitorsContent = () => {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchVisitors = async (page = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/visitors?page=${page}&limit=20`);
            const data = await res.json();
            if (data.visitors) {
                setVisitors(data.visitors);
                setPagination(data.pagination);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Failed to fetch visitors", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this log?")) return;

        try {
            const res = await fetch(`/api/admin/visitors?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setVisitors((prev) => prev.filter((v) => v._id !== id));
                // Update pagination total count roughly
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
                setStats(null); // Or reset stats to zero
                fetchVisitors(1); // Refresh to be sure
            }
        } catch (error) {
            console.error("Failed to clear logs", error);
        }
    };

    const formatUserAgent = (ua: string) => {
        if (!ua) return "Unknown";
        if (ua.includes("Mobile")) return "Mobile Device";
        if (ua.includes("Macintosh")) return "Mac OS";
        if (ua.includes("Windows")) return "Windows";
        if (ua.includes("Linux")) return "Linux";
        return "Desktop"; // Simplified
    };

    const formatTimeSpent = (seconds?: number) => {
        if (!seconds) return "0s";
        if (seconds < 60) return `${Math.floor(seconds)}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}m ${remainingSeconds}s`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="glass-card p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <Link href="/admin/dashboard" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                                </Link>
                                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                                    Visitor <span className="text-pulse-500">Logs</span>
                                </h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Total Visits: {pagination?.total || 0}
                                </div>
                                {visitors.length > 0 && (
                                    <button
                                        onClick={handleClearAll}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Clear History
                                    </button>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pulse-500"></div>
                            </div>
                        ) : (
                            <>
                                <StatsCards stats={stats} />

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                                <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Time</th>
                                                <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">IP / ISP</th>
                                                <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Location</th>
                                                <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Page / Duration</th>
                                                <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Source</th>
                                                <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Device</th>
                                                <th className="p-4 font-semibold text-gray-700 dark:text-gray-200 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                            {visitors.map((visitor) => (
                                                <tr key={visitor._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-gray-400" />
                                                            {formatDate(visitor.visitedAt)}
                                                        </div>
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
                                                        <div className="truncate max-w-[150px]" title={visitor.referrer || 'Direct'}>
                                                            {visitor.referrer ? visitor.referrer.replace('https://', '').replace('http://', '').split('/')[0] : 'Direct'}
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
                                                                {visitor.screenResolution && (
                                                                    <span className="inline-flex items-center gap-1" title="Screen Resolution">
                                                                        <Monitor className="h-3 w-3" />
                                                                        {visitor.screenResolution}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-sm text-right">
                                                        <button
                                                            onClick={() => handleDelete(visitor._id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                            title="Delete Log"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {visitors.length === 0 && (
                                                <tr>
                                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                                        No visits recorded yet.
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
            </main>

            <Footer />
        </div>
    );
};

export default VisitorsContent;
