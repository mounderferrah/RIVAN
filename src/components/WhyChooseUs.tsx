"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  Zap,
  Merge,
  Cpu,
  Award
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function WhyChooseUs() {
  const { t } = useLanguage();

  const differentiators = [
    { icon: <Merge className="w-5 h-5 text-[#BFC2C7] group-hover:text-[#B11226] transition-colors" />, title: t("whyUs", "allInOne.title"), desc: t("whyUs", "allInOne.desc") },
    { icon: <Zap className="w-5 h-5 text-[#BFC2C7] group-hover:text-[#B11226] transition-colors" />, title: t("whyUs", "velocity.title"), desc: t("whyUs", "velocity.desc") },
    { icon: <Sparkles className="w-5 h-5 text-[#BFC2C7] group-hover:text-[#B11226] transition-colors" />, title: t("whyUs", "bespoke.title"), desc: t("whyUs", "bespoke.desc") },
    { icon: <Cpu className="w-5 h-5 text-[#BFC2C7] group-hover:text-[#B11226] transition-colors" />, title: t("whyUs", "techStack.title"), desc: t("whyUs", "techStack.desc") },
    { icon: <Award className="w-5 h-5 text-[#BFC2C7] group-hover:text-[#B11226] transition-colors" />, title: t("whyUs", "mediaProd.title"), desc: t("whyUs", "mediaProd.desc") },
    { icon: <CheckCircle2 className="w-5 h-5 text-[#BFC2C7] group-hover:text-[#B11226] transition-colors" />, title: t("whyUs", "consulting.title"), desc: t("whyUs", "consulting.desc") },
  ];

  return (
    <section id="why-choose-us" className="py-24 md:py-32 relative overflow-hidden px-6 md:px-12 bg-transparent">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Text Left (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <motion.span 
              className="text-xs font-semibold tracking-[0.25em] text-[#B11226] uppercase"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {t("whyUs", "badge")}
            </motion.span>
            
            <motion.h2 
              className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-tight text-[#F8F8F8] uppercase"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t("whyUs", "heading1")} <br />
              <span style={{ color: "var(--th-brand)" }}>{t("whyUs", "heading2")}</span>
            </motion.h2>

            <motion.p 
              className="text-base text-[#BFC2C7] font-sans font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("whyUs", "paragraph")}
            </motion.p>
            
            <motion.div
              className="flex items-center gap-4 mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div 
                    key={idx} 
                    className="w-10 h-10 rounded-full border-2 border-bg-dark bg-[#1a1a1a] flex items-center justify-center text-xs font-heading font-bold text-[#BFC2C7]"
                  >
                    {idx === 5 ? "+" : ""}
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-sans text-[#BFC2C7]/50 tracking-wider uppercase">
                {t("whyUs", "trusted")}
              </p>
            </motion.div>
          </div>

          {/* Differentiators Grid Right (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {differentiators.map((diff, index) => (
              <motion.div
                key={index}
                className="group p-6 rounded-2xl glassmorphism border border-[#BFC2C7]/10 hover:border-[#B11226]/40 transition-all duration-300 relative overflow-hidden flex flex-col gap-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
              >
                {/* Accent border highlight */}
                <div className="absolute top-0 left-0 w-[2px] h-0 bg-[#B11226] group-hover:h-full transition-all duration-300" />
                
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                    {diff.icon}
                  </div>
                  <h3 className="text-base font-heading font-black tracking-wide text-white uppercase group-hover:text-[#B11226] transition-colors">
                    {diff.title}
                  </h3>
                </div>
                
                <p className="text-sm font-sans text-[#BFC2C7]/60 leading-relaxed group-hover:text-[#BFC2C7]/80 transition-colors font-light">
                  {diff.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
