import { Product } from '../data/products';

// Generate Product schema for individual product pages
export const generateProductSchema = (product: Product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.detailedDescription || product.description,
  "image": product.images.map(img => `https://aster-medicines.vercel.app${img}`),
  "brand": {
    "@type": "Brand",
    "name": "Aster Medicines PVT LTD"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Aster Medicines PVT LTD",
    "url": "https://aster-medicines.vercel.app"
  },
  "category": product.category,
  "offers": product.price ? {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": "INR",
    "availability": product.availability === "In Stock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    "seller": {
      "@type": "Organization",
      "name": "Aster Medicines PVT LTD"
    }
  } : undefined,
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Dosage",
      "value": product.dosage
    },
    ...(product.composition ? [{
      "@type": "PropertyValue",
      "name": "Composition",
      "value": product.composition
    }] : [])
  ]
});

// Generate BreadcrumbList schema
export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `https://aster-medicines.vercel.app${item.url}`
  }))
});
