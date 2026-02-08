import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = {};
    if (category && category !== 'All') {
      query = { category };
    }

    const page = parseInt(searchParams.get('page') || '0');
    const limit = parseInt(searchParams.get('limit') || '0');

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
      id: product._id,
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
        const newProducts = await Product.insertMany(body);
        return NextResponse.json({ message: 'Products created successfully', products: newProducts, count: newProducts.length }, { status: 201 });
    }

    const { 
      name, description, price, category, images, stock, featured, 
      composition, dosageInstructions, indications, sideEffects, precautions,
      isQualityAssured, isGmpCertified, isWhoApproved 
    } = body;

    if (!name || !description || !price || !category || !images) {
      return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
    }

    const newProduct = await Product.create({
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
