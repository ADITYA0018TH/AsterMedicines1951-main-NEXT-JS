import type { Metadata } from 'next';
import BlogListContent from '@/components/BlogListContent';

export const metadata: Metadata = {
  title: 'Pharma Knowledge Hub | Aster Medicines Pvt Ltd',
  description:
    'Expert articles on pharmaceutical manufacturing, PCD pharma franchise in Bihar, drug profiles, GMP compliance, and third-party manufacturing. Stay informed with Aster Medicines.',
  keywords: [
    'Pharma blog Bihar',
    'PCD pharma franchise guide',
    'Meropenem injection manufacturer India',
    'Third party manufacturing pharma',
    'GMP certification pharma India',
    'Pharmaceutical knowledge base',
    'Drug profile injection',
    'Pharma franchise Bihar UP Jharkhand',
  ],
  openGraph: {
    title: 'Pharma Knowledge Hub — Aster Medicines',
    description: 'Expert articles on pharma manufacturing, PCD franchise, and drug profiles.',
    url: 'https://astermedicines.com/blog',
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://astermedicines.com/blog' },
};

export default function BlogPage() {
  return <BlogListContent />;
}
