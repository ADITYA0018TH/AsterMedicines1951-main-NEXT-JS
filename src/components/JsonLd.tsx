// This component injects high-quality JSON-LD Structured Data
// It helps Google understand that this is a Manufacturer (Factory) + Organization
export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://astermedicines.com/#organization",
        "name": "Aster Medicines Pvt Ltd",
        "legalName": "Aster Medicines Private Limited",
        "alternateName": ["Aster Medicines", "Aster Medicines Pvt Ltd", "Aster Medicines Private Limited" ],
        "url": "https://astermedicines.com",
        "logo": "https://astermedicines.com/icon.png",
        "email": ["accounts@astermedicines.com", "hr@astermedicines.com", "astermedicinespvtltd@gmail.com"],
        "identifier": {
          "@type": "PropertyValue",
          "propertyID": "CIN",
          "value": "U24230BR2008PTC013937"
        },
        "foundingDate": "1982", // Honoring the established date
        "slogan": "Care For Life",
        "founder": {
          "@type": "Person",
          "name": "Rupesh Anand",
          "jobTitle": "Managing Director"
        },
        // 1. REGISTERED OFFICE (Patna)
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
            "telephone": "+91-7909071165",
            "contactType": "customer service",
            "areaServed": "IN"
          }
        ],
        "sameAs": [
          "https://www.facebook.com/astermedicines/",
          "https://www.indiamart.com/astermedicines/", // Critical for B2B Authority
          "https://www.linkedin.com/company/aster-medicines-pvt-ltd/"
        ]
      },
      {
        "@type": "ManufacturingBusiness",
        "parentOrganization": { "@id": "https://astermedicines.com/#organization" },
        "name": "Aster Medicines Manufacturing Unit",
        "description": "WHO-GMP Certified Manufacturing Unit for Beta-Lactam & Non-Beta Lactam Injections.",
        "image": "https://astermedicines.com/og-image.webp",
        // 2. FACTORY ADDRESS (Hajipur)
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
            "name": "About",
            "item": "https://astermedicines.com/about"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Products",
            "item": "https://astermedicines.com/products"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Contact",
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