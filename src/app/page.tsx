import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { organizationStructuredData, websiteStructuredData } from "@/data/structuredData";

export const metadata: Metadata = {
  title: "Aster Medicines PVT LTD - Leading Pharmaceutical Company",
  description: "Aster Medicines PVT LTD - Advancing global health with high-quality pharmaceutical solutions, innovative research, and trusted healthcare products.",
  keywords: "pharmaceutical, medicines, healthcare, drugs, medical, pharmacy, health solutions, pharmaceutical company, medical products, aster medicines",
  openGraph: {
    title: "Aster Medicines PVT LTD - Leading Pharmaceutical Company",
    description: "Aster Medicines PVT LTD - Advancing global health with high-quality pharmaceutical solutions, innovative research, and trusted healthcare products.",
    url: "https://astermedicines.com", // Replace with actual URL if known, or leave generic
    siteName: "Aster Medicines PVT LTD",
    images: [
      {
        url: "/og-image-update.png",
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
    images: ["/og-image-update.png"],
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
