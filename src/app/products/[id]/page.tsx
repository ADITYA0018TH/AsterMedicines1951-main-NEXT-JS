import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailContent from "@/components/ProductDetailContent";
import { getProduct } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd"; 

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found - Aster Medicines Pvt Ltd",
      robots: { index: false },
    };
  }

  // FIX 1: Use the first image from the array, or a default
  const mainImage = product.images?.[0] || "/og-image-update.webp";

  return {
    title: `${product.name} | Manufacturer in Bihar - Aster Medicines`,
    description: product.description || `GMP Certified manufacturing of ${product.name}.`,
    openGraph: {
      title: `${product.name} - Manufacturing Details`,
      description: product.description?.slice(0, 150) + "...",
      url: `https://astermedicines.com/products/${id}`,
      images: [
        {
          url: mainImage, // Uses the fixed variable
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    alternates: {
      canonical: `https://astermedicines.com/products/${id}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound(); 
  }

  return (
    <>
      {/* FIX 2: Map 'images[0]' to 'image' for the Schema */}
      <ProductJsonLd 
        product={{
          id: product.id,
          name: product.name,
          description: product.description || "",
          // We take the first image from your array
          image: product.images?.[0] || "/placeholder.jpg", 
          category: product.category
        }}
      />

      <ProductDetailContent product={product} />
    </>
  );
}