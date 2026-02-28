import { products } from "./products";

// ============================================================
// ORGANIZATION - Accurate company details for brand searches
// ============================================================
// ============================================================
// ORGANIZATION - Accurate company details for brand searches
// ============================================================
export const generateOrganizationData = (products: any[], categories: string[]) => ({
  "@type": "Organization",
  "@id": "https://astermedicines.com/#organization",
  "name": "Aster Medicines Pvt Ltd",
  "legalName": "Aster Medicines Private Limited",
  "alternateName": [
    "Aster Medicines",
    "Aster Medicines Pvt Ltd",
    "Aster Medicines Private Limited",
    "Aster Pharma",
    "Aster",
    "Aster Medicines India",
    "AM Pvt Ltd"
  ],
  "description": "Aster Medicines Pvt Ltd (CIN: U24230BR2008PTC013937) is a WHO-GMP & ISO 9001:2015 certified pharmaceutical manufacturer established in 1982. Specializing in Critical Care Injections (Meropenem, Ceftriaxone, Amikacin), Syrups, Baby Massage Oil. Factory at Hajipur Industrial Area, Bihar. Registered office at Govind Mitra Road, Patna.",
  "url": "https://astermedicines.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://astermedicines.com/icon.png",
    "width": "512",
    "height": "512"
  },
  "image": "https://astermedicines.com/og-image.webp",
  "foundingDate": "1982",
  "slogan": "Care For Life",
  "industry": "Pharmaceutical Manufacturing",
  "identifier": {
    "@type": "PropertyValue",
    "propertyID": "CIN",
    "value": "U24230BR2008PTC013937"
  },
  "disambiguatingDescription": "Aster Medicines Pvt Ltd (Bihar) is a distinct pharmaceutical manufacturing company established in 1982 by Late Mr. Raj Kumar. It is unrelated to Aster DM Healthcare or Dr. Azad Moopen.",
  "founder": {
    "@type": "Person",
    "name": "Late Mr. Raj Kumar",
    "jobTitle": "Founder",
    "nationality": "Indian",
    "gender": "Male",
    "affiliation": {
      "@type": "Organization",
      "name": "Aster Medicines Pvt Ltd"
    },
    "disambiguatingDescription": "Founder of Aster Medicines Pvt Ltd (Bihar, 1982). Distinct from Dr. Azad Moopen of Aster DM Healthcare."
  },
  "employee": {
    "@type": "Person",
    "name": "Rupesh Anand",
    "jobTitle": "Managing Director"
  },
  "address": [
    {
      "@type": "PostalAddress",
      "name": "Registered Office",
      "streetAddress": "North of Janta Hotel, 1st Floor, Govind Mitra Road",
      "addressLocality": "Patna",
      "addressRegion": "Bihar",
      "postalCode": "800004",
      "addressCountry": "IN"
    },
    {
      "@type": "PostalAddress",
      "name": "Manufacturing Unit",
      "streetAddress": "Plot No E/4, Industrial Area",
      "addressLocality": "Hajipur",
      "addressRegion": "Bihar",
      "postalCode": "844102",
      "addressCountry": "IN"
    }
  ],
  "email": [
    "accounts@astermedicines.com",
    "hr@astermedicines.com",
    "astermedicinespvtltd@gmail.com"
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+91-9934006655",
      "contactType": "sales",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    },
    {
      "@type": "ContactPoint",
      "telephone": "+91-7909071165",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    }
  ],
  "sameAs": [
    "https://www.facebook.com/astermedicines/",
    "https://www.indiamart.com/astermedicines/",
    "https://www.linkedin.com/company/aster-medicines-pvt-ltd/"
  ],
  "areaServed": [
    { "@type": "State", "name": "Bihar" },
    { "@type": "State", "name": "Jharkhand" },
    { "@type": "State", "name": "Uttar Pradesh" },
    { "@type": "State", "name": "West Bengal" },
    { "@type": "Country", "name": "India" }
  ],
  "knowsAbout": [
    "Pharmaceutical Manufacturing",
    "Injectable Medicines",
    "Critical Care Injections",
    "Beta-Lactam Antibiotics",
    "Non Beta-Lactam Injections",
    "GMP Compliance",
    "WHO GMP Certification",
    "ISO 9001:2015",
    "Third Party Manufacturing",
    "PCD Pharma Franchise",
    "Contract Manufacturing",
    "Government Tender Supply",
    // Specific product names for search matching
    "Meropenem Injection",
    "Ceftriaxone Injection",
    "Amikacin Injection",
    "Ondansetron Injection",
    "Adrenaline Injection",
    "Atropine Injection",
    "Dexamethasone Injection",
    "Frusemide Injection",
    "Calcium Gluconate Injection",
    "Aminophylline Injection",
    "Lignocaine Injection",
    "Sodium Bicarbonate Injection",
    "Dextrose Injection",
    "Baby Massage Oil",
    "B-Complex Syrup",
    "Digestive Enzyme Syrup",
    "Amoxicillin Clavulanate Injection"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Aster Medicines Product Catalog",
    "itemListElement": categories.filter(c => c !== "All").map(category => ({
      "@type": "OfferCatalog",
      "name": category,
      "itemListElement": products
        .filter(p => p.category === category)
        .map(p => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": p.name,
            "description": p.description,
            "image": p.images[0],
            "sku": String(p.id),
            "url": `https://astermedicines.com/products/${p.id}`,
            "brand": {
              "@type": "Brand",
              "name": "Aster Medicines"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://astermedicines.com/products/${p.id}`,
              "availability": "https://schema.org/InStock",
              "priceCurrency": "INR",
              "price": "0",
              "priceValidUntil": "2027-12-31",
              "itemCondition": "https://schema.org/NewCondition",
              "seller": {
                "@type": "Organization",
                "name": "Aster Medicines Pvt Ltd"
              }
            }
          }
        }))
    }))
  }
});

