import type { Metadata } from "next";
import ProductDetailContent from "@/components/ProductDetailContent";
import { getProduct } from "@/lib/products";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: "Product Not Found - Aster Medicines PVT LTD",
            description: "The requested product could not be found.",
        };
    }

    return {
        title: `${product.name} - Aster Medicines PVT LTD`,
        description: product.description || "Leading pharmaceutical products by Aster Medicines PVT LTD.",
        keywords: `${product.name}, ${product.category}, pharmaceutical product, medicine`,
    };
}

export default function ProductDetailPage() {
    return <ProductDetailContent />;
}
