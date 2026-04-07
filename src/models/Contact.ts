import mongoose, { Document, Schema } from 'mongoose';

export type PipelineStage = 'New' | 'Contacted' | 'Quoted' | 'Converted' | 'Lost';

export interface IContact extends Document {
  firstName: string;
  lastName?: string;
  email: string;
  mobileNumber: string;
  subject?: string;
  message: string;
  status: 'New' | 'Read' | 'Replied';
  /** CRM pipeline stage */
  pipelineStage: PipelineStage;
  /** Internal admin notes */
  notes?: string;
  createdAt: Date;
}

const ContactSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['New', 'Read', 'Replied'],
    default: 'New',
  },
  pipelineStage: {
    type: String,
    enum: ['New', 'Contacted', 'Quoted', 'Converted', 'Lost'],
    default: 'New',
    index: true,
  },
  notes: {
    type: String,
    maxlength: 5000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if model already exists to prevent OverwriteModelError
const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
