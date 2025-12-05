import type { Metadata } from "next";
import ContactContent from "@/components/ContactContent";
import { faqStructuredData } from "@/data/structuredData";

export const metadata: Metadata = {
    title: "Contact Us - Aster Medicines PVT LTD",
    description: "Get in touch with Aster Medicines PVT LTD. Contact us for pharmaceutical inquiries, partnerships, or general information. We're here to help with your healthcare needs.",
    keywords: "contact aster medicines, pharmaceutical contact, healthcare inquiries, medical company contact, pharmaceutical partnerships",
};

export default function ContactPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
            />
            <ContactContent />
        </>
    );
}
