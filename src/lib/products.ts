import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function getProduct(id: string) {
  try {
    await connectDB();
    const product = await Product.findById(id);

    if (!product) {
      return null;
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
      images: product.images.map((img: string) => img.replace(/lovable-uploads/gi, 'My-uploads')),
      price: product.price,
      availability: product.stock > 0 ? 'In Stock' : 'Out of Stock',
      detailedDescription: product.description,
      composition: 'Available on request - Please contact for detailed composition information',
      indications: 'Please consult healthcare professional for indications and usage',
      dosageInstructions: 'As prescribed by physician',
      sideEffects: 'Consult your healthcare provider for potential side effects',
      precautions: 'Keep out of reach of children. Store in a cool, dry place. Consult physician before use.'
    };

    return transformedProduct;
  } catch (error) {
    console.error('Error in getProduct:', error);
    throw error;
  }
}