// ============================================================
// WEBSITE - For sitelinks search box in Google
// ============================================================
export const websiteStructuredData = {
  "@type": "WebSite",
  "@id": "https://astermedicines.com/#website",
  "name": "Aster Medicines Pvt Ltd",
  "alternateName": ["Aster Medicines", "Aster Pharma"],
  "url": "https://astermedicines.com",
  "description": "Official website of Aster Medicines Pvt Ltd - Leading WHO-GMP certified pharmaceutical manufacturer in Bihar, India. Manufacturer of injections, syrups, and baby care products.",
  "publisher": { "@id": "https://astermedicines.com/#organization" },
  "inLanguage": ["en", "hi", "ja"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://astermedicines.com/products?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// ============================================================
// PRODUCT CATALOG - Real products for rich results
// ============================================================
// ============================================================
// PRODUCT CATALOG - Real products for rich results
// ============================================================
export const generateProductCatalogData = (products: any[]) => ({
  "@type": "ItemList",
  "@id": "https://astermedicines.com/products/#itemlist",
  "name": "Aster Medicines Complete Product Catalog",
  "description": "Full range of pharmaceutical products manufactured by Aster Medicines Pvt Ltd including injections, syrups, and baby care products",
  "numberOfItems": products.length,
  "itemListOrder": "https://schema.org/ItemListOrderAscending",
  "itemListElement": products.map((product, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Product",
      "name": product.name,
      "description": product.detailedDescription || product.description,
      "category": product.category,
      "image": product.images[0],
      "url": `https://astermedicines.com/products/${product.id}`,
      "brand": {
        "@type": "Brand",
        "name": "Aster Medicines"
      },
      "manufacturer": {
        "@type": "Organization",
        "name": "Aster Medicines Pvt Ltd"
      },
      ...(product.composition && {
        "additionalProperty": {
          "@type": "PropertyValue",
          "name": "Composition",
          "value": product.composition
        }
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
    }
  }))
});

export const productCatalogStructuredData = generateProductCatalogData(products);

// ============================================================
// FAQ - Comprehensive questions for FAQ rich results
// ============================================================
export const faqStructuredData = {
  "@type": "FAQPage",
  "@id": "https://astermedicines.com/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Aster Medicines Pvt Ltd?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aster Medicines Pvt Ltd (also known as Aster Medicines Private Limited) is a WHO-GMP and ISO 9001:2015 certified pharmaceutical manufacturing company established in 1982. Our CIN is U24230BR2008PTC013937. We manufacture pharmaceutical injections, syrups, and baby care products at our factory in Hajipur Industrial Area, Bihar, India."
      }
    },
    {
      "@type": "Question",
      "name": "What products does Aster Medicines manufacture?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aster Medicines manufactures a wide range of pharmaceutical products including: Critical Care Injections (Meropenem, Ceftriaxone, Amikacin), Emergency Medicine Injections (Adrenaline, Atropine, Sodium Bicarbonate), IV Solutions (Dextrose 25% and 50%), Cardiovascular drugs (Frusemide), Antibiotics (Amoxicillin-Clavulanate), Respiratory medicines (Aminophylline), Corticosteroids (Dexamethasone), Anesthetics (Lignocaine), Syrups (B-Codex, Lu-Zyme), and Baby Massage Oil (Aster AD Vitamin Oil)."
      }
    },
    {
      "@type": "Question",
      "name": "Where is Aster Medicines located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aster Medicines has two locations in Bihar, India. Our registered office is at North of Janta Hotel, 1st Floor, Govind Mitra Road, Patna 800004. Our WHO-GMP certified manufacturing plant is at Plot No E/4, Industrial Area, Hajipur, Vaishali, Bihar 844102."
      }
    },
    {
      "@type": "Question",
      "name": "Is Aster Medicines WHO-GMP certified?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Aster Medicines Pvt Ltd holds WHO-GMP (Good Manufacturing Practices) certification and ISO 9001:2015 certification. Our manufacturing facility in Hajipur follows strict quality control measures and international pharmaceutical manufacturing standards."
      }
    },
    {
      "@type": "Question",
      "name": "Does Aster Medicines offer Third Party Manufacturing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Aster Medicines provides Third Party Manufacturing (Contract Manufacturing) services for pharmaceutical companies. We offer manufacturing of injections, syrups, and other dosage forms with customized formulations and packaging as per your requirements."
      }
    },
    {
      "@type": "Question",
      "name": "Does Aster Medicines offer PCD Pharma Franchise?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Aster Medicines offers PCD (Propaganda Cum Distribution) Pharma Franchise opportunities across India. We provide monopoly rights, promotional support, and a wide product range for pharma entrepreneurs looking to start their own distribution business."
      }
    },
    {
      "@type": "Question",
      "name": "How to contact Aster Medicines?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can contact Aster Medicines through: Phone: +91-9934006655 or +91-7909071165, Email: accounts@astermedicines.com or astermedicinespvtltd@gmail.com, Visit our registered office at Govind Mitra Road, Patna, Bihar 800004, or factory at Industrial Area E/4, Hajipur, Bihar 844102. You can also reach us through our website at https://astermedicines.com/contact."
      }
    },
    {
      "@type": "Question",
      "name": "Who is the founder of Aster Medicines?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aster Medicines was established in 1982 by Late Mr. Raj Kumar. The company was incorporated as Aster Medicines Private Limited in 2008 (CIN: U24230BR2008PTC013937). Currently, the company is managed by Rupesh Anand as Managing Director."
      }
    },
    {
      "@type": "Question",
      "name": "What types of injections does Aster Medicines manufacture?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aster Medicines manufactures both Beta-Lactam and Non-Beta Lactam injections. Our injection range includes: Meropenem (NEXOMER 1g), Ceftriaxone (NOBICEF 1g), Amoxicillin-Clavulanate (A-CLAV 1.2g), Ondansetron (ON-2), Frusemide (UTRIX), Adrenaline (ALINE), Atropine Sulphate, Aminophylline, Lignocaine (ALCAINE), Calcium Gluconate, Dexamethasone, Sodium Bicarbonate, and Dextrose (25% & 50%)."
      }
    },
    {
      "@type": "Question",
      "name": "Does Aster Medicines supply to government hospitals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Aster Medicines is a registered government tender supplier. We supply pharmaceutical products to government hospitals and institutions across Bihar and other states in India. Our products meet all regulatory requirements for government procurement."
      }
    },
    {
      "@type": "Question",
      "name": "What is Aster AD Vitamin Baby Massage Oil?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aster AD Vitamin Baby Massage Oil is a specially formulated baby massage oil enriched with Vitamins A, D, E, and natural Olive Oil. It supports healthy growth and bone development in babies. Available in three sizes: 100ml, 170ml, and 340ml bottles. It is safe for daily use after bath."
      }
    },
    {
      "@type": "Question",
      "name": "What is the CIN of Aster Medicines?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Corporate Identification Number (CIN) of Aster Medicines Private Limited is U24230BR2008PTC013937. The company was incorporated on 17th September 2008 under the Companies Act."
      }
    }
  ]
};

