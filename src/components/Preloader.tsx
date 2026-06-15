"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface PreloaderProps {
  onComplete: () => void;
}

const CRYSTAL_FRAGMENTS = [
  { x: -180, y: -120, rot: 45,  delay: 0,    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
  { x:  160, y: -100, rot: -30, delay: 0.08, clipPath: "polygon(50% 0%, 85% 32%, 70% 100%, 30% 100%, 15% 32%)" },
  { x: -120, y:  130, rot: 20,  delay: 0.16, clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)" },
  { x:  140, y:  120, rot: -55, delay: 0.06, clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
  { x: -200, y:   10, rot: 70,  delay: 0.12, clipPath: "polygon(50% 0%, 80% 28%, 65% 100%, 35% 100%, 20% 28%)" },
  { x:  190, y:   20, rot: -15, delay: 0.04, clipPath: "polygon(40% 0%, 100% 30%, 75% 100%, 25% 100%, 0% 28%)" },
  { x:  -80, y: -170, rot: -40, delay: 0.2,  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
  { x:   70, y:  165, rot: 35,  delay: 0.14, clipPath: "polygon(50% 0%, 90% 28%, 75% 100%, 25% 100%, 10% 28%)" },
];

interface AshParticle {
  x: number; y: number;
  vy: number;           // upward speed (negative = up)
  vxBase: number;       // horizontal drift base
  phase: number;        // sine drift phase
  size: number;
  wRatio: number;       // width/height ratio for flake shape
  alpha: number;
  maxAlpha: number;
  rot: number;
  rotSpeed: number;
  type: 0 | 1 | 2;     // 0=ash, 1=ember, 2=spark
}

interface DustParticle {
  id: number; x: number; y: number;
  size: number; delay: number; color: string;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [phase, setPhase] = useState<"dust" | "assemble" | "reveal" | "button" | "exit">("dust");
  const [isDone, setIsDone] = useState(false);
  const [dustParticles, setDustParticles] = useState<DustParticle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setDustParticles(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 420,
        y: (Math.random() - 0.5) * 380,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 0.4,
        color: i % 4 === 0 ? "#ff6b35" : i % 4 === 1 ? "#B11226" : i % 4 === 2 ? "#ff9a3c" : "#BFC2C7",
      }))
    );
  }, []);

  // Burning ashes / ember canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let rafId: number;

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    // Spawn ash particles distributed across the screen
    const COUNT = 90;
    const particles: AshParticle[] = Array.from({ length: COUNT }, (_, i) => {
      const type = i < 55 ? 0 : i < 80 ? 1 : 2; // ash, ember, spark
      return {
        x: Math.random() * W,
        y: Math.random() * H,           // scattered across viewport at start
        vy: -(Math.random() * 0.55 + (type === 2 ? 0.6 : type === 1 ? 0.3 : 0.12)),
        vxBase: (Math.random() - 0.5) * 0.22,
        phase: Math.random() * Math.PI * 2,
        size: type === 2 ? Math.random() * 1.5 + 0.5
              : type === 1 ? Math.random() * 2.5 + 1
              : Math.random() * 4 + 2,
        wRatio: type === 0 ? Math.random() * 1.4 + 0.6 : 1,
        alpha: 0,
        maxAlpha: type === 2 ? Math.random() * 0.7 + 0.3
                 : type === 1 ? Math.random() * 0.55 + 0.2
                 : Math.random() * 0.38 + 0.12,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.025,
        type,
      };
    });

    // Gradually fade particles in
    let frameCount = 0;

    const drawBg = (light: boolean) => {
      // Rich red-fire gradient background
      const cx = W / 2, cy = H;
      const r = Math.max(W, H) * 1.1;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      if (light) {
        // Burgundy fire for light theme
        grad.addColorStop(0,   "#780000");
        grad.addColorStop(0.25,"#5a0008");
        grad.addColorStop(0.55,"#2e0005");
        grad.addColorStop(1,   "#0d0001");
      } else {
        // Deep crimson fire for dark theme
        grad.addColorStop(0,   "#B11226");
        grad.addColorStop(0.22,"#5c0710");
        grad.addColorStop(0.5, "#1a0103");
        grad.addColorStop(1,   "#050505");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Secondary hot-spot at center-bottom
      const hot = ctx.createRadialGradient(cx, H * 0.85, 0, cx, H * 0.85, W * 0.45);
      hot.addColorStop(0, light ? "rgba(193,18,31,0.22)" : "rgba(177,18,38,0.30)");
      hot.addColorStop(1, "transparent");
      ctx.fillStyle = hot; ctx.fillRect(0, 0, W, H);
    };

    const drawParticle = (p: AshParticle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;

      if (p.type === 0) {
        // Ash flake — dark brownish grey irregular shape
        const col = isLight
          ? `rgba(60,10,10,${p.maxAlpha})`
          : `rgba(90,50,50,${p.maxAlpha})`;
        ctx.fillStyle = col;
        ctx.beginPath();
        const hw = p.size * p.wRatio * 0.5;
        const hh = p.size * 0.5;
        ctx.ellipse(0, 0, hw, hh, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 1) {
        // Ember — glowing orange-red dot
        const inner = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        inner.addColorStop(0, "rgba(255,130,30,0.95)");
        inner.addColorStop(0.4, "rgba(220,50,10,0.70)");
        inner.addColorStop(1, "rgba(177,18,38,0)");
        ctx.fillStyle = inner;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Spark — tiny bright white-yellow
        ctx.fillStyle = "rgba(255,220,120,0.95)";
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      frameCount++;
      const light = document.documentElement.getAttribute("data-theme") === "light";

      ctx.clearRect(0, 0, W, H);
      drawBg(light);

      // Subtle scanline texture
      ctx.fillStyle = "rgba(0,0,0,0.018)";
      for (let yy = 0; yy < H; yy += 6) {
        ctx.fillRect(0, yy, W, 1);
      }

      particles.forEach(p => {
        // Fade in during first 60 frames
        const targetA = frameCount > 60 ? p.maxAlpha : p.maxAlpha * (frameCount / 60);
        p.alpha += (targetA - p.alpha) * 0.05;

        // Rise upward with sine horizontal drift
        p.phase += 0.012;
        p.x += p.vxBase + Math.sin(p.phase) * 0.18;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        // Sparks fade out as they rise
        if (p.type === 2) {
          p.alpha *= 0.985;
        }

        // Reset when off screen
        if (p.y < -20 || (p.type === 2 && p.alpha < 0.02)) {
          p.y = H + Math.random() * 80;
          p.x = Math.random() * W;
          p.phase = Math.random() * Math.PI * 2;
          if (p.type === 2) {
            p.alpha = p.maxAlpha;
          }
        }
        // Wrap horizontal
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        drawParticle(p);
      });

      // Film grain over everything
      ctx.fillStyle = "rgba(255,100,30,0.008)";
      for (let i = 0; i < 200; i++) {
        ctx.fillRect(Math.random() * W, Math.random() * H, Math.random() * 1.5, Math.random() * 1.5);
      }

      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", onResize); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("assemble"), 300);
    const t2 = setTimeout(() => setPhase("reveal"), 1100);
    const t3 = setTimeout(() => setPhase("button"), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleEnter = () => {
    setIsDone(true);
    setTimeout(onComplete, 900);
  };

  // Brand colors adapt to theme
  const brand = isLight ? "#C1121F" : "#B11226";
  const brandGlow = isLight ? "rgba(193,18,31," : "rgba(177,18,38,";

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none pointer-events-auto overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100vh",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Burning ashes canvas — fills entire preloader */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Ember dust particles burst on entry */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {dustParticles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{ width: p.size, height: p.size, background: p.color, boxShadow: p.color === "#ff6b35" || p.color === "#ff9a3c" ? `0 0 4px ${p.color}` : "none" }}
                initial={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
                animate={
                  phase === "dust"
                    ? { x: p.x, y: p.y, opacity: [0, 0.9, 0.6], scale: [0, 1, 0.8] }
                    : phase === "assemble"
                    ? { x: p.x * 0.3, y: p.y * 0.3, opacity: [0.6, 0.3, 0], scale: [0.8, 0.5, 0] }
                    : { opacity: 0, scale: 0 }
                }
                transition={{ duration: 0.5, delay: p.delay, ease: "easeOut" }}
              />
            ))}
          </div>

          {/* Crystal assembly fragments */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {CRYSTAL_FRAGMENTS.map((frag, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: 40 + (i % 3) * 14,
                  height: 50 + (i % 3) * 18,
                  clipPath: frag.clipPath,
                }}
                initial={{ x: frag.x, y: frag.y, rotate: frag.rot, opacity: 0, scale: 0.4 }}
                animate={
                  phase === "assemble"
                    ? {
                        x: 0, y: 0, rotate: 0, opacity: [0, 0.6, 0],
                        scale: [0.4, 1, 0],
                        background: [
                          `${brandGlow}0.25)`,
                          "rgba(255,120,30,0.35)",
                          "rgba(248,248,248,0)",
                        ],
                      }
                    : phase === "reveal" || phase === "button"
                    ? { opacity: 0, scale: 0 }
                    : {}
                }
                transition={{ duration: 0.75, delay: frag.delay, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>

          {/* Central ember glow at assembly peak */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 260, height: 260,
              background: `radial-gradient(circle, ${brandGlow}0.28) 0%, rgba(255,80,20,0.08) 45%, transparent 70%)`,
              filter: "blur(24px)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              phase === "assemble"
                ? { scale: [0, 1.6, 0], opacity: [0, 1, 0] }
                : { scale: 0, opacity: 0 }
            }
            transition={{ duration: 0.85, delay: 0.3, ease: "easeOut" }}
          />

          {/* RIVAN logo reveal */}
          <div className="relative z-10 flex flex-col items-center gap-5 text-center px-6">
            <div className="flex overflow-hidden pb-1" dir="ltr">
              {"RIVAN".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  className="font-heading font-black tracking-widest"
                  style={{ fontSize: "clamp(3.5rem, 10vw, 6.5rem)", color: "#F8F8F8" }}
                  initial={{ y: 120, opacity: 0 }}
                  animate={phase === "reveal" || phase === "button"
                    ? { y: 0, opacity: 1 }
                    : { y: 120, opacity: 0 }
                  }
                  transition={{ duration: 0.88, delay: 0.08 + i * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Ember accent line */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={phase === "reveal" || phase === "button" ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
            >
              <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, rgba(255,150,50,0.35))" }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: brand, boxShadow: `0 0 6px ${brand}` }} />
              <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, rgba(255,150,50,0.35))" }} />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="font-sans uppercase font-medium"
              style={{ fontSize: "0.65rem", letterSpacing: "0.65em", color: "rgba(255,200,180,0.45)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={phase === "reveal" || phase === "button"
                ? { opacity: 0.45, y: 0 }
                : { opacity: 0, y: 10 }
              }
              transition={{ delay: 0.85, duration: 0.8 }}
            >
              Creative • Technology • Media
            </motion.p>

            {/* ENTER EXPERIENCE button */}
            <div className="h-24 flex items-center justify-center mt-8">
              <AnimatePresence>
                {phase === "button" && (
                  <motion.button
                    onClick={handleEnter}
                    initial={{ opacity: 0, y: 24, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="relative group overflow-hidden px-12 py-4 cursor-pointer"
                    style={{
                      background: "rgba(10,2,2,0.55)",
                      border: `1px solid ${brandGlow}0.30)`,
                      backdropFilter: "blur(16px)",
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Glass reflection */}
                    <span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(105deg, transparent 30%, rgba(255,150,50,0.06) 50%, transparent 70%)",
                        transform: "translateX(-120%) skewX(-20deg)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.animation = "glassReflect 0.7s ease forwards";
                      }}
                    />

                    {/* Ember glow on hover */}
                    <motion.span
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "rgba(177,18,38,0)" }}
                      whileHover={{ background: `${brandGlow}0.09)`, boxShadow: `0 0 35px ${brandGlow}0.25), inset 0 0 20px ${brandGlow}0.06)` }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Crystal corners */}
                    <span className="absolute top-0 left-0 w-2 h-2 border-t border-l pointer-events-none" style={{ borderColor: `${brandGlow}0.40)` }} />
                    <span className="absolute top-0 right-0 w-2 h-2 border-t border-r pointer-events-none" style={{ borderColor: `${brandGlow}0.40)` }} />
                    <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l pointer-events-none" style={{ borderColor: `${brandGlow}0.40)` }} />
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r pointer-events-none" style={{ borderColor: `${brandGlow}0.40)` }} />

                    <span
                      className="relative z-10 font-sans font-bold uppercase tracking-[0.3em]"
                      style={{ fontSize: "0.72rem", color: "#F8F8F8" }}
                    >
                      Enter Experience
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
