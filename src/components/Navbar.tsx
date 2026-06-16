"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("nav", "services"), href: "#services" },
    { name: t("nav", "about"),    href: "#about" },
    { name: t("nav", "whyUs"),    href: "#why-choose-us" },
    { name: t("nav", "process"),  href: "#process" },
    { name: t("nav", "team"),     href: "#team" },
    { name: t("nav", "contact"),  href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "py-4 px-4 md:px-8 backdrop-blur-xl"
            : "py-6 px-6 md:px-12"
        }`}
        style={isScrolled ? {
          background: "var(--th-glass)",
          borderBottom: "1px solid var(--th-border)",
        } : { background: "transparent" }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="relative flex items-center gap-2 group clickable">
            {isLight && (
              <span
                className="absolute -inset-3 rounded-full pointer-events-none"
                style={{ background: "#FDF0D5", opacity: 0.15, filter: "blur(20px)" }}
              />
            )}
            <span
              className="relative text-2xl md:text-3xl font-heading font-black tracking-widest transition-all"
              style={{ color: isLight ? "#003049" : "var(--th-text)", fontWeight: isLight ? 800 : undefined }}
            >
              RIVAN
            </span>
            <span className="relative w-1.5 h-1.5 rounded-full group-hover:scale-150 transition-transform" style={{ background: "var(--th-brand)" }} />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-sans relative group py-2 clickable ${
                  isLight
                    ? "text-[#003049] font-semibold hover:text-[#C1121F] transition-colors duration-300"
                    : "tracking-wide transition-colors"
                }`}
                style={
                  isLight
                    ? { letterSpacing: "0.02em", textShadow: "0 1px 4px rgba(255,255,255,0.25)" }
                    : { color: "var(--th-muted)" }
                }
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] group-hover:w-full transition-all duration-300" style={{ background: "var(--th-brand)" }} />
              </a>
            ))}
          </div>

          {/* CTA & controls */}
          <div className="flex items-center gap-3">
            {/* Theme switcher */}
            <ThemeSwitcher />
            {/* Crystal language switcher */}
            <LanguageSwitcher />

            <a
              href="#contact"
              className={
                isLight
                  ? "hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-[#C1121F] text-white hover:bg-[#780000] hover:shadow-[0_10px_30px_rgba(193,18,31,0.25)] transition-all duration-300 clickable"
                  : "hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#BFC2C7]/30 text-sm font-medium tracking-wide bg-transparent hover:bg-[#B11226] text-[#F8F8F8] hover:border-[#B11226] hover:shadow-[0_0_20px_rgba(177,18,38,0.3)] transition-all duration-300 clickable"
              }
              style={isLight ? { letterSpacing: "0.04em" } : undefined}
            >
              {t("nav", "workWithUs")}
              <ArrowRight size={14} />
            </a>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors clickable"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30 lg:hidden backdrop-blur-2xl flex flex-col justify-center px-8 md:px-16"
            style={{ background: "var(--th-bg)", opacity: 0.98 }}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", ease: [0.76, 0, 0.24, 1], duration: 0.6 }}
          >
            {/* Grid background effect in mobile overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.02] pointer-events-none" />

            <div className="flex flex-col gap-6 relative z-10">
              {/* Controls row — mobile */}
              <div className="flex items-center gap-3 mb-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl md:text-4xl font-heading font-bold transition-colors tracking-wide"
                  style={{ color: "var(--th-muted)" }}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-base font-semibold tracking-wide text-white shadow-lg transition-all duration-300"
                style={{ background: "var(--th-brand)" }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.08, duration: 0.4 }}
              >
                {t("nav", "workWithUs")}
                <ArrowRight size={18} />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