// ============================================================
// LOCAL BUSINESS - For Google Maps and local searches
// ============================================================
export const localBusinessStructuredData = {
  "@type": ["LocalBusiness", "ManufacturingBusiness"],
  "@id": "https://astermedicines.com/#localbusiness",
  "name": "Aster Medicines Pvt Ltd - Manufacturing Unit",
  "description": "WHO-GMP Certified Pharmaceutical Manufacturing Plant. Manufacturer of Beta-Lactam & Non-Beta Lactam Injections, Syrups, and Baby Care Products.",
  "image": "https://astermedicines.com/og-image.webp",
  "url": "https://astermedicines.com",
  "telephone": "+91-9934006655",
  "email": "accounts@astermedicines.com",
  "priceRange": "$$",
  "parentOrganization": { "@id": "https://astermedicines.com/#organization" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Plot No E/4, Industrial Area",
    "addressLocality": "Hajipur",
    "addressRegion": "Bihar",
    "postalCode": "844102",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 25.6888,
    "longitude": 85.2166
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "10:00",
      "closes": "16:00"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/astermedicines/",
    "https://www.indiamart.com/astermedicines/",
    "https://www.linkedin.com/company/aster-medicines-pvt-ltd/"
  ]
};

// ============================================================
// PATNA OFFICE - Specific LocalBusiness for Registered Office
// ============================================================
export const patnaOfficeStructuredData = {
  "@type": ["LocalBusiness", "MedicalBusiness"],
  "@id": "https://astermedicines.com/#patna-office",
  "name": "Aster Medicines Pvt Ltd - Registered Office (Patna)",
  "description": "Registered Office of Aster Medicines Pvt Ltd. Pharmaceutical Manufacturer & Supplier in Govind Mitra Road, Patna.",
  "image": "https://astermedicines.com/og-image.webp",
  "url": "https://astermedicines.com",
  "telephone": "+91-9934006655",
  "email": "astermedicinespvtltd@gmail.com",
  "priceRange": "$$",
  "parentOrganization": { "@id": "https://astermedicines.com/#organization" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "North of Janta Hotel, 1st Floor, Govind Mitra Road",
    "addressLocality": "Patna",
    "addressRegion": "Bihar",
    "postalCode": "800004",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 25.6154,
    "longitude": 85.1485
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "10:30",
      "closes": "19:00"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/astermedicines/",
    "https://www.indiamart.com/astermedicines/",
    "https://www.linkedin.com/company/aster-medicines-pvt-ltd/"
  ]
};