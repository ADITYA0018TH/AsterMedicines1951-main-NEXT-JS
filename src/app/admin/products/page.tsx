import type { Metadata } from "next";
import AdminProductsContent from "@/components/AdminProductsContent";

export const metadata: Metadata = {
    title: "Admin Products - Aster Medicines PVT LTD",
    description: "Manage product catalog, inventory, and pricing.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminProductsPage() {
    return <AdminProductsContent />;
}
