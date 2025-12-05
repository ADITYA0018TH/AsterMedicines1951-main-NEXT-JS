import type { Metadata } from "next";
import AdminMessagesContent from "@/components/AdminMessagesContent";

export const metadata: Metadata = {
    title: "Admin Messages - Aster Medicines PVT LTD",
    description: "View and manage customer inquiries and messages.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminMessagesPage() {
    return <AdminMessagesContent />;
}
