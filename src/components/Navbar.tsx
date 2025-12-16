"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Button3D from "@/components/ui/Button3D";
import GlassSurface from "@/components/ui/GlassSurface";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
          isScrolled ? "py-2" : "py-4"
        )}
      >
        <div className="w-fit mx-auto px-6 flex items-stretch justify-between gap-4">
          {/* Logo Section */}
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={50}
            borderWidth={isScrolled ? 0.07 : 0}
            backgroundOpacity={0}
            opacity={isScrolled ? 0.93 : 0}
            className="px-6 py-2 transition-all duration-300"
            id="navbar-logo-surface"
          >
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-16 w-24">
                <Image
                  src="/My-uploads/logo.png"
                  alt="Aster Medicines Logo"
                  fill
                  sizes="(max-width: 768px) 120px, 160px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
            </Link>
          </GlassSurface>

          {/* Navigation Section */}
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={50}
            borderWidth={isScrolled ? 0.07 : 0}
            backgroundOpacity={0}
            opacity={isScrolled ? 0.93 : 0}
            className="hidden md:flex flex-1 px-6 py-2 items-center justify-end gap-8 transition-all duration-300"
            id="navbar-content-surface"
          >
            {/* Desktop Links */}
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative inline-block px-4 py-2 text-sm font-medium transition-colors hover:text-brand-accent ${pathname === link.href ? "text-brand-accent" : "text-muted-foreground"
                    }`}
                  style={{ position: 'relative' }}
                >
                  {pathname === link.href && (
                    <motion.span
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-brand-accent/10 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              ))}
              <ThemeToggle />
              <Button3D href="/contact" variant="primary" size="sm">
                Contact Us
                <ChevronRight className="w-4 h-4" />
              </Button3D>
            </div>
          </GlassSurface>

          {/* Mobile Menu Button - Moved outside Desktop container */}
          <button
            className="fixed top-6 right-6 z-50 md:hidden text-gray-700 p-2 rounded-full transition hover:bg-white/30"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1), inset 0 0 10px rgba(255,255,255,0.2)",
            }}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Nav Overlay - User requested styling */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed top-20 right-6 z-50 w-64 md:hidden rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(25px)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15), inset 0 0 30px rgba(255,255,255,0.2)",
            }}
          >
            <nav className="flex flex-col p-2">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block text-base py-3 px-4 rounded-xl transition-all duration-200",
                      isActive
                        ? "text-[#FE5C02] bg-white/50 font-medium shadow-sm"
                        : "text-gray-700 hover:text-[#FE5C02] hover:bg-white/30"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;