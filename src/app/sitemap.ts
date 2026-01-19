import { MetadataRoute } from "next";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://astermedicines.com";

  // Strategy: If your product data has an 'updatedAt' field, use it. 
  // If not, hardcode a recent deployment date to avoid "fake" daily updates.
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    // If you have product.updatedAt in your DB, use that: new Date(product.updatedAt)
    lastModified: new Date(), 
    changeFrequency: "weekly" as const,
    priority: 0.9, // High priority: These are your specific drug pages (e.g., Meropenem)
  }));

  return [
    // --- TIER 1: The Homepage ---
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    // --- TIER 2: Revenue Generators (The "Money" Pages) ---
    // You MUST have a dedicated page for Third Party Manufacturing to rank for B2B queries
    {
      url: `${baseUrl}/third-party-manufacturing`, 
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Showcasing the factory helps with trust/conversions
    {
      url: `${baseUrl}/infrastructure`, 
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    
    // --- TIER 3: Product Directory ---
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },

    // --- TIER 4: Trust & Utility ---
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/certificates`, // GMP/ISO certs are huge for Pharma SEO
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(), // Contact info rarely changes
      changeFrequency: "yearly",
      priority: 0.6,
    },

    // --- TIER 5: Dynamic Products ---
    ...productUrls,
  ];
}