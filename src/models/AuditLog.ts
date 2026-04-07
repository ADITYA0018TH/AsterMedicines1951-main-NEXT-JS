import mongoose, { Document, Schema } from 'mongoose';

export type AuditAction =
  | 'product.create'
  | 'product.update'
  | 'product.delete'
  | 'product.bulk_delete'
  | 'product.bulk_import'
  | 'settings.update'
  | 'message.delete'
  | 'message.status_update'
  | 'message.bulk_action'
  | 'visitor.delete'
  | 'auth.login'
  | 'auth.logout'
  | 'auth.password_reset';

export interface IAuditLog extends Document {
  action: AuditAction;
  /** Human-readable summary */
  summary: string;
  /** The entity type affected */
  entity: string;
  /** The entity ID(s) affected */
  entityId?: string;
  /** Snapshot of changed fields (before/after) */
  diff?: Record<string, unknown>;
  /** Admin user identifier (email or session id) */
  performedBy: string;
  ip?: string;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    action: { type: String, required: true, index: true },
    summary: { type: String, required: true },
    entity: { type: String, required: true, index: true },
    entityId: { type: String },
    diff: { type: Schema.Types.Mixed },
    performedBy: { type: String, required: true, index: true },
    ip: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const AuditLog =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
