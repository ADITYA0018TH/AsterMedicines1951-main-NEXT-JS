import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://astermedicines.com"), // Replace with your actual domain
  title: {
    default: "Aster Medicines",
    template: "%s | Aster Medicines",
  },
  description: "Aster Medicines Website",
  openGraph: {
    title: "Aster Medicines",
    description: "Aster Medicines Website",
    url: "https://astermedicines.com",
    siteName: "Aster Medicines",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    title: "Aster Medicines",
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
