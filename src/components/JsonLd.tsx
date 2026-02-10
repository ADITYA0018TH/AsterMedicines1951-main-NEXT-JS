// Enhanced global JSON-LD Structured Data using centralized data
import { organizationStructuredData, websiteStructuredData, localBusinessStructuredData } from "@/data/structuredData";

export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationStructuredData,
      localBusinessStructuredData,
      websiteStructuredData,
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://astermedicines.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "About Aster Medicines",
            "item": "https://astermedicines.com/about"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Products - Injections, Syrups & Baby Care",
            "item": "https://astermedicines.com/products"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Contact Us",
            "item": "https://astermedicines.com/contact"
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}