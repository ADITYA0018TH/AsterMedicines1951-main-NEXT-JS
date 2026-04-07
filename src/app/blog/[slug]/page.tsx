import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostContent from '@/components/BlogPostContent';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return {};
    const post = await res.json();
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: `https://astermedicines.com/blog/${slug}`,
        images: post.coverImage ? [{ url: post.coverImage }] : [{ url: '/og-image.webp' }],
      },
      alternates: { canonical: `https://astermedicines.com/blog/${slug}` },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/${slug}`, { next: { revalidate: 3600 } });
  if (!res.ok) notFound();
  const post = await res.json();
  if (!post.published) notFound();
  return <BlogPostContent post={post} />;
}
