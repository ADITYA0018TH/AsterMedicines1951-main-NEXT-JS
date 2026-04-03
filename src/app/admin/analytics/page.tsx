import type { Metadata } from "next";
import ProductAnalyticsContent from "@/components/ProductAnalyticsContent";

export const metadata: Metadata = {
    title: "Product Analytics | Admin - Aster Medicines Pvt Ltd",
    description: "View product view analytics and most viewed products",
    robots: { index: false, follow: false },
};

export default function ProductAnalyticsPage() {
    return <ProductAnalyticsContent />;
}
