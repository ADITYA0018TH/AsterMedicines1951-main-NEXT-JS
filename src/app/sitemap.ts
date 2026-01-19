import { MetadataRoute } from "next";
// Make sure this path is correct based on your folder structure
import { products } from "@/data/products"; 

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://astermedicines.com";

  // Dynamic Product Routes
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    // --- 1. Core Pages (From your old utils file) ---
    {
      url: baseUrl, // Home
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // --- 2. High-Value B2B Pages (Added for SEO) ---
    {
      url: `${baseUrl}/infrastructure`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // --- 3. Dynamic Products ---
    ...productUrls,
  ];
}