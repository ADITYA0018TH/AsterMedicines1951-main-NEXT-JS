import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://astermedicines.com"; // Replace with your actual domain

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
