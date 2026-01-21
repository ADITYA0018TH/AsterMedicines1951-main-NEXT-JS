import { MetadataRoute } from "next";
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
    // --- 1. Core Pages ---
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

    // --- 2. Dynamic Products ---
    ...productUrls,
  ];
}