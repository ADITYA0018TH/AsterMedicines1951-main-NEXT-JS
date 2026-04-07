import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { logAudit } from '@/lib/audit';
import { getClientIp } from '@/lib/rateLimit';
import { z } from 'zod';
import { sanitizeTextForStorage, sanitizeSearchTerm, toSafeInt } from '@/lib/inputSecurity';

const blogPostSchema = z.object({
  title: z.string().min(1).max(300).transform((v) => sanitizeTextForStorage(v, 300)),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().min(1).max(500).transform((v) => sanitizeTextForStorage(v, 500)),
  content: z.string().min(1).max(100000),
  coverImage: z.string().url().optional(),
  category: z.string().min(1).max(100).transform((v) => sanitizeTextForStorage(v, 100)),
  tags: z.array(z.string().max(50)).max(10).optional().default([]),
  author: z.string().max(100).optional().default('Aster Medicines Team'),
  published: z.boolean().optional().default(false),
  scheduledPublishAt: z.string().datetime().optional().nullable(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = toSafeInt(searchParams.get('page'), 1, 1, 10000);
    const limit = toSafeInt(searchParams.get('limit'), 10, 1, 50);
    const category = sanitizeSearchTerm(searchParams.get('category') || '', 100);
    const adminView = searchParams.get('admin') === '1';

    const query: Record<string, unknown> = {};
    if (!adminView) query.published = true;
    if (category && category !== 'All') query.category = category;

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      BlogPost.find(query)
        .select(adminView ? undefined : '-content')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      BlogPost.countDocuments(query),
    ]);

    return NextResponse.json({
      posts,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const parsed = blogPostSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: 'Validation Error', errors: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;
    const post = await BlogPost.create({
      ...data,
      publishedAt: data.published ? new Date() : undefined,
      scheduledPublishAt: data.scheduledPublishAt ? new Date(data.scheduledPublishAt) : undefined,
    });

    await logAudit({
      action: 'product.create', // reusing closest action type
      summary: `Created blog post "${data.title}"`,
      entity: 'BlogPost',
      entityId: post._id.toString(),
      performedBy: (session.user?.email) || 'admin',
      ip: getClientIp(request),
    });

    return NextResponse.json({ message: 'Post created', post }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: 'Slug already exists' }, { status: 409 });
    }
    console.error('Error creating blog post:', error);
    return NextResponse.json({ message: 'Error creating post' }, { status: 500 });
  }
}
