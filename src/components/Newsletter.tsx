"use client";

import React, { useState } from "react";
import { toast } from "sonner"; // Assuming you use sonner based on previous context, or switch to your toast provider
import { ChevronRight, Mail, FileText } from "lucide-react";
import ScrollFloat from "@/components/ScrollFloat";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Subscribed successfully!", {
        description: "You will receive the latest Aster Medicines Product List shortly."
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section className="py-20 relative overflow-hidden bg-white dark:bg-black animate-on-scroll opacity-0" id="newsletter">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        
        {/* Card Container */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-slate-800 p-8 sm:p-16 text-center transition-all duration-300 shadow-2xl dark:shadow-[0_8px_30px_rgb(255,107,0,0.05)] group hover:-translate-y-1">
          
          {/* Subtle Background Animation */}
          <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[gradient_15s_linear_infinite]" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            
            {/* Icon Badge */}
            <div className="w-16 h-16 mx-auto bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center mb-8 shadow-lg border border-slate-100 dark:border-white/10 text-orange-500">
               <Mail size={32} />
            </div>

            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="mb-6"
              textClassName="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white"
            >
              Get the Latest Product List.
            </ScrollFloat>
            
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 leading-relaxed">
              Join 1,000+ Distributors and Partners. Be the first to know about <span className="text-orange-500 font-semibold">new molecule launches</span>, stock updates, and price changes.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative">
              <input
                type="email"
                id="newsletter-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your business email"
                aria-label="Email address for newsletter subscription"
                className="flex-1 px-6 py-4 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-sm transition-all"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex items-center justify-between gap-4 px-2 py-2 pl-6 text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 rounded-full shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="text-base font-semibold">
                    {isSubmitting ? "Joining..." : "Subscribe"}
                </span>
                <span className="flex items-center justify-center w-10 h-10 bg-white rounded-full transition-all duration-300 group-hover:rotate-45 text-orange-600">
                  {isSubmitting ? <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"/> : <ChevronRight size={20} />}
                </span>
              </button>
            </form>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                    <FileText size={14} />
                    <span>Monthly Price Lists</span>
                </div>
                <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                <div>No Spam, Only Business.</div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;