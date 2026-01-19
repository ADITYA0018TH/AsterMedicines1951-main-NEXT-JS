import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import JsonLd from "@/components/JsonLd"; // Import the new component

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

export const viewport: Viewport = {
  themeColor: "#FE5C02",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://astermedicines.com"),
  
  // 1. STRONGER TITLE: Includes Location + Key Service
  title: {
    default: "Aster Medicines Pvt Ltd | Pharmaceutical Manufacturer in Bihar",
    template: "%s | Aster Medicines Pvt Ltd",
  },
  
  // 2. PRODUCT-FOCUSED DESCRIPTION:
  description: "GMP Certified manufacturer of Pharmaceutical Injections, Syrups, and Dry Injections. Leading Third Party Pharma Manufacturing company in Hajipur, Bihar since 1991.",
  
  // 3. KEYWORDS: Added specific molecules and location variations
  keywords: [
    "Aster Medicines", 
    "Aster Medicines Pvt Ltd Hajipur", 
    "Pharma Manufacturer Bihar", 
    "Injection Manufacturing India", 
    "Meropenem Injection Manufacturer", 
    "Ondansetron Injection", 
    "Third Party Manufacturing Pharma", 
    "Industrial Area E/4 Hajipur", 
    "GMP Certified Pharma Company"
  ],
  
  authors: [{ name: "Aster Medicines", url: "https://astermedicines.com" }],
  creator: "Aster Medicines",
  publisher: "Aster Medicines Pvt Ltd",
  
  // 4. GEO TAGS: Critical for showing up in "Near me" searches in Patna/Hajipur
  other: {
    "geo.region": "IN-BR",
    "geo.placename": "Hajipur",
    "geo.position": "25.6888;85.2166",
    "ICBM": "25.6888, 85.2166"
  },

  openGraph: {
    title: "Aster Medicines - Precision Pharmaceutical Manufacturing",
    description: "GMP Certified Manufacturer of Injections and Syrups. Serving Global Healthcare from Hajipur, India.",
    url: "https://astermedicines.com",
    siteName: "Aster Medicines Pvt Ltd",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image-update.webp",
        width: 1200,
        height: 630,
        alt: "Aster Medicines Manufacturing Unit",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Aster Medicines Pvt Ltd",
    description: "Leading Pharma Manufacturer in Bihar. Injectables, Syrups, and more.",
    images: ["/og-image-update.webp"],
  },
  
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  
  // 5. ROBOTS: Ensure Google knows this is the main version
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
  
  // 6. VERIFICATION: You will need this code from Google Search Console
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
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>
        <JsonLd /> {/* Injects the schema into the body */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}