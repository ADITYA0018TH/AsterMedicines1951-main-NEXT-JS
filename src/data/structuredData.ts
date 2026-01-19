export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Aster Medicines PVT LTD",
  "alternateName": "Aster Medicines",
  "description": "Leading pharmaceutical company advancing global health with high-quality pharmaceutical solutions, innovative research, and trusted healthcare products.",
  "url": "https://astermedicines.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://astermedicines.com/logo.svg",
    "width": "250",
    "height": "60"
  },
  "image": "https://astermedicines.com/og-image-update.webp",
  "foundingDate": "2015",
  "industry": "Pharmaceutical Manufacturing",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": "500"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Niper Hostel, Niper Rd",
    "addressLocality": "Hajipur",
    "addressRegion": "Bihar",
    "postalCode": "844102",
    "addressCountry": "IN"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+91-7061452180",
      "contactType": "Customer Service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"],
      "email": "contact@astermedicines.com"
    },
    {
      "@type": "ContactPoint",
      "telephone": "+91-7061452180",
      "contactType": "Sales",
      "areaServed": "Worldwide",
      "availableLanguage": ["English"]
    }
  ],
  "sameAs": [
    "https://www.linkedin.com/company/aster-medicines",
    "https://twitter.com/astermedicines",
    "https://www.facebook.com/astermedicines"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "150"
  }
};

export const localBusinessStructuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Aster Medicines PVT LTD",
  "image": "https://astermedicines.com/og-image-update.webp",
  "@id": "https://astermedicines.com",
  "url": "https://astermedicines.com",
  "telephone": "+91-7061452180",
  "email": "contact@astermedicines.com",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Niper Hostel, Niper Rd",
    "addressLocality": "Hajipur",
    "addressRegion": "Bihar",
    "postalCode": "844102",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 25.695802,
    "longitude": 85.242669
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
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
    "https://www.linkedin.com/company/aster-medicines",
    "https://twitter.com/astermedicines"
  ]
};

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Aster Medicines PVT LTD",
  "url": "https://astermedicines.com",
  "description": "Official website of Aster Medicines PVT LTD - Leading pharmaceutical company",
  "publisher": {
    "@type": "Organization",
    "name": "Aster Medicines PVT LTD"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://astermedicines.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const productCatalogStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Aster Medicines Product Catalog",
  "description": "Comprehensive catalog of pharmaceutical products by Aster Medicines",
  "numberOfItems": "50+",
  "itemListElement": [
    {
      "@type": "Product",
      "name": "Cardiovascular Medications",
      "category": "Cardiovascular Health",
      "description": "Advanced cardiovascular medications for heart health"
    },
    {
      "@type": "Product", 
      "name": "Respiratory Solutions",
      "category": "Respiratory Health",
      "description": "Comprehensive respiratory healthcare solutions"
    },
    {
      "@type": "Product",
      "name": "Neurological Treatments",
      "category": "Neurological Health", 
      "description": "Innovative neurological treatment options"
    }
  ]
};

export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What types of pharmaceutical products does Aster Medicines manufacture?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aster Medicines manufactures a wide range of pharmaceutical products including cardiovascular medications, respiratory solutions, neurological treatments, and various other therapeutic areas with strict quality control and regulatory compliance."
      }
    },
    {
      "@type": "Question",
      "name": "Where are Aster Medicines products available?",
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": "Our pharmaceutical products are available globally through authorized distributors and healthcare providers. We maintain international quality standards and regulatory approvals in multiple countries."
      }
    },
    {
      "@type": "Question",
      "name": "What quality standards does Aster Medicines follow?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aster Medicines follows international quality standards including WHO-GMP, ISO certifications, and various regulatory approvals. We maintain strict quality control throughout our manufacturing and distribution processes."
      }
    }
  ]
};