import mongoose, { Document, Schema } from 'mongoose';

export interface IVisitor extends Document {
  ip: string;
  userAgent: string;
  path: string;
  visitedAt: Date;
  location?: {
      city: string;
      country: string;
      region: string;
  };
  referrer?: string;
  isp?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  screenResolution?: string;
  language?: string;
  device?: string;
  browser?: {
    name: string;
    version: string;
  };
  os?: {
    name: string;
    version: string;
  };
  deviceType?: string;
  timeSpent?: number; // in seconds
}

const VisitorSchema: Schema = new Schema({
  ip: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  visitedAt: {
    type: Date,
    default: Date.now,
  },
  location: {
      city: { type: String },
      country: { type: String },
      region: { type: String },
  },
  referrer: {
    type: String,
  },
  isp: {
    type: String,
  },
  coordinates: {
    lat: { type: Number },
    lon: { type: Number },
  },
  screenResolution: {
    type: String,
  },
  language: {
    type: String,
  },
  device: {
    type: String,
  },
  browser: {
    name: { type: String },
    version: { type: String },
  },
  os: {
    name: { type: String },
    version: { type: String },
  },
  deviceType: {
    type: String,
  },
  timeSpent: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Check if model already exists to prevent OverwriteModelError
const Visitor = mongoose.models.Visitor || mongoose.model<IVisitor>('Visitor', VisitorSchema);

export default Visitor;
