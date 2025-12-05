import type { Metadata } from "next";
import ProductDetailContent from "@/components/ProductDetailContent";
import { fetchProductById } from "@/services/api";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await fetchProductById(id);

    if (!product) {
        return {
            title: "Product Not Found - Aster Medicines PVT LTD",
            description: "The requested product could not be found.",
        };
    }

    return {
        title: `${product.name} - Aster Medicines PVT LTD`,
        description: product.description,
        keywords: `${product.name}, ${product.category}, pharmaceutical product, medicine`,
    };
}

export default function ProductDetailPage() {
    return <ProductDetailContent />;
}
