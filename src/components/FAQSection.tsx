"use client";

import React, { useState } from "react";
import { faqStructuredData } from "@/data/structuredData";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    // Extract FAQs from the structured data source
    const faqs = faqStructuredData.mainEntity;

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 bg-white dark:bg-black relative overflow-hidden" id="faq-section">
            <div className="container px-4 sm:px-6 mx-auto relative z-10">

                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-500 mb-4">
                        <HelpCircle className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
                        Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Questions</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg">
                        Everything you need to know about our pharmaceutical manufacturing capabilities and regulatory standards.
                    </p>
                </div>

                {/* FAQ Grid */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className={`border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-zinc-900/50 overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md ring-1 ring-orange-500/20' : ''}`}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                    aria-expanded={isOpen}
                                >
                                    <span className={`text-lg font-semibold pr-8 transition-colors ${isOpen ? 'text-orange-600 dark:text-orange-500' : 'text-slate-900 dark:text-white'}`}>
                                        {faq.name}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 dark:text-slate-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-4">
                                                {faq.acceptedAnswer.text}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default FAQSection;
