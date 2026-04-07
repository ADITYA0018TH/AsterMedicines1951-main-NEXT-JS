"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion"; // Removed AnimatePresence as it was used for the old menu
import {
  Home,
  Package,
  Info,
  Mail,
  BookOpen
} from "lucide-react"; // Added icons for the bottom bar
import ThemeToggle from "./ThemeToggle";
import GlassSurface from "@/components/ui/GlassSurface";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  // Removed isMobileMenuOpen state as it is no longer needed
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const checkDesktop = () => {
      setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
    };

    checkDesktop();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkDesktop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkDesktop);
    };
  }, []);

  // Added 'icon' property to navLinks for the bottom bar
  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Products", href: "/products", icon: Package },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <>
      {/* --- MAIN NAVBAR (Desktop Links + Mobile Logo) --- */}
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
          isScrolled ? "py-2" : "py-4"
        )}
      >
        {/* Changed w-full to w-fit on mobile to keep logo compact, matches desktop style */}
        <div className="w-fit md:w-fit mx-auto px-6 flex items-stretch justify-between gap-4">

          {/* 1. Logo Section */}
          {isDesktop ? (
            <GlassSurface
              width="auto"
              height="auto"
              borderRadius={50}
              borderWidth={isScrolled ? 0.07 : 0}
              backgroundOpacity={0}
              opacity={isScrolled ? 0.93 : 0}
              className="px-6 py-2 transition-all duration-300 dark:!bg-white"
              id="navbar-logo-surface"
            >
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative h-14 w-20">
                  <Image
                    src="/uploads/logo.webp"
                    alt="Aster Medicines Logo"
                    width={80}
                    height={56}
                    className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                </div>
              </Link>
            </GlassSurface>
          ) : (
            <div className="px-0 py-0 transition-all duration-300 rounded-full backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative h-10 w-16 my-3 mx-4 py-0.5">
                  <Image
                    src="/uploads/logo.webp"
                    alt="Aster Medicines Logo"
                    width={96}
                    height={64}
                    className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                </div>
              </Link>
            </div>
          )}

          {/* REMOVED: Mobile Menu Button (Hamburger) */}

          {/* 2. Desktop Navigation Section (UNCHANGED - STRICTLY PRESERVED) */}
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={50}
            borderWidth={isScrolled ? 0.07 : 0}
            backgroundOpacity={0}
            opacity={isScrolled ? 0.93 : 0}
            className="hidden md:flex flex-1 px-6 py-2 items-center justify-center gap-8 transition-all duration-300"
            id="navbar-content-surface"
          >
            <div className="flex items-center space-x-8 relative" onMouseLeave={() => setHoveredLink(null)}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group"
                  onMouseEnter={() => setHoveredLink(link.href)}
                >
                  <div
                    className={`relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:text-brand-accent dark:hover:text-brand-accent ${pathname === link.href ? "text-brand-accent" : "text-black dark:text-white"
                      }`}
                  >
                    {pathname === link.href && isDesktop && (
                      <motion.div
                        layoutId="active-nav-pill"
                        className="absolute inset-0 -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <GlassSurface
                          width="100%"
                          height="100%"
                          borderRadius={50}
                          borderWidth={0}
                          backgroundOpacity={0}
                          opacity={0.2}
                          blur={5}
                          className="w-full h-full"
                        />
                      </motion.div>
                    )}
                    {hoveredLink === link.href && (
                      <motion.div
                        layoutId="hover-nav-pill"
                        className="absolute inset-0 -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <GlassSurface
                          width="100%"
                          height="100%"
                          borderRadius={50}
                          borderWidth={0}
                          backgroundOpacity={0}
                          opacity={0.15}
                          blur={5}
                          className="w-full h-full"
                        />
                      </motion.div>
                    )}
                    {link.name}
                  </div>
                </Link>
              ))}
              <ThemeToggle />

            </div>
          </GlassSurface>
        </div>
      </motion.nav>

      {/* --- NEW: MOBILE BOTTOM NAVIGATION (Transparent) --- */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-4">
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={24}
          borderWidth={0.05}        // Thin border
          backgroundOpacity={0}     // Transparent
          blur={15}                 // Frosted effect
          className="flex items-center justify-between px-2 py-3 shadow-lg"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                className="relative flex-1 flex flex-col items-center gap-1 group"
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -4 : 0
                  }}
                  className={cn(
                    "flex flex-col items-center transition-colors duration-300",
                    isActive ? "text-[#FE5C02]" : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  <Icon className="w-6 h-6 stroke-[1.5]" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80">
                    {link.name}
                  </span>
                </motion.div>

                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute -bottom-1 w-1 h-1 bg-[#FE5C02] rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Vertical Divider */}
          <div className="h-8 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />

          {/* Theme Toggle in Bottom Bar */}
          <div className="flex-1 flex justify-center">
            <ThemeToggle />
          </div>
        </GlassSurface>
      </div>
    </>
  );
};

export default Navbar;