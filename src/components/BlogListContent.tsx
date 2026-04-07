"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, ArrowRight, BookOpen } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
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
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
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
