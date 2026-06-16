"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

// Fixed (non-random) layout so server/client markup matches — values are hand-placed
// to sit within the cloud/mist bands of manifesto.png (left & right thirds, avoiding
// the clear center sky and the ground level).
const DUST_PARTICLES = [
  { top: "8%",  left: "6%",  size: 1.6, depth: "back",  variant: "A", dur: 34, delay: 0    },
  { top: "16%", left: "14%", size: 1.1, depth: "back",  variant: "B", dur: 39, delay: 4.5  },
  { top: "24%", left: "9%",  size: 1.8, depth: "mid",   variant: "A", dur: 26, delay: 2    },
  { top: "33%", left: "18%", size: 1.3, depth: "mid",   variant: "C", dur: 29, delay: 9    },
  { top: "12%", left: "27%", size: 1.0, depth: "back",  variant: "B", dur: 37, delay: 13   },
  { top: "41%", left: "11%", size: 2.0, depth: "front", variant: "A", dur: 20, delay: 6    },
  { top: "20%", left: "82%", size: 1.5, depth: "back",  variant: "C", dur: 35, delay: 1.5  },
  { top: "9%",  left: "90%", size: 1.2, depth: "mid",   variant: "A", dur: 27, delay: 11   },
  { top: "30%", left: "86%", size: 1.9, depth: "front", variant: "B", dur: 21, delay: 3.5  },
  { top: "38%", left: "75%", size: 1.1, depth: "back",  variant: "C", dur: 40, delay: 7    },
  { top: "17%", left: "70%", size: 1.4, depth: "mid",   variant: "B", dur: 28, delay: 15   },
  { top: "45%", left: "92%", size: 1.0, depth: "back",  variant: "A", dur: 36, delay: 10   },
  { top: "5%",  left: "48%", size: 0.9, depth: "back",  variant: "C", dur: 38, delay: 5    },
  { top: "27%", left: "55%", size: 1.3, depth: "mid",   variant: "A", dur: 30, delay: 8.5  },
  // Bottom-band motes — continue the same atmosphere toward the Team seam
  { top: "82%", left: "12%", size: 1.2, depth: "back",  variant: "B", dur: 36, delay: 6.5  },
  { top: "88%", left: "30%", size: 0.9, depth: "back",  variant: "C", dur: 41, delay: 2.5  },
  { top: "85%", left: "68%", size: 1.3, depth: "mid",   variant: "A", dur: 31, delay: 12   },
  { top: "91%", left: "85%", size: 1.0, depth: "back",  variant: "B", dur: 38, delay: 9.5  },
] as const;

