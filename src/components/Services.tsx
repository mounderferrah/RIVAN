"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import {
  Code2,
  Smartphone,
  Palette,
  Camera,
  Video,
  TrendingUp,
  Mic2,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/translations";

// ─── Types ────────────────────────────────────────────────────────────────────
type MediaItem = {
  category: string;
  subtitle: string;
  gradient: string;
  accentColor: string;
  Icon: React.ElementType;
  image?: string;
  video?: string;
};

// ─── Ribbon content ───────────────────────────────────────────────────────────
const TOP_ITEMS: MediaItem[] = [
  {
    category: "Web Development",
    subtitle: "Full-Stack Engineering",
    gradient: "linear-gradient(135deg,#0d1117 0%,#162032 55%,#1e3a5f 100%)",
    accentColor: "#5e8be2",
    Icon: Code2,
    image: "/web.jpg",
  },
  {
    category: "Mobile Apps",
    subtitle: "iOS & Android",
    gradient: "linear-gradient(135deg,#100508 0%,#200c14 55%,#2d1018 100%)",
    accentColor: "#B11226",
    Icon: Smartphone,
    image: "/app.jpg",
  },
  {
    category: "Graphic Design",
    subtitle: "Brand Identity",
    gradient: "linear-gradient(135deg,#0f0a1e 0%,#1c1030 55%,#271545 100%)",
    accentColor: "#a05ac8",
    Icon: Palette,
    image: "/id.jpg",
  },
  {
    category: "Photography",
    subtitle: "Product & Portrait",
    gradient: "linear-gradient(135deg,#120e05 0%,#1e1508 55%,#2a1c0a 100%)",
    accentColor: "#c8a050",
    Icon: Camera,
    image: "/cam2.jpg",
  },
  {
    category: "Videography",
    subtitle: "Cinematic Production",
    gradient: "linear-gradient(135deg,#0d0d0d 0%,#1a0507 55%,#240b0d 100%)",
    accentColor: "#d42035",
    Icon: Video,
    image: "/cam.jpg",
  },
  {
    category: "Marketing",
    subtitle: "Growth Strategy",
    gradient: "linear-gradient(135deg,#051212 0%,#0a1f1f 55%,#0d2b2b 100%)",
    accentColor: "#50b4a0",
    Icon: TrendingUp,
  },
  {
    category: "Media Production",
    subtitle: "Audio & Visual",
    gradient: "linear-gradient(135deg,#0d0a05 0%,#1a140a 55%,#261d0f 100%)",
    accentColor: "#c8aa50",
    Icon: Mic2,
  },
  {
    category: "VFX & Motion",
    subtitle: "Visual Effects",
    gradient: "linear-gradient(135deg,#050d12 0%,#0a1a20 55%,#0d2530 100%)",
    accentColor: "#50a0c8",
    Icon: Sparkles,
    video: "/vis.mp4",
  },
];

const BOTTOM_ITEMS: MediaItem[] = [
  {
    category: "UI/UX Design",
    subtitle: "Interface Engineering",
    gradient: "linear-gradient(135deg,#080d18 0%,#101e35 55%,#182b50 100%)",
    accentColor: "#6496e6",
    Icon: Code2,
  },
  {
    category: "App Prototyping",
    subtitle: "Rapid Development",
    gradient: "linear-gradient(135deg,#120308 0%,#200810 55%,#2d0e18 100%)",
    accentColor: "#e63050",
    Icon: Smartphone,
    image: "/pro.jpg",
  },
  {
    category: "Visual Identity",
    subtitle: "Creative Direction",
    gradient: "linear-gradient(135deg,#100a20 0%,#1e1038 55%,#2a1550 100%)",
    accentColor: "#b070d8",
    Icon: Palette,
    image: "/creative.jpg",
  },
  {
    category: "Studio Lighting",
    subtitle: "Product Shots",
    gradient: "linear-gradient(135deg,#141008 0%,#201810 55%,#2c2010 100%)",
    accentColor: "#d4b060",
    Icon: Camera,
    image: "/light.jpg",
  },
  {
    category: "Film Production",
    subtitle: "Story Driven",
    gradient: "linear-gradient(135deg,#100505 0%,#1c0808 55%,#281010 100%)",
    accentColor: "#B11226",
    Icon: Video,
    image: "/film.jpg",
  },
  {
    category: "Campaign Planning",
    subtitle: "Data & Analytics",
    gradient: "linear-gradient(135deg,#081414 0%,#102020 55%,#142c2c 100%)",
    accentColor: "#60c4b0",
    Icon: TrendingUp,
    image: "/data.jpg",
  },
  {
    category: "Voice Recording",
    subtitle: "Sound Design",
    gradient: "linear-gradient(135deg,#100c05 0%,#1c1408 55%,#28200e 100%)",
    accentColor: "#d8b860",
    Icon: Mic2,
    image: "/sound.jpg",
  },
  {
    category: "Motion Graphics",
    subtitle: "Dynamic Visuals",
    gradient: "linear-gradient(135deg,#060e14 0%,#0c1c24 55%,#102838 100%)",
    accentColor: "#60b0d8",
    Icon: Sparkles,
    image: "/vs.jpg",
  },
];

