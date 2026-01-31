export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://astermedicines.com/#organization",
        "name": "Aster Medicines Pvt Ltd",
        "legalName": "Aster Medicines Private Limited",
        "alternateName": ["Aster Medicines", "Aster Pharma"],
        "url": "https://astermedicines.com",
        "logo": "https://astermedicines.com/icon.png",
        "email": "accounts@astermedicines.com",
        // Trust Signal: Using the CIN (Corporate Identity Number) proves you are a real Indian entity
        "identifier": {
          "@type": "PropertyValue",
          "propertyID": "CIN",
          "value": "U24230BR2008PTC013937"
        },
        // SEO Win: Mentioning the 1982 roots shows legacy
        "foundingDate": "2008-09-17",
        "slogan": "Care For Life",
        "founder": {
          "@type": "Person",
          "name": "Rupesh Anand",
          "jobTitle": "Managing Director"
        },
        // 1. REGISTERED OFFICE (Patna) - Critical for Local SEO in Govind Mitra Road
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "North of Janta Hotel, 1st Floor, Govind Mitra Road",
          "addressLocality": "Patna",
          "addressRegion": "Bihar",
          "postalCode": "800004",
          "addressCountry": "IN"
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+91-9934006655",
            "contactType": "sales",
            "areaServed": "IN",
            "availableLanguage": ["en", "hi"]
          },
          {
            "@type": "ContactPoint",
            "telephone": "+91-7909071165", // Verified number from trade directories
            "contactType": "customer service",
            "areaServed": "IN"
          }
        ],
        "sameAs": [
          "https://www.facebook.com/astermedicines/",
          "https://www.indiamart.com/astermedicines/", // Strong B2B Signal
          "https://www.linkedin.com/company/aster-medicines-pvt-ltd/"
        ]
      },
      {
        "@type": "ManufacturingBusiness",
        "parentOrganization": { "@id": "https://astermedicines.com/#organization" },
        "name": "Aster Medicines Manufacturing Unit",
        "description": "WHO-GMP Certified Manufacturing Unit for Beta-Lactam & Non-Beta Lactam Injections.",
        "image": "https://astermedicines.com/og-image-update.webp",
        // 2. FACTORY ADDRESS (Hajipur) - Critical for 'Manufacturer' keywords
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Plot No E/4, Industrial Area",
          "addressLocality": "Hajipur",
          "addressRegion": "Bihar",
          "postalCode": "844102",
          "addressCountry": "IN"
        },
        "telephone": "+91-9934006655",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 25.6888,
          "longitude": 85.2166
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "opens": "09:00",
          "closes": "18:00"
        },
        "priceRange": "$$"
      },
      // 3. PRODUCT CATALOG - Helps you rank for specific drug names
      {
        "@type": "OfferCatalog",
        "name": "Pharmaceutical Products",
        "itemListElement": [
          {
            "@type": "Product",
            "name": "Meropenem Injection",
            "brand": "Nexomer",
            "category": "Critical Care Injection"
          },
          {
            "@type": "Product",
            "name": "Ondansetron Injection",
            "brand": "ON2",
            "category": "Antiemetic"
          },
          {
            "@type": "Product",
            "name": "AD Vitamin Baby Massage Oil",
            "category": "Pediatric Care"
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