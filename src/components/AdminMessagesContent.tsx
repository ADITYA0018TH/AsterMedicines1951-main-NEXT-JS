"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
    ArrowLeft,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Copy,
    Download,
    Eye,
    Filter,
    Mail,
    MessageCircle,
    MoreVertical,
    RefreshCw,
    Search,
    SendHorizontal,
    Sparkles,
    Trash2,
} from "lucide-react";
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

interface ContactMessage {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    subject: string;
    message: string;
    status: "New" | "Read" | "Replied";
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

type SortBy = "latest" | "oldest" | "name" | "status";

type ReplyTemplate = {
    id: string;
    label: string;
    subject: string;
    body: string;
};

type CountryCodeOption = {
    code: string;
    label: string;
};

const WHATSAPP_COUNTRY_CODES: CountryCodeOption[] = [
    { code: "91", label: "India (+91)" },
    { code: "1", label: "USA/Canada (+1)" },
    { code: "44", label: "United Kingdom (+44)" },
    { code: "971", label: "UAE (+971)" },
    { code: "61", label: "Australia (+61)" },
    { code: "49", label: "Germany (+49)" },
    { code: "33", label: "France (+33)" },
    { code: "65", label: "Singapore (+65)" },
];

const REPLY_TEMPLATES: ReplyTemplate[] = [
    {
        id: "acknowledge",
        label: "Acknowledgement",
        subject: "Re: {{subject}}",
        body: "Hi {{firstName}},\n\nThank you for contacting us regarding \"{{subject}}\". We have received your message and our team is reviewing it.\n\nWe will get back to you shortly.\n\nBest regards,\nAster Medicines Team",
    },
    {
        id: "request-more-details",
        label: "Request More Details",
        subject: "Re: {{subject}} - Additional Details Needed",
        body: "Hi {{firstName}},\n\nThank you for your message dated {{date}}. To help us assist you better, could you please share a few more details related to \"{{subject}}\"?\n\nOnce we receive that, we can proceed quickly.\n\nBest regards,\nAster Medicines Team",
    },
    {
        id: "resolved",
        label: "Resolution Sent",
        subject: "Re: {{subject}} - Update from Aster Medicines",
        body: "Hi {{firstName}},\n\nWe are writing with an update regarding your request about \"{{subject}}\".\n\nYour query has been addressed from our end. If you need anything else, please reply to this email and we will be happy to help.\n\nBest regards,\nAster Medicines Team",
    },
];

const applyTemplateVariables = (template: ReplyTemplate, message: ContactMessage) => {
    const replacements = {
        "{{firstName}}": message.firstName || "there",
        "{{lastName}}": message.lastName || "",
        "{{fullName}}": `${message.firstName} ${message.lastName}`.trim(),
        "{{subject}}": message.subject || "your inquiry",
        "{{date}}": format(new Date(message.createdAt), "dd MMM yyyy"),
    };

    const replaceTokens = (text: string) =>
        Object.entries(replacements).reduce(
            (acc, [token, value]) => acc.replaceAll(token, value),
            text
        );

    return {
        subject: replaceTokens(template.subject),
        body: replaceTokens(template.body),
    };
};

const AdminMessagesContent = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState<SortBy>("latest");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);
    const [isAutoRefresh, setIsAutoRefresh] = useState(false);
    const [lastUpdated, setLastUpdated] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState(REPLY_TEMPLATES[0].id);
    const [replySubject, setReplySubject] = useState("");
    const [replyBody, setReplyBody] = useState("");
    const [selectedCountryCode, setSelectedCountryCode] = useState("91");

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    const {
        data: responseData,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["admin-messages", page, limit, debouncedSearch, statusFilter],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search: debouncedSearch,
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
    const isRefreshing = isFetching && !isLoading;

    useEffect(() => {
        if (responseData) {
            setLastUpdated(new Date().toISOString());
        }
    }, [responseData]);

    useEffect(() => {
        if (!isAutoRefresh) return;

        const timer = setInterval(() => {
            refetch();
        }, 10000);

        return () => clearInterval(timer);
    }, [isAutoRefresh, refetch]);

    const displayedMessages = useMemo(() => {
        const list = [...messages];

        if (sortBy === "latest") {
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        if (sortBy === "oldest") {
            list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }

        if (sortBy === "name") {
            list.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
        }

        if (sortBy === "status") {
            const order: Record<ContactMessage["status"], number> = { New: 0, Read: 1, Replied: 2 };
            list.sort((a, b) => order[a.status || "New"] - order[b.status || "New"]);
        }

        return list;
    }, [messages, sortBy]);

    const metrics = useMemo(() => {
        const newCount = displayedMessages.filter((msg) => (msg.status || "New") === "New").length;
        const readCount = displayedMessages.filter((msg) => msg.status === "Read").length;
        const repliedCount = displayedMessages.filter((msg) => msg.status === "Replied").length;

        return {
            total: displayedMessages.length,
            newCount,
            readCount,
            repliedCount,
        };
    }, [displayedMessages]);

    useEffect(() => {
        setSelectedIds((prev) => prev.filter((id) => displayedMessages.some((msg) => msg._id === id)));
    }, [displayedMessages]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        setPage(1);
    };

    const handleSelectAll = (checked: boolean | "indeterminate") => {
        if (checked === true) {
            setSelectedIds(displayedMessages.map((msg) => msg._id));
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

    const openMessageDrawer = (message: ContactMessage) => {
        setActiveMessage(message);
        setIsDrawerOpen(true);

        const template = REPLY_TEMPLATES.find((t) => t.id === selectedTemplate) || REPLY_TEMPLATES[0];
        const content = applyTemplateVariables(template, message);
        setReplySubject(content.subject);
        setReplyBody(content.body);

        const digits = (message.mobileNumber || "").replace(/\D/g, "");
        const detected = WHATSAPP_COUNTRY_CODES
            .slice()
            .sort((a, b) => b.code.length - a.code.length)
            .find((item) => digits.startsWith(item.code) && digits.length > item.code.length + 6);

        if (detected) {
            setSelectedCountryCode(detected.code);
        }
    };

    const handleTemplateChange = (templateId: string) => {
        setSelectedTemplate(templateId);
        if (!activeMessage) return;

        const template = REPLY_TEMPLATES.find((t) => t.id === templateId) || REPLY_TEMPLATES[0];
        const content = applyTemplateVariables(template, activeMessage);
        setReplySubject(content.subject);
        setReplyBody(content.body);
    };

    const handleCopyReply = async () => {
        const payload = `Subject: ${replySubject}\n\n${replyBody}`;
        try {
            await navigator.clipboard.writeText(payload);
            toast.success("Reply copied to clipboard");
        } catch (err) {
            console.error(err);
            toast.error("Failed to copy reply");
        }
    };

    const handleSendFromDrawer = () => {
        if (!activeMessage) return;

        const subject = encodeURIComponent(replySubject || `Re: ${activeMessage.subject || "your message"}`);
        const body = encodeURIComponent(replyBody || "");

        updateStatus.mutate({ id: activeMessage._id, status: "Replied" });
        window.location.href = `mailto:${activeMessage.email}?subject=${subject}&body=${body}`;
    };

    const getWhatsAppNumber = (rawNumber?: string) => {
        const input = (rawNumber || "").trim();
        const digits = input.replace(/\D/g, "");

        if (!digits) return "";

        if (input.startsWith("+")) {
            return digits;
        }

        if (digits.startsWith("00") && digits.length > 8) {
            return digits.slice(2);
        }

        if (digits.length <= 10) {
            return `${selectedCountryCode}${digits}`;
        }

        return digits;
    };

    const handleSendWhatsApp = () => {
        if (!activeMessage) return;

        const phone = getWhatsAppNumber(activeMessage.mobileNumber);
        if (!phone) {
            toast.error("No valid WhatsApp number found for this contact");
            return;
        }

        const whatsappText = `Subject: ${replySubject || `Re: ${activeMessage.subject || "your message"}`}\n\n${replyBody || ""}`;
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappText)}`;

        updateStatus.mutate({ id: activeMessage._id, status: "Replied" });
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        toast.success("Opening WhatsApp draft");
    };

    const resetControls = () => {
        setSearch("");
        setStatusFilter("All");
        setSortBy("latest");
        setPage(1);
    };

    const handleBulkAction = async (action: "delete" | "markAsRead") => {
        if (selectedIds.length === 0) return;
        if (action === "delete" && !window.confirm(`Are you sure you want to delete ${selectedIds.length} messages?`)) return;

        setIsBulkActionLoading(true);
        try {
            const body: { ids: string[]; action?: string; status?: string } = { ids: selectedIds };
            if (action === "delete") body.action = "delete";
            if (action === "markAsRead") {
                body.action = "updateStatus";
                body.status = "Read";
            }

            const response = await fetch("/api/contact/bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error("Failed to perform bulk action");

            toast.success(`Messages ${action === "delete" ? "deleted" : "updated"} successfully`);
            setSelectedIds([]);
            queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
        } catch (err) {
            console.error("Bulk action failed:", err);
            toast.error("Failed to perform action");
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const handleMarkVisibleAsRead = async () => {
        const ids = displayedMessages
            .filter((msg) => (msg.status || "New") === "New")
            .map((msg) => msg._id);

        if (ids.length === 0) {
            toast.info("No unread messages on this page");
            return;
        }

        setIsBulkActionLoading(true);
        try {
            const response = await fetch("/api/contact/bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids, action: "updateStatus", status: "Read" }),
            });

            if (!response.ok) throw new Error("Failed to update page messages");

            toast.success(`Marked ${ids.length} messages as read`);
            queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
        } catch (err) {
            console.error(err);
            toast.error("Failed to mark page messages");
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
        updateStatus.mutate({ id, status: "Replied" });
        window.location.href = `mailto:${email}?subject=Re: ${subject}`;
    };

    const handleExport = (selectedOnly = false) => {
        const exportMessages = selectedOnly
            ? displayedMessages.filter((msg) => selectedIds.includes(msg._id))
            : displayedMessages;

        if (exportMessages.length === 0) {
            toast.info(selectedOnly ? "No selected messages to export" : "No messages to export");
            return;
        }

        const data = exportMessages.map((msg) => ({
            Date: format(new Date(msg.createdAt), "yyyy-MM-dd HH:mm:ss"),
            "First Name": msg.firstName,
            "Last Name": msg.lastName,
            Email: msg.email,
            "Mobile Number": msg.mobileNumber,
            Subject: msg.subject,
            Message: msg.message,
            Status: msg.status || "New",
        }));

        const ws = XLSX.utils.json_to_sheet(data);

        const range = XLSX.utils.decode_range(ws["!ref"] || "A1:G1");
        for (let col = range.s.c; col <= range.e.c; ++col) {
            const address = XLSX.utils.encode_cell({ r: 0, c: col });
            if (!ws[address]) continue;
            ws[address].s = {
                font: {
                    bold: true,
                },
            };
        }

        ws["!cols"] = [
            { wch: 20 },
            { wch: 15 },
            { wch: 15 },
            { wch: 25 },
            { wch: 15 },
            { wch: 20 },
            { wch: 50 },
            { wch: 12 },
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Messages");

        const namePrefix = selectedOnly ? "selected_messages" : "contact_messages";
        XLSX.writeFile(wb, `${namePrefix}_${format(new Date(), "yyyy-MM-dd_HH-mm")}.xlsx`);
        toast.success(`${exportMessages.length} messages exported successfully`);
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
        } catch (err) {
            toast.error("Failed to delete message");
            console.error("Error deleting message:", err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="glass-card p-8">
                        <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Loading messages...
                        </div>
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

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main id="main-content" className="flex-grow pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="glass-card p-4 sm:p-6 md:p-8 hover:scale-[1.001] transition-all duration-500 animate-enter">
                        <div className="flex flex-col gap-6 mb-6 md:mb-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
                                    Contact <span className="text-pulse-500">Messages</span>
                                </h1>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex items-center justify-center gap-2 w-full sm:w-auto"
                                        onClick={() => router.push("/admin/dashboard")}
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        <span className="hidden sm:inline">Back</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex items-center justify-center gap-2 w-full sm:w-auto"
                                        onClick={() => refetch()}
                                        disabled={isRefreshing}
                                    >
                                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                                        <span className="hidden sm:inline">Refresh</span>
                                    </Button>
                                    <Button
                                        variant={isAutoRefresh ? "default" : "outline"}
                                        className="flex items-center justify-center gap-2 w-full sm:w-auto"
                                        onClick={() => setIsAutoRefresh((prev) => !prev)}
                                    >
                                        <Sparkles className="h-4 w-4" />
                                        <span className="hidden sm:inline">{isAutoRefresh ? "Auto On" : "Auto Off"}</span>
                                    </Button>
                                    <Button
                                        onClick={() => handleExport(false)}
                                        disabled={displayedMessages.length === 0}
                                        className="button-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                                    >
                                        <Download className="h-4 w-4" />
                                        <span className="hidden sm:inline">Export Page</span>
                                    </Button>
                                    {selectedIds.length > 0 && (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleExport(true)}
                                                disabled={isBulkActionLoading}
                                                className="hidden sm:flex"
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Export Selected
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleBulkAction("delete")}
                                                disabled={isBulkActionLoading}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete ({selectedIds.length})
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleBulkAction("markAsRead")}
                                                disabled={isBulkActionLoading}
                                                className="hidden md:flex"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Mark Read
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>Last updated: {lastUpdated ? format(new Date(lastUpdated), "dd MMM yyyy, HH:mm:ss") : "--"}</span>
                                <span>Page {pagination?.page || 1} of {pagination?.pages || 1}</span>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="rounded-xl border border-blue-200/60 bg-blue-50/70 px-4 py-3 animate-enter-delayed dark:border-blue-900/40 dark:bg-blue-950/30">
                                    <p className="text-[11px] uppercase tracking-wide text-blue-700 dark:text-blue-300">Visible</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{metrics.total}</p>
                                </div>
                                <div className="rounded-xl border border-cyan-200/60 bg-cyan-50/70 px-4 py-3 animate-enter-delayed-2 dark:border-cyan-900/40 dark:bg-cyan-950/30">
                                    <p className="text-[11px] uppercase tracking-wide text-cyan-700 dark:text-cyan-300">New</p>
                                    <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">{metrics.newCount}</p>
                                </div>
                                <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/70 px-4 py-3 animate-enter-delayed-3 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                                    <p className="text-[11px] uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Read</p>
                                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{metrics.readCount}</p>
                                </div>
                                <div className="rounded-xl border border-violet-200/60 bg-violet-50/70 px-4 py-3 animate-enter-delayed-4 dark:border-violet-900/40 dark:bg-violet-950/30">
                                    <p className="text-[11px] uppercase tracking-wide text-violet-700 dark:text-violet-300">Replied</p>
                                    <p className="text-2xl font-bold text-violet-900 dark:text-violet-100">{metrics.repliedCount}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 items-stretch justify-between bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200/40 dark:border-gray-700/40">
                                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                                    <div className="relative w-full md:w-72">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            placeholder="Search name, email, subject..."
                                            className="pl-8 bg-white dark:bg-gray-900"
                                            value={search}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        <Filter className="h-4 w-4 text-gray-500" />
                                        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                                            <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-900">
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
                                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                                        <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-900">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="latest">Newest First</SelectItem>
                                            <SelectItem value="oldest">Oldest First</SelectItem>
                                            <SelectItem value="name">Name A-Z</SelectItem>
                                            <SelectItem value="status">Status</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Selected: <span className="font-semibold">{selectedIds.length}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleMarkVisibleAsRead}
                                            disabled={isBulkActionLoading || metrics.newCount === 0}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Mark Page Read
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={resetControls}>
                                            Reset Controls
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {displayedMessages.length > 0 ? (
                            <div className="rounded-lg overflow-x-auto glass-card border border-gray-200/40 dark:border-gray-700/40">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-white/10 dark:hover:bg-white/5">
                                            <TableHead className="w-[40px]">
                                                <Checkbox
                                                    checked={selectedIds.length === displayedMessages.length && displayedMessages.length > 0}
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
                                        {displayedMessages.map((msg, index) => (
                                            <TableRow
                                                key={msg._id}
                                                className={`border-b border-gray-200/30 dark:border-gray-700/30 transition-colors animate-row-enter ${msg.status === "New" ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                                                style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                                            >
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedIds.includes(msg._id)}
                                                        onCheckedChange={(checked) => handleSelectOne(checked, msg._id)}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-gray-800 dark:text-gray-200 hidden md:table-cell whitespace-nowrap">
                                                    {format(new Date(msg.createdAt), "MMM dd, yyyy")}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={msg.status === "New" ? "default" : msg.status === "Replied" ? "secondary" : "outline"}
                                                        className={msg.status === "New" ? "bg-blue-500 hover:bg-blue-600" : msg.status === "Replied" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                                                    >
                                                        {msg.status || "New"}
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
                                                            onClick={() => openMessageDrawer(msg)}
                                                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                            title="Open Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleReply(msg.email, msg.subject || "No Subject", msg._id)}
                                                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                            title="Quick Reply"
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
                                                                <DropdownMenuItem onClick={() => openMessageDrawer(msg)}>
                                                                    Open Drawer
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => updateStatus.mutate({ id: msg._id, status: "Read" })}>
                                                                    Mark as Read
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => updateStatus.mutate({ id: msg._id, status: "New" })}>
                                                                    Mark as New
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => updateStatus.mutate({ id: msg._id, status: "Replied" })}>
                                                                    Mark as Replied
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
                                <Button className="mt-4" variant="outline" onClick={resetControls}>
                                    Reset Controls
                                </Button>
                            </div>
                        )}

                        {pagination && pagination.pages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> messages
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
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
                                        onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
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

            <Sheet
                open={isDrawerOpen}
                onOpenChange={(open) => {
                    setIsDrawerOpen(open);
                    if (!open) setActiveMessage(null);
                }}
            >
                <SheetContent side="right" className="w-full sm:max-w-xl p-0">
                    <SheetHeader className="border-b border-gray-200/70 dark:border-gray-800 px-5 py-4">
                        <SheetTitle>Message Details</SheetTitle>
                        <SheetDescription>
                            Review full message and send replies using templates.
                        </SheetDescription>
                    </SheetHeader>

                    {activeMessage && (
                        <div className="h-full overflow-y-auto px-5 py-4 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3">
                                    <p className="text-xs text-gray-400 mb-1">Name</p>
                                    <p className="font-semibold text-gray-700 dark:text-gray-200">
                                        {activeMessage.firstName} {activeMessage.lastName}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3">
                                    <p className="text-xs text-gray-400 mb-1">Status</p>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={activeMessage.status === "New" ? "default" : activeMessage.status === "Replied" ? "secondary" : "outline"}
                                            className={activeMessage.status === "New" ? "bg-blue-500 hover:bg-blue-600" : activeMessage.status === "Replied" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                                        >
                                            {activeMessage.status || "New"}
                                        </Badge>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateStatus.mutate({ id: activeMessage._id, status: "Read" })}
                                        >
                                            Mark Read
                                        </Button>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 sm:col-span-2">
                                    <p className="text-xs text-gray-400 mb-1">Contact</p>
                                    <p className="font-medium text-gray-700 dark:text-gray-200 break-all">{activeMessage.email}</p>
                                    <p className="text-gray-500 mt-1">{activeMessage.mobileNumber || "-"}</p>
                                </div>
                                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 sm:col-span-2">
                                    <p className="text-xs text-gray-400 mb-1">Subject</p>
                                    <p className="font-medium text-gray-700 dark:text-gray-200">
                                        {activeMessage.subject || "No subject"}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3">
                                <p className="text-xs text-gray-400 mb-2">Original Message</p>
                                <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap break-words">
                                    {activeMessage.message || "No message body"}
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Reply Composer</p>
                                    <span className="text-xs text-gray-400">Template + custom edit</span>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500">WhatsApp Country Code</label>
                                    <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
                                        <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                                            <SelectValue placeholder="Select country code" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {WHATSAPP_COUNTRY_CODES.map((country) => (
                                                <SelectItem key={country.code} value={country.code}>
                                                    {country.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                                    <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                                        <SelectValue placeholder="Choose a reply template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REPLY_TEMPLATES.map((template) => (
                                            <SelectItem key={template.id} value={template.id}>
                                                {template.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500">Subject</label>
                                    <Input
                                        value={replySubject}
                                        onChange={(e) => setReplySubject(e.target.value)}
                                        placeholder="Reply subject"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500">Body</label>
                                    <Textarea
                                        rows={10}
                                        value={replyBody}
                                        onChange={(e) => setReplyBody(e.target.value)}
                                        placeholder="Write your reply"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2 pt-1">
                                    <Button variant="outline" onClick={handleCopyReply}>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy Reply
                                    </Button>
                                    <Button
                                        onClick={handleSendWhatsApp}
                                        className="bg-green-600 text-white hover:bg-green-700"
                                    >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Send WhatsApp Draft
                                    </Button>
                                    <Button onClick={handleSendFromDrawer} className="button-primary">
                                        <SendHorizontal className="h-4 w-4 mr-2" />
                                        Open Mail Draft
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

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

                .animate-expand-row {
                    animation: fade-up 0.2s ease-out both;
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

export default AdminMessagesContent;