const CARD_W = 280;
const CARD_GAP = 12;

// ─── Single media card ────────────────────────────────────────────────────────
function MediaCard({ item, height }: { item: MediaItem; height: number }) {
  const { Icon, category, subtitle, gradient, accentColor, image, video } = item;

  return (
    <motion.div
      className="relative flex-shrink-0 overflow-hidden cursor-default group/card select-none"
      style={{ width: CARD_W, height, borderRadius: 12, background: gradient }}
      whileHover={{
        scale: 1.03,
        zIndex: 10,
        boxShadow: `0 0 32px ${accentColor}38, 0 8px 40px rgba(0,0,0,0.5), 0 0 60px rgba(177,18,38,0.10)`,
      }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Video background (when available) */}
      {video && (
        <>
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 100%)" }}
          />
        </>
      )}

      {/* Real photo background (when available) */}
      {image && !video && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={category}
            className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
            draggable={false}
          />
          {/* Dark overlay so text/effects remain readable */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 100%)" }}
          />
        </>
      )}

      {/* Dot grid pattern (skip on photo/video cards — too noisy) */}
      {!image && !video && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${accentColor}2a 1px, transparent 1px)`,
            backgroundSize: "22px 22px",
            opacity: 0.4,
          }}
        />
      )}

      {/* Top crystal edge highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent 5%, ${accentColor}95 50%, transparent 95%)`,
        }}
      />
      {/* Left edge subtle glow */}
      <div
        className="absolute top-0 left-0 bottom-0 w-[1px]"
        style={{
          background: `linear-gradient(180deg, ${accentColor}50 0%, transparent 70%)`,
        }}
      />

      {/* Crystal reflection sweep on hover */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
        <div
          className="absolute inset-0 -translate-x-full group-hover/card:translate-x-full transition-transform duration-700 ease-in-out"
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.09) 50%, transparent 70%)",
          }}
        />
      </div>

      {/* Large background icon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Icon
          style={{
            width: 110,
            height: 110,
            color: accentColor,
            opacity: 0.09,
          }}
          strokeWidth={0.65}
          className="group-hover/card:opacity-[0.17] transition-opacity duration-500"
        />
      </div>

      {/* Accent glow dot — top right */}
      <div
        className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full opacity-70 group-hover/card:opacity-100 transition-opacity duration-300"
        style={{
          background: accentColor,
          boxShadow: `0 0 10px ${accentColor}, 0 0 4px ${accentColor}`,
        }}
      />

      {/* Ruby micro-glow at bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-16 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at bottom, ${accentColor}22 0%, transparent 70%)`,
        }}
      />

      {/* Bottom gradient + text */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-12"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
        }}
      >
        <p
          className="text-[9px] uppercase tracking-[0.28em] font-sans font-bold mb-1.5"
          style={{ color: accentColor }}
        >
          {subtitle}
        </p>
        <p className="text-[13px] font-heading font-black uppercase tracking-wide text-white/90">
          {category}
        </p>
      </div>

      {/* Crystal corner marks */}
      <div
        className="absolute top-3 left-3 w-3 h-3 border-t border-l opacity-20 group-hover/card:opacity-65 transition-opacity duration-300"
        style={{ borderColor: accentColor }}
      />
      <div
        className="absolute bottom-3 right-3 w-3 h-3 border-b border-r opacity-20 group-hover/card:opacity-65 transition-opacity duration-300"
        style={{ borderColor: accentColor }}
      />
    </motion.div>
  );
}

