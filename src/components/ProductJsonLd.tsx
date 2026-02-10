import React from 'react';

interface ProductJsonLdProps {
  product: {
    id: string | number;
    name: string;
    description: string;
    image?: string;
    category?: string;
    brand?: string;
    composition?: string;
    indications?: string;
    dosage?: string;
    features?: string[];
  };
}

export default function ProductJsonLd({ product }: ProductJsonLdProps) {
  // Handle image URL - if it's already a full URL (cloudinary), use as-is
  const imageUrl = product.image
    ? (product.image.startsWith('http')
      ? product.image
      : `https://astermedicines.com${product.image.startsWith('/') ? product.image : '/' + product.image}`)
    : "https://astermedicines.com/og-image.webp";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": imageUrl,
    "description": product.description || `High-quality ${product.name} manufactured by Aster Medicines Pvt Ltd.`,
    "sku": String(product.id),
    "mpn": String(product.id),
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Aster Medicines"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Aster Medicines Pvt Ltd",
      "url": "https://astermedicines.com"
    },
    "category": product.category || "Pharmaceuticals",

    // Additional properties for rich schema
    ...(product.composition && {
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Composition",
          "value": product.composition
        },
        ...(product.indications ? [{
          "@type": "PropertyValue",
          "name": "Indications",
          "value": product.indications
        }] : []),
        ...(product.dosage ? [{
          "@type": "PropertyValue",
          "name": "Dosage",
          "value": product.dosage
        }] : []),
      ]
    }),

    // Features as keywords
    ...(product.features && product.features.length > 0 && {
      "keywords": product.features.join(", ")
    }),

    "offers": {
      "@type": "Offer",
      "url": `https://astermedicines.com/products/${product.id}`,
      "priceCurrency": "INR",
      "price": "0",
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