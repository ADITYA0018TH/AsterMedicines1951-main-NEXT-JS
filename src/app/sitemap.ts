import { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { getProductPath } from "@/lib/productSlug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://astermedicines.com";
  const corePages = ['', '/about', '/products', '/contact'];

  // Generate URLs for core pages (English/Default only)
  const pages = corePages.map(page => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '/products' ? 'daily' as const : 'weekly' as const,
    priority: page === '' ? 1 : page === '/products' ? 0.9 : 0.8,
  }));

  // Fetch all products from DB
  const dbProducts = await getAllProducts();

  // Generate product URLs
  const productUrls = dbProducts.map((product) => ({
    url: `${baseUrl}${getProductPath(product)}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...pages,
    ...productUrls,
  ];
}