// ─── Infinite scrolling ribbon ────────────────────────────────────────────────
function MediaRibbon({
  items,
  direction = "left",
  baseSpeed = 38,
  height = 264,
}: {
  items: MediaItem[];
  direction?: "left" | "right";
  baseSpeed?: number;
  height?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Pre-calculate half-width based on known card dimensions
  const halfW = items.length * CARD_W + (items.length - 1) * CARD_GAP;
  const xVal = useMotionValue(direction === "right" ? -halfW : 0);
  const isHovered = useRef(false);
  const speedMult = useRef(1);
  const lastScrollY = useRef(0);
  const decayTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Refine initial position after DOM mount (accounts for paddingInline)
  useEffect(() => {
    if (direction === "right" && trackRef.current) {
      xVal.set(-(trackRef.current.scrollWidth / 2));
    }
  }, [direction, xVal]);

  // Scroll velocity → speed boost
  useEffect(() => {
    const onScroll = () => {
      const cy = window.scrollY;
      const delta = Math.abs(cy - lastScrollY.current);
      lastScrollY.current = cy;
      speedMult.current = Math.min(1 + delta * 0.055, 3.5);
      if (decayTimer.current) clearTimeout(decayTimer.current);
      decayTimer.current = setTimeout(() => {
        speedMult.current = 1;
      }, 380);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (decayTimer.current) clearTimeout(decayTimer.current);
    };
  }, []);

  useAnimationFrame((_, delta) => {
    if (isHovered.current) return;
    const track = trackRef.current;
    const hw = track ? track.scrollWidth / 2 : halfW;
    const move = (baseSpeed * delta / 1000) * speedMult.current;
    let next = xVal.get();
    if (direction === "left") {
      next -= move;
      if (next <= -hw) next += hw;
    } else {
      next += move;
      if (next >= 0) next -= hw;
    }
    xVal.set(next);
  });

  const cardH = height - 20;

  return (
    <div
      dir="ltr"
      className="relative overflow-hidden"
      style={{ height }}
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
    >
      <motion.div
        ref={trackRef}
        className="flex items-center h-full"
        style={{ x: xVal, width: "max-content", gap: CARD_GAP, paddingInline: 6 }}
      >
        {[...items, ...items].map((item, i) => (
          <MediaCard key={i} item={item} height={cardH} />
        ))}
      </motion.div>

      {/* Left edge fade */}
      <div
        className="absolute top-0 left-0 bottom-0 w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, var(--th-bg) 0%, transparent 100%)" }}
      />
      {/* Right edge fade */}
      <div
        className="absolute top-0 right-0 bottom-0 w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to left, var(--th-bg) 0%, transparent 100%)" }}
      />
    </div>
  );
}

