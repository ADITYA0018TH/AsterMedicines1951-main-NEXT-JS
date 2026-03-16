import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { generateUniqueProductSlug } from '@/lib/products';
import { getProductSlug } from '@/lib/productSlug';
import { z } from 'zod';
import {
  sanitizeAssetPath,
  sanitizeSearchTerm,
  sanitizeTextForStorage,
  sanitizeUrl,
  toSafeBoolean,
  toSafeInt,
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

const productCreateSchema = z.object({
  name: z.string().min(1).max(200).transform((value) => sanitizeTextForStorage(value, 200)),
  description: z.string().min(1).max(5000).transform((value) => sanitizeTextForStorage(value, 5000)),
  price: z.preprocess((value) => Number(value), z.number().finite().min(0).max(100000000)),
  category: z.string().min(1).max(120).transform((value) => sanitizeTextForStorage(value, 120)),
  images: z.array(productImageSchema).min(1).max(20),
  stock: z.preprocess((value) => value === undefined ? 0 : Number(value), z.number().int().min(0).max(1000000)),
  featured: z.any().optional().transform((value) => toSafeBoolean(value)),
  composition: optionalTextField(2000),
  dosageInstructions: optionalTextField(2000),
  indications: optionalTextField(2000),
  sideEffects: optionalTextField(2000),
  precautions: optionalTextField(2000),
  isQualityAssured: z.any().optional().transform((value) => toSafeBoolean(value)),
  isGmpCertified: z.any().optional().transform((value) => toSafeBoolean(value)),
  isWhoApproved: z.any().optional().transform((value) => toSafeBoolean(value)),
}).strict();

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = sanitizeSearchTerm(searchParams.get('category') || '', 120);

    const query: Record<string, unknown> = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const page = toSafeInt(searchParams.get('page'), 0, 0, 10000);
    const limit = toSafeInt(searchParams.get('limit'), 0, 0, 100);

    let products;
    let total = 0;

    if (page && limit) {
      const skip = (page - 1) * limit;
      total = await Product.countDocuments(query);
      products = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    } else {
      products = await Product.find(query).sort({ createdAt: -1 });
      total = products.length;
    }

    const transformedProducts = products.map(product => ({
      _id: product._id,
      id: product._id.toString(),
      slug: getProductSlug({ name: product.name, slug: product.slug }),
      name: product.name,
      description: product.description,
      category: product.category,
      stock: product.stock,
      featured: product.featured,
      dosage: product.stock ? `${product.stock} ${product.stock === 1 ? 'unit' : 'units'} available` : 'Contact for availability',
      features: [
        `Price: ₹${product.price}`,
        `Category: ${product.category}`,
        ...(product.featured ? ['Featured Product'] : []),
        ...(product.isQualityAssured ? ['Quality Assured'] : []),
        ...(product.isGmpCertified ? ['GMP Certified'] : []),
        ...(product.isWhoApproved ? ['WHO Approved'] : [])
      ],
      images: product.images,
      price: product.price,
      availability: product.stock > 0 ? 'In Stock' : 'Out of Stock',
      detailedDescription: product.description,
      composition: product.composition || 'Available on request',
      indications: product.indications || 'Please consult healthcare professional',
      dosageInstructions: product.dosageInstructions || 'As prescribed by physician',
      sideEffects: product.sideEffects || '',
      precautions: product.precautions || 'Keep out of reach of children. Store in a cool, dry place.',
      isQualityAssured: product.isQualityAssured || false,
      isGmpCertified: product.isGmpCertified || false,
      isWhoApproved: product.isWhoApproved || false
    }));

    if (page && limit) {
      return NextResponse.json({
        products: transformedProducts,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    }

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Handle Bulk Create
    if (Array.isArray(body)) {
        const parsedBulkProducts = z.array(productCreateSchema).min(1).max(200).safeParse(body);

        if (!parsedBulkProducts.success) {
          return NextResponse.json(
            { message: 'Validation Error', errors: parsedBulkProducts.error.format() },
            { status: 400 }
          );
        }

        const reservedSlugs = new Set<string>();
        const productsWithSlugs = [];

        for (const product of parsedBulkProducts.data) {
          const slug = await generateUniqueProductSlug(product.name, undefined, reservedSlugs);
          reservedSlugs.add(slug);
          productsWithSlugs.push({ ...product, slug });
        }

        const newProducts = await Product.insertMany(productsWithSlugs, { ordered: false });
        return NextResponse.json({ message: 'Products created successfully', products: newProducts, count: newProducts.length }, { status: 201 });
    }

    const parsedProduct = productCreateSchema.safeParse(body);
    if (!parsedProduct.success) {
      return NextResponse.json(
        { message: 'Validation Error', errors: parsedProduct.error.format() },
        { status: 400 }
      );
    }

    const {
      name, description, price, category, images, stock, featured,
      composition, dosageInstructions, indications, sideEffects, precautions,
      isQualityAssured, isGmpCertified, isWhoApproved,
    } = parsedProduct.data;

    const slug = await generateUniqueProductSlug(name);

    const newProduct = await Product.create({
      slug,
      name,
      description,
      price,
      category,
      images,
      stock: stock || 0,
      featured: featured || false,
      composition,
      dosageInstructions,
      indications,
      sideEffects,
      precautions,
      isQualityAssured: isQualityAssured || false,
      isGmpCertified: isGmpCertified || false,
      isWhoApproved: isWhoApproved || false,
    });

    return NextResponse.json({ message: 'Product created successfully', product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: 'Error creating product' }, { status: 500 });
  }
}
