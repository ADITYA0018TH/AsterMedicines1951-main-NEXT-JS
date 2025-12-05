import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const transformedProduct = {
      id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      dosage: product.stock ? `${product.stock} units available` : 'Contact for availability',
      features: [
        `Price: ₹${product.price}`,
        `Category: ${product.category}`,
        product.featured ? 'Featured Product' : 'Quality Assured',
        'GMP Certified',
        'WHO Approved'
      ],
      images: product.images,
      price: product.price,
      availability: product.stock > 0 ? 'In Stock' : 'Out of Stock',
      detailedDescription: product.description,
      composition: 'Available on request - Please contact for detailed composition information',
      indications: 'Please consult healthcare professional for indications and usage',
      dosageInstructions: 'As prescribed by physician',
      sideEffects: 'Consult your healthcare provider for potential side effects',
      precautions: 'Keep out of reach of children. Store in a cool, dry place. Consult physician before use.'
    };

    return NextResponse.json(transformedProduct);
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
    const updates = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updates,
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
