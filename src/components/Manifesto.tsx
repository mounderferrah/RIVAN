"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function Manifesto() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const lineVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // elegant easeOutExpo
      },
    },
  };

  return (
    <section className="py-32 md:py-48 relative overflow-hidden px-6 md:px-12 bg-transparent select-none border-y border-[#BFC2C7]/5">
      {/* Subtle ruby red leak backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#B11226]/[0.015] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="flex flex-col gap-16 md:gap-24"
        >
          {/* Main Manifesto Statement */}
          <div className="flex flex-col gap-3">
            <motion.span 
              variants={lineVariants}
              className="text-[10px] md:text-xs font-sans font-bold tracking-[0.4em] text-[#B11226] uppercase mb-4"
            >
              {t("manifesto", "badge")}
            </motion.span>
            
            <motion.h2
              variants={lineVariants}
              className="text-4xl sm:text-6xl md:text-8xl font-heading font-black tracking-tighter leading-[1.05] uppercase max-w-5xl"
              style={{ color: "var(--th-text)" }}
            >
              {t("manifesto", "heading1")} <br />
              <span style={{ color: "var(--th-text)" }}>{t("manifesto", "heading2")}</span>
            </motion.h2>
          </div>

          {/* Pillars List */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 border-t border-[#BFC2C7]/5 pt-16">
            <motion.div variants={lineVariants} className="flex flex-col items-center gap-2">
              <span className="text-2xl md:text-3xl font-heading font-black text-[#F8F8F8] uppercase tracking-wide">
                {t("manifesto", "techLabel")}
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#BFC2C7]/50 font-sans">
                {t("manifesto", "techSub")}
              </span>
            </motion.div>

            <motion.div variants={lineVariants} className="flex flex-col items-center gap-2">
              <span className="text-2xl md:text-3xl font-heading font-black text-[#F8F8F8] uppercase tracking-wide">
                {t("manifesto", "creativeLabel")}
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#BFC2C7]/50 font-sans">
                {t("manifesto", "creativeSub")}
              </span>
            </motion.div>

            <motion.div variants={lineVariants} className="flex flex-col items-center gap-2">
              <span className="text-2xl md:text-3xl font-heading font-black text-[#B11226] uppercase tracking-wide">
                {t("manifesto", "strategyLabel")}
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#BFC2C7]/50 font-sans">
                {t("manifesto", "strategySub")}
              </span>
            </motion.div>
          </div>

          {/* Team Tagline */}
          <motion.div 
            variants={lineVariants}
            className="text-sm md:text-base tracking-[0.3em] text-[#BFC2C7]/60 font-sans uppercase font-light"
          >
            {t("manifesto", "tagline1")} <span className="font-medium" style={{ color: isLight ? "var(--th-brand)" : "#ffffff" }}>{t("manifesto", "tagline2")}</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
