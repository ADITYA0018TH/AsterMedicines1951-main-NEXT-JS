
// Enhanced global JSON-LD Structured Data using centralized data
import { generateOrganizationData, websiteStructuredData, localBusinessStructuredData, generateProductCatalogData, faqStructuredData, patnaOfficeStructuredData } from "@/data/structuredData";
import { getAllProductsFull } from "@/lib/products";
import { categories } from "@/data/products"; // Note: accessing static categories is fine, or we can fetch them if dynamic

export default async function JsonLd() {
  // Fetch real product data from DB for SEO
  const products = await getAllProductsFull();

  // Generate dynamic structured data
  const organizationData = generateOrganizationData(products, categories);
  const productCatalogData = generateProductCatalogData(products);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationData,
      localBusinessStructuredData,
      patnaOfficeStructuredData,
      websiteStructuredData,
      productCatalogData,
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