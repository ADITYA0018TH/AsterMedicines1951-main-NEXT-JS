"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Building2, FlaskConical, Users, CheckCircle2 } from "lucide-react";

const DetailsSection = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    service: "Third Party Manufacturing", // Default selection
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Inquiry sent! Our team will contact you within 24 hours.");
    setFormData({ name: "", email: "", mobile: "", service: "Third Party Manufacturing" });
    setLoading(false);
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-black relative overflow-hidden" id="contact-section">

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none dark:hidden"></div>

      <div className="container px-4 sm:px-6 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* LEFT COLUMN: The "Factory Dashboard" (Trust Builder) */}
          <div className="order-2 lg:order-1">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
                Ready to Scale? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                  Let's Manufacture Together.
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                Whether you need a Third Party Manufacturer for your brand or want to start a PCD Pharma Franchise, our Hajipur facility is ready to deliver.
              </p>
            </div>

            {/* Capacity Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Daily Ampoule Output", val: "500k+", icon: FlaskConical },
                { label: "Partner Brands", val: "150+", icon: Building2 },
                { label: "Skilled Workforce", val: "300+", icon: Users },
                { label: "Quality Pass Rate", val: "99.9%", icon: CheckCircle2 },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mb-4">
                    <item.icon size={20} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {item.val}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Contact Info */}
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Corporate Office:</p>
              <p className="text-slate-600 dark:text-slate-400 mb-1">Plot No E/4, Industrial Area, Hajipur, Bihar - 844101</p>
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-orange-500">Email:</span> sales@astermedicines.com
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: The "Conversion Engine" (Quote Form) */}
          <div className="order-1 lg:order-2">
            <div className="bg-white dark:bg-black rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 md:p-10 relative overflow-hidden">

              {/* Form Header */}
              <div className="relative z-10 mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Get a Quote</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Fill the form below to get a callback from our Business Development Manager.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="relative z-10 space-y-5">

                {/* Service Selection Dropdown (Critical for B2B) */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">I am interested in</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  >
                    <option>Third Party Manufacturing</option>
                    <option>PCD Pharma Franchise</option>
                    <option>Government Tender Supply</option>
                    <option>Export Inquiry</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="+91 98765 43210"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30"
                >
                  {loading ? "Sending..." : "Request Call Back"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DetailsSection;