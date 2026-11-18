import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { logAudit } from '@/lib/audit';
import { getClientIp } from '@/lib/rateLimit';
import { sanitizeTextForStorage } from '@/lib/inputSecurity';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().min(1).max(300).transform((v) => sanitizeTextForStorage(v, 300)).optional(),
  excerpt: z.string().min(1).max(500).transform((v) => sanitizeTextForStorage(v, 500)).optional(),
  content: z.string().min(1).max(100000).optional(),
  coverImage: z.string().url().optional().nullable().or(z.literal('')),
  downloadImage: z.string().url().optional().nullable().or(z.literal('')),
  category: z.string().min(1).max(100).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  author: z.string().max(100).optional(),
  published: z.boolean().optional(),
  scheduledPublishAt: z.string().datetime().optional().nullable(),
  allowImageDownload: z.boolean().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await BlogPost.findOne({ slug });
    if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching post' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { slug } = await params;
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: 'Validation Error', errors: parsed.error.format() }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.scheduledPublishAt !== undefined) {
      updateData.scheduledPublishAt = parsed.data.scheduledPublishAt
        ? new Date(parsed.data.scheduledPublishAt)
        : null;
    }
    if (parsed.data.published === true) {
      const existing = await BlogPost.findOne({ slug });
      if (existing && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const post = await BlogPost.findOneAndUpdate({ slug }, { $set: updateData }, { new: true });
    if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

    await logAudit({
      action: 'product.update',
      summary: `Updated blog post "${post.title}"`,
      entity: 'BlogPost',
      entityId: post._id.toString(),
      performedBy: session.user?.email || 'admin',
      ip: getClientIp(request),
    });

    return NextResponse.json({ message: 'Post updated', post });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating post' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { slug } = await params;
    const post = await BlogPost.findOneAndDelete({ slug });
    if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

    await logAudit({
      action: 'product.delete',
      summary: `Deleted blog post "${post.title}"`,
      entity: 'BlogPost',
      entityId: post._id.toString(),
      performedBy: session.user?.email || 'admin',
      ip: getClientIp(request),
    });

    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting post' }, { status: 500 });
  }
}
