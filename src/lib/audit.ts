import connectDB from '@/lib/db';
import AuditLog, { AuditAction } from '@/models/AuditLog';

export interface LogAuditParams {
  action: AuditAction;
  summary: string;
  entity: string;
  entityId?: string;
  diff?: Record<string, unknown>;
  performedBy: string;
  ip?: string;
}

/**
 * Write an audit log entry. Fire-and-forget — never throws.
 */
export async function logAudit(params: LogAuditParams): Promise<void> {
  try {
    await connectDB();
    await AuditLog.create(params);
  } catch (err) {
    // Audit logging must never break the main request
    console.error('[AuditLog] Failed to write audit entry:', err);
  }
}
