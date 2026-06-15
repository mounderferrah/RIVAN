"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Compass, Palette, Rocket, TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

// ─── Orbital constants ────────────────────────────────────────────────────────
const CX = 250, CY = 250;

const ORBITS = [
  { idx: 0, rx: 62,  ry: 20, tilt: -22, dur: 14, step: "01", label: "DISCOVER" },
  { idx: 1, rx: 98,  ry: 33, tilt: -11, dur: 20, step: "02", label: "PLAN"     },
  { idx: 2, rx: 134, ry: 47, tilt: -2,  dur: 28, step: "03", label: "CREATE"   },
  { idx: 3, rx: 170, ry: 61, tilt:  8,  dur: 38, step: "04", label: "LAUNCH"   },
  { idx: 4, rx: 206, ry: 75, tilt: 18,  dur: 50, step: "05", label: "GROW"     },
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
  accent,
}: {
  activeStep: number | null;
  onOrbitHover: (idx: number | null) => void;
  isLight: boolean;
  accent: string;
}) {
  const orbitBase  = isLight ? "rgba(0,48,73,0.15)"    : "rgba(255,255,255,0.13)";
  const nodeBase   = isLight ? "rgba(0,48,73,0.50)"    : "rgba(191,194,199,0.50)";
  const labelBase  = isLight ? "rgba(0,48,73,0.45)"    : "rgba(191,194,199,0.42)";
  const labelSub   = isLight ? "rgba(0,48,73,0.28)"    : "rgba(191,194,199,0.28)";

  return (
    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg"
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
      <circle cx={CX} cy={CY} r={58}
        fill={isLight ? "rgba(193,18,31,0.04)" : "rgba(177,18,38,0.06)"} />
      <circle cx={CX} cy={CY} r={42}
        fill={isLight ? "rgba(193,18,31,0.06)" : "rgba(177,18,38,0.10)"}>
        <animate attributeName="r"       values="42;48;42" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.55;1" dur="5s" repeatCount="indefinite" />
      </circle>

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
              {/* Active orbit background glow line */}
              {isAct && (
                <ellipse cx={CX} cy={CY} rx={o.rx} ry={o.ry}
                  stroke={accent} strokeWidth={8} opacity={0.07}
                  filter="url(#fGlow)" />
              )}
              {/* Main orbit line */}
              <ellipse cx={CX} cy={CY} rx={o.rx} ry={o.ry}
                stroke={isAct ? accent : orbitBase}
                strokeWidth={isAct ? 1.5 : 0.85}
                opacity={isDim ? 0.28 : 1}
                style={{ transition: "stroke 0.4s, stroke-width 0.4s, opacity 0.4s" }}
              />
              {/* Tick marks at cardinal points on orbit */}
              {[0, 90, 180, 270].map(deg => {
                const ar = (deg * Math.PI) / 180;
                const tx = CX + o.rx * Math.cos(ar);
                const ty = CY + o.ry * Math.sin(ar);
                return (
                  <circle key={deg} cx={tx} cy={ty} r={isAct ? 2 : 1.2}
                    fill={isAct ? accent : orbitBase}
                    opacity={isDim ? 0.25 : 0.6}
                    style={{ transition: "all 0.4s" }} />
                );
              })}

              {/* Animated node */}
              <g opacity={isDim ? 0.35 : 1} style={{ transition: "opacity 0.4s" }}>
                {/* animateMotion moves the origin of this g along the orbit */}
                <animateMotion
                  path={ePath(o.rx, o.ry)}
                  dur={`${o.dur}s`}
                  repeatCount="indefinite"
                />
                {/* Outer pulse (active) */}
                {isAct && (
                  <circle r={13} fill="none" stroke={accent} strokeWidth={0.8} opacity={0.45}>
                    <animate attributeName="r"       values="10;16;10" dur="2.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.45;0.1;0.45" dur="2.8s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Diamond node */}
                <polygon
                  points={`0,${isAct ? -7 : -5} ${isAct ? 7 : 5},0 0,${isAct ? 7 : 5} ${isAct ? -7 : -5},0`}
                  fill={isAct ? accent : nodeBase}
                  stroke={isAct ? "rgba(255,255,255,0.55)" : (isLight ? "rgba(0,48,73,0.22)" : "rgba(255,255,255,0.18)")}
                  strokeWidth="0.6"
                  filter={isAct ? "url(#fNode)" : undefined}
                  style={{ transition: "all 0.35s" }}
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
              opacity={isDim ? 0.28 : 1}
              style={{ transition: "opacity 0.4s", cursor: "pointer" }}
              onMouseEnter={() => onOrbitHover(o.idx)}
              onMouseLeave={() => onOrbitHover(null)}
            >
              {/* Connector dot */}
              <circle cx={lx + 5} cy={ly}
                r={isAct ? 2.8 : 1.8}
                fill={isAct ? accent : orbitBase}
                style={{ transition: "all 0.4s" }} />
              {/* Step number */}
              <text x={lx + 12} y={ly - 3}
                fontSize="6.5" fontFamily="var(--font-jakarta), sans-serif"
                fontWeight="700" letterSpacing="0.12em"
                fill={isAct ? accent : labelSub}
                style={{ transition: "fill 0.4s" }}>
                {o.step}
              </text>
              {/* Step name */}
              <text x={lx + 12} y={ly + 8}
                fontSize="7.5" fontFamily="var(--font-sora), sans-serif"
                fontWeight="800" letterSpacing="0.18em"
                fill={isAct ? accent : labelBase}
                style={{ transition: "fill 0.4s" }}>
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
          <circle cx={CX} cy={CY} r={40}
            stroke={isLight ? "rgba(193,18,31,0.14)" : "rgba(177,18,38,0.18)"}
            strokeWidth="0.6" strokeDasharray="3 5" />

          {/* Main crystal body */}
          <polygon points={hexPoints(CX, CY, 34)}
            fill={isLight ? "url(#cryLight)" : "url(#cryDark)"}
            stroke={isLight ? "rgba(102,155,188,0.55)" : "rgba(177,18,38,0.40)"}
            strokeWidth="0.8"
            filter="url(#fCry)" />

          {/* Top facet — brightest */}
          <polygon
            points={`${CX},${CY - 34} ${CX + 19},${CY - 9} ${CX - 19},${CY - 9}`}
            fill={isLight ? "rgba(255,255,255,0.55)" : "rgba(177,18,38,0.13)"}
            stroke={isLight ? "rgba(255,255,255,0.8)"  : "rgba(177,18,38,0.22)"}
            strokeWidth="0.35" />

          {/* Bottom-right facet */}
          <polygon
            points={`${CX},${CY + 34} ${CX + 19},${CY + 9} ${CX + 29},${CY - 8}`}
            fill={isLight ? "rgba(102,155,188,0.22)" : "rgba(70,70,110,0.18)"}
            stroke={isLight ? "rgba(102,155,188,0.35)" : "rgba(100,100,140,0.14)"}
            strokeWidth="0.3" />

          {/* Bottom-left facet */}
          <polygon
            points={`${CX},${CY + 34} ${CX - 19},${CY + 9} ${CX - 29},${CY - 8}`}
            fill={isLight ? "rgba(200,222,238,0.18)" : "rgba(35,35,65,0.22)"}
            stroke={isLight ? "rgba(150,195,215,0.28)" : "rgba(70,70,115,0.14)"}
            strokeWidth="0.3" />

          {/* Specular highlight */}
          <ellipse cx={CX - 9} cy={CY - 13} rx={7} ry={4}
            fill={isLight ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.14)"}
            transform={`rotate(-28, ${CX - 9}, ${CY - 13})`} />

          {/* Ruby heart glow */}
          <circle cx={CX} cy={CY} r={15}
            fill={isLight ? "rgba(193,18,31,0.08)" : "rgba(177,18,38,0.12)"}>
            <animate attributeName="opacity" values="1;0.5;1" dur="3.5s" repeatCount="indefinite" />
          </circle>

          {/* RIVAN — engraved text */}
          <text x={CX} y={CY + 5}
            textAnchor="middle"
            fontFamily="var(--font-sora), sans-serif"
            fontSize="8.5" fontWeight="900"
            letterSpacing="0.38em"
            fill={isLight ? "rgba(0,48,73,0.35)" : "rgba(248,248,248,0.26)"}>
            RIVAN
          </text>

          {/* Crystal shimmer sweep */}
          <polygon points={hexPoints(CX, CY, 34)}
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

      <div className="max-w-7xl mx-auto">
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
                accent={accent}
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
