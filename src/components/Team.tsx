"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import translations from "@/translations";

interface Member {
  name: string;
  position: string;
  roles: string[];
  initials: string;
  num: string;
  fullTitle: string;
  expandedRoles: string[];
  expandedDesc: string;
  descKey: string;          // key into translations.team for translated description
  imageHint: string;
  imageAlt: string;
  imageSrc?: string;
}

const members: Member[] = [
  {
    name: "Ferrah Mounder",
    position: "Lead Developer",
    roles: ["Web Developer", "Mobile App Dev", "AI Solutions", "Tech Architecture"],
    initials: "FM",
    num: "01",
    fullTitle: "Lead Developer",
    expandedRoles: ["Web Development", "Mobile Development", "Full Stack Solutions", "Software Architecture", "UI Implementation"],
    expandedDesc: "Ferrah transforms ideas into modern digital products by combining technical expertise with creative execution.",
    descKey: "ferrahDesc",
    imageHint: "Developer coding setup — multiple monitors",
    imageAlt: "Ferrah Mounder — Lead Developer",
    imageSrc: "/FM.png",
  },
  {
    name: "Boumendjel Zakaria",
    position: "Marketing & Media Director",
    roles: ["Voice Over Artist", "Audiovisual Director", "Script Writer", "Marketing Manager", "PR"],
    initials: "BZ",
    num: "02",
    fullTitle: "Marketing & Media Director",
    expandedRoles: ["Voice Over", "Audiovisual Direction", "Script Writing", "Media Presentation", "Marketing Strategy", "Public Relations"],
    expandedDesc: "Zakaria leads communication and media strategy.",
    descKey: "zakariaDesc",
    imageSrc: "/zak.png",
    imageHint: "Media production — professional broadcast setup",
    imageAlt: "Boumendjel Zakaria — Marketing & Media Director",
  },
  {
    name: "Ayoub Zenad",
    position: "Visual Production Specialist",
    roles: ["Photographer", "Videographer", "Commercial Filmmaker", "Product Marketing"],
    initials: "AZ",
    num: "03",
    fullTitle: "Visual Production Specialist",
    expandedRoles: ["Photography", "Videography", "Commercial Filmmaking", "Product Marketing", "Visual Storytelling"],
    expandedDesc: "Ayoub creates impactful visual content that elevates brands and strengthens their identity.",
    descKey: "ayoubDesc",
    imageHint: "Photography scene — camera equipment on location",
    imageAlt: "Ayoub Zenad — Visual Production Specialist",
  },
  {
    name: "Bencheikh M. Mehdi",
    position: "Creative Production Manager",
    roles: ["Video Editor", "VFX Artist", "High-End Visuals", "Team Management"],
    initials: "BM",
    num: "04",
    fullTitle: "Creative Production Manager",
    expandedRoles: ["Video Editing", "VFX", "Motion Graphics", "Creative Direction", "Visual Production"],
    expandedDesc: "Mehdi oversees post-production and visual excellence.",
    descKey: "mehdiDesc",
    imageHint: "Editing suite — professional VFX workstation",
    imageAlt: "Bencheikh M. Mehdi — Creative Production Manager",
    imageSrc: "/meh.jpeg",
  },
  {
    name: "Adem",
    position: "Business Development",
    roles: ["Commercial Representative", "Marketing Specialist", "Client Relations"],
    initials: "AD",
    num: "05",
    fullTitle: "Business Development Manager",
    expandedRoles: ["Business Development", "Marketing", "Client Relations", "Commercial Strategy"],
    expandedDesc: "Adem focuses on building partnerships and creating growth opportunities.",
    descKey: "ademDesc",
    imageHint: "Business meetings — marketing strategy sessions",
    imageAlt: "Adem — Business Development Manager",
  },
];

