import connectDB from '@/lib/db';
import ProductModel from '@/models/Product';
import { Product } from '@/types/product';

export async function getProduct(id: string): Promise<Product | null> {
  try {
    await connectDB();
    const product = await ProductModel.findById(id);

    if (!product) {
      return null;
    }

    const transformedProduct: Product = {
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      category: product.category,
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
      composition: product.composition || 'Available on request - Please contact for detailed composition information',
      indications: product.indications || 'Please consult healthcare professional for indications and usage',
      dosageInstructions: product.dosageInstructions || 'As prescribed by physician',
      sideEffects: product.sideEffects || 'Consult your healthcare provider for potential side effects',
      precautions: product.precautions || 'Keep out of reach of children. Store in a cool, dry place. Consult physician before use.',
      isQualityAssured: product.isQualityAssured,
      isGmpCertified: product.isGmpCertified,
      isWhoApproved: product.isWhoApproved,
      stock: product.stock,
      featured: product.featured
    };

    return transformedProduct;
  } catch (error) {
    console.error('Error in getProduct:', error);
    throw error;
  }
}

export async function getRelatedProducts(category: string, currentProductId: string, limit: number = 4): Promise<Product[]> {
  try {
    await connectDB();
    const products = await ProductModel.find({
      category,
      _id: { $ne: currentProductId }
    }).limit(limit);

    return products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      category: product.category,
      dosage: product.stock ? `${product.stock} units` : 'Contact',
      features: [], // Minimal data for card
      images: product.images,
      price: product.price,
      availability: product.stock > 0 ? 'In Stock' : 'Out of Stock',
      isQualityAssured: product.isQualityAssured,
      isGmpCertified: product.isGmpCertified,
      isWhoApproved: product.isWhoApproved
    }));
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    return [];
  }
}

export async function getAllProducts(): Promise<{ id: string; updatedAt: Date }[]> {
  try {
    await connectDB();
    const products = await ProductModel.find({}, '_id updatedAt').lean();
    return products.map(p => ({
      id: p._id.toString(),
      updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    }));
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return [];
  }
}
