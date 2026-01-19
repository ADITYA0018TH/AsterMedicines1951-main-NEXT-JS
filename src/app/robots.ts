import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://astermedicines.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",        // Keep your admin panel private
        "/api/",          // Don't index your backend API routes
        "/private/",      // Any other private folders
        "/account/",      // User account pages (if you have login)
        "/search?*",      // Crucial: Prevents "Spider Traps" from internal site search
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}