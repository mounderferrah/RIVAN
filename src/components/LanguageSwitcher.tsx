"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/translations";

const LANGS: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "EN", native: "English" },
  { code: "fr", label: "FR", native: "Français" },
  { code: "ar", label: "ع",  native: "العربية" },
];

// SVG gem crystal shape
function CrystalGem({
  label,
  active,
  size = 44,
  onClick,
}: {
  label: string;
  active: boolean;
  size?: number;
  onClick?: () => void;
}) {
  const h = size * (46 / 40);
  return (
    <motion.button
      onClick={onClick}
      className="relative flex items-center justify-center focus:outline-none clickable"
      style={{ width: size, height: h, background: "transparent", border: "none", padding: 0 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.18 }}
    >
      <svg
        viewBox="0 0 40 46"
        width={size}
        height={h}
        style={{ display: "block", overflow: "visible" }}
      >
        {/* Outer glow when active */}
        {active && (
          <polygon
            points="20,1 38,11 38,35 20,45 2,35 2,11"
            fill="none"
            stroke="rgba(177,18,38,0.35)"
            strokeWidth="6"
            style={{ filter: "blur(4px)" }}
          />
        )}

        {/* Main crystal body */}
        <polygon
          points="20,1 38,11 38,35 20,45 2,35 2,11"
          fill={
            active
              ? "rgba(177,18,38,0.18)"
              : "rgba(191,194,199,0.05)"
          }
          stroke={
            active
              ? "rgba(177,18,38,0.65)"
              : "rgba(191,194,199,0.22)"
          }
          strokeWidth="0.8"
        />

        {/* Top facet — lighter face */}
        <polygon
          points="20,1 38,11 20,19 2,11"
          fill={
            active
              ? "rgba(177,18,38,0.12)"
              : "rgba(255,255,255,0.04)"
          }
        />

        {/* Primary highlight edge */}
        <line
          x1="20" y1="1" x2="38" y2="11"
          stroke={active ? "rgba(255,180,180,0.45)" : "rgba(255,255,255,0.25)"}
          strokeWidth="0.7"
        />

        {/* Secondary inner highlight */}
        <line
          x1="20" y1="19" x2="38" y2="11"
          stroke={active ? "rgba(255,120,120,0.2)" : "rgba(255,255,255,0.08)"}
          strokeWidth="0.5"
        />

        {/* Bottom facet shadow */}
        <polygon
          points="20,45 2,35 2,11 20,19"
          fill="rgba(0,0,0,0.12)"
        />

        {/* Right facet */}
        <polygon
          points="38,11 38,35 20,45 20,19"
          fill={active ? "rgba(177,18,38,0.08)" : "rgba(255,255,255,0.02)"}
        />

        {/* Language label */}
        <text
          x="20"
          y="31"
          textAnchor="middle"
          fill={active ? "#F8F8F8" : "rgba(191,194,199,0.65)"}
          fontSize={label.length > 2 ? "11" : "10"}
          fontWeight="700"
          fontFamily="var(--font-jakarta), sans-serif"
          letterSpacing="1"
          style={{ userSelect: "none" }}
        >
          {label}
        </text>
      </svg>
    </motion.button>
  );
}

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const current = LANGS.find((l) => l.code === lang)!;

  return (
    <div ref={ref} className="relative flex items-center" style={{ zIndex: 50 }}>
      {/* Main trigger crystal */}
      <div className="relative">
        <CrystalGem
          label={current.label}
          active
          size={38}
          onClick={() => setOpen((v) => !v)}
        />
        {/* Pulse ring on closed state */}
        {!open && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            style={{
              borderRadius: "2px",
              border: "1px solid rgba(177,18,38,0.3)",
              clipPath: "polygon(50% 0%, 95% 27.5%, 95% 87.5%, 50% 112.5%, 5% 87.5%, 5% 27.5%)",
            }}
          />
        )}
      </div>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2"
            style={{
              background: "rgba(7,7,7,0.92)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(191,194,199,0.1)",
              padding: "14px 10px",
              minWidth: 120,
            }}
          >
            {/* Crystal top edge */}
            <div
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(177,18,38,0.4) 50%, transparent)" }}
            />

            {/* Ruby corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8" style={{ background: "radial-gradient(circle at 0% 0%, rgba(177,18,38,0.07), transparent 70%)" }} />
            <div className="absolute top-0 right-0 w-8 h-8" style={{ background: "radial-gradient(circle at 100% 0%, rgba(177,18,38,0.07), transparent 70%)" }} />

            {/* Language crystals */}
            <div className="flex flex-col items-center gap-2">
              {LANGS.map((l, i) => (
                <motion.div
                  key={l.code}
                  initial={{ opacity: 0, y: -10, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 w-full px-1 cursor-pointer group"
                  onClick={() => { setLang(l.code); setOpen(false); }}
                >
                  <CrystalGem label={l.label} active={lang === l.code} size={32} />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-jakarta)",
                      color: lang === l.code ? "#F8F8F8" : "rgba(191,194,199,0.45)",
                      transition: "color 0.2s",
                    }}
                    className="group-hover:!text-white"
                  >
                    {l.native}
                  </span>

                  {/* Active dot */}
                  {lang === l.code && (
                    <motion.div
                      layoutId="active-lang-dot"
                      className="ml-auto w-1 h-1 rounded-full bg-[#B11226]"
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Bottom crystal tip decoration */}
            <div
              className="absolute -bottom-[5px] left-1/2 -translate-x-1/2"
              style={{
                width: 10,
                height: 10,
                background: "rgba(7,7,7,0.92)",
                border: "1px solid rgba(191,194,199,0.1)",
                transform: "translateX(-50%) rotate(45deg)",
                borderTop: "none",
                borderLeft: "none",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
