import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  featured: boolean;
  composition?: string;
  dosageInstructions?: string;
  indications?: string;
  sideEffects?: string;
  precautions?: string;
  isQualityAssured?: boolean;
  isGmpCertified?: boolean;
  isWhoApproved?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  composition: {
    type: String,
    required: false,
  },
  dosageInstructions: {
    type: String,
    required: false,
  },
  indications: {
    type: String,
    required: false,
  },
  sideEffects: {
    type: String,
    required: false,
  },
  precautions: {
    type: String,
    required: false,
  },
  isQualityAssured: {
    type: Boolean,
    default: false,
  },
  isGmpCertified: {
    type: Boolean,
    default: false,
  },
  isWhoApproved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Check if model already exists to prevent OverwriteModelError
// In development, we need to delete the model to allow schema updates to take effect
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Product;
}

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
