import type { Metadata } from "next";
import ContactContent from "@/components/ContactContent";
import { faqStructuredData, localBusinessStructuredData } from "@/data/structuredData";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
    title: "Contact Aster Medicines Pvt Ltd | Govind Mitra Road Patna & Hajipur Factory, Bihar",
    description: "Contact Aster Medicines Pvt Ltd: Registered Office — North of Janta Hotel, 1st Floor, Govind Mitra Road, Patna 800004. Factory — Plot No E/4, Industrial Area, Hajipur, Vaishali, Bihar 844102. Phone: +91-9934006655, +91-7909071165. Email: accounts@astermedicines.com. For Third Party Manufacturing, PCD Pharma Franchise, Government Tenders, and bulk orders.",
    keywords: [
        "Contact Aster Medicines",
        "Aster Medicines Phone Number",
        "Aster Medicines Email",
        "Aster Medicines Address",
        "Aster Medicines Patna Office",
        "Aster Medicines Hajipur Factory",
        "Govind Mitra Road Patna Pharma",
        "Hajipur Industrial Area Pharma",
        "Aster Medicines Contact Number",
        "+91-9934006655",
        "+91-7909071165",
        "accounts@astermedicines.com",
        "Third Party Manufacturing Enquiry",
        "PCD Pharma Franchise Enquiry Bihar",
        "Pharmaceutical Bulk Order Bihar",
        "Government Tender Pharma Bihar",
        "Pharma Company Contact Bihar",
        "Injection Manufacturer Contact India"
    ],
    openGraph: {
        title: "Contact Aster Medicines — Patna Office & Hajipur Factory",
        description: "Reach us at Govind Mitra Road, Patna or Hajipur Industrial Area. Phone: +91-9934006655. For inquiries on Third Party Manufacturing, PCD Franchise & bulk orders.",
        url: "https://astermedicines.com/contact",
        images: [{ url: "/og-image.webp", width: 1200, height: 630, alt: "Contact Aster Medicines Pvt Ltd" }],
    },
    alternates: {
        canonical: "https://astermedicines.com/contact",
    },
};

export default function ContactPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [faqStructuredData, localBusinessStructuredData] }) }}
            />
            <BreadcrumbJsonLd
                items={[
                    { name: "Home", item: "/" },
                    { name: "Contact Us", item: "/contact" },
                ]}
            />
            <ContactContent />
        </>
    );
}
