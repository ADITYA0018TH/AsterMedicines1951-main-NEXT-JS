export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalOrganization",
        "@id": "https://astermedicines.com/#organization",
        "name": "Aster Medicines Pvt Ltd",
        "url": "https://astermedicines.com",
        
        // --- UPDATED THIS LINE ---
        // Now pointing to your new square, high-quality logo file
        "logo": "https://astermedicines.com/icon.png", 
        
        "slogan": "Care For Life",
        "foundingDate": "1991",
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
          "telephone": "+91-9934006655", // Make sure to use your real number here
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
        "image": "https://astermedicines.com/og-image-update.webp", // Good to keep a banner image here for the factory
        "telephone": "+91-9934006655", // Add your real number here
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 25.6888,
          "longitude": 85.2166
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