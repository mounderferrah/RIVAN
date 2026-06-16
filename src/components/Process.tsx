"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Compass, Palette, Rocket, TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

// ─── Orbital constants ────────────────────────────────────────────────────────
// Canvas enlarged (was 500×500 / CX,CY=250) to give the now much wider orbit
// spread room to breathe without relying on SVG overflow to render correctly.
const CX = 300, CY = 300;

// Orbit radii are spread with growing gaps (56/56/56/56 minimum, widening further
// out) so each ring reads as clearly, deliberately farther than the last — a real
// solar-system hierarchy rather than compressed concentric rings.
const ORBITS = [
  { idx: 0, rx: 70,  ry: 24,  tilt: -22, dur: 16, step: "01", label: "DISCOVER" },
  { idx: 1, rx: 126, ry: 42,  tilt: -11, dur: 24, step: "02", label: "PLAN"     },
  { idx: 2, rx: 182, ry: 62,  tilt: -2,  dur: 34, step: "03", label: "CREATE"   },
  { idx: 3, rx: 238, ry: 83,  tilt:  8,  dur: 46, step: "04", label: "LAUNCH"   },
  { idx: 4, rx: 294, ry: 106, tilt: 18,  dur: 60, step: "05", label: "GROW"     },
];

// Full ellipse path for animateMotion (centred at CX, CY)
function ePath(rx: number, ry: number): string {
  return `M ${CX - rx},${CY} A ${rx},${ry},0,1,1,${CX + rx},${CY} A ${rx},${ry},0,1,1,${CX - rx},${CY} Z`;
}

// Regular hexagon vertices
function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 30) * (Math.PI / 180);
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

