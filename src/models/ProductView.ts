import mongoose, { Document, Schema } from 'mongoose';

export interface IProductView extends Document {
  productId: string;
  productSlug: string;
  productName: string;
  category: string;
  viewedAt: Date;
  visitorId?: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  deviceType?: string;
}

const ProductViewSchema: Schema = new Schema({
  productId: {
    type: String,
    required: true,
    index: true,
  },
  productSlug: {
    type: String,
    required: true,
    index: true,
  },
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  visitorId: {
    type: String,
  },
  ip: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  referrer: {
    type: String,
  },
  deviceType: {
    type: String,
  },
}, {
  timestamps: true,
});

// Compound indexes for efficient queries
ProductViewSchema.index({ productId: 1, viewedAt: -1 });
ProductViewSchema.index({ category: 1, viewedAt: -1 });

const ProductView = mongoose.models.ProductView || mongoose.model<IProductView>('ProductView', ProductViewSchema);

export default ProductView;
