import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
    title: "About Us - Aster Medicines PVT LTD",
    description: "Learn about Aster Medicines PVT LTD, our mission, values, and leadership. Over 30 years of excellence in healthcare innovation and pharmaceutical solutions.",
    keywords: "about aster medicines, healthcare company, pharmaceutical leadership, rupesh anand, medical innovation, healthcare mission",
};

export default function AboutPage() {
    return <AboutContent />;
}
