import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import ProductModel from '@/models/Product';
import { Product } from '@/types/product';
import { products as staticProducts } from '@/data/products';
import type { Product as StaticProduct } from '@/data/products';
import { isValidObjectId } from '@/lib/inputSecurity';
import {
  extractIdentifierFromProductSegment,
  getLegacyProductSlug,
  getProductSlug,
  normalizeProductRouteSegment,
  slugifyProductName,
} from '@/lib/productSlug';

type ProductRecord = {
  _id: { toString(): string };
  slug?: string;
  name: string;
  description: string;
  category: string;
  stock?: number;
  strengthVariants?: string[];
  packagingOptions?: string[];
  storageConditions?: string;
  shelfLife?: string;
  featured?: boolean;
  images: string[];
  price: number;
  composition?: string;
  indications?: string;
  dosageInstructions?: string;
  sideEffects?: string;
  precautions?: string;
  isQualityAssured?: boolean;
  isGmpCertified?: boolean;
  isWhoApproved?: boolean;
  updatedAt?: Date | string;
};

const staticSlugs = new Set(
  staticProducts.map((product) => getProductSlug({ name: product.name, slug: product.slug }))
);

function toProductRecord(product: unknown): ProductRecord {
  return product as ProductRecord;
}

function buildProduct(product: ProductRecord, slug: string): Product {
  const stock = product.stock || 0;
  const featured = product.featured || false;

  return {
    id: product._id.toString(),
    slug,
    name: product.name,
    description: product.description,
    category: product.category,
    dosage: product.strengthVariants?.join(', ') || '',
    strengthVariants: product.strengthVariants,
    packagingOptions: product.packagingOptions,
    storageConditions: product.storageConditions,
    shelfLife: product.shelfLife,
    features: [
      `Price: ₹${product.price}`,
      `Category: ${product.category}`,
      ...(featured ? ['Featured Product'] : []),
      ...(product.isQualityAssured ? ['Quality Assured'] : []),
      ...(product.isGmpCertified ? ['GMP Certified'] : []),
      ...(product.isWhoApproved ? ['WHO Approved'] : []),
    ],
    images: product.images,
    price: product.price,
    availability: stock > 0 ? 'In Stock' : 'Out of Stock',
    detailedDescription: product.description,
    composition: product.composition || 'Available on request - Please contact for detailed composition information',
    indications: product.indications || 'Please consult healthcare professional for indications and usage',
    dosageInstructions: product.dosageInstructions || 'As prescribed by physician',
    sideEffects: product.sideEffects || 'Consult your healthcare provider for potential side effects',
    precautions: product.precautions || 'Keep out of reach of children. Store in a cool, dry place. Consult physician before use.',
    isQualityAssured: product.isQualityAssured,
    isGmpCertified: product.isGmpCertified,
    isWhoApproved: product.isWhoApproved,
    stock,
    featured,
  };
}

function transformProduct(product: ProductRecord): Product {
  return buildProduct(product, getProductSlug({ name: product.name, slug: product.slug }));
}

function transformStaticProduct(product: StaticProduct): Product {
  const slug = getProductSlug({ name: product.name, slug: product.slug });

  return {
    ...product,
    id: product.id.toString(),
    slug,
    stock: 0,
    featured: false,
    price: product.price || 0,
    availability: product.availability || 'Contact',
  };
}

function findStaticProduct(routeSegment: string): Product | null {
  const exactIdMatch = staticProducts.find((product) => product.id.toString() === routeSegment);
  if (exactIdMatch) {
    return transformStaticProduct(exactIdMatch);
  }

  const slugMatch = staticProducts.find((product) => {
    const canonicalSlug = getProductSlug({ name: product.name, slug: product.slug });
    const legacySlug = getLegacyProductSlug(product.name, product.id);

    return routeSegment === canonicalSlug || routeSegment === legacySlug;
  });
  if (slugMatch) {
    return transformStaticProduct(slugMatch);
  }

  // Only use extracted numeric IDs when they match the legacy slug format (name-id).
  // Do NOT blindly extract trailing numbers from arbitrary slugs, as slugs like
  // "dextrose-injection-i-p-50-2" would falsely extract "2" and match product id=2.
  const extractedId = extractIdentifierFromProductSegment(routeSegment);
  if (extractedId && /^\d+$/.test(extractedId)) {
    const idMatch = staticProducts.find((product) => {
      const legacySlug = getLegacyProductSlug(product.name, product.id);
      return product.id.toString() === extractedId && routeSegment === legacySlug;
    });
    if (idMatch) {
      return transformStaticProduct(idMatch);
    }
  }

  return null;
}


