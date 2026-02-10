import { MetadataRoute } from "next";
import { products } from "@/data/products"; 

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://astermedicines.com";
  const locales = ['en', 'hi', 'ja'];
  const corePages = ['', '/about', '/products', '/contact'];

  // Generate URLs for each locale for core pages
  const localeUrls = locales.flatMap(locale => 
    corePages.map(page => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '/products' ? 'daily' as const : 'weekly' as const,
      priority: page === '' ? 1 : page === '/products' ? 0.9 : 0.8,
    }))
  );

  // Generate product URLs for each locale
  const productUrls = locales.flatMap(locale =>
    products.map((product) => ({
      url: `${baseUrl}/${locale}/products/${product.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [
    // Root URL (redirects to /en)
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // All locale-specific URLs
    ...localeUrls,
    // All product URLs across locales
    ...productUrls,
  ];
}