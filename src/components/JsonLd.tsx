
// Enhanced global JSON-LD Structured Data using centralized data
import { organizationStructuredData, websiteStructuredData, localBusinessStructuredData, productCatalogStructuredData, faqStructuredData } from "@/data/structuredData";

export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationStructuredData,
      localBusinessStructuredData,
      websiteStructuredData,
      productCatalogStructuredData,
      faqStructuredData
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}