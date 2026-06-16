"use client";

import { useEffect, useState, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight, Sparkles, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

// Native IntersectionObserver Hook to avoid external packages
function useInView(options?: IntersectionObserverInit & { triggerOnce?: boolean }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (options?.triggerOnce) {
          observer.unobserve(el);
        }
      } else if (!options?.triggerOnce) {
        setInView(false);
      }
    }, {
      threshold: options?.threshold,
      root: options?.root,
      rootMargin: options?.rootMargin,
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [options?.threshold, options?.root, options?.rootMargin, options?.triggerOnce]);

  return { ref, inView };
}


export default function Hero() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 35, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 18,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden px-6 md:px-12 bg-transparent select-none">

      {/* ── Creation of Adam background image ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-8%",
            backgroundImage: "url('/creation.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: isLight ? 1 : 0.75,
            filter: isLight ? "contrast(1.04) saturate(1.04)" : undefined,
            animation: "cloudDrift 28s ease-in-out infinite",
            willChange: "transform",
          }}
        />
      </div>

      {/* ── Crystal depth layer — background prisms ── */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        {/* Large faint white prism — left */}
        <div
          style={{
            position: "absolute", top: "10%", left: "-2%",
            width: 180, height: 260,
            clipPath: "polygon(50% 0%, 88% 35%, 70% 100%, 30% 100%, 12% 35%)",
            background: "rgba(248,248,248,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            filter: "blur(2px)",
            animation: "crystalFloat 14s ease-in-out 0s infinite alternate",
          }}
        />
        {/* Ruby shard — right */}
        <div
          style={{
            position: "absolute", top: "20%", right: "1%",
            width: 100, height: 130,
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            background: "rgba(177,18,38,0.045)",
            border: "1px solid rgba(177,18,38,0.12)",
            transform: "rotate(-18deg)",
            filter: "blur(0.5px)",
            animation: "crystalFloat 10s ease-in-out 2s infinite alternate",
          }}
        />
        {/* Silver hexagon — center low */}
        <div
          style={{
            position: "absolute", bottom: "12%", right: "8%",
            width: 120, height: 105,
            clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
            background: "rgba(191,194,199,0.025)",
            border: "1px solid rgba(191,194,199,0.07)",
            transform: "rotate(12deg)",
            filter: "blur(1.5px)",
            animation: "crystalFloat 12s ease-in-out 4s infinite alternate",
          }}
        />
        {/* White shard — bottom left */}
        <div
          style={{
            position: "absolute", bottom: "8%", left: "5%",
            width: 70, height: 95,
            clipPath: "polygon(40% 0%, 100% 28%, 75% 100%, 25% 100%, 0% 28%)",
            background: "rgba(248,248,248,0.018)",
            border: "1px solid rgba(255,255,255,0.04)",
            transform: "rotate(-22deg)",
            filter: "blur(1px)",
            animation: "crystalFloat 9s ease-in-out 1s infinite alternate",
          }}
        />
      </div>

      {/* ── Volumetric light beam behind hero text ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 60% 55% at 50% 40%, rgba(177,18,38,0.04) 0%, transparent 65%), radial-gradient(ellipse 40% 35% at 50% 35%, rgba(248,248,248,0.015) 0%, transparent 55%)",
        }}
      />

      {/* Luxury Film Frame Grid Overlay */}
      <div className="absolute inset-8 border border-[#BFC2C7]/5 pointer-events-none z-10 flex flex-col justify-between p-4 opacity-40">
        <div className="flex justify-between text-[9px] font-sans tracking-[0.2em] text-[#BFC2C7] uppercase">
          <span>RIVAN // PROJECTOR SEQUENCE_01</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B11226] animate-pulse" />
            REC 24FPS
          </span>
        </div>
        <div className="flex justify-between text-[9px] font-sans tracking-[0.2em] text-[#BFC2C7] uppercase">
          <span>FRAME_001A</span>
          <span>ISO 800</span>
        </div>
      </div>

      {/* Cinematic Vignette — dark mode only. Light mode previously faded the
          artwork into a heavy cream haze at the edges/corners; the artwork should
          now display naturally all the way to the corners in Light Mode. */}
      {!isLight && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,5,0.9) 100%)" }}
        />
      )}

      {/* Light Mode only: a tight, subtle darkening directly behind the headline
          block so the text stays highly readable without dimming the artwork
          globally — the hands/clouds elsewhere keep their full presence. */}
      {isLight && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(ellipse 55% 48% at 50% 42%, rgba(0,48,73,0.16) 0%, rgba(0,48,73,0.06) 55%, transparent 80%)",
          }}
        />
      )}

      {/* Camera Crosshair Indicators */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 pointer-events-none opacity-10 z-10">
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#F8F8F8]" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#F8F8F8]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-[#F8F8F8]" />
      </div>

      <motion.div
        className="max-w-6xl mx-auto text-center z-10 flex flex-col items-center mt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Luxury Pill Indicator */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8 backdrop-blur-sm"
            style={{ border: "1px solid var(--th-border)", background: "var(--th-glass2)", color: "var(--th-muted)" }}
        >
          <Sparkles size={11} className="text-[#B11226]" />
          {t("hero", "badge")}
        </motion.div>

        {/* Dynamic Massive Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-8xl font-heading font-black tracking-tighter leading-[1.05] max-w-5xl mb-8 uppercase"
            style={{ color: "var(--th-text)" }}
        >
          {t("hero", "line1")} <br />
          {t("hero", "line2")} <br />
          {t("hero", "line3")} <span
            style={{ color: "var(--th-brand)" }}
          >{t("hero", "highlight")}</span>
        </motion.h1>

        {/* Subheadline (Luxury Statement Format) */}
        <motion.div variants={itemVariants} className="flex flex-col gap-2 mb-12">
          <p className="text-sm md:text-base tracking-[0.4em] text-[#B11226] font-heading uppercase font-bold">
            {t("hero", "tech")}
          </p>
          <p className="text-sm md:text-base tracking-[0.25em] text-[#BFC2C7] font-sans font-light uppercase">
            {t("hero", "vision")}
          </p>
        </motion.div>

        {/* Call to Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 mb-24 w-full justify-center px-4"
        >
          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4.5 rounded-full bg-[#B11226] text-xs font-bold uppercase tracking-[0.2em] text-[#F8F8F8] shadow-[0_0_15px_rgba(177,18,38,0.2)] hover:shadow-[0_0_25px_rgba(177,18,38,0.45)] transition-all duration-300 transform hover:-translate-y-0.5 clickable"
          >
            {t("hero", "ctaPrimary")}
            <ArrowUpRight size={14} />
          </a>
          <a
            href="#services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4.5 rounded-full backdrop-blur-sm text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 clickable"
            style={{ border: "1px solid var(--th-border)", background: "var(--th-glass2)", color: "var(--th-text)" }}
          >
            {t("hero", "ctaSecondary")}
          </a>
        </motion.div>

      </motion.div>

      {/* Down arrow indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30 animate-bounce pointer-events-none">
        <span className="text-[9px] tracking-[0.4em] uppercase text-[#BFC2C7]">{t("hero", "scroll")}</span>
        <ChevronDown size={12} className="text-[#BFC2C7]" />
      </div>
    </section>
  );
}