export default function Manifesto() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Extremely subtle independent parallax per depth layer (dark mode only — light
  // mode stays exactly as-is). Amplitudes are kept tiny on purpose: just enough to
  // separate the layers, never enough to read as "the artwork moving".
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const yArchitecture = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  const yClouds = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const yDust = useTransform(scrollYProgress, [0, 1], [-16, 16]);

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
    <section ref={sectionRef} className="py-32 md:py-48 relative overflow-hidden px-6 md:px-12 bg-transparent select-none">
      {/* ── Manifesto background art ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      >
        {/* Layer 1 — background architecture: static image, never moves in light mode.
            In dark mode it carries only a near-invisible parallax shift (±4px) for depth. */}
        <motion.div className="absolute inset-0" style={{ y: isLight ? 0 : yArchitecture }}>
          {isLight ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url('/manifesto.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: 0.95,
                maskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 16%, rgba(0,0,0,1) 32%, rgba(0,0,0,1) 64%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.12) 92%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 16%, rgba(0,0,0,1) 32%, rgba(0,0,0,1) 64%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.12) 92%, rgba(0,0,0,0) 100%)",
              }}
            />
          ) : (
            // manidark.png — purpose-built dark variant: architecture/crystals concentrated
            // at the edges, a naturally clean dark center. Masked on all four sides (not just
            // top/bottom) so left/right never show a rectangular image edge either.
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url('/manidark.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: 0.96,
                // Top reveal stretched much longer and softer (full opacity not reached until
                // ~56% instead of 30%) so the image's near-empty dark top band never appears
                // as a flat rectangle against the page background — it simply keeps getting
                // very gradually less transparent until real content (architecture) is already
                // present. Bottom-half stops (66%/82%/94%/100%) are untouched per instructions.
                maskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.22) 18%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.72) 42%, rgba(0,0,0,1) 56%, rgba(0,0,0,1) 66%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.15) 94%, rgba(0,0,0,0) 100%), linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 8%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, rgba(0,0,0,0.6) 92%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.22) 18%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.72) 42%, rgba(0,0,0,1) 56%, rgba(0,0,0,1) 66%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.15) 94%, rgba(0,0,0,0) 100%), linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 8%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, rgba(0,0,0,0.6) 92%, rgba(0,0,0,0) 100%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
            />
          )}
          {/* Theme-matching wash so the art blends with the section. Dark mode is kept
              lighter than before — manidark.png is already dark, so a heavy wash would
              just muddy it; only a faint depth gradient is added. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: isLight
                ? "linear-gradient(to bottom, rgba(253,240,213,0.15) 0%, rgba(253,240,213,0.3) 100%)"
                : "linear-gradient(to bottom, rgba(5,5,5,0.08) 0%, rgba(5,5,5,0.18) 100%)",
            }}
          />
        </motion.div>

        {/* Layer 2 — cloud atmosphere: low-opacity soft shapes confined to the artwork's
            own mist bands (left & right thirds). No blend-mode trick, no movement of the
            artwork itself — just a faint shift in mist density + shape breathing, plus a
            slightly larger parallax range than the architecture layer (dark mode only). */}
        <motion.div className="absolute inset-0" style={{ y: isLight ? 0 : yClouds }}>
          <div style={{
            position: "absolute", top: "6%", left: "-6%", width: "44%", height: "60%",
            background: "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(248,248,248,0.07) 0%, transparent 78%)",
            filter: "blur(22px)", animation: "mistDriftBg 34s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", top: "14%", left: "-2%", width: "30%", height: "42%",
            background: "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(248,248,248,0.09) 0%, transparent 75%)",
            filter: "blur(14px)", animation: "mistDriftFg 24s ease-in-out 3s infinite",
          }} />
          <div style={{
            position: "absolute", top: "10%", right: "-8%", width: "46%", height: "58%",
            background: "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(248,248,248,0.065) 0%, transparent 78%)",
            filter: "blur(22px)", animation: "mistDriftBg 38s ease-in-out 6s infinite",
          }} />
          <div style={{
            position: "absolute", top: "20%", right: "2%", width: "28%", height: "40%",
            background: "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(248,248,248,0.08) 0%, transparent 75%)",
            filter: "blur(13px)", animation: "mistDriftFg 27s ease-in-out 1.5s infinite",
          }} />
          {/* Extra flank fog — dark mode only, reinforces the mask so the manidark.png
              edges never read as a rectangular image boundary against the page background */}
          {!isLight && (
            <>
              <div style={{
                position: "absolute", top: "0%", left: "-12%", width: "26%", height: "100%",
                background: "radial-gradient(ellipse 50% 90% at 50% 50%, rgba(20,18,18,0.5) 0%, transparent 80%)",
                filter: "blur(28px)", animation: "mistDriftBg 40s ease-in-out 10s infinite",
              }} />
              <div style={{
                position: "absolute", top: "0%", right: "-12%", width: "26%", height: "100%",
                background: "radial-gradient(ellipse 50% 90% at 50% 50%, rgba(20,18,18,0.5) 0%, transparent 80%)",
                filter: "blur(28px)", animation: "mistDriftFg 33s ease-in-out 14s infinite",
              }} />
            </>
          )}
        </motion.div>

        {/* Layer 3 — dust & particles: tiny, near-invisible motes drifting inside the
            cloud formations, with the largest (still tiny) parallax range so they read
            as the closest layer, plus occasional light-catch glints. */}
        <motion.div className="absolute inset-0" style={{ y: isLight ? 0 : yDust }}>
          {DUST_PARTICLES.map((p, i) => {
            const palette = isLight
              ? ["rgba(253,240,213,0.55)", "rgba(247,233,200,0.5)", "rgba(212,175,55,0.5)", "rgba(120,38,46,0.45)"]
              : ["rgba(191,194,199,0.55)", "rgba(177,18,38,0.55)", "rgba(255,255,255,0.5)"];
            const color = palette[i % palette.length];
            const blurPx = p.depth === "back" ? 1.4 : p.depth === "mid" ? 0.7 : 0.2;
            const baseOpacity = p.depth === "back" ? 0.35 : p.depth === "mid" ? 0.55 : 0.7;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: p.top,
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  borderRadius: "50%",
                  background: color,
                  filter: `blur(${blurPx}px)`,
                  opacity: baseOpacity,
                  animation: `dustWander${p.variant} ${p.dur}s ease-in-out ${p.delay}s infinite`,
                  willChange: "transform, opacity",
                }}
              />
            );
          })}
        </motion.div>
      </div>

      {/* ── Cinematic seam continuing from Process: fog, crystals, dust, volumetric light ── */}
      <div className="absolute inset-x-0 top-0 h-[34vh] min-h-[260px] pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Vertical atmospheric fade — light mode only, unchanged. Dark mode has no
            gradient layer here: any full-width overlay stacked on top of the artwork's
            own mask was exactly what created the visible band against Process. The
            artwork's own top mask (below) now handles the entire emergence by itself. */}
        {isLight && (
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(248,225,180,0.14) 0%, rgba(253,240,213,0.08) 45%, rgba(253,240,213,0) 75%)",
          }} />
        )}

        {/* Floating crystal fragments — continuing from the Process seam above.
            Light mode keeps the original float+rotate. Dark mode keeps these structures
            perfectly still (per spec) and only lets them glow/flicker. */}
        <div style={{
          position: "absolute", top: "18%", left: "11%", width: 30, height: 38,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          background: "rgba(191,194,199,0.045)", border: "1px solid rgba(255,255,255,0.07)",
          animation: isLight ? "crystalFloat 15s ease-in-out 1s infinite alternate" : "crystalGlow 9s ease-in-out 1s infinite",
        }} />
        <div style={{
          position: "absolute", top: "28%", right: "9%", width: 44, height: 58,
          clipPath: "polygon(50% 0%, 88% 35%, 70% 100%, 30% 100%, 12% 35%)",
          background: "rgba(177,18,38,0.05)", border: "1px solid rgba(177,18,38,0.12)",
          filter: "blur(0.5px)", animation: isLight ? "crystalFloat 13s ease-in-out 3s infinite alternate" : "crystalGlow 11s ease-in-out 3s infinite",
        }} />

        {/* Light dust continuing upward through the seam — original intensity kept for
            light mode; softened to the 3–10% bleed range for dark mode */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", top: `${4 + i * 6}%`, left: `${16 + i * 13}%`,
            width: 3, height: 3, borderRadius: "50%",
            background: isLight ? "rgba(248,232,200,0.32)" : "rgba(248,232,200,0.08)",
            animation: `dustDrift ${9 + i}s ease-in-out ${i * 0.6}s infinite`,
          }} />
        ))}

        {/* Glass reflection sweep — light mode only (see Process.tsx for why dark mode
            drops this: two independent sweeps, unsynchronized, read as website noise) */}
        {isLight && (
          <div style={{
            position: "absolute", top: 0, bottom: 0, width: "30%",
            background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.04), transparent)",
            animation: "glassReflect 11s ease-in-out 2s infinite",
          }} />
        )}
      </div>

      {/* ── Exit atmosphere into Team: architecture is already gone by here (the
          base art is masked out above this band), and what remains dissolves in
          stages — clouds and dust outlast everything else. Light mode dissolves
          purely into warm cream (#FDF0D5), never into gray or black. Dark mode
          eases toward Team's dark base but is capped well short of solid black,
          so the lingering clouds/dust/light stay visible through it. ── */}
      <div className="absolute inset-x-0 bottom-0 h-[42vh] min-h-[300px] pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Vertical atmospheric fade. Light mode kept exactly as-is. Dark mode softened —
            lower contrast, lower peak — so it evaporates rather than fades to black. */}
        <div className="absolute inset-0" style={{
          background: isLight
            ? "linear-gradient(to bottom, rgba(253,240,213,0) 0%, rgba(253,240,213,0.45) 50%, rgba(253,240,213,0.8) 78%, rgba(253,240,213,0.97) 100%)"
            : "linear-gradient(to bottom, rgba(5,5,5,0) 0%, rgba(13,11,13,0.16) 52%, rgba(9,8,9,0.28) 80%, rgba(7,6,7,0.38) 100%)",
        }} />

        {/* Cloud dissolution — sparse, lower density than the body of the artwork,
            fragmenting and fading as it approaches Team. These persist the longest.
            Light mode unchanged; dark mode softened further (lower contrast, more blur). */}
        <div style={{
          position: "absolute", bottom: "26%", left: "10%", width: "30%", height: "34%",
          background: `radial-gradient(ellipse 60% 100% at 50% 50%, rgba(248,248,248,${isLight ? 0.05 : 0.035}) 0%, transparent 75%)`,
          filter: `blur(${isLight ? 15 : 19}px)`, animation: "mistDriftBg 36s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "6%", right: "14%", width: "24%", height: "28%",
          background: `radial-gradient(ellipse 60% 100% at 50% 50%, rgba(248,248,248,${isLight ? 0.04 : 0.028}) 0%, transparent 75%)`,
          filter: `blur(${isLight ? 13 : 17}px)`, animation: "mistDriftFg 26s ease-in-out 4s infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "0%", left: "38%", width: "20%", height: "20%",
          background: `radial-gradient(ellipse 60% 100% at 50% 50%, rgba(248,225,180,${isLight ? 0.035 : 0.022}) 0%, transparent 75%)`,
          filter: `blur(${isLight ? 11 : 15}px)`, animation: "mistDriftBg 31s ease-in-out 8s infinite",
        }} />

        {/* Crystal fragments fading to a faint trace as they cross into Team (5–10% opacity).
            Light mode keeps the float+rotate; dark mode holds them still, glow only. */}
        <div style={{
          position: "absolute", bottom: "30%", left: "16%", width: 22, height: 28,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          background: "rgba(191,194,199,0.05)", border: "1px solid rgba(255,255,255,0.06)",
          opacity: 0.08, animation: isLight ? "crystalFloat 17s ease-in-out 2.5s infinite alternate" : "crystalGlow 12s ease-in-out 2.5s infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "18%", right: "10%", width: 30, height: 40,
          clipPath: "polygon(50% 0%, 88% 35%, 70% 100%, 30% 100%, 12% 35%)",
          background: "rgba(177,18,38,0.04)", border: "1px solid rgba(177,18,38,0.08)",
          filter: "blur(0.5px)", opacity: 0.07, animation: isLight ? "crystalFloat 14s ease-in-out 5s infinite alternate" : "crystalGlow 10s ease-in-out 5s infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "6%", left: "46%", width: 18, height: 23,
          clipPath: "polygon(50% 0%, 88% 35%, 70% 100%, 30% 100%, 12% 35%)",
          background: "rgba(191,194,199,0.04)", border: "1px solid rgba(255,255,255,0.05)",
          opacity: 0.06, animation: isLight ? "crystalFloat 19s ease-in-out 7s infinite alternate" : "crystalGlow 13s ease-in-out 7s infinite",
        }} />

        {/* Light dust — outlasts the clouds and crystals, continuing through toward Team.
            Light mode kept at its original intensity; dark mode eased to the 3–8% range. */}
        {[...Array(7)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", bottom: `${2 + i * 5}%`, left: `${10 + i * 12}%`,
            width: 2.5, height: 2.5, borderRadius: "50%",
            background: isLight ? "rgba(193,18,31,0.18)" : "rgba(248,232,200,0.08)",
            animation: `dustDrift ${10 + i}s ease-in-out ${i * 0.8}s infinite`,
          }} />
        ))}
      </div>

      {/* Subtle ruby red leak backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#B11226]/[0.015] rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
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
