import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { backfillProductSlugs } from '@/lib/products';

export const dynamic = 'force-dynamic';

function parseLimit(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  const safeInt = Math.floor(parsed);
  if (safeInt <= 0) {
    return 0;
  }

  return Math.min(safeInt, 50000);
}

async function isAuthorizedRequest(req: NextRequest): Promise<boolean> {
  const session = await getServerSession(authOptions);
  const role = session?.user && typeof session.user === 'object' && 'role' in session.user
    ? session.user.role
    : undefined;

  if (role === 'admin') {
    return true;
  }

  const configuredSecret = process.env.PRODUCT_SLUG_BACKFILL_SECRET;
  if (!configuredSecret) {
    return false;
  }

  const providedSecret = req.headers.get('x-maintenance-key') || req.headers.get('x-api-key') || '';
  return providedSecret === configuredSecret;
}

export async function POST(req: NextRequest) {
  try {
    const authorized = await isAuthorizedRequest(req);
    if (!authorized) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let body: { dryRun?: unknown; limit?: unknown } = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const dryRun = body?.dryRun === true;
    const limit = parseLimit(body?.limit);

    const result = await backfillProductSlugs({ dryRun, limit });

    return NextResponse.json({
      message: dryRun
        ? 'Dry run completed'
        : 'Slug backfill completed',
      result,
    });
  } catch (error) {
    console.error('Error running slug backfill:', error);
    return NextResponse.json({ message: 'Error running slug backfill' }, { status: 500 });
  }
}
