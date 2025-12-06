import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { ChevronRight } from "lucide-react";
const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thank you for subscribing!",
        description: "You'll receive updates about Atlas soon."
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };
  return (
    <section className="py-20 relative overflow-hidden bg-white dark:bg-black animate-on-scroll opacity-0" id="newsletter">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-[#111111] dark:bg-[length:60px_60px] dark:bg-[position:-5px_-5px] dark:bg-[linear-gradient(32deg,rgba(8,8,8,0.74)_30px,transparent)] border border-gray-100 dark:border-slate-800 p-8 sm:p-16 text-center transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.1)] hover:shadow-[0_30px_60px_rgb(0,0,0,0.15)] dark:hover:shadow-[0_30px_60px_rgb(255,255,255,0.1)] hover:-translate-y-2">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
              Join the Future of Healthcare
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 leading-relaxed">
              Subscribe to receive updates on our latest medical breakthroughs and global initiatives.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pulse-500 backdrop-blur-sm"
                required
              />
              <button
                type="submit"
                className="group inline-flex items-center justify-between gap-4 px-6 py-4 text-white bg-gradient-to-r from-[#FE5C02] to-[#FE5C02] rounded-full shadow-[inset_2px_2px_6px_rgba(255,255,255,0.2),_inset_-2px_-2px_6px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-105 active:scale-95 active:shadow-[inset_1px_1px_4px_rgba(0,0,0,0.2)]"
              >
                <span className="text-lg font-medium">Subscribe</span>
                <span className="flex items-center justify-center w-10 h-10 bg-white rounded-full transition-all duration-300 group-hover:translate-x-1 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] group-hover:animate-pulse shadow-[inset_2px_2px_5px_rgba(255,255,255,0.4),_inset_-2px_-2px_5px_rgba(0,0,0,0.1)] active:shadow-inner active:scale-90">
                  <ChevronRight className="text-[#FE5C02] w-5 h-5" />
                </span>
              </button>
            </form>
            <p className="mt-6 text-xs text-slate-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
