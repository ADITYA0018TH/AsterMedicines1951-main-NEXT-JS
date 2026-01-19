export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalOrganization",
        "@id": "https://astermedicines.com/#organization",
        "name": "Aster Medicines Pvt Ltd",
        "url": "https://astermedicines.com",
        "logo": "https://astermedicines.com/og-image-update.webp", // Ensure this logo URL is correct
        "slogan": "Precision Pharmaceutical Manufacturing",
        "foundingDate": "1991", // Consistent with your text
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Plot No E/4, Industrial Area",
          "addressLocality": "Hajipur",
          "addressRegion": "Bihar",
          "postalCode": "844101",
          "addressCountry": "IN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "sales",
          "areaServed": "IN",
          "availableLanguage": ["en", "hi"]
        },
        "sameAs": [
          "https://www.indiamart.com/astermedicines/",
          "https://www.facebook.com/astermedicines/"
        ]
      },
      {
        "@type": "ManufacturingBusiness",
        "parentOrganization": { "@id": "https://astermedicines.com/#organization" },
        "name": "Aster Medicines Manufacturing Unit",
        "image": "https://astermedicines.com/factory-image.jpg", // Replace with real factory image
        "telephone": "+91-0000000000", // Add your official number
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 25.6888, // Approximate Hajipur Industrial Area lat
          "longitude": 85.2166   // Approximate Hajipur Industrial Area long
        },
        "priceRange": "$$"
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