"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
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
import { Download, Trash2, Package, ArrowLeft } from "lucide-react";
import XLSX from "xlsx-js-style";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

interface ContactMessage {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    subject: string;
    message: string;
    createdAt: string;
}

const AdminMessagesContent = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { data: messages, isLoading, error } = useQuery({
        queryKey: ["admin-messages"],
        queryFn: async () => {
            const response = await fetch("/api/contact");
            if (!response.ok) {
                throw new Error("Failed to fetch messages");
            }
            return response.json() as Promise<ContactMessage[]>;
        },
    });

    const handleExport = () => {
        if (!messages || messages.length === 0) return;

        const data = messages.map((msg) => ({
            Date: format(new Date(msg.createdAt), "yyyy-MM-dd HH:mm:ss"),
            "First Name": msg.firstName,
            "Last Name": msg.lastName,
            Email: msg.email,
            "Mobile Number": msg.mobileNumber,
            Subject: msg.subject,
            Message: msg.message,
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

    if (isLoading) {
        return (
            <div
                className="min-h-screen flex flex-col bg-background"
            >
                <CustomCursor />
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
            <div
                className="min-h-screen flex flex-col bg-background"
            >
                <CustomCursor />
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
        <div
            className="min-h-screen flex flex-col bg-background"
        >
            <CustomCursor />
            <Navbar />

            <main id="main-content" className="flex-grow pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="glass-card p-4 sm:p-6 md:p-8 hover:scale-[1.001] transition-all duration-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
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
                                    <span className="hidden sm:inline">Back to Dashboard</span>
                                    <span className="sm:hidden">Dashboard</span>
                                </Button>
                                <Link href="/admin/products" className="w-full sm:w-auto">
                                    <Button variant="outline" className="flex items-center justify-center gap-2 w-full">
                                        <Package className="h-4 w-4" />
                                        <span className="hidden sm:inline">Manage Products</span>
                                        <span className="sm:hidden">Products</span>
                                    </Button>
                                </Link>
                                <Button
                                    onClick={handleExport}
                                    disabled={!messages || messages.length === 0}
                                    className="button-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    <Download className="h-4 w-4" />
                                    <span className="hidden sm:inline">Export to Excel</span>
                                    <span className="sm:hidden">Export</span>
                                </Button>
                            </div>
                        </div>

                        {messages && messages.length > 0 ? (
                            <div className="rounded-lg overflow-x-auto glass-card">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-white/10 dark:hover:bg-white/5">
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold hidden md:table-cell">Date</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Name</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold hidden lg:table-cell">Email</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold hidden lg:table-cell">Mobile</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold hidden md:table-cell">Subject</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Message</TableHead>
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {messages.map((msg) => (
                                            <TableRow key={msg._id} className="border-b border-gray-200/30 dark:border-gray-700/30 hover:bg-white/10 dark:hover:bg-white/5 transition-colors">
                                                <TableCell className="text-gray-800 dark:text-gray-200 hidden md:table-cell whitespace-nowrap">
                                                    {format(new Date(msg.createdAt), "MMM dd, yyyy")}
                                                </TableCell>
                                                <TableCell className="text-gray-800 dark:text-gray-200 font-medium">
                                                    <div className="min-w-[120px]">{msg.firstName} {msg.lastName}</div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 md:hidden">
                                                        {format(new Date(msg.createdAt), "MMM dd, yyyy")}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-800 dark:text-gray-200 hidden lg:table-cell">{msg.email}</TableCell>
                                                <TableCell className="text-gray-800 dark:text-gray-200 hidden lg:table-cell">{msg.mobileNumber}</TableCell>
                                                <TableCell className="text-gray-800 dark:text-gray-200 hidden md:table-cell max-w-[150px] truncate">{msg.subject}</TableCell>
                                                <TableCell className="text-gray-800 dark:text-gray-200 max-w-[200px] md:max-w-xs truncate">
                                                    {msg.message}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => handleDelete(e, msg._id, `${msg.firstName} ${msg.lastName}`)}
                                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 min-w-[44px] min-h-[44px]"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12 glass-card rounded-lg">
                                <p className="text-gray-600 dark:text-gray-400 text-lg">No messages yet</p>
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
