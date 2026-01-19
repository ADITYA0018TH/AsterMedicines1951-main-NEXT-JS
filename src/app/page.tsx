import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { organizationStructuredData, websiteStructuredData } from "@/data/structuredData";

export const metadata: Metadata = {
  // 1. TITLE: Targets "Manufacturer" (B2B) + "Location" (Local SEO)
  title: "Pharmaceutical Manufacturer in Bihar | Third Party Pharma - Aster Medicines",
  
  // 2. DESCRIPTION: Proof of Authority (ISO/GMP) + Specific Products (Injections)
  description: "ISO & GMP Certified Manufacturer of Pharmaceutical Injections, Syrups, and Dry Syrups. Premier Third Party Manufacturing partner in Hajipur Industrial Area, Bihar since 1991.",
  
  // 3. KEYWORDS: Swapped generic words for high-value B2B terms
  keywords: [
    "Aster Medicines Pvt Ltd",
    "Pharma Manufacturer Bihar",
    "Injection Manufacturing India",
    "Third Party Pharma Manufacturing", 
    "Meropenem Injection Manufacturer", 
    "PCD Pharma Franchise Bihar",
    "Hajipur Industrial Area Pharma",
    "Contract Manufacturing"
  ],
  
  // 4. CANONICAL: Tells Google this is the main homepage
  alternates: {
    canonical: "https://astermedicines.com",
  },

  openGraph: {
    title: "Aster Medicines - GMP Certified Pharma Manufacturing Unit",
    description: "Your trusted partner for quality pharmaceutical manufacturing. Specializing in Critical Care Injections and Syrups.",
    url: "https://astermedicines.com",
    siteName: "Aster Medicines Pvt Ltd",
    images: [
      {
        url: "/og-image-update.webp",
        width: 1200,
        height: 630,
        alt: "Aster Medicines Manufacturing Plant Entrance",
      },
    ],
    type: "website",
    locale: "en_IN", // Specifically targeting India
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Aster Medicines - Pharmaceutical Manufacturer",
    description: "Leading Injection & Syrup Manufacturer in East India.",
    images: ["/og-image-update.webp"],
  },
};

export default function Home() {
  const combinedStructuredData = {
    "@context": "https://schema.org",
    "@graph": [organizationStructuredData, websiteStructuredData]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedStructuredData) }}
      />
      <HomeContent />
    </>
  );
}