// ─── Orbital SVG visualization ────────────────────────────────────────────────
function OrbitalViz({
  activeStep,
  onOrbitHover,
  isLight,
}: {
  activeStep: number | null;
  onOrbitHover: (idx: number | null) => void;
  isLight: boolean;
}) {
  // Orbit lines are always visible at rest now (not "almost invisible until hover").
  const orbitBase  = isLight ? "rgba(0,48,73,0.10)"  : "rgba(255,255,255,0.08)";
  const nodeBase   = isLight ? "rgba(0,48,73,0.50)"  : "rgba(191,194,199,0.50)";
  // Active orbit always transitions to the same RIVAN red regardless of theme.
  const activeColor = "#C1121F";
  const activeGlow  = "rgba(193,18,31,0.35)";
  const labelBase   = isLight ? "#669BBC" : "rgba(255,255,255,0.45)";
  const labelSub    = isLight ? "rgba(102,155,188,0.65)" : "rgba(255,255,255,0.28)";
  const transition  = "0.7s cubic-bezier(0.22,1,0.36,1)";
  const isHoveringAny = activeStep !== null;

  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="cryDark" cx="50%" cy="32%" r="68%">
          <stop offset="0%"   stopColor="rgba(160,155,175,0.38)" />
          <stop offset="38%"  stopColor="rgba(18,10,14,0.72)" />
          <stop offset="100%" stopColor="rgba(4,4,8,0.94)" />
        </radialGradient>
        <radialGradient id="cryLight" cx="50%" cy="32%" r="68%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.90)" />
          <stop offset="38%"  stopColor="rgba(190,215,232,0.55)" />
          <stop offset="100%" stopColor="rgba(100,155,188,0.28)" />
        </radialGradient>
        <filter id="fGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="fNode" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="fCry" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ambient soft glow rings behind crystal */}
      <circle cx={CX} cy={CY} r={64}
        fill={isLight ? "rgba(193,18,31,0.04)" : "rgba(177,18,38,0.06)"} />
      <circle cx={CX} cy={CY} r={47}
        fill={isLight ? "rgba(193,18,31,0.06)" : "rgba(177,18,38,0.10)"}>
        <animate attributeName="r"       values="47;53;47" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.55;1" dur="5s" repeatCount="indefinite" />
      </circle>
      {/* Hover pulse — the crystal emits a subtle red pulse whenever any orbit/step
          is active, eased in with the same luxurious timing as the orbits */}
      <circle cx={CX} cy={CY}
        style={{
          r: isHoveringAny ? 72 : 47,
          opacity: isHoveringAny ? 0.22 : 0,
          transition: `r ${transition}, opacity ${transition}`,
        }}
        fill={activeColor}
        filter="url(#fGlow)" />

      {/* ── Orbits ── */}
      {ORBITS.map((o) => {
        const isAct = activeStep === o.idx;
        const isDim = activeStep !== null && !isAct;

        // Label position: rightmost point of tilted ellipse
        const rad = (o.tilt * Math.PI) / 180;
        const lx  = CX + o.rx * Math.cos(rad);
        const ly  = CY + o.rx * Math.sin(rad);

        return (
          <g key={o.idx}>
            {/* Orbit group — tilted */}
            <g
              transform={`rotate(${o.tilt}, ${CX}, ${CY})`}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => onOrbitHover(o.idx)}
              onMouseLeave={() => onOrbitHover(null)}
            >
              {/* Active orbit glow — soft red halo, eases in/out with the rest */}
              {isAct && (
                <ellipse cx={CX} cy={CY} rx={o.rx} ry={o.ry}
                  stroke={activeGlow} strokeWidth={10} opacity={0.6}
                  filter="url(#fGlow)"
                  style={{ transition: `opacity ${transition}` }} />
              )}
              {/* Main orbit line — always visible at rest, eases to RIVAN red on hover */}
              <ellipse cx={CX} cy={CY} rx={o.rx} ry={o.ry}
                stroke={isAct ? activeColor : orbitBase}
                strokeWidth={isAct ? 2 : 1.1}
                opacity={isDim ? 0.4 : 1}
                style={{ transition: `stroke ${transition}, stroke-width ${transition}, opacity ${transition}` }}
              />
              {/* Tick marks at cardinal points on orbit */}
              {[0, 90, 180, 270].map(deg => {
                const ar = (deg * Math.PI) / 180;
                const tx = CX + o.rx * Math.cos(ar);
                const ty = CY + o.ry * Math.sin(ar);
                return (
                  <circle key={deg} cx={tx} cy={ty} r={isAct ? 2.4 : 1.4}
                    fill={isAct ? activeColor : orbitBase}
                    opacity={isDim ? 0.35 : 0.75}
                    style={{ transition: `all ${transition}` }} />
                );
              })}

              {/* Animated node */}
              <g opacity={isDim ? 0.35 : 1} style={{ transition: `opacity ${transition}` }}>
                {/* animateMotion moves the origin of this g along the orbit */}
                <animateMotion
                  path={ePath(o.rx, o.ry)}
                  dur={`${o.dur}s`}
                  repeatCount="indefinite"
                />
                {/* Outer pulse (active) */}
                {isAct && (
                  <circle r={13} fill="none" stroke={activeColor} strokeWidth={0.8} opacity={0.45}>
                    <animate attributeName="r"       values="10;16;10" dur="2.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.45;0.1;0.45" dur="2.8s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Diamond node */}
                <polygon
                  points={`0,${isAct ? -7 : -5} ${isAct ? 7 : 5},0 0,${isAct ? 7 : 5} ${isAct ? -7 : -5},0`}
                  fill={isAct ? activeColor : nodeBase}
                  stroke={isAct ? "rgba(255,255,255,0.55)" : (isLight ? "rgba(0,48,73,0.22)" : "rgba(255,255,255,0.18)")}
                  strokeWidth="0.6"
                  filter={isAct ? "url(#fNode)" : undefined}
                  style={{ transition: `all ${transition}` }}
                />
                {/* Inner highlight */}
                <circle r={isAct ? 2.5 : 1.8}
                  fill={isAct ? "#ffffff" : (isLight ? "rgba(253,240,213,0.9)" : "rgba(255,255,255,0.75)")}
                  opacity={0.92}
                />
              </g>
            </g>

            {/* Label — static, at rightmost point of orbit after tilt */}
            <g
              opacity={isDim ? 0.4 : 1}
              style={{ transition: `opacity ${transition}`, cursor: "pointer" }}
              onMouseEnter={() => onOrbitHover(o.idx)}
              onMouseLeave={() => onOrbitHover(null)}
            >
              {/* Connector dot */}
              <circle cx={lx + 5} cy={ly}
                r={isAct ? 2.8 : 1.8}
                fill={isAct ? activeColor : orbitBase}
                style={{ transition: `all ${transition}` }} />
              {/* Step number */}
              <text x={lx + 12} y={ly - 3}
                fontSize="7" fontFamily="var(--font-jakarta), sans-serif"
                fontWeight="700" letterSpacing="0.12em"
                fill={isAct ? activeColor : labelSub}
                style={{ transition: `fill ${transition}` }}>
                {o.step}
              </text>
              {/* Step name */}
              <text x={lx + 12} y={ly + 9}
                fontSize="8.5" fontFamily="var(--font-sora), sans-serif"
                fontWeight={isAct ? 600 : 800} letterSpacing="0.18em"
                fill={isAct ? activeColor : labelBase}
                style={{ transition: `fill ${transition}, font-weight ${transition}` }}>
                {o.label}
              </text>
            </g>
          </g>
        );
      })}

      {/* ── Central Crystal (nested animateTransform for float + rotate) ── */}
      <g>
        {/* Float */}
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 0,-7; 0,0" dur="5.5s" repeatCount="indefinite"
          calcMode="spline" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
          keyTimes="0;0.5;1" additive="replace" />
        <g>
          {/* Slow rotation */}
          <animateTransform attributeName="transform" type="rotate"
            values={`0 ${CX} ${CY}; 2 ${CX} ${CY}; 0 ${CX} ${CY}; -2 ${CX} ${CY}; 0 ${CX} ${CY}`}
            dur="9s" repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1"
            keyTimes="0;0.25;0.5;0.75;1"
            additive="sum" />

          {/* Outer ring */}
          <circle cx={CX} cy={CY} r={46}
            stroke={isLight ? "rgba(193,18,31,0.14)" : "rgba(177,18,38,0.18)"}
            strokeWidth="0.6" strokeDasharray="3 5" />

          {/* Main crystal body — slightly larger, raising its visual importance */}
          <polygon points={hexPoints(CX, CY, 38)}
            fill={isLight ? "url(#cryLight)" : "url(#cryDark)"}
            stroke={isLight ? "rgba(102,155,188,0.55)" : "rgba(177,18,38,0.40)"}
            strokeWidth="0.8"
            filter="url(#fCry)" />

          {/* Top facet — brightest */}
          <polygon
            points={`${CX},${CY - 38} ${CX + 21},${CY - 10} ${CX - 21},${CY - 10}`}
            fill={isLight ? "rgba(255,255,255,0.55)" : "rgba(177,18,38,0.13)"}
            stroke={isLight ? "rgba(255,255,255,0.8)"  : "rgba(177,18,38,0.22)"}
            strokeWidth="0.35" />

          {/* Bottom-right facet */}
          <polygon
            points={`${CX},${CY + 38} ${CX + 21},${CY + 10} ${CX + 32},${CY - 9}`}
            fill={isLight ? "rgba(102,155,188,0.22)" : "rgba(70,70,110,0.18)"}
            stroke={isLight ? "rgba(102,155,188,0.35)" : "rgba(100,100,140,0.14)"}
            strokeWidth="0.3" />

          {/* Bottom-left facet */}
          <polygon
            points={`${CX},${CY + 38} ${CX - 21},${CY + 10} ${CX - 32},${CY - 9}`}
            fill={isLight ? "rgba(200,222,238,0.18)" : "rgba(35,35,65,0.22)"}
            stroke={isLight ? "rgba(150,195,215,0.28)" : "rgba(70,70,115,0.14)"}
            strokeWidth="0.3" />

          {/* Specular highlight */}
          <ellipse cx={CX - 10} cy={CY - 14} rx={8} ry={4.5}
            fill={isLight ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.14)"}
            transform={`rotate(-28, ${CX - 10}, ${CY - 14})`} />

          {/* Ruby heart glow */}
          <circle cx={CX} cy={CY} r={17}
            fill={isLight ? "rgba(193,18,31,0.08)" : "rgba(177,18,38,0.12)"}>
            <animate attributeName="opacity" values="1;0.5;1" dur="3.5s" repeatCount="indefinite" />
          </circle>

          {/* RIVAN — engraved text */}
          <text x={CX} y={CY + 5}
            textAnchor="middle"
            fontFamily="var(--font-sora), sans-serif"
            fontSize="9.5" fontWeight="900"
            letterSpacing="0.38em"
            fill={isLight ? "rgba(0,48,73,0.35)" : "rgba(248,248,248,0.26)"}>
            RIVAN
          </text>

          {/* Crystal shimmer sweep */}
          <polygon points={hexPoints(CX, CY, 38)}
            fill="none"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="6">
            <animate attributeName="stroke-opacity"
              values="0;0.12;0" dur="4s" repeatCount="indefinite" begin="1s" />
          </polygon>
        </g>
      </g>

      {/* Floating micro particles */}
      {([
        { x: CX + 92,  y: CY - 48, r: 1.2, d: "7.5s",  od: "7.5s"  },
        { x: CX - 78,  y: CY + 58, r: 0.9, d: "9.5s",  od: "9.5s"  },
        { x: CX + 48,  y: CY + 88, r: 1.0, d: "11s",   od: "11s"   },
        { x: CX - 108, y: CY - 28, r: 0.7, d: "8.5s",  od: "8.5s"  },
        { x: CX + 128, y: CY + 32, r: 0.8, d: "13s",   od: "13s"   },
        { x: CX - 55,  y: CY - 80, r: 0.6, d: "10.5s", od: "10.5s" },
      ] as const).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r}
          fill={isLight ? "rgba(0,48,73,0.28)" : "rgba(255,255,255,0.22)"}>
          <animate attributeName="cy"
            values={`${p.y};${p.y - 14};${p.y}`}
            dur={p.d} repeatCount="indefinite" begin={`${i * 0.9}s`} />
          <animate attributeName="opacity"
            values="0.28;0.65;0.28"
            dur={p.od} repeatCount="indefinite" begin={`${i * 0.9}s`} />
        </circle>
      ))}
    </svg>
  );
}

