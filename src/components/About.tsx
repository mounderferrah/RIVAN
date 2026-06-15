"use client";

import { motion } from "framer-motion";
import { Shield, Cpu, Play, TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  const cards = [
    {
      icon: <Cpu className="text-[#BFC2C7] w-6 h-6 group-hover:text-[#B11226] transition-colors" />,
      title: t("about", "tech.title"),
      desc: t("about", "tech.desc"),
      glow: "group-hover:shadow-[0_0_20px_rgba(177,18,38,0.12)]",
    },
    {
      icon: <Play className="text-[#BFC2C7] w-6 h-6 group-hover:text-[#B11226] transition-colors" />,
      title: t("about", "media.title"),
      desc: t("about", "media.desc"),
      glow: "group-hover:shadow-[0_0_20px_rgba(177,18,38,0.12)]",
    },
    {
      icon: <Shield className="text-[#BFC2C7] w-6 h-6 group-hover:text-[#B11226] transition-colors" />,
      title: t("about", "branding.title"),
      desc: t("about", "branding.desc"),
      glow: "group-hover:shadow-[0_0_20px_rgba(177,18,38,0.12)]",
    },
    {
      icon: <TrendingUp className="text-[#BFC2C7] w-6 h-6 group-hover:text-[#B11226] transition-colors" />,
      title: t("about", "growth.title"),
      desc: t("about", "growth.desc"),
      glow: "group-hover:shadow-[0_0_20px_rgba(177,18,38,0.12)]",
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden px-6 md:px-12 bg-transparent">
      {/* Background soft leak */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Text content (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <motion.span 
              className="text-xs font-semibold tracking-[0.25em] text-[#B11226] uppercase"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              {t("about", "badge")}
            </motion.span>
            
            <motion.h2 
              className="text-3xl md:text-5xl font-heading font-black tracking-tight text-[#F8F8F8] uppercase"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t("about", "heading1")} <br />
              <span style={{ color: "var(--th-brand)" }}>{t("about", "heading2")}</span>
            </motion.h2>

            <motion.p 
              className="text-base md:text-lg text-[#BFC2C7] font-sans font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("about", "paragraph")}
            </motion.p>
            
            <motion.div 
              className="mt-4 p-6 rounded-2xl glassmorphism border border-[#BFC2C7]/10 relative group overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.01] to-[#B11226]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="text-sm italic font-sans text-[#BFC2C7] leading-relaxed z-10 relative">
                &ldquo;{t("about", "quote")}&rdquo;
              </p>
            </motion.div>
          </div>

          {/* Grid Cards (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                className="group p-8 rounded-2xl glassmorphism border border-white/5 hover:border-[#B11226]/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
              >
                {/* Glow Background on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-2xl bg-gradient-to-br from-white/[0.01] to-transparent ${card.glow}`} />
                
                <div className="flex flex-col gap-5">
                  <div className="p-3.5 w-fit rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-heading font-black text-[#F8F8F8] tracking-wide uppercase group-hover:text-[#B11226] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm font-sans text-[#BFC2C7]/70 leading-relaxed font-light">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
