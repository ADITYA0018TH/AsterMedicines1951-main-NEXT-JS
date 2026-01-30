"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, Loader2, ChevronRight, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import Navbar from "@/components/Navbar";

const LoginContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const router = useRouter();

  // Client-only time to prevent hydration mismatch
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error("Authentication Failed", {
          description: "Invalid credentials for administrative access."
        });
      } else if (result?.ok) {
        toast.success("Identity Verified", {
          description: "Accessing dashboard..."
        });
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("System Error", { description: "Security server unreachable." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden font-sans">

      {/* 1. Dynamic Background Layer (Uses your animate-gradient-x) */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 animate-gradient-x bg-black" />

      {/* 2. Scanning Lines Layer (Uses your animate-dash) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <svg className="w-full h-full opacity-20">
          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="currentColor" strokeWidth="1" className="text-pulse-500 animate-dash" strokeDasharray="10, 20" />
          <line x1="0" y1="80%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="1" className="text-pulse-500 animate-dash" strokeDasharray="10, 20" />
        </svg>
      </div>

      {/* Mobile Navbar - Only visible on small screens */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Theme Toggle - Fixed Top Right (Desktop only) */}
      <div className="hidden lg:block fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <main className="relative z-10 w-full max-w-[1100px] px-6 py-12 pt-24 lg:pt-12 flex flex-col items-center">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-12"
        >
          <Image
            src="/My-uploads/logo.webp"
            alt="Aster Medicines Logo"
            width={180}
            height={120}
            className="h-24 w-auto mb-6"
            priority
          />
          <div className="flex items-center gap-3 bg-secondary px-4 py-1.5 rounded-full border border-border">
            <div className="w-2 h-2 rounded-full bg-pulse-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Admin Security Protocol
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-0 w-full max-w-4xl rounded-[var(--radius)] overflow-hidden border border-border shadow-2xl">

          {/* Left Panel: Context (Hidden on Mobile) */}
          <div className="hidden lg:flex lg:col-span-5 bg-secondary/50 backdrop-blur-sm p-10 flex-col justify-between border-r border-border">
            <div className="space-y-6">
              <Fingerprint className="w-12 h-12 text-pulse-500" />
              <h2 className="text-3xl font-bold leading-tight">
                Internal <br />
                <span className="text-pulse-500">Management</span>
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Authorized personnel only. All access attempts are logged and monitored via 256-bit encryption protocols.
              </p>
            </div>

            <Link href="/" className="group flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-pulse-500 transition-colors">
              Return to Website
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Panel: Login Form */}
          <div className="col-span-12 lg:col-span-7 bg-card p-10 sm:p-14 relative">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Operator Identifier
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@astermedicines.com"
                      className="w-full bg-background border border-border focus:border-orange-500 focus:ring-1 focus:ring-orange-500 py-3.5 pl-12 pr-4 rounded-[var(--radius)] outline-none transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                      Access Token
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-background border border-border focus:border-orange-500 focus:ring-1 focus:ring-orange-500 py-3.5 pl-12 pr-12 rounded-[var(--radius)] outline-none transition-all text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-pulse-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-pulse-500 hover:bg-pulse-500/90 text-white font-bold py-4 rounded-[var(--radius)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span className="text-sm uppercase tracking-[0.1em]">Initialize Session</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <Link
                href="/forgot-password"
                className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-pulse-500 transition-colors block"
              >
                Forgot Password?
              </Link>
            </form>
          </div>
        </div>

        {/* Industrial Footer Detail */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-40">
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Encryption</span>
            <span className="text-xs font-mono text-foreground">AES-256</span>
          </div>
          <div className="flex flex-col items-center border-l border-border pl-8">
            <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Session Status</span>
            <span className="text-xs font-mono text-foreground tracking-widest">ENCRYPTED</span>
          </div>
          <div className="flex flex-col items-center border-l border-border pl-8">
            <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">System Clock</span>
            <span className="text-xs font-mono text-foreground uppercase">{currentTime || "--:--:--"}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginContent;