"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface CrystalDef {
  id: number;
  clipPath: string;
  width: number;
  height: number;
  top: string;
  left?: string;
  right?: string;
  color: string;
  border: string;
  glow: string;
  rotation: number;
  blur: number;
  opacity: number;
  parallaxY: number;
  animDelay: number;
  animDuration: number;
  type: "white" | "silver" | "ruby";
}

const CRYSTALS: CrystalDef[] = [
  // Left side — tall white-glass shard
  {
    id: 1, type: "white",
    clipPath: "polygon(50% 0%, 85% 32%, 70% 100%, 30% 100%, 15% 32%)",
    width: 95, height: 145, top: "6%", left: "1.5%",
    color: "rgba(248,248,248,0.03)", border: "rgba(255,255,255,0.09)",
    glow: "rgba(255,255,255,0.04)", rotation: 12, blur: 1.5, opacity: 0.55,
    parallaxY: -110, animDelay: 0, animDuration: 9,
  },
  // Right top — ruby shard
  {
    id: 2, type: "ruby",
    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    width: 58, height: 58, top: "18%", right: "3%",
    color: "rgba(177,18,38,0.06)", border: "rgba(177,18,38,0.18)",
    glow: "rgba(177,18,38,0.12)", rotation: -22, blur: 0, opacity: 0.75,
    parallaxY: -140, animDelay: 1.5, animDuration: 8,
  },
  // Right — large hexagonal silver
  {
    id: 3, type: "silver",
    clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
    width: 130, height: 115, top: "12%", right: "0.5%",
    color: "rgba(191,194,199,0.025)", border: "rgba(191,194,199,0.07)",
    glow: "rgba(191,194,199,0.04)", rotation: 8, blur: 2, opacity: 0.4,
    parallaxY: -90, animDelay: 3, animDuration: 13,
  },
  // Left mid — silver prism
  {
    id: 4, type: "silver",
    clipPath: "polygon(50% 0%, 90% 28%, 75% 100%, 25% 100%, 10% 28%)",
    width: 75, height: 110, top: "52%", left: "0.5%",
    color: "rgba(191,194,199,0.03)", border: "rgba(191,194,199,0.09)",
    glow: "rgba(191,194,199,0.035)", rotation: -8, blur: 1, opacity: 0.5,
    parallaxY: -70, animDelay: 2, animDuration: 11,
  },
  // Right mid — ruby diamond
  {
    id: 5, type: "ruby",
    clipPath: "polygon(50% 0%, 80% 25%, 100% 78%, 60% 100%, 40% 100%, 0% 78%, 20% 25%)",
    width: 82, height: 100, top: "48%", right: "2%",
    color: "rgba(177,18,38,0.04)", border: "rgba(177,18,38,0.13)",
    glow: "rgba(177,18,38,0.08)", rotation: 28, blur: 0.5, opacity: 0.6,
    parallaxY: -105, animDelay: 0.8, animDuration: 10,
  },
  // Left bottom — white asymmetric shard
  {
    id: 6, type: "white",
    clipPath: "polygon(40% 0%, 100% 25%, 80% 100%, 20% 100%, 0% 28%)",
    width: 68, height: 88, top: "76%", left: "2%",
    color: "rgba(248,248,248,0.025)", border: "rgba(255,255,255,0.07)",
    glow: "rgba(255,255,255,0.03)", rotation: -14, blur: 1, opacity: 0.45,
    parallaxY: -55, animDelay: 4, animDuration: 12,
  },
  // Right bottom — silver needle
  {
    id: 7, type: "silver",
    clipPath: "polygon(50% 0%, 65% 20%, 72% 70%, 50% 100%, 28% 70%, 35% 20%)",
    width: 44, height: 80, top: "78%", right: "4%",
    color: "rgba(191,194,199,0.04)", border: "rgba(191,194,199,0.11)",
    glow: "rgba(191,194,199,0.05)", rotation: 18, blur: 0, opacity: 0.65,
    parallaxY: -45, animDelay: 2.5, animDuration: 7,
  },
  // Center left — large faint white prism (background depth)
  {
    id: 8, type: "white",
    clipPath: "polygon(50% 0%, 95% 38%, 72% 100%, 28% 100%, 5% 38%)",
    width: 160, height: 200, top: "30%", left: "-2%",
    color: "rgba(248,248,248,0.012)", border: "rgba(255,255,255,0.04)",
    glow: "rgba(255,255,255,0.015)", rotation: 5, blur: 3, opacity: 0.3,
    parallaxY: -80, animDelay: 6, animDuration: 16,
  },
];

// Light-mode color overrides per crystal type
const LIGHT_COLORS: Record<CrystalDef["type"], { color: string; border: string; glow: string }> = {
  white:  { color: "rgba(0,48,73,0.04)",    border: "rgba(0,48,73,0.12)",    glow: "rgba(102,155,188,0.06)" },
  silver: { color: "rgba(102,155,188,0.05)", border: "rgba(102,155,188,0.16)", glow: "rgba(102,155,188,0.08)" },
  ruby:   { color: "rgba(193,18,31,0.05)",  border: "rgba(193,18,31,0.16)",  glow: "rgba(193,18,31,0.08)" },
};

function Crystal({ def, scrollYProgress, isLight }: { def: CrystalDef; scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]; isLight: boolean }) {
  const y = useTransform(scrollYProgress, [0, 1], [0, def.parallaxY]);

  const colors = isLight ? LIGHT_COLORS[def.type] : { color: def.color, border: def.border, glow: def.glow };

  const glowStyle = def.type === "ruby"
    ? `0 0 20px ${colors.glow}, inset 0 0 12px ${isLight ? "rgba(193,18,31,0.04)" : "rgba(177,18,38,0.06)"}`
    : `0 0 15px ${colors.glow}, inset 0 0 10px ${isLight ? "rgba(102,155,188,0.03)" : "rgba(255,255,255,0.02)"}`;

  return (
    <motion.div
      className="crystal-shard absolute"
      style={{
        top: def.top,
        left: def.left,
        right: def.right,
        width: def.width,
        height: def.height,
        y,
        rotate: def.rotation,
        opacity: def.opacity,
      }}
    >
      {/* Crystal body */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: def.clipPath,
          background: colors.color,
          boxShadow: glowStyle,
          backdropFilter: "blur(2px)",
          filter: def.blur > 0 ? `blur(${def.blur}px)` : undefined,
          animation: `crystalFloat ${def.animDuration}s ease-in-out ${def.animDelay}s infinite alternate`,
        }}
      />
      {/* Reflection highlight — first face only */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: def.clipPath,
          background: `linear-gradient(135deg, ${colors.border} 0%, transparent 45%)`,
          opacity: 0.6,
          animation: `crystalFloat ${def.animDuration}s ease-in-out ${def.animDelay}s infinite alternate`,
        }}
      />
      {/* Edge stroke via outline trick */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: def.clipPath,
          border: `1px solid ${colors.border}`,
          animation: `crystalFloat ${def.animDuration}s ease-in-out ${def.animDelay}s infinite alternate`,
        }}
      />
    </motion.div>
  );
}

export default function FloatingCrystals() {
  const { scrollYProgress } = useScroll();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none select-none"
      style={{ zIndex: -5 }}
      aria-hidden="true"
    >
      {CRYSTALS.map((def) => (
        <Crystal key={def.id} def={def} scrollYProgress={scrollYProgress} isLight={isLight} />
      ))}
    </div>
  );
}
