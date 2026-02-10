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

  const mainImage = product.images?.[0] || "/og-image.webp";

  // Build a comprehensive description pulling in every searchable field
  const descParts = [
    product.detailedDescription || product.description,
    product.composition ? `Composition: ${product.composition}.` : "",
    product.indications ? `Used for: ${product.indications}.` : "",
    product.dosage ? `Dosage: ${product.dosage}.` : "",
    `Category: ${product.category}. Manufactured by Aster Medicines Pvt Ltd, Bihar, India. WHO-GMP Certified.`,
  ].filter(Boolean).join(" ");

  // Trim to ~300 chars for meta description but keep full for keywords
  const metaDescription = descParts.length > 320 ? descParts.slice(0, 317) + "..." : descParts;

  // Generate keywords from product data
  const productKeywords = [
    product.name,
    `${product.name} manufacturer`,
    `${product.name} India`,
    `${product.name} Bihar`,
    `${product.name} price`,
    `Buy ${product.name}`,
    product.category,
    `${product.category} injection manufacturer`,
    `Aster Medicines ${product.name}`,
    ...(product.composition ? product.composition.split(",").map(c => c.trim()) : []),
    ...(product.features || []),
    "Aster Medicines Pvt Ltd",
    "Pharmaceutical Manufacturer Bihar",
  ];

  return {
    title: `${product.name} | ${product.category} — Buy from Aster Medicines Pvt Ltd, Bihar`,
    description: metaDescription,
    keywords: productKeywords,
    openGraph: {
      title: `${product.name} — ${product.category} | Aster Medicines`,
      description: product.detailedDescription || product.description || `WHO-GMP Certified ${product.name} manufactured by Aster Medicines Pvt Ltd.`,
      url: `https://astermedicines.com/products/${id}`,
      images: [
        {
          url: mainImage,
          width: 800,
          height: 600,
          alt: `${product.name} by Aster Medicines Pvt Ltd`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Aster Medicines`,
      description: product.description || `${product.name} - manufactured by Aster Medicines Pvt Ltd`,
      images: [mainImage],
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
      <ProductJsonLd
        product={{
          id: product.id,
          name: product.name,
          description: product.detailedDescription || product.description || "",
          image: product.images?.[0] || "/placeholder.jpg",
          category: product.category,
          composition: product.composition,
          indications: product.indications,
          dosage: product.dosage,
          features: product.features,
        }}
      />
      <ProductDetailContent product={product} />
    </>
  );
}