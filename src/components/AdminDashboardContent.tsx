"use client";

import Link from "next/link";
import { Package, MessageSquare, LogOut, Users, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


const AdminDashboardContent = () => {
    const router = useRouter();

    const handleLogout = () => {
        // Remove cookie
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
                    <div className="glass-card p-8 hover:scale-[1.001] transition-all duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                                Admin <span className="text-pulse-500">Dashboard</span>
                            </h1>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-8">Welcome to the admin panel. Choose an option below to get started.</p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Manage Products Card */}
                            <Link href="/admin/products">
                                <div className="glass-card p-8 hover:scale-105 transition-all duration-300 cursor-pointer group h-full">
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pulse-500 to-pulse-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Package className="h-10 w-10 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Products</h2>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            Add, edit, or delete products. Manage inventory.
                                        </p>
                                        <div className="button-primary mt-auto">
                                            Go to Products →
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* View Messages Card */}
                            <Link href="/admin/messages">
                                <div className="glass-card p-8 hover:scale-105 transition-all duration-300 cursor-pointer group h-full">
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <MessageSquare className="h-10 w-10 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">View Messages</h2>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            Read customer inquires from the contact form.
                                        </p>
                                        <div className="button-primary mt-auto">
                                            Go to Messages →
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* View Visitors Card */}
                            <Link href="/admin/visitors">
                                <div className="glass-card p-8 hover:scale-105 transition-all duration-300 cursor-pointer group h-full">
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Users className="h-10 w-10 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Visitor Logs</h2>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            Track website traffic and view visitor details.
                                        </p>
                                        <div className="button-primary mt-auto">
                                            View Logs →
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Site Settings Card */}
                            <Link href="/admin/settings">
                                <div className="glass-card p-8 hover:scale-105 transition-all duration-300 cursor-pointer group h-full">
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Settings className="h-10 w-10 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Site Settings</h2>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            Manage contact info, social links, and maintenance mode.
                                        </p>
                                        <div className="button-primary mt-auto">
                                            Go to Settings →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminDashboardContent;
