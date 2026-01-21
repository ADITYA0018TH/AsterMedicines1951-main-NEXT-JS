import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "recharts",
      "@react-three/drei",
      "@react-three/fiber",
      "lottie-react",
      "gsap",
      "advanced-liquid-glass-ui",
      "react-ios-liquid-glass",
      "liquid-glass-react",
      "algui",
      "date-fns",
      "@tanstack/react-query",
      "react-day-picker",
      "embla-carousel-react",
      "vaul",
      "sonner",
      "@gsap/react",
      "styled-components",
      "@hookform/resolvers",
      "react-hook-form",
      "input-otp",
      "zod",
    ],
    optimizeCss: true,
  },
  productionBrowserSourceMaps: true,
};

export default nextConfig;
