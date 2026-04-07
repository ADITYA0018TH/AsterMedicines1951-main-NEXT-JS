import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BlogPost from '@/models/BlogPost';

/**
 * Scheduled publish cron endpoint.
 *
 * Call this every 5–15 minutes via an external cron service:
 *   - Vercel Cron (vercel.json)
 *   - cron-job.org (free)
 *   - GitHub Actions schedule
 *
 * Protect with CRON_SECRET env var so only your cron service can trigger it.
 *
 * Example vercel.json:
 * {
 *   "crons": [{ "path": "/api/cron/publish-scheduled", "schedule": "*/10 * * * *" }]
 * }
 */
export async function GET(request: Request) {
  const secret = request.headers.get('x-cron-secret') || new URL(request.url).searchParams.get('secret');

  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const now = new Date();

    const result = await BlogPost.updateMany(
      {
        published: false,
        scheduledPublishAt: { $lte: now },
      },
      {
        $set: { published: true, publishedAt: now },
        $unset: { scheduledPublishAt: '' },
      }
    );

    return NextResponse.json({
      published: result.modifiedCount,
      checkedAt: now.toISOString(),
    });
  } catch (error) {
    console.error('[cron] publish-scheduled failed:', error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
