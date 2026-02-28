"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Download, Trash2, ArrowLeft } from "lucide-react";
import XLSX from "xlsx-js-style";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Filter, MoreVertical, Mail, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";


interface ContactMessage {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    subject: string;
    message: string;
    status: 'New' | 'Read' | 'Replied';
    createdAt: string;
}

interface MessagesResponse {
    messages: ContactMessage[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

const AdminMessagesContent = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

    const { data: responseData, isLoading, error } = useQuery({
        queryKey: ["admin-messages", page, limit, search, statusFilter],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search,
                status: statusFilter,
            });
            const response = await fetch(`/api/contact?${params}`);
            if (!response.ok) {
                throw new Error("Failed to fetch messages");
            }
            return response.json() as Promise<MessagesResponse>;
        },
    });

    const messages = responseData?.messages || [];
    const pagination = responseData?.pagination;

    // Reset page when search or filter changes
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        setPage(1);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(messages.map((msg) => msg._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (checked: boolean, id: string) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((prevId) => prevId !== id));
        }
    };

    const handleBulkAction = async (action: 'delete' | 'markAsRead') => {
        if (selectedIds.length === 0) return;
        if (action === 'delete' && !window.confirm(`Are you sure you want to delete ${selectedIds.length} messages?`)) return;

        setIsBulkActionLoading(true);
        try {
            const endpoint = action === 'delete' || action === 'markAsRead' ? '/api/contact/bulk' : '';

            const body: { ids: string[]; action?: string; status?: string } = { ids: selectedIds };
            if (action === 'delete') body.action = 'delete';
            if (action === 'markAsRead') {
                body.action = 'updateStatus';
                body.status = 'Read';
            }

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error("Failed to perform bulk action");

            toast.success(`Messages ${action === 'delete' ? 'deleted' : 'updated'} successfully`);
            setSelectedIds([]);
            queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
        } catch (error) {
            console.error("Bulk action failed:", error);
            toast.error("Failed to perform action");
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const response = await fetch(`/api/contact`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            if (!response.ok) throw new Error("Failed to update status");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
            toast.success("Status updated");
        },
        onError: () => toast.error("Failed to update status"),
    });

    const handleReply = (email: string, subject: string, id: string) => {
        // Mark as replied logic could go here updating backend first
        updateStatus.mutate({ id, status: 'Replied' });
        window.location.href = `mailto:${email}?subject=Re: ${subject}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="glass-card p-8">
                        <p className="text-gray-900 dark:text-gray-100">Loading messages...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="glass-card p-8">
                        <p className="text-red-600 dark:text-red-400">Error loading messages</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const handleExport = () => {
        if (messages.length === 0) return;

        const data = messages.map((msg) => ({
            Date: format(new Date(msg.createdAt), "yyyy-MM-dd HH:mm:ss"),
            "First Name": msg.firstName,
            "Last Name": msg.lastName,
            Email: msg.email,
            "Mobile Number": msg.mobileNumber,
            Subject: msg.subject,
            Message: msg.message,
            Status: msg.status || 'New',
        }));

        const ws = XLSX.utils.json_to_sheet(data);

        // Apply bold style to header row
        const range = XLSX.utils.decode_range(ws['!ref'] || "A1:G1");
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!ws[address]) continue;
            ws[address].s = {
                font: {
                    bold: true,
                },
            };
        }

        // Set column widths
        const colWidths = [
            { wch: 20 }, // Date
            { wch: 15 }, // First Name
            { wch: 15 }, // Last Name
            { wch: 25 }, // Email
            { wch: 15 }, // Mobile Number
            { wch: 20 }, // Subject
            { wch: 50 }, // Message
        ];
        ws["!cols"] = colWidths;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Messages");

        XLSX.writeFile(wb, `contact_messages_${format(new Date(), "yyyy-MM-dd_HH-mm")}.xlsx`);
        toast.success("Messages exported successfully");
    };

    const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete the message from "${name}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/contact/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete message");
            }

            toast.success("Message deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
        } catch (error) {
            toast.error("Failed to delete message");
            console.error("Error deleting message:", error);
        }
    };



    return (
        <div
            className="min-h-screen flex flex-col bg-background"
        >

            <Navbar />

            <main id="main-content" className="flex-grow pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="glass-card p-4 sm:p-6 md:p-8 hover:scale-[1.001] transition-all duration-500">
                        <div className="flex flex-col gap-6 mb-6 md:mb-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
                                    Contact <span className="text-pulse-500">Messages</span>
                                </h1>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex items-center justify-center gap-2 w-full sm:w-auto"
                                        onClick={() => router.push('/admin/dashboard')}
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        <span className="hidden sm:inline">Back</span>
                                    </Button>
                                    <Button
                                        onClick={handleExport}
                                        disabled={messages.length === 0}
                                        className="button-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                                    >
                                        <Download className="h-4 w-4" />
                                        <span className="hidden sm:inline">Export</span>
                                    </Button>
                                    {selectedIds.length > 0 && (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleBulkAction('delete')}
                                                disabled={isBulkActionLoading}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete ({selectedIds.length})
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleBulkAction('markAsRead')}
                                                disabled={isBulkActionLoading}
                                                className="hidden sm:flex"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Mark Read
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Filters Toolbar */}
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-lg">
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="Search name, email, subject..."
                                        className="pl-8 bg-white dark:bg-gray-900"
                                        value={search}
                                        onChange={handleSearch}
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Filter className="h-4 w-4 text-gray-500" />
                                    <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                                        <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-900">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Statuses</SelectItem>
                                            <SelectItem value="New">New</SelectItem>
                                            <SelectItem value="Read">Read</SelectItem>
                                            <SelectItem value="Replied">Replied</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {messages.length > 0 ? (
                            <div className="rounded-lg overflow-x-auto glass-card">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-white/10 dark:hover:bg-white/5">
                                            <TableHead className="w-[40px]">
                                                <Checkbox
                                                    checked={selectedIds.length === messages.length && messages.length > 0}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold hidden md:table-cell">Date</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Status</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Name</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold hidden lg:table-cell">Email</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold hidden md:table-cell">Subject</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {messages.map((msg) => (
                                            <TableRow key={msg._id} className={`border-b border-gray-200/30 dark:border-gray-700/30 transition-colors ${msg.status === 'New' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedIds.includes(msg._id)}
                                                        onCheckedChange={(checked) => handleSelectOne(checked as boolean, msg._id)}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-gray-800 dark:text-gray-200 hidden md:table-cell whitespace-nowrap">
                                                    {format(new Date(msg.createdAt), "MMM dd, yyyy")}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={msg.status === 'New' ? "default" : msg.status === 'Replied' ? "secondary" : "outline"}
                                                        className={msg.status === 'New' ? "bg-blue-500 hover:bg-blue-600" : msg.status === 'Replied' ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                                                    >
                                                        {msg.status || 'New'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-800 dark:text-gray-200 font-medium">
                                                    <div className="min-w-[120px]">{msg.firstName} {msg.lastName}</div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 md:hidden">
                                                        {format(new Date(msg.createdAt), "MMM dd, yyyy")}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-800 dark:text-gray-200 hidden lg:table-cell">{msg.email}</TableCell>
                                                <TableCell className="text-gray-800 dark:text-gray-200 hidden md:table-cell max-w-[150px] truncate">{msg.subject}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleReply(msg.email, msg.subject || 'No Subject', msg._id)}
                                                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                            title="Reply"
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => updateStatus.mutate({ id: msg._id, status: 'Read' })}>
                                                                    Mark as Read
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => updateStatus.mutate({ id: msg._id, status: 'New' })}>
                                                                    Mark as New
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                                                                    onClick={(e) => handleDelete(e, msg._id, `${msg.firstName} ${msg.lastName}`)}
                                                                >
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12 glass-card rounded-lg">
                                <p className="text-gray-600 dark:text-gray-400 text-lg">No messages found matching your criteria</p>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {pagination && pagination.pages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> messages
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

export default AdminMessagesContent;
