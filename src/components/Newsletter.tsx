import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
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
        <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 dark:bg-black p-8 sm:p-16 text-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Join the Future of Healthcare
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Subscribe to receive updates on our latest medical breakthroughs and global initiatives.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pulse-500 backdrop-blur-sm"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 rounded-full bg-pulse-500 text-white font-bold hover:bg-pulse-600 transition-colors shadow-lg hover:shadow-pulse-500/25"
              >
                Subscribe
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
