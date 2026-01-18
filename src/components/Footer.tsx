"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Facebook, Instagram, Linkedin, Twitter, Youtube, ArrowUp, Heart, MapPin, Phone, Mail } from "lucide-react"
import { useRef, useState } from "react"
import Link from "next/link"

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "https://www.instagram.com/aster_medicines?igsh=MTRwODV4bXJwM3BtMg==", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "https://www.youtube.com/@astermedicines13", label: "Youtube" },
]

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
]

interface FooterProps {
  setCursorVariant?: (variant: "default" | "text" | string) => void
}

export default function Footer({ setCursorVariant = () => { } }: FooterProps) {
  const containerRef = useRef<HTMLElement>(null)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  })

  // Removed y transform to fix CLS
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleMouseEnter = () => setCursorVariant("text")
  const handleMouseLeave = () => setCursorVariant("default")

  return (
    <motion.footer
      ref={containerRef}
      style={{ opacity, transform: 'none' }}
      className="relative border-t border-brand-accent/20 bg-background/95 backdrop-blur-xl overflow-hidden pt-24 pb-12"
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(251, 146, 60, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(251, 146, 60, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Glowing orbs */}
      <motion.div
        className="absolute -top-20 left-1/4 w-60 h-60 bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-[150px] pointer-events-none"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main footer content - 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16 lg:gap-20 mb-16 md:mb-20">

          {/* Column 1: Brand & Info */}
          <div className="space-y-8">
            <motion.div className="relative inline-block" whileHover={{ scale: 1.02 }}>
              <h3 className="text-3xl font-black tracking-tighter">
                <span className="text-brand-accent">ASTER</span>
                <br />
                <span className="text-foreground">MEDICINES</span>
              </h3>
              <motion.div
                className="absolute -bottom-2 left-0 h-[3px] bg-gradient-to-r from-brand-accent to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </motion.div>

            <p className="text-muted-foreground text-sm leading-relaxed font-mono">
              Advancing global health with high-quality pharmaceutical solutions.
              <span className="text-brand-accent block mt-2 font-bold">Trusted since 1991.</span>
            </p>

            {/* Status indicator */}
            <div className="flex items-center gap-3 pt-2">
              <motion.div
                className="w-2.5 h-2.5 bg-green-500 rounded-full"
                animate={{
                  boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.4)", "0 0 0 8px rgba(34, 197, 94, 0)"],
                }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Serving Humanity</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:pl-8">
            <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-[0.3em] mb-8">Navigation</h4>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="relative group inline-flex items-center gap-2"
                    onMouseEnter={() => {
                      handleMouseEnter()
                      setHoveredLink(link.label)
                    }}
                    onMouseLeave={() => {
                      handleMouseLeave()
                      setHoveredLink(null)
                    }}
                  >
                    <span className="text-muted-foreground text-sm font-medium transition-colors group-hover:text-brand-accent">
                      {link.label}
                    </span>
                    <motion.span
                      className="text-brand-accent text-xs absolute -left-4"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{
                        opacity: hoveredLink === link.label ? 1 : 0,
                        x: hoveredLink === link.label ? 0 : -5,
                      }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-[0.3em] mb-8">Contact</h4>
            <div className="space-y-6">
              <motion.a
                href="https://maps.app.goo.gl/hQDTvWxUv5rqNafW7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group"
                whileHover={{ x: 5 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <MapPin className="w-5 h-5 text-brand-accent mt-0.5 shrink-0 group-hover:text-brand-accent/80 transition-colors" />
                <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors leading-tight">
                  E-4 Part, Phase-2,<br />
                  Industrial Area, Hajipur,<br />
                  Vaishali, Bihar-844102
                </span>
              </motion.a>

              <motion.a
                href="tel:+917061452180"
                className="flex items-center gap-3 group"
                whileHover={{ x: 5 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Phone className="w-5 h-5 text-brand-accent shrink-0 group-hover:text-brand-accent/80 transition-colors" />
                <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                  +91 7061452180
                </span>
              </motion.a>

              <motion.a
                href="mailto:sales@astermedicines.com"
                className="flex items-center gap-3 group"
                whileHover={{ x: 5 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Mail className="w-5 h-5 text-brand-accent shrink-0 group-hover:text-brand-accent/80 transition-colors" />
                <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                  sales@astermedicines.com
                </span>
              </motion.a>
            </div>
          </div>

          {/* Column 4: Connect & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-[0.3em] mb-8">Connect</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                    aria-label={social.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="relative p-3 border border-border rounded-xl bg-secondary/50 backdrop-blur-sm transition-all duration-300 group-hover:border-brand-accent/50 group-hover:bg-brand-accent/10">
                      <social.icon className="w-5 h-5 text-muted-foreground transition-colors group-hover:text-brand-accent" aria-hidden="true" />
                      {/* Glow effect */}
                      <motion.div className="absolute inset-0 rounded-xl bg-brand-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Back to top button */}
            <motion.button
              onClick={scrollToTop}
              className="group flex items-center gap-3 mt-12 self-start"
              whileHover={{ x: 5 }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-label="Back to top"
            >
              <div className="p-3 border border-border rounded-lg bg-secondary/50 transition-all group-hover:border-brand-accent/50 group-hover:bg-brand-accent/10">
                <ArrowUp className="w-4 h-4 text-muted-foreground group-hover:text-brand-accent transition-colors" aria-hidden="true" />
              </div>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em] group-hover:text-brand-accent transition-colors">
                Back to top
              </span>
            </motion.button>
          </div>
        </div>

        {/* Divider with animation */}
        <div className="relative h-px mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent" />
          <motion.div
            className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-brand-accent to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
          <motion.p
            className="text-xs font-mono text-muted-foreground flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <span className="text-muted-foreground">©</span>
            <span>{new Date().getFullYear()}</span>
            <span className="text-muted-foreground">|</span>
            <span>Aster Medicines PVT LTD</span>
            <span className="text-muted-foreground">|</span>
            <span>Crafted with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
            >
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            </motion.span>
          </motion.p>

          {/* Tech badges */}
          <div className="flex items-center gap-3">
            {["GMP Certified", "ISO 9001:2015"].map((tech, index) => (
              <motion.span
                key={tech}
                className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-border rounded bg-secondary/50 text-muted-foreground"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  borderColor: "rgba(251, 146, 60, 0.5)",
                  color: "rgb(251, 146, 60)",
                  boxShadow: "0 0 15px rgba(251, 146, 60, 0.1)"
                }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Large background text */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none">
        <motion.h2
          className="text-[18vw] font-black text-foreground/5 leading-none tracking-tighter text-center whitespace-nowrap"
          style={{ transform: "translateY(35%)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          ASTER MEDICINES
        </motion.h2>
      </div>
    </motion.footer>
  )
}
