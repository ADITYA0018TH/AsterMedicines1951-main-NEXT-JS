
import React, { useState } from "react";

import { toast } from "sonner";
const DetailsSection = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Demo form submission
    toast.success("Request submitted successfully!");

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      company: ""
    });
  };

const backgroundContent = (
    <>
      <div
        className="absolute inset-0 z-0 dark:hidden"
        style={{
          backgroundColor: 'orange',
          opacity: 1,
          width: '100%',
          height: '100%',
          backgroundImage: `repeating-radial-gradient(
              circle at 0 0,
              transparent 0,
              white 30px
            ),
            repeating-linear-gradient(#FF6B00, #FF6B00)`
        }}
      />
      <div
        className="absolute inset-0 z-0 hidden dark:block"
        style={{
          backgroundColor: 'black',
          opacity: 1,
          width: '100%',
          height: '100%',
          backgroundImage: `repeating-radial-gradient(
              circle at 0 0,
              transparent 0,
              black 30px
            ),
            repeating-linear-gradient(#333333, #666666)`
        }}
      />
    </>
  );

  return (
    <section id="details" className="w-full bg-transparent py-0 animate-on-scroll opacity-0 dark:text-white">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {/* Left Card - Medical Manufacturing Specs */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant">
            {/* Card Header with background image instead of gradient */}
            <div className="relative h-48 sm:h-64 p-6 sm:p-8 flex items-end overflow-hidden">
              {backgroundContent}
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-display text-white font-bold">
                  Facility Specifications
                </h2>
              </div>
            </div>

            {/* Card Content - Specs Grid */}
            <div className="bg-white dark:bg-black p-6 sm:p-10 border border-[#ECECEC] dark:border-neutral-800">
              <h3 className="text-xl sm:text-2xl font-display mb-8 text-slate-900 dark:text-white">
                Medical Manufacturing Standards
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "GMP Certified", desc: "Good Manufacturing Practices", icon: "GF" },
                  { title: "ISO 13485", desc: "Medical Device Standards", icon: "ISO" },
                  { title: "Sterile Pro", desc: "Contaminant-free Zones", icon: "SP" },
                  { title: "Traceability", desc: "End-to-End Tracking", icon: "TR" },
                  { title: "Auto QC", desc: "Automated Quality Control", icon: "QC" },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900/50 hover:bg-white dark:hover:bg-neutral-800 border border-transparent hover:border-gray-200 dark:hover:border-neutral-700 transition-all duration-300 group">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">{item.desc}</p>
                  </div>
                ))}
                <div className="p-4 rounded-2xl bg-pulse-500 dark:bg-neutral-900 text-white flex flex-col justify-center items-center text-center">
                  <span className="text-2xl font-bold mb-1">100+</span>
                  <span className="text-xs opacity-90">Global Partners</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card - Contact Form */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant">
            {/* Card Header with background image instead of gradient */}
            <div className="relative h-48 sm:h-64 p-6 sm:p-8 flex flex-col items-start overflow-hidden">
              {backgroundContent}
              <div className="relative z-10 w-full h-full flex flex-col items-start">
                <div className="inline-block px-4 sm:px-6 py-2 border border-white text-white rounded-full text-xs mb-4">
                  Partner With Us
                </div>
                <h2 className="text-2xl sm:text-3xl font-display text-white font-bold mt-auto">
                  Contact Aster Medicines
                </h2>
              </div>
            </div>

            {/* Card Content - Form */}
            <div className="bg-white dark:bg-black p-6 sm:p-10 border border-[#ECECEC] dark:border-neutral-800">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-900 border-none focus:ring-2 focus:ring-pulse-500 dark:focus:ring-neutral-500 text-slate-900 dark:text-white placeholder:text-gray-400"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-900 border-none focus:ring-2 focus:ring-pulse-500 dark:focus:ring-neutral-500 text-slate-900 dark:text-white placeholder:text-gray-400"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Organization / Hospital"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-900 border-none focus:ring-2 focus:ring-pulse-500 dark:focus:ring-neutral-500 text-slate-900 dark:text-white placeholder:text-gray-400"
                />

                <div>
                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-slate-900 dark:bg-white text-orange-600 dark:text-neutral-900 font-bold rounded-xl hover:opacity-90 transition-opacity duration-300"
                  >
                    Initiate Partnership
                  </button>
                </div>
              </form>
              <div className="text-xs text-gray-400 mt-6 text-center">
                Trusted by 500+ Healthcare Institutions
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default DetailsSection;
