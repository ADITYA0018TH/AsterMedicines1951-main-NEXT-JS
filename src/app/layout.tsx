import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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

export const viewport: Viewport = {
  themeColor: "#FE5C02",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://astermedicines.com"),
  
  title: {
    default: "Aster Medicines Pvt Ltd | Pharmaceutical Manufacturer in Bihar",
    template: "%s | Aster Medicines Pvt Ltd",
  },
  
  // SEO: "Official Website" helps fix the "Missing: website" tag
  description: "Official Website of Aster Medicines Pvt Ltd. GMP Certified manufacturer of Pharmaceutical Injections, Syrups, and Dry Injections in Hajipur, Bihar since 1991.",
  
  keywords: [
    "Aster Medicines Official Website",
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
  
  other: {
    "geo.region": "IN-BR",
    "geo.placename": "Hajipur",
    "geo.position": "25.6888;85.2166",
    "ICBM": "25.6888, 85.2166"
  },

  openGraph: {
    title: "Aster Medicines - Precision Pharmaceutical Manufacturing",
    description: "Official Website. GMP Certified Manufacturer of Injections and Syrups. Serving Global Healthcare from Hajipur, India.",
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
    description: "Official Website of Aster Medicines. Leading Pharma Manufacturer in Bihar.",
    images: ["/og-image-update.webp"],
  },
  
  // UPDATED SECTION FOR GOOGLE LOGO
  icons: {
    icon: [
      { url: '/favicon.ico' }, // Fallback for browsers
      { url: '/icon.png', sizes: '512x512', type: 'image/png' }, // Primary for Google Search
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
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>
        <JsonLd />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}