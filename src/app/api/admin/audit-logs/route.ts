import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import AuditLog from '@/models/AuditLog';
import { toSafeInt, sanitizeSearchTerm } from '@/lib/inputSecurity';

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = toSafeInt(searchParams.get('page'), 1, 1, 10000);
    const limit = toSafeInt(searchParams.get('limit'), 20, 1, 100);
    const entity = sanitizeSearchTerm(searchParams.get('entity') || '', 50);
    const action = sanitizeSearchTerm(searchParams.get('action') || '', 50);

    const query: Record<string, unknown> = {};
    if (entity) query.entity = entity;
    if (action) query.action = action;

    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(query),
    ]);

    return NextResponse.json({
      logs,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ message: 'Error fetching audit logs' }, { status: 500 });
  }
}
