"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Tag, Download, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  downloadImage?: string;
  allowImageDownload?: boolean;
  category: string;
  tags: string[];
  author: string;
  publishedAt?: string;
  createdAt: string;
}

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPhoto = async () => {
    const targetUrl = post.downloadImage || post.coverImage;
    if (!targetUrl) return;
    setIsDownloading(true);
    try {
      const res = await fetch(targetUrl);
      if (!res.ok) throw new Error("Failed to fetch image");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      let ext = "jpg";
      if (blob.type.includes("png")) ext = "png";
      else if (blob.type.includes("webp")) ext = "webp";
      else if (blob.type.includes("gif")) ext = "gif";
      else {
        const urlExt = targetUrl.split(".").pop()?.split("?")[0]?.toLowerCase();
        if (urlExt && ["jpg", "jpeg", "png", "webp", "gif"].includes(urlExt)) {
          ext = urlExt;
        }
      }
      a.download = `${post.slug || "blog-photo"}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Photo downloaded successfully");
    } catch {
      window.open(targetUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : ['https://astermedicines.com/og-image.webp'],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.publishedAt || post.createdAt,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://astermedicines.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aster Medicines Pvt Ltd',
      url: 'https://astermedicines.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://astermedicines.com/uploads/logo.webp',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://astermedicines.com/blog/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navbar />
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-6 max-w-3xl">

          <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand-accent transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Knowledge Hub
          </Link>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 border border-border group">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
              {post.allowImageDownload !== false && (
                <div className="absolute bottom-3 right-3 z-10">
                  <button
                    onClick={handleDownloadPhoto}
                    disabled={isDownloading}
                    className="group/btn flex items-center justify-center h-9 min-w-9 max-w-9 hover:max-w-[150px] rounded-full bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 ease-out cursor-pointer disabled:opacity-70 px-2.5 overflow-hidden hover:scale-105 active:scale-95"
                    title="Download Photo"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-4 h-4 shrink-0 animate-spin text-brand-accent" />
                    ) : (
                      <Download className="w-4 h-4 shrink-0 text-brand-accent transition-transform duration-200 group-hover/btn:translate-y-0.5" />
                    )}
                    <span className="max-w-0 opacity-0 group-hover/btn:max-w-[110px] group-hover/btn:opacity-100 group-hover/btn:ml-1.5 transition-all duration-300 ease-out whitespace-nowrap text-xs font-semibold overflow-hidden">
                      Download Photo
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" className="text-brand-accent border-brand-accent/30">{post.category}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {format(new Date(post.publishedAt || post.createdAt), "dd MMMM yyyy")}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              {post.author}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">{post.title}</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>

          {/* Content — rendered as HTML from CMS */}
          <article
            className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-brand-accent prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border">
              <Tag className="w-4 h-4 text-muted-foreground mt-0.5" />
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 p-6 bg-brand-accent/5 border border-brand-accent/20 rounded-2xl text-center">
            <p className="font-semibold text-foreground mb-2">Interested in partnering with Aster Medicines?</p>
            <p className="text-sm text-muted-foreground mb-4">Contact us for Third Party Manufacturing, PCD Franchise, or bulk orders.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand-accent text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-accent/90 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