// ── Image Placeholder / Real Photo ────────────────────────────────────────────
// When member.imageSrc is set, a real photo is shown.
// To add a photo for another member, set imageSrc: "/filename.ext" in their data.
function ImagePlaceholder({ member }: { member: Member }) {
  if (member.imageSrc) {
    return (
      <div className="relative overflow-hidden w-full" style={{ aspectRatio: "3/4", background: "#090909" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.imageSrc}
          alt={member.imageAlt}
          className="w-full h-full object-cover object-top"
          draggable={false}
        />
        {/* Subtle cinematic overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(5,5,5,0.55) 0%, transparent 50%)" }} />
        <div className="absolute top-4 left-4 w-4 h-4 pointer-events-none" style={{ borderTop: "1.5px solid rgba(191,194,199,0.22)", borderLeft: "1.5px solid rgba(191,194,199,0.22)" }} />
        <div className="absolute top-4 right-4 w-4 h-4 pointer-events-none" style={{ borderTop: "1.5px solid rgba(191,194,199,0.22)", borderRight: "1.5px solid rgba(191,194,199,0.22)" }} />
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden w-full"
      style={{ aspectRatio: "3/4", background: "#090909" }}
    >
      {/* Studio lighting simulation */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 72% 14%, rgba(191,194,199,0.07) 0%, transparent 60%), linear-gradient(165deg, #111 0%, #0a0a0a 40%, #050505 100%)",
        }}
      />

      {/* Horizontal scanlines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(255,255,255,0.006) 3px, rgba(255,255,255,0.006) 4px)",
        }}
      />

      {/* Large initials watermark */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <span
          className="font-heading font-black text-[#F8F8F8] select-none"
          style={{ fontSize: "clamp(5rem, 14vw, 9rem)", opacity: 0.045, letterSpacing: "-0.02em" }}
        >
          {member.initials}
        </span>
      </div>

      {/* Cinematic corner marks */}
      <div className="absolute top-4 left-4 w-4 h-4 pointer-events-none" style={{ borderTop: "1.5px solid rgba(191,194,199,0.22)", borderLeft: "1.5px solid rgba(191,194,199,0.22)" }} />
      <div className="absolute top-4 right-4 w-4 h-4 pointer-events-none" style={{ borderTop: "1.5px solid rgba(191,194,199,0.22)", borderRight: "1.5px solid rgba(191,194,199,0.22)" }} />
      <div className="absolute bottom-16 left-4 w-4 h-4 pointer-events-none" style={{ borderBottom: "1.5px solid rgba(191,194,199,0.12)", borderLeft: "1.5px solid rgba(191,194,199,0.12)" }} />
      <div className="absolute bottom-16 right-4 w-4 h-4 pointer-events-none" style={{ borderBottom: "1.5px solid rgba(191,194,199,0.12)", borderRight: "1.5px solid rgba(191,194,199,0.12)" }} />

      {/* Image hint */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: "20%" }}>
        <p
          className="text-center px-6"
          style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(191,194,199,0.18)", textTransform: "uppercase", fontFamily: "var(--font-jakarta)", lineHeight: 1.8 }}
        >
          {member.imageHint}
        </p>
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-0 left-0 right-0 px-5 py-4" style={{ background: "linear-gradient(to top, rgba(5,5,5,0.95) 0%, transparent 100%)" }}>
        <p className="text-center" style={{ fontSize: 8, letterSpacing: "0.38em", color: "rgba(191,194,199,0.3)", textTransform: "uppercase", fontFamily: "var(--font-jakarta)", fontWeight: 600 }}>
          Custom Image Placeholder
        </p>
        <p className="text-center mt-0.5" style={{ fontSize: 7.5, letterSpacing: "0.25em", color: "rgba(191,194,199,0.16)", textTransform: "uppercase", fontFamily: "var(--font-jakarta)" }}>
          JPG · PNG · WEBP
        </p>
      </div>
    </div>
  );
}

// ── Expanded Panel ─────────────────────────────────────────────────────────────
function ExpandedPanel({ member }: { member: Member }) {
  const { t, lang } = useLanguage();
  const desc = (translations[lang].team as Record<string, string>)[member.descKey] ?? member.expandedDesc;
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "rgba(7,7,7,0.88)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        border: "1px solid rgba(191,194,199,0.09)",
      }}
    >
      {/* Crystal reflection sweep on mount */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.01, delay: 0.85 }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ x: "-120%", skewX: "-20deg" }}
          animate={{ x: "220%", skewX: "-20deg" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.055) 50%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Top edge highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 40%, rgba(177,18,38,0.2) 60%, transparent)" }}
      />

      {/* Ruby corner accent */}
      <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none" style={{ background: "radial-gradient(circle at 0% 0%, rgba(177,18,38,0.08) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 100%, rgba(177,18,38,0.06) 0%, transparent 70%)" }} />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-0">

        {/* LEFT — Image placeholder (2/5 on desktop) */}
        <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-[rgba(191,194,199,0.08)]">
          <ImagePlaceholder member={member} />
        </div>

        {/* RIGHT — Member information (3/5 on desktop) */}
        <div className="md:col-span-3 flex flex-col justify-center gap-7 px-8 md:px-12 py-10 md:py-14">

          {/* Member number */}
          <motion.span
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{
              fontSize: 10,
              letterSpacing: "0.45em",
              color: "rgba(177,18,38,0.75)",
              textTransform: "uppercase",
              fontFamily: "var(--font-jakarta)",
              fontWeight: 700,
            }}
          >
            {member.num} — {String(members.length).padStart(2, "0")}
          </motion.span>

          {/* Name + title */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
          >
            <h3
              className="font-heading font-black text-[#F8F8F8] tracking-tight leading-none"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 3.2rem)" }}
            >
              {member.name}
            </h3>
            <p
              className="font-heading font-bold text-[#B11226] mt-2 uppercase"
              style={{ fontSize: "clamp(0.72rem, 1vw, 0.88rem)", letterSpacing: "0.18em" }}
            >
              {member.fullTitle}
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.55, delay: 0.38 }}
            style={{ height: 1, background: "linear-gradient(to right, rgba(191,194,199,0.18) 0%, transparent 80%)" }}
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.42 }}
            className="font-sans font-light leading-relaxed"
            style={{ fontSize: "clamp(0.82rem, 1.1vw, 0.96rem)", color: "rgba(191,194,199,0.72)", maxWidth: 520 }}
          >
            {desc}
          </motion.p>

          {/* Expertise tags */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5 }}
          >
            <p
              style={{
                fontSize: 9,
                letterSpacing: "0.35em",
                color: "rgba(191,194,199,0.38)",
                textTransform: "uppercase",
                fontFamily: "var(--font-jakarta)",
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              {t("team", "expertise")}
            </p>
            <div className="flex flex-wrap gap-2">
              {member.expandedRoles.map((role, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.54 + i * 0.06 }}
                  style={{
                    fontSize: 9.5,
                    fontWeight: 600,
                    padding: "5px 14px",
                    border: "1px solid rgba(191,194,199,0.12)",
                    color: "rgba(191,194,199,0.58)",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontFamily: "var(--font-jakarta)",
                    background: "rgba(255,255,255,0.025)",
                  }}
                >
                  {role}
                </motion.span>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

// ── Member Gallery Card ────────────────────────────────────────────────────────
function MemberPanel({
  member,
  index,
  isActive,
  onCardClick,
  onHover,
  onHoverEnd,
}: {
  member: Member;
  index: number;
  isActive: boolean;
  onCardClick: () => void;
  onHover: () => void;
  onHoverEnd: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="flex-none relative overflow-hidden cursor-pointer"
      style={{
        width: "clamp(220px, 72vw, 400px)",
        height: "clamp(480px, 76vh, 660px)",
        backgroundColor: "#0a0a0a",
        border: `1px solid rgba(191,194,199,${isActive ? "0.2" : hovered ? "0.12" : "0.06"})`,
        transition: "border-color 0.5s ease",
        boxShadow: isActive ? "0 0 40px rgba(177,18,38,0.1)" : "none",
      }}
      onClick={onCardClick}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => { setHovered(true); onHover(); }}
      onMouseLeave={() => { setHovered(false); onHoverEnd(); }}
    >
      {/* Real photo (when available) */}
      {member.imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.imageSrc}
          alt={member.imageAlt}
          className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
          draggable={false}
          style={{ opacity: hovered || isActive ? 0.82 : 0.65, transition: "opacity 0.7s ease" }}
        />
      )}

      {/* Studio lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: member.imageSrc
            ? `linear-gradient(165deg, rgba(5,5,5,${hovered || isActive ? "0.25" : "0.45"}) 0%, rgba(5,5,5,0.1) 50%, rgba(5,5,5,0.35) 100%)`
            : hovered || isActive
              ? `radial-gradient(ellipse 75% 65% at 72% 12%, rgba(191,194,199,0.09) 0%, transparent 60%), linear-gradient(165deg, #131313 0%, #0a0a0a 45%, #050505 100%)`
              : `radial-gradient(ellipse 70% 60% at 72% 12%, rgba(191,194,199,0.04) 0%, transparent 60%), linear-gradient(165deg, #111111 0%, #0a0a0a 45%, #050505 100%)`,
          transition: "background 0.8s ease",
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(255,255,255,0.007) 3px, rgba(255,255,255,0.007) 4px)",
        }}
      />

      {/* Large initials watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span
          className="font-heading font-black leading-none select-none"
          style={{
            fontSize: "clamp(6rem, 16vw, 13rem)",
            opacity: hovered || isActive ? 0.022 : 0.06,
            transform: hovered || isActive ? "scale(1.1)" : "scale(1)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            color: "#F8F8F8",
            letterSpacing: "-0.02em",
          }}
        >
          {member.initials}
        </span>
      </div>

      {/* Portrait key light */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 42% 52% at 50% 38%, rgba(55,55,55,${hovered || isActive ? "0.18" : "0.08"}) 0%, transparent 70%)`,
          transition: "background 0.7s ease",
        }}
        animate={{ scale: hovered || isActive ? 1.04 : 1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Crystal reflection on active state */}
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: "-120%", skewX: "-15deg" }}
          animate={{ x: "220%", skewX: "-15deg" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)" }}
        />
      )}

      {/* Corner marks */}
      <div className="absolute top-5 left-5 pointer-events-none" style={{ width: 18, height: 18, borderTop: "1.5px solid rgba(191,194,199,0.2)", borderLeft: "1.5px solid rgba(191,194,199,0.2)" }} />
      <div className="absolute top-5 right-5 pointer-events-none" style={{ width: 18, height: 18, borderTop: "1.5px solid rgba(191,194,199,0.2)", borderRight: "1.5px solid rgba(191,194,199,0.2)" }} />

      {/* Top strip */}
      <div className="absolute top-5 left-0 right-0 flex items-center justify-between px-6 pointer-events-none z-10">
        <span style={{ fontSize: 9, letterSpacing: "0.35em", color: "rgba(191,194,199,0.22)", textTransform: "uppercase", fontFamily: "var(--font-jakarta)" }}>
          {member.num}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, letterSpacing: "0.25em", color: isActive ? "rgba(177,18,38,0.6)" : "rgba(191,194,199,0.18)", textTransform: "uppercase", fontFamily: "var(--font-jakarta)", transition: "color 0.4s" }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: isActive ? "#B11226" : "#B11226", opacity: isActive ? 0.9 : 0.5 }} />
          RIVAN
        </span>
      </div>

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: 220, background: "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.92) 55%, transparent 100%)" }}
      />

      {/* Info panel */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-10 z-10"
        animate={{ y: hovered || isActive ? 0 : 8 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <span
          style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", color: "#B11226", textTransform: "uppercase", fontFamily: "var(--font-jakarta)", marginBottom: 6 }}
        >
          {member.position}
        </span>

        <h3
          className="font-heading font-black text-[#F8F8F8] leading-snug"
          style={{ fontSize: "clamp(1.1rem, 1.4vw, 1.35rem)", marginBottom: 12, letterSpacing: "0.01em" }}
        >
          {member.name}
        </h3>

        <motion.div
          initial={false}
          animate={{ opacity: hovered || isActive ? 1 : 0, height: hovered || isActive ? "auto" : 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ overflow: "hidden" }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {member.roles.map((role, rIdx) => (
              <span
                key={rIdx}
                style={{ fontSize: 9, fontWeight: 600, padding: "3px 8px", border: "1px solid rgba(191,194,199,0.1)", color: "rgba(191,194,199,0.5)", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "var(--font-jakarta)", background: "rgba(255,255,255,0.02)" }}
              >
                {role}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Ruby accent line */}
      <motion.div
        className="absolute bottom-0 left-0"
        style={{ height: 2, background: "#B11226" }}
        animate={{ width: isActive ? "100%" : hovered ? "60%" : "18%" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Active indicator — top pulse */}
      {isActive && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(to right, transparent, #B11226, transparent)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6] }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  );
}

// ── Main Team Section ──────────────────────────────────────────────────────────
export default function Team() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const isDragging = useRef(false);
  const didDrag = useRef(false);
  const dragStartX = useRef(0);
  const dragStartMotionX = useRef(0);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  // Rolling velocity buffer — averages last 5 frames to smooth touch jitter
  const velocityBuf = useRef<number[]>([]);
  const lastClientX = useRef(0);
  const lastTimestamp = useRef(0);

  const [activeMember, setActiveMember] = useState<number | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCardHover = useCallback((index: number) => {
    if (isDragging.current) return;
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setActiveMember(index);
  }, []);

  const handleCardHoverEnd = useCallback(() => {
    hoverTimeout.current = setTimeout(() => setActiveMember(null), 220);
  }, []);

  const handlePanelMouseEnter = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  }, []);

  const handlePanelMouseLeave = useCallback(() => {
    hoverTimeout.current = setTimeout(() => setActiveMember(null), 180);
  }, []);

  const getConstraints = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return { min: 0, max: 0 };
    const min = Math.min(0, -(trackRef.current.offsetWidth - containerRef.current.offsetWidth));
    return { min, max: 0 };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (animRef.current) animRef.current.stop();
    isDragging.current = true;
    didDrag.current = false;
    dragStartX.current = e.clientX;
    dragStartMotionX.current = x.get();
    lastClientX.current = e.clientX;
    lastTimestamp.current = e.timeStamp;
    velocityBuf.current = [];
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    if (Math.abs(e.clientX - dragStartX.current) > 6) didDrag.current = true;

    const delta = e.clientX - dragStartX.current;
    const newX = dragStartMotionX.current + delta;
    const { min, max } = getConstraints();

    if (newX > max) x.set(max + (newX - max) * 0.15);
    else if (newX < min) x.set(min + (newX - min) * 0.15);
    else x.set(newX);

    // Time-weighted instantaneous velocity (px/ms → scale to px/frame at 60fps)
    const dt = Math.max(1, e.timeStamp - lastTimestamp.current);
    const v = ((e.clientX - lastClientX.current) / dt) * 16;
    velocityBuf.current.push(v);
    if (velocityBuf.current.length > 6) velocityBuf.current.shift();
    lastClientX.current = e.clientX;
    lastTimestamp.current = e.timeStamp;
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const { min, max } = getConstraints();
    const currentX = x.get();
    // Average recent velocity frames — eliminates near-zero last-frame jitter on touch
    const buf = velocityBuf.current;
    const velocity = buf.length ? buf.reduce((a, b) => a + b, 0) / buf.length : 0;
    const targetX = Math.max(min, Math.min(max, currentX + velocity * 7));

    animRef.current = animate(x, targetX, {
      type: "spring", stiffness: 70, damping: 18, mass: 0.9, velocity: velocity * 5,
    });
  };

  const handleCardClick = useCallback((index: number) => {
    if (didDrag.current) return;
    setActiveMember(prev => prev === index ? null : index);
  }, []);

  // Smooth scroll panel into view when opened
  useEffect(() => {
    if (activeMember !== null && panelRef.current) {
      const timeout = setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 180);
      return () => clearTimeout(timeout);
    }
  }, [activeMember]);

  return (
    <section id="team" className="py-24 md:py-32 relative overflow-hidden bg-transparent">
      {/* ── Entry atmosphere from Manifesto: receives the dissolving clouds, the last
          faint crystal traces, and the continuing dust — no hard start to this section.
          Light mode merges from the same warm cream Manifesto dissolved into (Team's
          own background is #FDF0D5 too in light mode, so almost nothing is needed
          there); dark mode eases the remaining charcoal down to Team's near-black base. ── */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden z-0"
        style={{ height: isLight ? "30vh" : "38vh", minHeight: isLight ? 230 : 280 }}
        aria-hidden="true"
      >
        {/* Vertical fade. Light mode unchanged. Dark mode reduced in contrast/peak so the
            handoff from Manifesto reads as evaporating atmosphere, not a fade-to-black. */}
        <div className="absolute inset-0" style={{
          background: isLight
            ? "linear-gradient(to bottom, rgba(253,240,213,0.5) 0%, rgba(253,240,213,0.18) 45%, rgba(253,240,213,0) 80%)"
            : "linear-gradient(to bottom, rgba(9,8,9,0.32) 0%, rgba(13,11,13,0.13) 45%, transparent 85%)",
        }} />

        {/* Faint cloud remnants — light mode unchanged. Dark mode keeps a wisp lingering
            behind the heading itself (extended further down, very soft) instead of fully
            dissolving right at the top of the band. */}
        <div style={{
          position: "absolute", top: "2%", left: "22%", width: "24%", height: "30%",
          background: `radial-gradient(ellipse 60% 100% at 50% 50%, rgba(248,248,248,${isLight ? 0.025 : 0.018}) 0%, transparent 75%)`,
          filter: `blur(${isLight ? 12 : 16}px)`, animation: "mistDriftFg 29s ease-in-out infinite",
        }} />
        {!isLight && (
          <div style={{
            position: "absolute", top: "30%", left: "40%", width: "30%", height: "26%",
            background: "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(248,225,180,0.022) 0%, transparent 78%)",
            filter: "blur(18px)", animation: "mistDriftBg 33s ease-in-out 5s infinite",
          }} />
        )}

        {/* Crystal fragments that survived the boundary, faded to a trace (5–10% opacity).
            Light mode keeps float+rotate; dark mode holds them still — glow only. */}
        <div style={{
          position: "absolute", top: "14%", left: "13%", width: 26, height: 33,
          clipPath: "polygon(50% 0%, 88% 35%, 70% 100%, 30% 100%, 12% 35%)",
          background: "rgba(177,18,38,0.04)", border: "1px solid rgba(177,18,38,0.08)",
          filter: "blur(0.5px)", opacity: 0.06, animation: isLight ? "crystalFloat 16s ease-in-out 1s infinite alternate" : "crystalGlow 11s ease-in-out 1s infinite",
        }} />
        <div style={{
          position: "absolute", top: "20%", right: "12%", width: 20, height: 26,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          background: "rgba(191,194,199,0.045)", border: "1px solid rgba(255,255,255,0.06)",
          opacity: 0.08, animation: isLight ? "crystalFloat 13s ease-in-out 4s infinite alternate" : "crystalGlow 9s ease-in-out 4s infinite",
        }} />

        {/* Dust continuing the same drift, fading out as the atmosphere settles.
            Light mode unchanged; dark mode eased to the 3–8% range and given a couple
            extra motes since the band now extends further down. */}
        {[...Array(isLight ? 5 : 7)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", top: `${4 + i * 5}%`, left: `${16 + i * 12}%`,
            width: 2.5, height: 2.5, borderRadius: "50%",
            background: isLight ? "rgba(193,18,31,0.15)" : "rgba(248,232,200,0.07)",
            animation: `dustDrift ${11 + i}s ease-in-out ${i * 0.9}s infinite`,
          }} />
        ))}
      </div>

      {/* Ambient ruby glow */}
      <div className="absolute bottom-1/3 right-0 w-[450px] h-[450px] rounded-full pointer-events-none" style={{ background: "rgba(177,18,38,0.04)", filter: "blur(140px)" }} />

      {/* Section header */}
      <div className="relative z-10 px-6 md:px-12 mb-14 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10 items-end">

          {/* LEFT — decorative editorial panel */}
          <div className="hidden lg:flex flex-col items-center gap-5 self-stretch justify-end pb-1">
            {/* Vertical grow line */}
            <motion.div
              className="w-px flex-1"
              initial={{ scaleY: 0, originY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: "linear-gradient(to bottom, transparent, rgba(191,194,199,0.08) 40%, rgba(177,18,38,0.35))" }}
            />

            {/* Large member count */}
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <span
                className="font-heading font-black leading-none"
                style={{ fontSize: "clamp(3.5rem, 6vw, 5.5rem)", color: "#B11226", opacity: 0.85 }}
              >
                05
              </span>
              <span style={{ fontSize: 8, letterSpacing: "0.45em", color: isLight ? "rgba(0,48,73,0.55)" : "rgba(191,194,199,0.28)", textTransform: "uppercase", fontFamily: "var(--font-jakarta)", fontWeight: 700 }}>
                {t("team", "members")}
              </span>
            </motion.div>

            {/* Thin horizontal rule */}
            <motion.div
              className="w-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ height: 1, background: "linear-gradient(to right, rgba(177,18,38,0.4), rgba(191,194,199,0.08))" }}
            />

            {/* Rotated vertical label */}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                fontSize: 8,
                letterSpacing: "0.4em",
                color: isLight ? "rgba(0,48,73,0.45)" : "rgba(191,194,199,0.22)",
                textTransform: "uppercase",
                fontFamily: "var(--font-jakarta)",
                fontWeight: 600,
                paddingBottom: 4,
              }}
            >
              {t("team", "specialists")}
            </motion.span>
          </div>

          {/* RIGHT — heading text */}
          <div className="flex flex-col gap-4">
            <motion.span
              className="text-xs font-semibold uppercase"
              style={{ letterSpacing: "0.25em", color: "#B11226" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {t("team", "badge")}
            </motion.span>
            <motion.h2
              className="font-heading font-black tracking-tight uppercase"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "var(--th-text)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t("team", "heading1")}{" "}
              <span style={{ color: "var(--th-brand)" }}>
                {t("team", "heading2")}
              </span>
            </motion.h2>
            <motion.p
              className="font-sans font-light"
              style={{ fontSize: "0.9rem", color: isLight ? "rgba(0,48,73,0.65)" : "rgba(191,194,199,0.6)", maxWidth: 480 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("team", "desc")}
            </motion.p>
          </div>

        </div>
      </div>

      {/* Draggable Gallery */}
      <div
        ref={containerRef}
        className="team-draggable-section overflow-hidden"
        style={{ cursor: isDragging.current ? "grabbing" : "grab", touchAction: "none", userSelect: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <motion.div
          ref={trackRef}
          className="flex"
          style={{ x, gap: 12, paddingLeft: "clamp(24px, 4vw, 48px)", width: "max-content" }}
        >
          {members.map((member, index) => (
            <MemberPanel
              key={index}
              member={member}
              index={index}
              isActive={activeMember === index}
              onCardClick={() => handleCardClick(index)}
              onHover={() => handleCardHover(index)}
              onHoverEnd={handleCardHoverEnd}
            />
          ))}
          <div style={{ flexShrink: 0, width: "clamp(24px, 4vw, 48px)" }} />
        </motion.div>
      </div>

      {/* Drag hint */}
      <div className="px-6 md:px-12 mt-6 flex items-center gap-4 max-w-7xl mx-auto">
        <div style={{ height: 1, background: "rgba(191,194,199,0.07)", flex: 1 }} />
        <span style={{ fontSize: 9, letterSpacing: "0.35em", color: "rgba(191,194,199,0.22)", textTransform: "uppercase", fontFamily: "var(--font-jakarta)", userSelect: "none" }}>
          {activeMember !== null ? t("team", "hintClose") : t("team", "hintExpand")}
        </span>
        <div style={{ height: 1, background: "rgba(191,194,199,0.07)", flex: 1 }} />
      </div>

      {/* ── Expandable Member Panel ── */}
      <div
        ref={panelRef}
        className="px-6 md:px-12 max-w-7xl mx-auto mt-4"
        onMouseEnter={handlePanelMouseEnter}
        onMouseLeave={handlePanelMouseLeave}
      >
        <AnimatePresence mode="wait">
          {activeMember !== null && (
            <motion.div
              key={activeMember}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <motion.div
                initial={{ y: 24, filter: "blur(6px)", opacity: 0 }}
                animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                exit={{ y: -12, filter: "blur(4px)", opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="pb-8 pt-3"
              >
                <ExpandedPanel member={members[activeMember]} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
