import { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { getProductPath } from "@/lib/productSlug";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://astermedicines.com";
  const corePages = ['', '/about', '/products', '/contact', '/blog'];

  const pages = corePages.map(page => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '/products' ? 'daily' as const : 'weekly' as const,
    priority: page === '' ? 1 : page === '/products' ? 0.9 : 0.8,
  }));

  // Products
  const dbProducts = await getAllProducts();
  const productUrls = dbProducts.map((product) => ({
    url: `${baseUrl}${getProductPath(product)}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Blog posts — only published ones
  let blogUrls: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const posts = await BlogPost.find({ published: true }, 'slug updatedAt publishedAt').lean();
    blogUrls = posts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB unavailable at build time — skip blog entries gracefully
  }

  return [...pages, ...productUrls, ...blogUrls];
}