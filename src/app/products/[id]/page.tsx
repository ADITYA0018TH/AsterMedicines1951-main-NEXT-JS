import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ProductDetailContent from "@/components/ProductDetailContent";
import { getProduct, getRelatedProducts, getAllProducts } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { getProductPath, getProductSlug, normalizeProductRouteSegment } from "@/lib/productSlug";

// Revalidate product pages every 1 hour (ISR)
export const revalidate = 3600;

// Pre-render known product pages at build time
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ id: getProductSlug(p) }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // ... metadata generation logic remains same ...
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found - Aster Medicines Pvt Ltd",
      robots: { index: false },
    };
  }

  const mainImage = product.images?.[0] || "/og-image.webp";
  const productPath = getProductPath(product);
  const productUrl = `https://astermedicines.com${productPath}`;

  // Build a comprehensive description pulling in every searchable field
  const descParts = [
    product.detailedDescription || product.description,
    product.composition ? `Composition: ${product.composition}.` : "",
    product.indications ? `Used for: ${product.indications}.` : "",
    product.dosage ? `Dosage: ${product.dosage}.` : "",
    `Category: ${product.category}. Manufactured by Aster Medicines Pvt Ltd, Bihar, India. GMP CERTIFIED.`,
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
      description: product.detailedDescription || product.description || `GMP CERTIFIED ${product.name} manufactured by Aster Medicines Pvt Ltd.`,
      url: productUrl,
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
      canonical: productUrl,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  const routeSegment = normalizeProductRouteSegment(id);
  const canonicalSegment = getProductSlug(product);
  if (routeSegment !== canonicalSegment) {
    redirect(getProductPath(product));
  }

  // Fetch related products for the section
  const relatedProducts = await getRelatedProducts(product.category, product.id);

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
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Products", item: "/products" },
          { name: product.category, item: `/products?category=${encodeURIComponent(product.category)}` },
          { name: product.name, item: getProductPath(product) },
        ]}
      />
      <ProductDetailContent product={product} relatedProducts={relatedProducts} />
    </>
  );
}