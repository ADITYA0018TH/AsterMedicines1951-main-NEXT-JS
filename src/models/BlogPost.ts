import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPost extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  published: boolean;
  publishedAt?: Date;
  /** If set, a cron job will auto-publish at this time */
  scheduledPublishAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    title: { type: String, required: true, maxlength: 300 },
    excerpt: { type: String, required: true, maxlength: 500 },
    content: { type: String, required: true },
    coverImage: { type: String },
    category: { type: String, required: true, index: true },
    tags: { type: [String], default: [] },
    author: { type: String, default: 'Aster Medicines Team' },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date },
    scheduledPublishAt: { type: Date, index: true },
    metaTitle: { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 160 },
  },
  { timestamps: true }
);

const BlogPost =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;
