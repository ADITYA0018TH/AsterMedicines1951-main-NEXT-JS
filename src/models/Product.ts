import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  slug?: string;
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
  /** e.g. ["1g Vial", "500mg Vial"] */
  strengthVariants?: string[];
  /** e.g. ["10 vials/box", "1 vial/box"] */
  packagingOptions?: string[];
  /** e.g. "Store below 25°C, away from light" */
  storageConditions?: string;
  /** e.g. "24 months" */
  shelfLife?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  slug: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
    index: true,
  },
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
  strengthVariants: {
    type: [String],
    default: [],
  },
  packagingOptions: {
    type: [String],
    default: [],
  },
  storageConditions: {
    type: String,
    required: false,
  },
  shelfLife: {
    type: String,
    required: false,
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
