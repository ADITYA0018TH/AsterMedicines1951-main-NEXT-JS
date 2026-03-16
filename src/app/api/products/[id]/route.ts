import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getProduct } from '@/lib/products';
import { z } from 'zod';
import {
  isValidObjectId,
  sanitizeAssetPath,
  sanitizeTextForStorage,
  sanitizeUrl,
  toSafeBoolean,
} from '@/lib/inputSecurity';

const optionalTextField = (maxLength: number) =>
  z.string().max(maxLength).optional().transform((value) => {
    if (typeof value !== 'string') {
      return undefined;
    }
    const sanitized = sanitizeTextForStorage(value, maxLength);
    return sanitized || undefined;
  });

const productImageSchema = z.string().min(1).max(2048).transform((value) => {
  const safeUrl = sanitizeUrl(value, 2048);
  if (safeUrl) {
    return safeUrl;
  }

  const safeAssetPath = sanitizeAssetPath(value, 2048);
  return safeAssetPath;
}).refine((value) => Boolean(value), 'Invalid image URL');

const productUpdateSchema = z.object({
  name: z.string().min(1).max(200).transform((value) => sanitizeTextForStorage(value, 200)).optional(),
  description: z.string().min(1).max(5000).transform((value) => sanitizeTextForStorage(value, 5000)).optional(),
  price: z.preprocess((value) => Number(value), z.number().finite().min(0).max(100000000)).optional(),
  category: z.string().min(1).max(120).transform((value) => sanitizeTextForStorage(value, 120)).optional(),
  images: z.array(productImageSchema).min(1).max(20).optional(),
  stock: z.preprocess((value) => Number(value), z.number().int().min(0).max(1000000)).optional(),
  featured: z.any().optional().transform((value) => value === undefined ? undefined : toSafeBoolean(value)),
  composition: optionalTextField(2000),
  dosageInstructions: optionalTextField(2000),
  indications: optionalTextField(2000),
  sideEffects: optionalTextField(2000),
  precautions: optionalTextField(2000),
  isQualityAssured: z.any().optional().transform((value) => value === undefined ? undefined : toSafeBoolean(value)),
  isGmpCertified: z.any().optional().transform((value) => value === undefined ? undefined : toSafeBoolean(value)),
  isWhoApproved: z.any().optional().transform((value) => value === undefined ? undefined : toSafeBoolean(value)),
}).strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required for update');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: 'Invalid product id' }, { status: 400 });
    }

    const product = await getProduct(id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Error fetching product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: 'Invalid product id' }, { status: 400 });
    }

    const parsedUpdates = productUpdateSchema.safeParse(await request.json());

    if (!parsedUpdates.success) {
      return NextResponse.json(
        { message: 'Validation Error', errors: parsedUpdates.error.format() },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: parsedUpdates.data },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: 'Invalid product id' }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
  }
}
