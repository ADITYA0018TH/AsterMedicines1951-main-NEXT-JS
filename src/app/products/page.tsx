import type { Metadata } from "next";
import ProductsContent from "@/components/ProductsContent";
import { productCatalogStructuredData } from "@/data/structuredData";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
    title: "Products | Meropenem, Ceftriaxone, Injections, Syrups & Baby Oil - Aster Medicines Pvt Ltd",
    description: "Complete product range by Aster Medicines Pvt Ltd: Meropenem (NEXOMER 1g), Ceftriaxone (NOBICEF 1g), Amoxicillin-Clavulanate (A-CLAV 1.2g), Ondansetron, Adrenaline, Atropine, Dexamethasone, Frusemide, Aminophylline, Lignocaine, Calcium Gluconate, Sodium Bicarbonate, Dextrose injections. B-Codex & Lu-Zyme Syrups. Aster AD Vitamin Baby Massage Oil. WHO-GMP certified manufacturing.",
    keywords: [
        "Aster Medicines Products",
        "Aster Medicines Product List",
        "Aster Medicines Injections",
        "Meropenem Injection NEXOMER",
        "Ceftriaxone Injection NOBICEF",
        "Amoxicillin Clavulanate Injection A-CLAV",
        "Ondansetron Injection ON-2",
        "Adrenaline Injection ALINE",
        "Atropine Sulphate Injection",
        "Dexamethasone Sodium Phosphate Injection",
        "Frusemide Injection UTRIX",
        "Aminophylline Injection",
        "Lignocaine Hydrochloride Injection ALCAINE",
        "Calcium Gluconate Injection 10%",
        "Sodium Bicarbonate Injection 7.5%",
        "Dextrose Injection 25% 50%",
        "B-Codex Syrup Vitamin B Complex",
        "Lu-Zyme Syrup Digestive Enzyme",
        "Aster AD Vitamin Baby Massage Oil",
        "Baby Massage Oil 100ml 170ml 340ml",
        "Pharmaceutical Injections Bihar",
        "Critical Care Injections India",
        "Emergency Medicine Injections",
        "IV Solutions Manufacturer",
        "Antibiotics Injection Manufacturer India",
        "Pediatric Care Products Bihar",
        "Cardiovascular Injections",
        "Corticosteroid Injections",
        "Anesthetic Injections Manufacturer",
        "Respiratory Medicine Injections"
    ],
    openGraph: {
        title: "Pharmaceutical Products — Injections, Syrups & Baby Care | Aster Medicines",
        description: "21+ products: Meropenem, Ceftriaxone, Ondansetron, Adrenaline injections. B-Codex & Lu-Zyme syrups. Baby massage oil. WHO-GMP certified.",
        url: "https://astermedicines.com/products",
        images: [{ url: "/og-image.webp", width: 1200, height: 630, alt: "Aster Medicines Products Catalog" }],
    },
    alternates: {
        canonical: "https://astermedicines.com/products",
    },
};

export default function ProductsPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...productCatalogStructuredData }) }}
            />
            <BreadcrumbJsonLd
                items={[
                    { name: "Home", item: "/" },
                    { name: "Products", item: "/products" },
                ]}
            />
            <ProductsContent />
        </>
    );
}