// ─── Services section ─────────────────────────────────────────────────────────
export default function Services() {
  const { t, lang } = useLanguage();
  const svcT = translations[lang].services;

  const services = [
    { icon: <Code2 className="w-6 h-6 text-[#BFC2C7] group-hover:text-[#B11226] transition-colors" />, key: "webDev" },
    { icon: <Smartphone className="w-6 h-6 text-[#BFC2C7] group-hover:text-[#B11226] transition-colors" />, key: "mobileApp" },
    { icon: <Palette className="w-6 h-6 text-[#BFC2C7] group-hover:text-[#B11226] transition-colors" />, key: "graphicDesign" },
    { icon: <Camera className="w-6 h-6 text-[#BFC2C7] group-hover:text-[#B11226] transition-colors" />, key: "photography" },
    { icon: <Video className="w-6 h-6 text-[#BFC2C7] group-hover:text-[#B11226] transition-colors" />, key: "videography" },
    { icon: <TrendingUp className="w-6 h-6 text-[#BFC2C7] group-hover:text-[#B11226] transition-colors" />, key: "marketing" },
    { icon: <Mic2 className="w-6 h-6 text-[#BFC2C7] group-hover:text-[#B11226] transition-colors" />, key: "mediaProduction" },
    { icon: <Sparkles className="w-6 h-6 text-[#BFC2C7] group-hover:text-[#B11226] transition-colors" />, key: "vfx" },
  ].map(({ icon, key }) => {
    const s = svcT[key as keyof typeof svcT] as unknown as { title: string; items: string[] };
    return { icon, title: s.title, items: s.items, color: "group-hover:border-[#B11226]/40 group-hover:shadow-[0_0_25px_rgba(177,18,38,0.12)]" };
  });

  return (
    <section id="services" className="py-24 md:py-32 relative overflow-hidden px-6 md:px-12 bg-transparent">

      {/* ── Section header ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center flex flex-col items-center gap-4 mb-12">
          <motion.span
            className="text-xs font-semibold tracking-[0.25em] text-[#BFC2C7]/60 uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t("services", "badge")}
          </motion.span>
          <motion.h2
            className="text-3xl md:text-5xl font-heading font-black tracking-tight uppercase"
            style={{ color: "var(--th-text)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t("services", "heading")}
          </motion.h2>
          <motion.p
            className="text-sm md:text-base text-[#BFC2C7]/70 font-sans font-light max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t("services", "desc")}
          </motion.p>
        </div>
      </div>

      {/* ── TOP MEDIA RIBBON ───────────────────────────────────── */}
      <motion.div
        dir="ltr"
        className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]"
        style={{ borderTop: "1px solid var(--th-line)", borderBottom: "1px solid var(--th-line)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {/* Ribbon label */}
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 z-20 text-[8px] tracking-[0.4em] uppercase font-sans font-bold pointer-events-none"
          style={{ color: "var(--th-muted)", opacity: 0.25 }}
        >
          Visual Showcase
        </div>
        <MediaRibbon items={TOP_ITEMS} direction="left" baseSpeed={36} height={268} />
      </motion.div>

      {/* ── Service cards ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc, index) => (
            <motion.div
              key={index}
              className={`group glass-card crystal-edge p-8 rounded-none border-[#BFC2C7]/[0.07] transition-all duration-500 relative flex flex-col h-full ${svc.color}`}
              style={{ border: "1px solid rgba(191,194,199,0.07)" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, boxShadow: "0 0 30px rgba(177,18,38,0.08), 0 0 60px rgba(177,18,38,0.04)" }}
            >
              {/* Crystal edge glow on hover */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#BFC2C7]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#B11226]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#BFC2C7]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#BFC2C7]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Corner crystal marks */}
              <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-[#BFC2C7]/15 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-[#BFC2C7]/15 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-[#BFC2C7]/15 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-[#BFC2C7]/15 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 w-fit bg-white/[0.04] border border-white/[0.08] group-hover:border-[#B11226]/25 group-hover:bg-[#B11226]/[0.06] transition-all duration-400">
                  {svc.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-heading font-black text-[#F8F8F8] mb-4 uppercase group-hover:text-[#B11226] transition-colors duration-300">
                {svc.title}
              </h3>

              {/* Items List */}
              <ul className="space-y-2.5 mt-auto">
                {svc.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-[#BFC2C7]/65 font-sans group-hover:text-[#F8F8F8]/85 transition-colors duration-300 font-light">
                    <span className="w-1 h-1 rounded-full bg-[#BFC2C7]/20 group-hover:bg-[#B11226] transition-colors duration-300 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM MEDIA RIBBON ────────────────────────────────── */}
      <motion.div
        dir="ltr"
        className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] mt-16"
        style={{ borderTop: "1px solid var(--th-line)", borderBottom: "1px solid var(--th-line)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <MediaRibbon items={BOTTOM_ITEMS} direction="right" baseSpeed={28} height={268} />
      </motion.div>

      {/* ── Existing text marquee banner ───────────────────────── */}
      <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden border-y border-[#BFC2C7]/5 py-12 mt-0 bg-[#080808]/40 backdrop-blur-sm select-none">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 3 }).map((_, segmentIdx) => (
            <div key={segmentIdx} className="flex gap-16 px-8 items-center text-4xl md:text-6xl font-heading font-black text-[#BFC2C7]/10 uppercase tracking-widest">
              <span>Web Development</span>
              <span className="text-[#B11226] text-3xl">•</span>
              <span>Mobile Apps</span>
              <span className="text-[#B11226] text-3xl">•</span>
              <span>Photography</span>
              <span className="text-[#B11226] text-3xl">•</span>
              <span>Videography</span>
              <span className="text-[#B11226] text-3xl">•</span>
              <span>Marketing</span>
              <span className="text-[#B11226] text-3xl">•</span>
              <span>Branding</span>
              <span className="text-[#B11226] text-3xl">•</span>
              <span>VFX</span>
              <span className="text-[#B11226] text-3xl">•</span>
              <span>Media Production</span>
              <span className="text-[#B11226] text-3xl">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