// ─── Process section ──────────────────────────────────────────────────────────
export default function Process() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight  = theme === "light";
  const accent   = isLight ? "#C1121F" : "#B11226";

  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [scrollActive, setScrollActive] = useState<number>(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Sync active from hover (priority) or scroll
  const activeStep = hoveredStep ?? scrollActive;

  const steps = [
    { icon: <Search     className="w-4 h-4" />, title: t("process","discover.title"), subtitle: t("process","discover.subtitle"), desc: t("process","discover.desc") },
    { icon: <Compass    className="w-4 h-4" />, title: t("process","plan.title"),     subtitle: t("process","plan.subtitle"),     desc: t("process","plan.desc")     },
    { icon: <Palette    className="w-4 h-4" />, title: t("process","create.title"),   subtitle: t("process","create.subtitle"),   desc: t("process","create.desc")   },
    { icon: <Rocket     className="w-4 h-4" />, title: t("process","launch.title"),   subtitle: t("process","launch.subtitle"),   desc: t("process","launch.desc")   },
    { icon: <TrendingUp className="w-4 h-4" />, title: t("process","grow.title"),     subtitle: t("process","grow.subtitle"),     desc: t("process","grow.desc")     },
  ];

  // Scroll-based orbit activation
  useEffect(() => {
    const els = stepRefs.current;
    const observers = els.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setScrollActive(i); },
        { rootMargin: "-38% 0px -38% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  return (
    <section id="process" className="py-24 md:py-32 relative overflow-hidden px-6 md:px-12 bg-transparent">
      {/* Ambient ruby haze */}
      <div className="absolute top-1/3 right-0 -translate-y-1/2 w-[480px] h-[480px] rounded-full blur-[160px] pointer-events-none"
        style={{ background: isLight ? "rgba(193,18,31,0.035)" : "rgba(177,18,38,0.045)" }} />

      {/* ── Cinematic seam into Manifesto: fog, crystals, dust, volumetric light ── */}
      <div className="absolute inset-x-0 bottom-0 h-[34vh] min-h-[260px] pointer-events-none z-0" aria-hidden="true">
        {/* Vertical atmospheric fade — light mode only (warm/cream rise toward Manifesto).
            Dark mode has no gradient layer here at all: any full-width overlay, even at
            near-zero alpha, was still reading as a faint band against the page's pure
            black. Process should end on the page's own black with nothing stacked on top. */}
        {isLight && (
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(253,240,213,0) 0%, rgba(248,225,180,0.08) 55%, rgba(248,225,180,0.18) 100%)",
          }} />
        )}

        {/* Floating crystal fragments near the seam. Light mode keeps float+rotate;
            dark mode holds them still — glow only. */}
        <div style={{
          position: "absolute", bottom: "20%", left: "9%", width: 44, height: 58,
          clipPath: "polygon(50% 0%, 88% 35%, 70% 100%, 30% 100%, 12% 35%)",
          background: "rgba(177,18,38,0.05)", border: "1px solid rgba(177,18,38,0.12)",
          filter: "blur(0.5px)", animation: isLight ? "crystalFloat 13s ease-in-out infinite alternate" : "crystalGlow 10s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "32%", right: "13%", width: 28, height: 36,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          background: "rgba(191,194,199,0.04)", border: "1px solid rgba(255,255,255,0.06)",
          animation: isLight ? "crystalFloat 16s ease-in-out 2s infinite alternate" : "crystalGlow 12s ease-in-out 2s infinite",
        }} />

        {/* Soft cloud atmosphere — light mode only (see note above re: dark mode bands) */}
        {isLight && (
          <div style={{
            position: "absolute", bottom: "4%", left: "18%", width: "44%", height: "55%",
            background: "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(248,248,248,0.06) 0%, transparent 75%)",
            filter: "blur(16px)",
          }} />
        )}

        {/* Light dust drifting upward toward Process content — kept at its original
            intensity for light mode; softened for dark mode per the 3–10% bleed spec */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", bottom: `${4 + i * 6}%`, left: `${10 + i * 14}%`,
            width: 3, height: 3, borderRadius: "50%",
            background: isLight ? "rgba(248,232,200,0.32)" : "rgba(248,232,200,0.08)",
            animation: `dustDrift ${8 + i}s ease-in-out ${i * 0.7}s infinite`,
          }} />
        ))}

        {/* Glass reflection sweep — light mode only. This horizontal traveling sweep,
            duplicated independently in the Manifesto seam, is what made dark mode's
            lighting feel like a disconnected website effect rather than atmosphere. */}
        {isLight && (
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: 0, bottom: 0, width: "30%",
              background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.04), transparent)",
              animation: "glassReflect 9s ease-in-out infinite",
            }} />
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Mobile: orbital on top; Desktop: side-by-side */}
        <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-6 items-start">

          {/* ── LEFT 45%: content ── */}
          <div className="w-full lg:w-[45%] flex flex-col">

            {/* Section header */}
            <motion.span className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
              style={{ color: accent }}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              {t("process", "badge")}
            </motion.span>

            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-heading font-black tracking-tight uppercase mb-4"
              style={{ color: "var(--th-text)" }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              {t("process", "heading1")}{" "}
              <span style={{ color: "var(--th-brand)" }}>{t("process", "heading2")}</span>
            </motion.h2>

            <motion.p className="text-sm md:text-base font-sans font-light max-w-md mb-8"
              style={{ color: "var(--th-muted)" }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              {t("process", "desc")}
            </motion.p>

            {/* Step cards */}
            <div className="flex flex-col gap-2.5">
              {steps.map((step, i) => {
                const isAct = activeStep === i;
                return (
                  <motion.div
                    key={i}
                    ref={el => { stepRefs.current[i] = el; }}
                    className="relative rounded-xl cursor-pointer overflow-hidden"
                    style={{
                      background: isAct
                        ? (isLight ? "rgba(255,255,255,0.78)" : "rgba(10,10,10,0.85)")
                        : (isLight ? "rgba(255,255,255,0.32)" : "rgba(8,8,8,0.38)"),
                      border: `1px solid ${isAct ? accent + "55" : (isLight ? "rgba(0,48,73,0.07)" : "rgba(255,255,255,0.055)")}`,
                      backdropFilter: "blur(18px)",
                      boxShadow: isAct ? `0 0 22px ${accent}18, 0 6px 28px rgba(0,0,0,0.14)` : "none",
                      transition: "all 0.38s cubic-bezier(0.22,1,0.36,1)",
                    }}
                    onMouseEnter={() => setHoveredStep(i)}
                    onMouseLeave={() => setHoveredStep(null)}
                    initial={{ opacity: 0, x: -22 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.52, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}>

                    {/* Active left bar */}
                    <div className="absolute left-0 top-2.5 bottom-2.5 w-[2px] rounded-full"
                      style={{
                        background: isAct ? accent : "transparent",
                        boxShadow: isAct ? `0 0 8px ${accent}` : "none",
                        transition: "all 0.38s",
                      }} />

                    {/* Top crystal sweep on active */}
                    {isAct && (
                      <div className="absolute top-0 left-0 right-0 h-[1px]"
                        style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }} />
                    )}

                    <div className="pl-4 pr-4 py-4 flex items-start gap-4">
                      {/* Step number */}
                      <span className="text-2xl font-heading font-black flex-shrink-0 leading-none mt-0.5"
                        style={{ color: isAct ? accent : (isLight ? "rgba(0,48,73,0.18)" : "rgba(191,194,199,0.20)"), transition: "color 0.38s" }}>
                        {ORBITS[i].step}
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-sm font-heading font-black uppercase tracking-wide"
                            style={{ color: isAct ? accent : "var(--th-text)", transition: "color 0.38s" }}>
                            {step.title}
                          </h3>
                          <span className="text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{
                              background: isAct ? `${accent}1a` : (isLight ? "rgba(0,48,73,0.05)" : "rgba(255,255,255,0.04)"),
                              border: `1px solid ${isAct ? accent + "42" : (isLight ? "rgba(0,48,73,0.09)" : "rgba(255,255,255,0.07)")}`,
                              color: isAct ? accent : "var(--th-muted)",
                              transition: "all 0.38s",
                            }}>
                            {step.subtitle}
                          </span>
                        </div>

                        {/* Description — expands on active */}
                        <div style={{
                          maxHeight: isAct ? "88px" : "0px",
                          overflow: "hidden",
                          opacity: isAct ? 1 : 0,
                          transition: "max-height 0.38s cubic-bezier(0.22,1,0.36,1), opacity 0.32s",
                        }}>
                          <p className="text-xs font-sans font-light leading-relaxed pt-1"
                            style={{ color: isLight ? "rgba(0,48,73,0.60)" : "rgba(191,194,199,0.58)" }}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT 55%: orbital visualization ── */}
          <div className="w-full lg:w-[55%] flex items-center justify-center lg:sticky lg:top-24 order-first lg:order-last">
            <motion.div
              className="relative w-full"
              style={{ maxWidth: 540, aspectRatio: "1 / 1" }}
              initial={{ opacity: 0, scale: 0.90 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}>

              {/* Subtle glass backdrop circle */}
              <div className="absolute inset-12 rounded-full pointer-events-none"
                style={{
                  background: isLight
                    ? "radial-gradient(circle, rgba(255,255,255,0.28) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(8,8,8,0.48) 0%, transparent 70%)",
                }} />

              {/* Outer decorative ring */}
              <div className="absolute inset-4 rounded-full pointer-events-none"
                style={{
                  border: `1px solid ${isLight ? "rgba(0,48,73,0.06)" : "rgba(255,255,255,0.04)"}`,
                }} />

              <OrbitalViz
                activeStep={activeStep}
                onOrbitHover={setHoveredStep}
                isLight={isLight}
              />

              {/* "METHODOLOGY" label below orb */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <p className="text-[8px] font-sans font-bold uppercase tracking-[0.45em]"
                  style={{ color: isLight ? "rgba(0,48,73,0.22)" : "rgba(191,194,199,0.20)" }}>
                  Orbital Methodology
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
