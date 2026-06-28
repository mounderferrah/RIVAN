"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { gsap } from "gsap";
import { ArrowUpRight, Sparkles, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

// ─────────────────────────────────────────────────────────────────────────────
// HERO — "The Creation of Ideas"
// Independent, absolutely-positioned layers animated with GSAP.
//   • Hands slide in from off-screen and freeze the instant before they touch.
//   • Clouds drift left→right forever on independent speeds (seamless wrap).
//   • Subtle spring parallax follows the pointer (clouds 10px, hands 5px).
// Everything is transform-only (translate/rotate/scale) for a constant 60fps.
// ─────────────────────────────────────────────────────────────────────────────

const enc = (p: string) => encodeURI(p);

// Fingertip anchor points, as a fraction of each hand image's own box.
// Calibrated from the source PNGs (Creation of Adam crop).
const LEFT_TIP = { fx: 0.7, fy: 0.46 }; // God's hand — reaches rightward
const RIGHT_TIP = { fx: 0.15, fy: 0.43 }; // Adam's hand — reaches leftward

// Cloud layers. `group` decides the parallax depth bucket; `speed` is seconds
// for one full L→R traversal (bigger = slower); `start` spreads them along the
// track on first paint so the sky never looks empty.
type CloudDef = {
  src: string;
  group: "far" | "near";
  speed: number;
  start: number; // 0..1 along the track
  top: string;
  width: string;
  opacity: number;
  blur: number;
  z: number;
};

const CLOUDS: CloudDef[] = [
  // FAR — large, slowest, softest (back of the sky)
  { src: "/hero sec/top clouds.png", group: "far", speed: 135, start: 0.05, top: "4%", width: "78vw", opacity: 0.5, blur: 3, z: 1 },
  { src: "/hero sec/buttom cloud.png", group: "far", speed: 115, start: 0.55, top: "18%", width: "66vw", opacity: 0.55, blur: 2, z: 2 },
  // NEAR — smaller / sharper, a touch faster (front of the sky)
  { src: "/hero sec/top clouds.png", group: "near", speed: 80, start: 0.32, top: "10%", width: "44vw", opacity: 0.8, blur: 0.5, z: 3 },
  { src: "/hero sec/buttom cloud.png", group: "near", speed: 95, start: 0.78, top: "62%", width: "82vw", opacity: 0.85, blur: 0, z: 3 },
];

export default function Hero() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const sceneRef = useRef<HTMLDivElement>(null);
  const cloudsFarRef = useRef<HTMLDivElement>(null);
  const cloudsNearRef = useRef<HTMLDivElement>(null);
  const handsRef = useRef<HTMLDivElement>(null);
  const leftHandRef = useRef<HTMLDivElement>(null);
  const rightHandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const leftHand = leftHandRef.current;
    const rightHand = rightHandRef.current;
    const cloudsFar = cloudsFarRef.current;
    const cloudsNear = cloudsNearRef.current;
    const hands = handsRef.current;
    if (!leftHand || !rightHand || !cloudsFar || !cloudsNear || !hands) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // ── CLOUDS — independent infinite L→R drift ─────────────────────────────
      const cloudNodes = gsap.utils.toArray<HTMLElement>(".hero-cloud");

      const buildDrift = () => {
        const vw = window.innerWidth;
        cloudNodes.forEach((node) => {
          const w = node.offsetWidth || vw * 0.5;
          const speed = parseFloat(node.dataset.speed || "100");
          const start = parseFloat(node.dataset.start || "0");
          const track = vw + w; // fully off-left → fully off-right
          const wrapX = gsap.utils.wrap(-w, vw);

          gsap.killTweensOf(node);
          gsap.set(node, { x: -w + start * track, force3D: true });

          if (reduceMotion) return;

          gsap.to(node, {
            x: `+=${track}`,
            duration: speed,
            ease: "none",
            repeat: -1,
            delay: 0.2,
            // Seamless teleport: once a cloud clears the right edge it reappears
            // off the left at the exact same Y / opacity — invisible to the eye.
            modifiers: { x: (v) => wrapX(parseFloat(v)) + "px" },
          });
        });
      };

      buildDrift();

      // ── HANDS — slide in from off-screen, freeze before contact ─────────────
      const lr = leftHand.getBoundingClientRect();
      const rr = rightHand.getBoundingClientRect();

      gsap.set(leftHand, {
        x: -(lr.right + 80),
        rotation: 5,
        transformOrigin: "12% 55%",
        autoAlpha: 1,
        force3D: true,
      });
      gsap.set(rightHand, {
        x: window.innerWidth - rr.left + 80,
        rotation: -5,
        transformOrigin: "88% 55%",
        autoAlpha: 1,
        force3D: true,
      });

      if (reduceMotion) {
        gsap.set([leftHand, rightHand], { x: 0, rotation: 0 });
      } else {
        gsap
          .timeline({ delay: 0.1 })
          .to(
            [leftHand, rightHand],
            { x: 0, rotation: 0, duration: 2.7, ease: "power4.out" },
            0
          );
      }

      // ── PARALLAX — subtle spring follow on the pointer ──────────────────────
      if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
        const farX = gsap.quickTo(cloudsFar, "x", { duration: 0.8, ease: "power2.out" });
        const farY = gsap.quickTo(cloudsFar, "y", { duration: 0.8, ease: "power2.out" });
        const nearX = gsap.quickTo(cloudsNear, "x", { duration: 0.7, ease: "power2.out" });
        const nearY = gsap.quickTo(cloudsNear, "y", { duration: 0.7, ease: "power2.out" });
        const handX = gsap.quickTo(hands, "x", { duration: 0.9, ease: "power2.out" });
        const handY = gsap.quickTo(hands, "y", { duration: 0.9, ease: "power2.out" });

        const onMove = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5; // -0.5 … 0.5
          const ny = e.clientY / window.innerHeight - 0.5;
          farX(nx * 10);   // ±5px
          farY(ny * 6);    // ±3px
          nearX(nx * 20);  // ±10px
          nearY(ny * 14);  // ±7px
          handX(nx * 10);  // ±5px
          handY(ny * 8);   // ±4px
        };
        window.addEventListener("mousemove", onMove, { passive: true });

        // Rebuild drift on resize so the wrap range tracks the viewport width.
        let rt: ReturnType<typeof setTimeout>;
        const onResize = () => {
          clearTimeout(rt);
          rt = setTimeout(buildDrift, 200);
        };
        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("resize", onResize);
          clearTimeout(rt);
        };
      }

      // Reduced-motion / touch: still keep drift responsive to resize.
      let rt: ReturnType<typeof setTimeout>;
      const onResize = () => {
        clearTimeout(rt);
        rt = setTimeout(buildDrift, 200);
      };
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        clearTimeout(rt);
      };
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  // ── Text entrance (independent of the GSAP stage) ──────────────────────────
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.4 } },
  };
  const itemVariants: Variants = {
    hidden: { y: 35, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 90, damping: 18 } },
  };

  // Anchor each hand by its OUTER edge, bled off the viewport edge, so the
  // forearm appears to grow out of the side of the page. Vertical is anchored
  // by the fingertip height so the tips still approach the same line.
  const handStyle = (tip: { fy: number }, side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    width: "var(--hand-w)",
    opacity: 0, // revealed by GSAP once positioned off-screen
    willChange: "transform",
    top: `calc(var(--meet-y) - ${tip.fy} * var(--hand-w))`,
    ...(side === "left"
      ? { left: "calc(-1 * var(--edge-bleed))" }
      : { right: "calc(-1 * var(--edge-bleed))" }),
  });

  return (
    <section
      ref={sceneRef}
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden px-6 md:px-12 select-none"
      style={
        {
          // Composition variables.
          //  --hand-w     : hand size (bigger = larger hands AND smaller centre gap)
          //  --edge-bleed : how far each forearm runs off the screen edge, so the
          //                 watercolour cut is hidden and the arms feel "attached"
          //  --meet-y     : vertical line where the fingertips approach
          "--hand-w": "72vw",
          "--edge-bleed": "8vw",
          "--meet-y": "57%",
        } as React.CSSProperties
      }
    >
      {/* ── Red sky backdrop ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          background: isLight
            ? "linear-gradient(180deg, #b11226 0%, #c5283c 45%, #7d0d17 100%)"
            : "linear-gradient(180deg, #5e0a14 0%, #8f1020 45%, #320409 100%)",
        }}
      />
      {/* soft glowing core */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 75% 55% at 50% 80%, rgba(255,150,150,0.30) 0%, transparent 70%)"
            : "radial-gradient(ellipse 75% 55% at 50% 80%, rgba(255,90,90,0.14) 0%, transparent 70%)",
        }}
      />

      {/* ── FAR clouds (parallax bucket) ── */}
      <div ref={cloudsFarRef} aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {CLOUDS.filter((c) => c.group === "far").map((c, i) => (
          <div
            key={`far-${i}`}
            className="hero-cloud absolute left-0"
            data-speed={c.speed}
            data-start={c.start}
            style={{ top: c.top, width: c.width, zIndex: c.z, willChange: "transform" }}
          >
            <img
              src={enc(c.src)}
              alt=""
              draggable={false}
              className="w-full h-auto"
              style={{ opacity: c.opacity, filter: c.blur ? `blur(${c.blur}px)` : undefined }}
            />
          </div>
        ))}
      </div>

      {/* ── NEAR clouds (parallax bucket) ── */}
      <div ref={cloudsNearRef} aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
        {CLOUDS.filter((c) => c.group === "near").map((c, i) => (
          <div
            key={`near-${i}`}
            className="hero-cloud absolute left-0"
            data-speed={c.speed}
            data-start={c.start}
            style={{ top: c.top, width: c.width, zIndex: c.z, willChange: "transform" }}
          >
            <img
              src={enc(c.src)}
              alt=""
              draggable={false}
              className="w-full h-auto"
              style={{ opacity: c.opacity, filter: c.blur ? `blur(${c.blur}px)` : undefined }}
            />
          </div>
        ))}
      </div>

      {/* ── HANDS (parallax bucket) ── */}
      <div ref={handsRef} aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 12 }}>
        <div ref={leftHandRef} style={handStyle(LEFT_TIP, "left")}>
          <img src={enc("/hero sec/left hand.png")} alt="" draggable={false} className="w-full h-auto" />
        </div>
        <div ref={rightHandRef} style={handStyle(RIGHT_TIP, "right")}>
          <img src={enc("/hero sec/right hand.png")} alt="" draggable={false} className="w-full h-auto" />
        </div>
      </div>

      {/* ── Depth / legibility scrim — sits BEHIND the hands so it never dims
            the fingertip-contact moment; the headline gets a text-shadow ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 58% 46% at 50% 42%, rgba(18,12,20,0.30) 0%, rgba(18,12,20,0.08) 55%, transparent 80%)"
            : "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(5,4,8,0.58) 0%, rgba(5,4,8,0.18) 55%, transparent 82%)",
        }}
      />

      {/* ── Luxury film-frame overlay ── */}
      <div className="absolute inset-8 border border-[#BFC2C7]/10 pointer-events-none z-[16] flex flex-col justify-between p-4 opacity-40">
        <div className="flex justify-between text-[9px] font-sans tracking-[0.2em] text-[#BFC2C7] uppercase">
          <span>RIVAN // GENESIS_SEQUENCE_01</span>
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

      {/* ── Foreground content ── */}
      <motion.div
        className="max-w-6xl mx-auto text-center z-20 flex flex-col items-center mt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8 backdrop-blur-sm"
          style={{ border: "1px solid var(--th-border)", background: "var(--th-glass2)", color: "var(--th-muted)" }}
        >
          <Sparkles size={11} className="text-[#B11226]" />
          {t("hero", "badge")}
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-8xl font-heading font-black tracking-tighter leading-[1.05] max-w-5xl mb-8 uppercase"
          style={{ color: "#F8F8F8", textShadow: "0 2px 30px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.35)" }}
        >
          {t("hero", "line1")} <br />
          {t("hero", "line2")} <br />
          {t("hero", "line3")} <span style={{ color: "var(--th-brand)" }}>{t("hero", "highlight")}</span>
        </motion.h1>

        <motion.div variants={itemVariants} className="flex flex-col gap-2 mb-12" style={{ textShadow: "0 1px 16px rgba(0,0,0,0.5)" }}>
          <p className="text-sm md:text-base tracking-[0.4em] font-heading uppercase font-bold" style={{ color: "#F8F8F8" }}>
            {t("hero", "tech")}
          </p>
          <p className="text-sm md:text-base tracking-[0.25em] font-sans font-light uppercase" style={{ color: "#BFC2C7" }}>
            {t("hero", "vision")}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 mb-24 w-full justify-center px-4"
        >
          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4.5 rounded-full bg-[#B11226] text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(177,18,38,0.2)] hover:shadow-[0_0_25px_rgba(177,18,38,0.45)] transition-all duration-300 transform hover:-translate-y-0.5 clickable"
            style={{ color: "#F8F8F8" }}
          >
            {t("hero", "ctaPrimary")}
            <ArrowUpRight size={14} />
          </a>
          <a
            href="#services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4.5 rounded-full backdrop-blur-sm text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 clickable"
            style={{ border: "1px solid var(--th-border)", background: "var(--th-glass2)", color: isLight ? "#C1121F" : "var(--th-text)" }}
          >
            {t("hero", "ctaSecondary")}
          </a>
        </motion.div>
      </motion.div>

      {/* Down arrow indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30 animate-bounce pointer-events-none z-20">
        <span className="text-[9px] tracking-[0.4em] uppercase text-[#BFC2C7]">{t("hero", "scroll")}</span>
        <ChevronDown size={12} className="text-[#BFC2C7]" />
      </div>
    </section>
  );
}
