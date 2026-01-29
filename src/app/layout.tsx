import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Roboto_Slab } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import JsonLd from "@/components/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FE5C02",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Extracted Data for SEO Consistency
const COMPANY_DETAILS = {
  name: "Aster Medicines Pvt Ltd",
  founder: "Rupesh Anand",
  est: "1982",
  incorporation: "2008",
  regOffice: "Govind Mitra Road, Patna, Bihar 800004",
  factory: "Industrial Area E/4, Hajipur, Vaishali, Bihar 844102",
  phone: "+91-7061452180",
  cin: "U24230BR2008PTC013937"
};

export const metadata: Metadata = {
  metadataBase: new URL("https://astermedicines.com"),

  title: {
    default: "Aster Medicines Pvt Ltd | Top Injection Manufacturer in Bihar & Patna",
    template: "%s | Aster Medicines Pvt Ltd",
  },

  description: `Led by ${COMPANY_DETAILS.founder} since ${COMPANY_DETAILS.est}, Aster Medicines is Bihar's premier WHO-GMP certified manufacturer of Critical Care Injections (Meropenem, Ceftriaxone), Syrups, and Dry Powders. Headquartered at Govind Mitra Road, Patna with manufacturing in Hajipur.`,

  keywords: [
    "Aster Medicines Pvt Ltd",
    "Aster Medicines Patna",
    "Aster Medicines Hajipur",
    "Rupesh Anand Aster Medicines",
    "Pharma Company in Govind Mitra Road Patna",
    "Injection Manufacturer in Hajipur Industrial Area",
    "Top 10 Pharma Companies in Bihar",
    "Third Party Manufacturing Pharma Bihar",
    "Meropenem Injection Manufacturer India",
    "Ceftriaxone Injection Third Party Manufacturing",
    "Amikacin Injection Manufacturer",
    "Baby Massage Oil Manufacturer Bihar",
    "PCD Pharma Franchise in Bihar",
    "Government Tender Pharma Supplier Bihar",
    "WHO GMP Certified Injection Plant"
  ],

  authors: [{ name: "Aster Medicines", url: "https://astermedicines.com" }],
  creator: "Aster Medicines Pvt Ltd",
  publisher: "Aster Medicines Pvt Ltd",

  other: {
    "geo.region": "IN-BR",
    "geo.placename": "Hajipur",
    "geo.position": "25.6888;85.2166",
    "ICBM": "25.6888, 85.2166",
    "business:contact_data:street_address": "Industrial Area E/4",
    "business:contact_data:locality": "Hajipur",
    "business:contact_data:postal_code": "844102",
    "business:contact_data:country_name": "India"
  },

  openGraph: {
    title: "Aster Medicines | Best Pharma Manufacturer in Bihar (Govind Mitra Road)",
    description: "ISO 9001:2015 & GMP Certified. Specializing in Beta-Lactam & Non-Beta Lactam Injections. Trusted by distributors since 1982.",
    url: "https://astermedicines.com",
    siteName: "Aster Medicines Pvt Ltd",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image-update.webp",
        width: 1200,
        height: 630,
        alt: "Aster Medicines Factory Unit in Hajipur Industrial Area",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Aster Medicines Pvt Ltd - Patna & Hajipur",
    description: "Leading Manufacturer of Pharmaceutical Injections and Syrups in Bihar. Contact for Third Party Manufacturing.",
    images: ["/og-image-update.webp"],
  },

  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },

  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Rich Structured Data restored with all the high-value details
  const jsonLdData = {
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
        "email": "sales@astermedicines.com",
        "identifier": {
          "@type": "PropertyValue",
          "propertyID": "CIN",
          "value": "U24230BR2008PTC013937"
        },
        "foundingDate": "2008-09-17",
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
            "telephone": "+91-7061452180",
            "contactType": "customer service",
            "areaServed": "IN"
          }
        ],
        "sameAs": [
          "https://www.facebook.com/astermedicines/",
          "https://www.indiamart.com/astermedicines/",
          "https://www.linkedin.com/company/aster-medicines-pvt-ltd/"
        ]
      },
      {
        "@type": "ManufacturingBusiness",
        "parentOrganization": { "@id": "https://astermedicines.com/#organization" },
        "name": "Aster Medicines Manufacturing Unit",
        "description": "WHO-GMP Certified Manufacturing Unit for Beta-Lactam & Non-Beta Lactam Injections.",
        "image": "https://astermedicines.com/og-image-update.webp",
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${robotoSlab.variable}`}>
      <body suppressHydrationWarning>
        <JsonLd />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}