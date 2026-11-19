import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
    title: "About Aster Medicines Pvt Ltd (Private Limited) | GMP CERTIFIED Pharma Company in Bihar Since 1982",
    description: "Aster Medicines Pvt Ltd (CIN: U24230BR2008PTC013937), established in 1982 by Late Mr. Raj Kumar. Managed by MD Rupesh Anand. WHO-GMP & ISO 9001:2015 certified pharmaceutical manufacturer. Registered office at Govind Mitra Road, Patna 800004. Manufacturing plant at Industrial Area E/4, Hajipur, Vaishali, Bihar 844102. Specializing in Beta-Lactam & Non-Beta Lactam Injections, Syrups, and Baby Care Products.",
    keywords: [
        "About Aster Medicines",
        "Aster Medicines Pvt Ltd history",
        "Aster Medicines Private Limited",
        "Aster Medicines founder",
        "Late Raj Kumar Aster Medicines",
        "Rupesh Anand Managing Director",
        "Aster Medicines CIN U24230BR2008PTC013937",
        "WHO GMP Certified Pharma Bihar",
        "ISO 9001:2015 Pharma Company",
        "Pharmaceutical Company Patna",
        "Pharma Manufacturer Hajipur",
        "Pharma Company Govind Mitra Road",
        "Injection Manufacturer Bihar since 1982",
        "Beta Lactam Injection Plant Bihar",
        "Care For Life Aster Medicines",
        "Aster Medicines Mission Vision"
    ],
    openGraph: {
        title: "About Aster Medicines Pvt Ltd — GMP CERTIFIED Since 1982",
        description: "Founded by Late Mr. Raj Kumar in 1982. WHO-GMP & ISO certified pharmaceutical manufacturer. Manufacturing plant at Hajipur, Bihar. Contact: +91-9934006655.",
        url: "https://astermedicines.com/about",
        images: [{ url: "/og-image.webp", width: 1200, height: 630, alt: "Aster Medicines About Us" }],
    },
    alternates: {
        canonical: "https://astermedicines.com/about",
    },
};

export default function AboutPage() {
    return (
        <>
            <BreadcrumbJsonLd
                items={[
                    { name: "Home", item: "/" },
                    { name: "About Aster Medicines", item: "/about" },
                ]}
            />
            <AboutContent />
        </>
    );
}
