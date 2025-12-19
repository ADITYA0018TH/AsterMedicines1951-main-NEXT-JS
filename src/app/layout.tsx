import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

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
    default: "Aster Medicines - Precision Pharmaceutical Manufacturing",
    template: "%s | Aster Medicines",
  },
  description: "Pioneering pharmaceutical manufacturing since 1951. Aster Medicines bridges the gap between scientific breakthrough and human compassion with state-of-the-art facilities.",
  keywords: ["Pharmaceuticals", "Medicine Manufacturing", "Pharma Company", "Global Health", "Healthcare Innovation", "Aster Medicines", "GMP Certified"],
  authors: [{ name: "Aster Medicines" }],
  creator: "Aster Medicines",
  openGraph: {
    title: "Aster Medicines - Precision Pharmaceutical Manufacturing",
    description: "Pioneering pharmaceutical manufacturing since 1951. Bridging science and compassion.",
    url: "https://astermedicines.com",
    siteName: "Aster Medicines",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image-update.webp",
        width: 1200,
        height: 630,
        alt: "Aster Medicines - Care for Life",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aster Medicines",
    description: "Pioneering pharmaceutical manufacturing since 1951.",
    images: ["/og-image-update.webp"],
  },
  icons: {
    icon: "/favicon.ico",
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