export async function generateUniqueProductSlug(
  name: string,
  excludeProductId?: string,
  reservedSlugs: Set<string> = new Set(),
): Promise<string> {
  const baseSlug = slugifyProductName(name);
  const queryBase: Record<string, unknown> = {};
  if (excludeProductId && isValidObjectId(excludeProductId)) {
    queryBase._id = { $ne: new mongoose.Types.ObjectId(excludeProductId) };
  }

  for (let suffix = 1; suffix <= 10000; suffix += 1) {
    const candidate = suffix === 1 ? baseSlug : `${baseSlug}-${suffix}`;
    if (staticSlugs.has(candidate) || reservedSlugs.has(candidate)) {
      continue;
    }

    const existing = await ProductModel.findOne({ ...queryBase, slug: candidate }, '_id').lean();
    if (!existing) {
      return candidate;
    }
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = `${baseSlug}-${Date.now()}-${attempt + 1}`;
    if (staticSlugs.has(candidate) || reservedSlugs.has(candidate)) {
      continue;
    }

    const existing = await ProductModel.findOne({ ...queryBase, slug: candidate }, '_id').lean();
    if (!existing) {
      return candidate;
    }
  }

  throw new Error('Unable to generate a unique product slug');
}

export type ProductSlugBackfillResult = {
  dryRun: boolean;
  scanned: number;
  updated: number;
  unchanged: number;
  failed: number;
  updates: Array<{
    id: string;
    name: string;
    previousSlug: string | null;
    nextSlug: string;
  }>;
  failures: Array<{
    id: string;
    name: string;
    reason: string;
  }>;
};

export async function backfillProductSlugs(options?: {
  dryRun?: boolean;
  limit?: number;
}): Promise<ProductSlugBackfillResult> {
  const dryRun = options?.dryRun === true;
  const limit = options?.limit && options.limit > 0 ? Math.floor(options.limit) : 0;

  await connectDB();

  const query = ProductModel.find({}, '_id name slug').sort({ _id: 1 });
  if (limit > 0) {
    query.limit(limit);
  }

  const products = await query;
  const reservedSlugs = new Set(staticSlugs);

  const result: ProductSlugBackfillResult = {
    dryRun,
    scanned: products.length,
    updated: 0,
    unchanged: 0,
    failed: 0,
    updates: [],
    failures: [],
  };

  for (const product of products) {
    const record = toProductRecord(product);
    const id = record._id.toString();
    const previousSlug = typeof record.slug === 'string' && record.slug ? record.slug : null;

    try {
      const canonicalSlug = getProductSlug({ name: record.name, slug: record.slug });
      const currentSlug = previousSlug ? previousSlug.trim().toLowerCase() : '';

      const isNormalized = Boolean(currentSlug) && currentSlug === canonicalSlug;
      const isCollision = reservedSlugs.has(canonicalSlug);

      if (isNormalized && !isCollision) {
        reservedSlugs.add(canonicalSlug);
        result.unchanged += 1;
        continue;
      }

      const nextSlug = await generateUniqueProductSlug(record.name, id, reservedSlugs);
      reservedSlugs.add(nextSlug);

      if (!dryRun) {
        await ProductModel.updateOne({ _id: record._id }, { $set: { slug: nextSlug } });
      }

      result.updated += 1;
      result.updates.push({
        id,
        name: record.name,
        previousSlug,
        nextSlug,
      });
    } catch (error) {
      result.failed += 1;
      result.failures.push({
        id,
        name: record.name,
        reason: error instanceof Error ? error.message : 'Unknown error during slug backfill',
      });
    }
  }

  return result;
}

async function ensureDbProductSlug(product: ProductRecord): Promise<string> {
  if (product.slug) {
    const normalized = getProductSlug({ name: product.name, slug: product.slug });
    if (normalized === product.slug) {
      return normalized;
    }

    try {
      await ProductModel.updateOne({ _id: product._id }, { $set: { slug: normalized } });
      return normalized;
    } catch {
      const fallback = await generateUniqueProductSlug(product.name, product._id.toString());
      await ProductModel.updateOne({ _id: product._id }, { $set: { slug: fallback } });
      return fallback;
    }
  }

  const generatedSlug = await generateUniqueProductSlug(product.name, product._id.toString());
  await ProductModel.updateOne(
    { _id: product._id, $or: [{ slug: { $exists: false } }, { slug: '' }, { slug: null }] },
    { $set: { slug: generatedSlug } },
  );

  return generatedSlug;
}

