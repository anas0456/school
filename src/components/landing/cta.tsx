"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Dictionary } from "@/i18n/config";

interface CtaProps {
  dictionary: Dictionary;
  lang: string;
}

export function Cta({ dictionary, lang }: CtaProps) {
  return (
    <section id="pricing" className="py-16 sm:py-20 lg:py-32 bg-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-black to-zinc-900/50" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {dictionary.cta.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto">
            {dictionary.cta.subtitle}
          </p>


        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 sm:mt-16 pt-8 border-t border-white/10"
        >
          <p className="text-sm text-zinc-500 mb-6">
            موثوق من أفضل المؤسسات التعليمية
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-12">
            {[
              { name: "جامعة دمشق", color: "text-zinc-400" },
              { name: "جامعة حلب", color: "text-zinc-400" },
              { name: "جامعة البعث", color: "text-zinc-400" },
              { name: "جامعة طرطوس", color: "text-zinc-400" },
            ].map((company) => (
              <div
                key={company.name}
                className={`text-lg sm:text-xl font-semibold ${company.color} hover:text-white transition-colors`}
              >
                {company.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
