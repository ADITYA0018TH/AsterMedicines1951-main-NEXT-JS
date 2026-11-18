"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, ArrowRight, BookOpen, Download, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import GradientASCII from "@/components/ui/GradientASCII";

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  downloadImage?: string;
  allowImageDownload?: boolean;
  category: string;
  tags: string[];
  author: string;
  publishedAt?: string;
  createdAt: string;
}

const CATEGORIES = ["All", "Manufacturing", "PCD Franchise", "Drug Profiles", "Regulatory", "Industry News"];

export default function BlogListContent() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);

  const handleDownloadPhoto = async (e: React.MouseEvent, imageUrl: string, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!imageUrl) return;
    setDownloadingSlug(slug);
    try {
      const res = await fetch(imageUrl);
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
        const urlExt = imageUrl.split(".").pop()?.split("?")[0]?.toLowerCase();
        if (urlExt && ["jpg", "jpeg", "png", "webp", "gif"].includes(urlExt)) {
          ext = urlExt;
        }
      }
      a.download = `${slug || "blog-photo"}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Photo downloaded successfully");
    } catch {
      window.open(imageUrl, "_blank");
    } finally {
      setDownloadingSlug(null);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts", category],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "20" });
      if (category !== "All") params.set("category", category);
      const res = await fetch(`/api/blog?${params}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json() as Promise<{ posts: BlogPost[] }>;
    },
  });

  const posts = (data?.posts || []).filter((p) =>
    search ? p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">

          {/* Header */}
          <div className="mb-12 text-center">
            <Badge variant="outline" className="text-brand-accent border-brand-accent/30 mb-4">Knowledge Hub</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pharma <span className="text-brand-accent">Insights</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Expert articles on pharmaceutical manufacturing, PCD franchise, drug profiles, and regulatory compliance.
            </p>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    category === cat
                      ? "bg-brand-accent text-white"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-secondary/30 animate-pulse h-72" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No articles yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group block bg-card border border-border rounded-2xl overflow-hidden hover:border-brand-accent/50 hover:shadow-xl transition-all duration-300"
                >
                  {post.coverImage ? (
                    <div className="relative h-48 overflow-hidden bg-black">
                      {/* Blurred image - remains blurred even on hover */}
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover filter blur-[10px] scale-110 pointer-events-none transition-none"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />

                      {/* Gradient ASCII overlay covering the image */}
                      <div className="absolute inset-0 z-10 pointer-events-none opacity-85 mix-blend-screen overflow-hidden">
                        <GradientASCII
                          shape="horizon"
                          colors={['#ea580c', '#f97316', '#38bdf8', '#1e3fd8']}
                          mouseInteraction={true}
                          speed={0.4}
                          gradientOpacity={0.8}
                        />
                      </div>

                      {/* Dark overlay for contrast */}
                      <div className="absolute inset-0 z-10 bg-black/25 pointer-events-none" />

                      {/* Download Button on picture */}
                      {post.allowImageDownload !== false && (post.downloadImage || post.coverImage) && (
                        <button
                          type="button"
                          onClick={(e) => handleDownloadPhoto(e, (post.downloadImage || post.coverImage)!, post.slug)}
                          disabled={downloadingSlug === post.slug}
                          className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/20 shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-70"
                          title="Download photo"
                        >
                          {downloadingSlug === post.slug ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-accent" />
                          ) : (
                            <Download className="w-3.5 h-3.5 text-brand-accent" />
                          )}
                          <span className="text-[11px] font-semibold">Download</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-brand-accent/10 to-orange-100/20 dark:to-orange-900/10 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-brand-accent/30" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                    </div>
                    <h2 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-brand-accent transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(post.publishedAt || post.createdAt), "dd MMM yyyy")}
                      </span>
                      <span className="flex items-center gap-1 text-brand-accent font-medium">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
