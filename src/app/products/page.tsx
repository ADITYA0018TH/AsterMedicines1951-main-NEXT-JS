import type { Metadata } from "next";
import ProductsContent from "@/components/ProductsContent";
import { productCatalogStructuredData } from "@/data/structuredData";

export const metadata: Metadata = {
    title: "Products - Aster Medicines PVT LTD",
    description: "Explore our comprehensive range of pharmaceutical products including cardiovascular medications, respiratory solutions, and neurological treatments. Quality healthcare solutions from Aster Medicines.",
    keywords: "pharmaceutical products, medicines, cardiovascular drugs, respiratory medications, neurological treatments, healthcare products, aster medicines products",
};

export default function ProductsPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productCatalogStructuredData) }}
            />
            <ProductsContent />
        </>
    );
}
