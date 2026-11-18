"use client";

import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff,
  RefreshCw, Search, Globe, FileText, X, Save, Clock,
  Upload, ImageIcon,
} from "lucide-react";

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  allowImageDownload?: boolean;
  category: string;
  tags: string[];
  author: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
}

const CATEGORIES = ["Manufacturing", "PCD Franchise", "Drug Profiles", "Regulatory", "Industry News"];

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  allowImageDownload: false,
  category: "Manufacturing",
  tags: "",
  author: "Aster Medicines Team",
  published: false,
  scheduledPublishAt: "",
  metaTitle: "",
  metaDescription: "",
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminBlogContent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("images", file);
      formData.append("folder", "aster-medicines/uploads");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const data = await res.json();
      const url = data.images?.[0];
      if (url) {
        setForm((f) => ({ ...f, coverImage: url }));
        toast.success("Cover image uploaded!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) uploadImage(file);
  }, [uploadImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const res = await fetch("/api/blog?admin=1&limit=50");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json() as Promise<{ posts: BlogPost[] }>;
    },
  });

  const posts = (data?.posts || []).filter((p) =>
    search ? p.title.toLowerCase().includes(search.toLowerCase()) : true
  );

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
    },
    onError: () => toast.error("Failed to delete post"),
  });

  const togglePublish = async (post: BlogPost) => {
    try {
      const res = await fetch(`/api/blog/${post.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      });
      if (!res.ok) throw new Error();
      toast.success(post.published ? "Post unpublished" : "Post published");
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
    } catch {
      toast.error("Failed to update publish status");
    }
  };

  const openCreate = () => {
    setEditingPost(null);
    setForm(EMPTY_FORM);
    setIsFormOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || "",
      allowImageDownload: (post as any).allowImageDownload ?? false,
      category: post.category,
      tags: post.tags.join(", "),
      author: post.author,
      published: post.published,
      scheduledPublishAt: (post as any).scheduledPublishAt
        ? new Date((post as any).scheduledPublishAt).toISOString().slice(0, 16)
        : "",
      metaTitle: (post as any).metaTitle || "",
      metaDescription: (post as any).metaDescription || "",
    });
    setIsFormOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setForm((f) => ({
      ...f,
      title: val,
      // Auto-slug only when creating (not editing)
      slug: editingPost ? f.slug : slugify(val),
      // Auto-fill meta title if still empty
      metaTitle: f.metaTitle || val.slice(0, 70),
      // Auto-fill meta description from excerpt if excerpt is set, else from title
      metaDescription: f.metaDescription
        ? f.metaDescription
        : `${val} | Aster Medicines Pvt Ltd`.slice(0, 160),
    }));
  };

  // When excerpt changes, update meta description if it was auto-generated from title
  const handleExcerptChange = (val: string) => {
    setForm((f) => ({
      ...f,
      excerpt: val,
      metaDescription: f.metaDescription === `${f.title} | Aster Medicines Pvt Ltd`.slice(0, 160) || !f.metaDescription
        ? val.slice(0, 160)
        : f.metaDescription,
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim() || !form.excerpt.trim()) {
      toast.error("Title, slug, excerpt and content are required");
      return;
    }

    setIsSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      scheduledPublishAt: form.scheduledPublishAt ? new Date(form.scheduledPublishAt).toISOString() : null,
    };

    try {
      const res = editingPost
        ? await fetch(`/api/blog/${editingPost.slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save");
      }

      toast.success(editingPost ? "Post updated" : "Post created");
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      setIsFormOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="glass-card p-6 md:p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Blog <span className="text-brand-accent">Manager</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} /> Refresh
                </Button>
                <Button onClick={openCreate} className="bg-brand-accent hover:bg-brand-accent/90 text-white">
                  <Plus className="h-4 w-4 mr-2" /> New Post
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Posts Table */}
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-muted/40 animate-pulse" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No posts yet. Create your first article.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-card/50 hover:border-brand-accent/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-foreground truncate">{post.title}</span>
                        <Badge variant={post.published ? "default" : "secondary"} className={post.published ? "bg-emerald-500/10 text-emerald-600 border-0" : ""}>
                          {post.published ? "Published" : (post as any).scheduledPublishAt ? "Scheduled" : "Draft"}
                        </Badge>
                        {(post as any).scheduledPublishAt && !post.published && (
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date((post as any).scheduledPublishAt).toLocaleDateString("en-IN")}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">{post.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{post.excerpt}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(post.createdAt), "dd MMM yyyy")} · /blog/{post.slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublish(post)}
                        title={post.published ? "Unpublish" : "Publish"}
                        className="cursor-pointer"
                      >
                        {post.published
                          ? <EyeOff className="h-4 w-4 text-muted-foreground" />
                          : <Eye className="h-4 w-4 text-emerald-500" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(post)} className="cursor-pointer">
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      {post.published && (
                        <Button variant="ghost" size="sm" asChild className="cursor-pointer">
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4 text-brand-accent" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Delete "${post.title}"?`)) deleteMutation.mutate(post.slug);
                        }}
                        className="cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create / Edit Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />

          {/* Panel */}
          <div className="relative ml-auto w-full max-w-2xl h-full bg-background border-l border-border flex flex-col shadow-2xl overflow-hidden">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="text-lg font-bold text-foreground">
                {editingPost ? "Edit Post" : "New Post"}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setIsFormOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input
                  placeholder="e.g. What is PCD Pharma Franchise?"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Slug *</Label>
                <Input
                  placeholder="e.g. what-is-pcd-pharma-franchise"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                />
                <p className="text-xs text-muted-foreground">URL: /blog/{form.slug || "..."}</p>
              </div>

              <div className="space-y-1.5">
                <Label>Excerpt * <span className="text-muted-foreground font-normal">(shown in listing)</span></Label>
                <Textarea
                  placeholder="A short summary of the article..."
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => handleExcerptChange(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Content * <span className="text-muted-foreground font-normal">(HTML supported)</span></Label>
                <Textarea
                  placeholder="<p>Write your article here...</p>"
                  rows={12}
                  className="font-mono text-sm"
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Author</Label>
                  <Input
                    value={form.author}
                    onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Tags <span className="text-muted-foreground font-normal">(comma separated)</span></Label>
                <Input
                  placeholder="e.g. pharma, injection, Bihar"
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Cover Image</Label>

                {form.coverImage ? (
                  <div className="relative group rounded-xl overflow-hidden border border-border">
                    <Image
                      src={form.coverImage}
                      alt="Cover preview"
                      width={600}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" /> Replace
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-red-400/50 text-red-300 hover:bg-red-500/20"
                        onClick={() => setForm((f) => ({ ...f, coverImage: "" }))}
                      >
                        <X className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`
                      relative flex flex-col items-center justify-center gap-3 p-8
                      rounded-xl border-2 border-dashed transition-colors cursor-pointer
                      ${isUploading
                        ? "border-brand-accent/50 bg-brand-accent/5"
                        : "border-border hover:border-brand-accent/40 hover:bg-muted/30"
                      }
                    `}
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="h-8 w-8 text-brand-accent animate-spin" />
                        <p className="text-sm text-brand-accent font-medium">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <div className="p-3 rounded-full bg-muted/50">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">
                            Drag & drop your image here
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            or click to browse · JPG, PNG, WebP, GIF · Max 5MB
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadImage(file);
                    e.target.value = "";
                  }}
                />

                {/* Photo Download Tick Option */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card/60 hover:bg-card/90 transition-colors">
                  <input
                    type="checkbox"
                    id="allowImageDownload"
                    checked={form.allowImageDownload}
                    onChange={(e) => setForm((f) => ({ ...f, allowImageDownload: e.target.checked }))}
                    className="w-4 h-4 mt-0.5 accent-brand-accent rounded cursor-pointer"
                  />
                  <Label htmlFor="allowImageDownload" className="cursor-pointer text-sm font-medium">
                    Enable photo download option
                    <span className="block text-xs text-muted-foreground font-normal mt-0.5">
                      When ticked, visitors will see a &quot;Download Photo&quot; button on this blog post to download the image.
                    </span>
                  </Label>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SEO (optional)</p>
                <div className="space-y-1.5">
                  <Label>Meta Title <span className="text-muted-foreground font-normal">(max 70 chars)</span></Label>
                  <Input
                    maxLength={70}
                    value={form.metaTitle}
                    onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Meta Description <span className="text-muted-foreground font-normal">(max 160 chars)</span></Label>
                  <Textarea
                    rows={2}
                    maxLength={160}
                    value={form.metaDescription}
                    onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked, scheduledPublishAt: e.target.checked ? "" : f.scheduledPublishAt }))}
                  className="w-4 h-4 accent-brand-accent cursor-pointer"
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Publish immediately
                  <span className="block text-xs text-muted-foreground font-normal">Uncheck to save as draft or schedule</span>
                </Label>
              </div>

              {!form.published && (
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    Schedule publish
                    <span className="text-muted-foreground font-normal text-xs">(optional — leave blank to keep as draft)</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    value={form.scheduledPublishAt}
                    min={new Date().toISOString().slice(0, 16)}
                    onChange={(e) => setForm((f) => ({ ...f, scheduledPublishAt: e.target.value }))}
                  />
                  {form.scheduledPublishAt && (
                    <p className="text-xs text-brand-accent">
                      Will auto-publish on {new Date(form.scheduledPublishAt).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Panel Footer */}
            <div className="px-6 py-4 border-t border-border flex justify-end gap-3 shrink-0">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-brand-accent hover:bg-brand-accent/90 text-white min-w-[100px]"
              >
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" />Save</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
