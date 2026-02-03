import React from 'react';

// Define the shape of the data this component expects
interface ProductJsonLdProps {
  product: {
    id: string;
    name: string;
    description: string;
    image?: string;       // Optional, falls back to placeholder
    category?: string;    // e.g. "Antibiotic Injection"
    brand?: string;       // Defaults to "Aster Medicines"
  };
}

export default function ProductJsonLd({ product }: ProductJsonLdProps) {
  // Use a fallback image if the product doesn't have one
  const imageUrl = product.image
    ? `https://astermedicines.com${product.image.startsWith('/') ? product.image : '/' + product.image}`
    : "https://astermedicines.com/og-image.webp";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": imageUrl,
    "description": product.description || `High-quality ${product.name} manufactured by Aster Medicines Pvt Ltd.`,
    "sku": product.id,
    "mpn": product.id, // Manufacturer Part Number: Critical for B2B/Industrial parts
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Aster Medicines"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Aster Medicines Pvt Ltd"
    },
    "category": product.category || "Pharmaceuticals",

    // Google STRONGLY prefers an 'offers' section, even for B2B.
    // We set a placeholder structure here to avoid "Missing Field" errors.
    "offers": {
      "@type": "Offer",
      "url": `https://astermedicines.com/products/${product.id}`,
      "priceCurrency": "INR",
      "price": "100", // Placeholder: Change this if you have real prices, or leave as a base estimate.
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Aster Medicines Pvt Ltd"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}