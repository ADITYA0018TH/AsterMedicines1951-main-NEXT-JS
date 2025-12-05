import type { Metadata } from "next";
import AdminDashboardContent from "@/components/AdminDashboardContent";

export const metadata: Metadata = {
    title: "Admin Dashboard - Aster Medicines PVT LTD",
    description: "Administrative dashboard for managing products and messages.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminDashboardPage() {
    return <AdminDashboardContent />;
}
