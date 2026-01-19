import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { organizationStructuredData, websiteStructuredData } from "@/data/structuredData";

export const metadata: Metadata = {
  title: "Aster Medicines PVT LTD - Leading Pharmaceutical Company",
  description: "Aster Medicines PVT LTD - Advancing global health with high-quality pharmaceutical solutions, innovative research, and trusted healthcare products.",
  keywords: "Aster Medicines Pvt Ltd, Aster Medicines, Aster Medicines Private Limited, pharmaceutical company, medicines, healthcare, drugs, medical, pharmacy, health solutions, medical products, Hajipur pharma, Bihar medicines",
  openGraph: {
    title: "Aster Medicines PVT LTD - Leading Pharmaceutical Company",
    description: "Aster Medicines PVT LTD - Advancing global health with high-quality pharmaceutical solutions, innovative research, and trusted healthcare products.",
    url: "https://astermedicines.com",
    siteName: "Aster Medicines PVT LTD",
    images: [
      {
        url: "/og-image-update.webp",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aster Medicines PVT LTD - Leading Pharmaceutical Company",
    description: "Aster Medicines PVT LTD - Advancing global health with high-quality pharmaceutical solutions, innovative research, and trusted healthcare products.",
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
