"use client";

import { FileSpreadsheet, Download } from "lucide-react";
import ScrollFloat from "@/components/ScrollFloat";

const Newsletter = () => {
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
               <FileSpreadsheet size={32} />
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
              Download the Aster Medicines catalogue for your purchasing team.
            </p>
            <a
              href="/catalogue"
              download="aster-medicines-products.xlsx"
              className="inline-flex items-center gap-2 rounded-full bg-orange-700 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-orange-800 hover:scale-105 active:scale-95"
            >
              <Download size={18} />
              <span>Download product list (Excel)</span>
            </a>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;