export async function getProduct(id: string): Promise<Product | null> {
  const routeSegment = normalizeProductRouteSegment(id).toLowerCase();
  if (!routeSegment) {
    return null;
  }

  const staticMatch = findStaticProduct(routeSegment);
  if (staticMatch) {
    return staticMatch;
  }

  try {
    await connectDB();

    const slugProduct = await ProductModel.findOne({ slug: routeSegment });
    if (slugProduct) {
      return transformProduct(toProductRecord(slugProduct));
    }

    const directObjectId = isValidObjectId(routeSegment) ? routeSegment : null;
    const extractedIdentifier = extractIdentifierFromProductSegment(routeSegment);
    const extractedObjectId = extractedIdentifier && isValidObjectId(extractedIdentifier)
      ? extractedIdentifier
      : null;

    const preferredObjectId = directObjectId || extractedObjectId;
    if (preferredObjectId) {
      const product = await ProductModel.findById(preferredObjectId);
      if (product) {
        const record = toProductRecord(product);
        const slug = await ensureDbProductSlug(record);
        return buildProduct(record, slug);
      }
    }

    const dbProducts = await ProductModel.find({});
    const slugMatchedProduct = dbProducts.find((product) => {
      const record = toProductRecord(product);
      const canonicalSlug = getProductSlug({ name: record.name, slug: record.slug });
      const fallbackNameSlug = slugifyProductName(record.name);
      const legacySlug = getLegacyProductSlug(record.name, record._id.toString());

      return (
        routeSegment === canonicalSlug
        || routeSegment === fallbackNameSlug
        || routeSegment === legacySlug
      );
    });

    if (!slugMatchedProduct) {
      return null;
    }

    const slugMatchedRecord = toProductRecord(slugMatchedProduct);
    const slug = await ensureDbProductSlug(slugMatchedRecord);
    return buildProduct(slugMatchedRecord, slug);
  } catch (error) {
    console.error('Error in getProduct:', error);
    throw error;
  }
}

export async function getRelatedProducts(category: string, currentProductId: string, limit: number = 4): Promise<Product[]> {
  // Get related from static data
  const staticRelated = staticProducts
    .filter(p => p.category === category && p.id.toString() !== currentProductId)
    .slice(0, limit)
    .map(transformStaticProduct);

  try {
    await connectDB();
    const query: Record<string, unknown> = { category };
    if (isValidObjectId(currentProductId)) {
      query._id = { $ne: new mongoose.Types.ObjectId(currentProductId) };
    }

    const products = await ProductModel.find({
      ...query,
    }).limit(limit);

    const dbRelated = await Promise.all(
      products.map(async (product) => {
        const record = toProductRecord(product);
        const slug = await ensureDbProductSlug(record);

        return {
          id: record._id.toString(),
          slug,
          name: record.name,
          description: record.description,
          category: record.category,
          dosage: product.strengthVariants?.join(', ') || '',
          features: [], // Minimal data for card
          images: record.images,
          price: record.price,
          availability: record.stock && record.stock > 0 ? 'In Stock' : 'Out of Stock',
          isQualityAssured: record.isQualityAssured,
          isGmpCertified: record.isGmpCertified,
          isWhoApproved: record.isWhoApproved,
        } as Product;
      })
    );

    // Combine and limit
    return [...staticRelated, ...dbRelated].slice(0, limit);
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    return staticRelated;
  }
}

export async function getAllProducts(): Promise<{ id: string; name: string; slug: string; updatedAt: Date }[]> {
  const staticIds = staticProducts.map(p => ({
    id: p.id.toString(),
    name: p.name,
    slug: getProductSlug({ name: p.name, slug: p.slug }),
    updatedAt: new Date()
  }));

  try {
    await connectDB();
    const products = await ProductModel.find({}, '_id name slug updatedAt');
    const dbIds = await Promise.all(
      products.map(async (product) => {
        const record = toProductRecord(product);
        const slug = await ensureDbProductSlug(record);

        return {
          id: record._id.toString(),
          name: record.name,
          slug,
          updatedAt: record.updatedAt ? new Date(record.updatedAt) : new Date(),
        };
      })
    );

    return [...staticIds, ...dbIds];
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return staticIds;
  }
}

export async function getAllProductsFull(): Promise<Product[]> {
  const staticFull = staticProducts.map(transformStaticProduct);

  try {
    await connectDB();
    const products = await ProductModel.find({});
    const dbFull = await Promise.all(
      products.map(async (product) => {
        const record = toProductRecord(product);
        const slug = await ensureDbProductSlug(record);
        return buildProduct(record, slug);
      })
    );

    return [...staticFull, ...dbFull];
  } catch (error) {
    console.error('Error in getAllProductsFull:', error);
    return staticFull;
  }
}
