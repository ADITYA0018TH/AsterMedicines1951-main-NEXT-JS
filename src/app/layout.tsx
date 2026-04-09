import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Roboto_Slab, Saira_Stencil_One } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import JsonLd from "@/components/JsonLd";
import VisitorTracker from "@/components/VisitorTracker";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { LanguageProvider } from "@/context/LanguageContext";

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

const sairaStencil = Saira_Stencil_One({
  weight: '400',
  subsets: ["latin"],
  variable: "--font-saira-stencil",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FE5C02",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://astermedicines.com"),

  title: {
    default: "Aster Medicines Pvt Ltd (Private Limited) | WHO-GMP Certified Injection & Syrup Manufacturer in Bihar, Patna & Hajipur",
    template: "%s | Aster Medicines Pvt Ltd",
  },

  description: "Aster Medicines Pvt Ltd (est. 1982) is a WHO-GMP & ISO certified pharmaceutical manufacturer in Patna & Hajipur, Bihar. Specializing in third-party manufacturing of injections and syrups.",

  keywords: [
    // Primary brand — exact match searches
    "Aster",
    "Aster Medicines",
    "Aster Medicines Pvt Ltd",
    "Aster Medicines Private Limited",
    "Aster Pharma",
    "Aster Medicines India",
    // Location-based brand
    "Aster Medicines Patna",
    "Aster Medicines Hajipur",
    "Aster Medicines Bihar",
    "Late Raj Kumar Aster Medicines",
    "Pharma Company in Govind Mitra Road Patna",
    "Injection Manufacturer in Hajipur Industrial Area",
    // Product-specific searches
    "Meropenem Injection Manufacturer India",
    "Ceftriaxone Injection Manufacturer",
    "Amikacin Injection Manufacturer",
    "Ondansetron Injection Manufacturer",
    "Adrenaline Injection Manufacturer",
    "Dexamethasone Injection Manufacturer",
    "Frusemide Injection Manufacturer",
    "Atropine Sulphate Injection",
    "Calcium Gluconate Injection",
    "Aminophylline Injection",
    "Lignocaine Injection",
    "Sodium Bicarbonate Injection",
    "Dextrose Injection",
    "Amoxicillin Clavulanate Injection",
    "Baby Massage Oil Manufacturer Bihar",
    "Aster AD Vitamin Baby Oil",
    "B-Codex Syrup",
    "Lu-Zyme Syrup",
    // Industry keywords
    "Top 10 Pharma Companies in Bihar",
    "Third Party Manufacturing Pharma Bihar",
    "PCD Pharma Franchise in Bihar",
    "Government Tender Pharma Supplier Bihar",
    "WHO GMP Certified Injection Plant",
    "Beta Lactam Injection Manufacturer",
    "Non Beta Lactam Injection Manufacturer",
    "Critical Care Injection Manufacturer India",
    "Contract Manufacturing Pharma India",
    "Injection Manufacturer Bihar",
    "where to buy medicine online",
    "how to buy medicine online",
    "urgent medicine delivery near me"
  ],

  authors: [{ name: "Aster Medicines Pvt Ltd", url: "https://astermedicines.com" }],
  creator: "Aster Medicines Pvt Ltd",
  publisher: "Aster Medicines Pvt Ltd",

  other: {
    "geo.region": "IN-BR",
    "geo.placename": "Hajipur, Bihar",
    "geo.position": "25.6888;85.2166",
    "ICBM": "25.6888, 85.2166",
    "business:contact_data:street_address": "Plot No E/4, Industrial Area",
    "business:contact_data:locality": "Hajipur",
    "business:contact_data:postal_code": "844102",
    "business:contact_data:country_name": "India",
    "business:contact_data:phone_number": "+91-9934006655",
    "business:contact_data:email": "accounts@astermedicines.com",
  },

  openGraph: {
    title: "Aster Medicines Pvt Ltd — Best Pharmaceutical Manufacturer in Bihar (Govind Mitra Road, Patna)",
    description: "WHO-GMP & ISO 9001:2015 Certified. Manufacturing Meropenem, Ceftriaxone, Amikacin injections, syrups & baby massage oil since 1982. Third Party Manufacturing & PCD Franchise available.",
    url: "https://astermedicines.com",
    siteName: "Aster Medicines Pvt Ltd",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Aster Medicines Pvt Ltd Manufacturing Plant at Hajipur Industrial Area, Bihar",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Aster Medicines Pvt Ltd - WHO-GMP Certified Pharma Manufacturer",
    description: "Manufacturing Meropenem, Ceftriaxone, Adrenaline injections, syrups & baby oil since 1982. Factory at Hajipur, Bihar. PCD Franchise & Third Party Manufacturing.",
    images: ["/og-image.webp"],
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

  // DNS verification already done — no meta tag needed for Google Search Console

  category: 'pharmaceutical',

  appleWebApp: {
    title: 'Aster Medicines',
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/icon.png',
    ],
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  alternates: {
    canonical: "https://astermedicines.com",
    languages: {
      'en-IN': 'https://astermedicines.com',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${robotoSlab.variable} ${sairaStencil.variable}`}>
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        <JsonLd />
        <Providers>
          <LanguageProvider>
            <VisitorTracker />
            {children}
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}