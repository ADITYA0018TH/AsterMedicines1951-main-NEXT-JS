const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: '.env' });

// Define Product Schema locally to avoid import issues
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  images: [String],
  stock: Number,
  featured: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({
      images: { $regex: /lovable-uploads/i }
    });

    console.log(`Found ${products.length} products with old image paths.`);

    for (const product of products) {
      let updated = false;
      const newImages = product.images.map(img => {
        if (img.match(/lovable-uploads/i)) {
          updated = true;
          return img.replace(/lovable-uploads/i, 'My-uploads');
        }
        return img;
      });

      if (updated) {
        product.images = newImages;
        await product.save();
        console.log(`Updated product: ${product.name}`);
      }
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
