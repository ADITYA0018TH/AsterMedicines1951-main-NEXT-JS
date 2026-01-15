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
        ...(product.featured ? ['Featured Product'] : []),
        ...(product.isQualityAssured ? ['Quality Assured'] : []),
        ...(product.isGmpCertified ? ['GMP Certified'] : []),
        ...(product.isWhoApproved ? ['WHO Approved'] : [])
      ],
      images: product.images.map((img: string) => img.replace(/lovable-uploads/gi, 'My-uploads')),
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
      isWhoApproved: product.isWhoApproved
    };

    return transformedProduct;
  } catch (error) {
    console.error('Error in getProduct:', error);
    throw error;
  }
}
