import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { faqStructuredData, patnaOfficeStructuredData } from "@/data/structuredData";

export const metadata: Metadata = {
  // 1. TITLE: Brand name + "Private Limited" + core business + location
  title: "Aster Medicines Pvt Ltd (Private Limited) | Best Pharmaceutical Manufacturer in Bihar, Patna & Hajipur",

  // 2. DESCRIPTION: Every searchable keyword packed naturally
  description: "Aster Medicines Pvt Ltd (CIN: U24230BR2008PTC013937) — WHO-GMP & ISO certified pharmaceutical manufacturer since 1982. Manufacturing Meropenem, Ceftriaxone, Amikacin, Ondansetron, Adrenaline, Dexamethasone injections, B-Codex Syrup, Lu-Zyme Syrup & Aster AD Baby Massage Oil. Factory at Hajipur Industrial Area. Office at Govind Mitra Road, Patna, Bihar. Third Party Manufacturing & PCD Pharma Franchise available.",

  // 3. KEYWORDS: Every brand variation + product + location
  keywords: [
    "Aster Medicines",
    "Aster Medicines Pvt Ltd",
    "Aster Medicines Private Limited",
    "Aster Pharma",
    "Aster Medicines India",
    "Aster Medicines Bihar",
    "Aster Medicines Patna",
    "Aster Medicines Hajipur",
    "Aster Medicines Govind Mitra Road",
    "Aster Medicines Products",
    "Aster Medicines Injections",
    "Meropenem Injection Manufacturer",
    "Ceftriaxone Injection Manufacturer India",
    "Amikacin Injection Manufacturer",
    "Ondansetron Injection Manufacturer",
    "Adrenaline Injection Manufacturer",
    "Dexamethasone Injection Manufacturer",
    "Frusemide Injection Manufacturer",
    "Sodium Bicarbonate Injection Manufacturer",
    "Dextrose Injection Manufacturer",
    "Calcium Gluconate Injection",
    "Aminophylline Injection",
    "Lignocaine Injection",
    "Atropine Sulphate Injection",
    "Amoxicillin Clavulanate Injection",
    "Baby Massage Oil Manufacturer Bihar",
    "Aster AD Vitamin Baby Oil",
    "B-Codex Syrup",
    "Lu-Zyme Syrup Digestive Enzyme",
    "Third Party Manufacturing Pharma Bihar",
    "PCD Pharma Franchise Bihar",
    "Contract Manufacturing Pharma India",
    "Pharma Manufacturer Bihar",
    "Injection Manufacturer Hajipur",
    "Injection Manufacturer Bihar",
    "Top Pharma Company Bihar",
    "WHO GMP Certified Pharma Bihar",
    "Government Tender Pharma Supplier Bihar",
    "Beta Lactam Injection Manufacturer",
    "Non Beta Lactam Injection Manufacturer",
    "Critical Care Injection Manufacturer India",
    "where to buy medicine online",
    "how to buy medicine online",
    "urgent medicine delivery near me"
  ],

  // 4. CANONICAL
  alternates: {
    canonical: "https://astermedicines.com",
  },

  openGraph: {
    title: "Aster Medicines Pvt Ltd — WHO-GMP Certified Injection & Syrup Manufacturer | Patna, Bihar",
    description: "Leading manufacturer of Meropenem, Ceftriaxone, Adrenaline, Dexamethasone injections, syrups & baby massage oil. ISO certified. Third Party Manufacturing & PCD Franchise available. Est. 1982.",
    url: "https://astermedicines.com",
    siteName: "Aster Medicines Pvt Ltd",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Aster Medicines Pvt Ltd Manufacturing Plant at Hajipur Industrial Area, Bihar",
      },
    ],
    type: "website",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title: "Aster Medicines Pvt Ltd - Pharmaceutical Manufacturer in Bihar",
    description: "WHO-GMP certified. Manufacturing Meropenem, Ceftriaxone, Adrenaline injections, syrups & baby oil since 1982. PCD Franchise & Third Party Manufacturing available.",
    images: ["/og-image.webp"],
  },
};

export default function Home() {
  const combinedStructuredData = {
    "@context": "https://schema.org",
    "@graph": [faqStructuredData, patnaOfficeStructuredData]
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