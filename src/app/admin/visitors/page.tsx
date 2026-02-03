import type { Metadata } from "next";
import VisitorsContent from "@/components/VisitorsContent";

export const metadata: Metadata = {
    title: "Visitor Logs - Admin Dashboard",
    description: "View website visitor logs.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function VisitorsPage() {
    return <VisitorsContent />;
}
