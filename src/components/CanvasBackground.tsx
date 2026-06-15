"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

// Crystal polygon shapes (points normalized, center = 0,0, radius ≈ 1)
const CRYSTAL_SHAPES: [number, number][][] = [
  [[-0.18, -1], [0.14, -0.55], [0.38, 0.05], [0.22, 0.85], [-0.14, 1], [-0.32, 0.38], [-0.28, -0.28]],
  [[0, -1], [0.65, -0.18], [0.48, 0.92], [-0.48, 0.92], [-0.65, -0.18]],
  [[0.12, -1], [0.58, -0.28], [0.78, 0.42], [0.28, 1], [-0.18, 0.58], [-0.38, -0.08]],
  [[0, -1], [0.14, -0.28], [0.22, 0.52], [0, 1], [-0.22, 0.52], [-0.14, -0.28]],
  [[-0.55, -0.48], [0.55, -0.48], [0.95, 0.12], [0.48, 0.8], [-0.48, 0.8], [-0.95, 0.12]],
];

// Crystal fill + stroke + highlight per type — dark mode
const CRYSTAL_COLORS_DARK: [string, string, string][] = [
  ["rgba(248,248,248,0.09)", "rgba(255,255,255,0.22)", "rgba(255,255,255,0.35)"],
  ["rgba(191,194,199,0.08)", "rgba(191,194,199,0.2)",  "rgba(191,194,199,0.32)"],
  ["rgba(177,18,38,0.1)",    "rgba(177,18,38,0.26)",   "rgba(177,18,38,0.42)"],
];
// Crystal fill + stroke + highlight per type — light mode
const CRYSTAL_COLORS_LIGHT: [string, string, string][] = [
  ["rgba(0,48,73,0.05)",    "rgba(0,48,73,0.14)",    "rgba(102,155,188,0.22)"],
  ["rgba(102,155,188,0.06)","rgba(102,155,188,0.18)","rgba(255,255,255,0.28)"],
  ["rgba(193,18,31,0.08)",  "rgba(193,18,31,0.22)",  "rgba(193,18,31,0.36)"],
];

interface Particle {
  x: number; y: number; vx: number; vy: number;
  r: number; a: number; aDir: number;
}

interface CrystalShard {
  x: number; y: number; vx: number; vy: number;
  rot: number; rotSpeed: number;
  scale: number; type: 0 | 1 | 2;
  a: number; aDir: number;
  shapeIdx: number;
}

interface FogPatch {
  x: number; y: number; vx: number; vy: number;
  radius: number; a: number; aDir: number;
}

interface RubyTrail {
  pts: { x: number; y: number }[];
  hx: number; hy: number;
  angle: number; speed: number;
  maxLen: number; a: number; aDir: number;
}

interface Scratch {
  x: number; w: number; opacity: number; life: number;
}

export default function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => { themeRef.current = theme; }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    // Scroll offset for subtle parallax influence on shards
    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // ── Ambient light leaks (colors updated per frame from themeRef) ─
    const lights = [
      { x: W * 0.15, y: H * 0.2, vx: 0.14, vy: 0.09, r: Math.max(W, H) * 0.46 },
      { x: W * 0.75, y: H * 0.6, vx: -0.09, vy: 0.11, r: Math.max(W, H) * 0.54 },
      { x: W * 0.5, y: H * 0.8, vx: 0.07, vy: -0.14, r: Math.max(W, H) * 0.38 },
    ];

    // ── Constellation particles ───────────────────────────────────
    const particles: Particle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 0.85 + 0.2,
      a: Math.random() * 0.22 + 0.04, aDir: Math.random() > 0.5 ? 1 : -1,
    }));

    // ── Fog patches ───────────────────────────────────────────────
    const fog: FogPatch[] = Array.from({ length: 4 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.07, vy: (Math.random() - 0.5) * 0.055,
      radius: Math.random() * 220 + 160,
      a: Math.random() * 0.011 + 0.003, aDir: 1,
    }));

    // ── Crystal shards ────────────────────────────────────────────
    const shards: CrystalShard[] = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.1, vy: (Math.random() - 0.5) * 0.1,
      rot: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.0028,
      scale: Math.random() * 90 + 60,       // 60–150px radius (was 22–74)
      type: (i % 3) as 0 | 1 | 2,
      a: Math.random() * 0.3 + 0.55, aDir: Math.random() > 0.5 ? 1 : -1, // 0.55–0.85 (was 0.18–0.68)
      shapeIdx: i % CRYSTAL_SHAPES.length,
    }));

    // ── Ruby energy trails ────────────────────────────────────────
    const trails: RubyTrail[] = Array.from({ length: 3 }, () => ({
      pts: [], hx: Math.random() * W, hy: Math.random() * H,
      angle: Math.random() * Math.PI * 2, speed: Math.random() * 0.35 + 0.15,
      maxLen: Math.floor(Math.random() * 55 + 35),
      a: 0.01, aDir: 1,
    }));

    // ── Film scratches ────────────────────────────────────────────
    const scratches: Scratch[] = [];

    // ── Draw a crystal shard ──────────────────────────────────────
    const drawShard = (s: CrystalShard) => {
      const pts = CRYSTAL_SHAPES[s.shapeIdx];
      const palette = themeRef.current === "light" ? CRYSTAL_COLORS_LIGHT : CRYSTAL_COLORS_DARK;
      const [fill, stroke, highlight] = palette[s.type];

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);

      // Fill
      ctx.beginPath();
      pts.forEach(([px, py], i) => {
        i === 0 ? ctx.moveTo(px * s.scale, py * s.scale) : ctx.lineTo(px * s.scale, py * s.scale);
      });
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.globalAlpha = s.a;
      ctx.fill();

      // Edge
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 0.65;
      ctx.globalAlpha = s.a * 0.85;
      ctx.stroke();

      // Inner reflection highlight (first two edges)
      ctx.beginPath();
      ctx.moveTo(pts[0][0] * s.scale * 0.82, pts[0][1] * s.scale * 0.82);
      ctx.lineTo(pts[1][0] * s.scale * 0.82, pts[1][1] * s.scale * 0.82);
      ctx.strokeStyle = highlight;
      ctx.lineWidth = 0.9;
      ctx.globalAlpha = s.a * 0.45;
      ctx.stroke();

      ctx.restore();
      ctx.globalAlpha = 1;
    };

    // ── Main render loop ──────────────────────────────────────────
    const loop = () => {
      const isLight = themeRef.current === "light";

      // 1 · Base fill — dark mode draws bg; light mode canvas is transparent (CSS body handles bg)
      ctx.globalAlpha = 1;
      if (!isLight) {
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, W, H);
      } else {
        ctx.clearRect(0, 0, W, H);
      }

      // 2 · Fog patches
      fog.forEach(f => {
        f.x += f.vx; f.y += f.vy;
        if (f.x < -f.radius) f.x = W + f.radius;
        if (f.x > W + f.radius) f.x = -f.radius;
        if (f.y < -f.radius) f.y = H + f.radius;
        if (f.y > H + f.radius) f.y = -f.radius;
        f.a += f.aDir * 0.000075;
        if (f.a > 0.015 || f.a < 0.003) f.aDir *= -1;

        const fogColor = isLight ? `rgba(102,155,188,${f.a * 0.7})` : `rgba(191,194,199,${f.a})`;
        const fogEdge = isLight ? "rgba(253,240,213,0)" : "rgba(5,5,5,0)";
        const fg = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
        fg.addColorStop(0, fogColor);
        fg.addColorStop(1, fogEdge);
        ctx.fillStyle = fg; ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2); ctx.fill();
      });

      // 3 · Ambient light leaks
      const lightColors = isLight
        ? ["rgba(102,155,188,0.015)", "rgba(193,18,31,0.010)", "rgba(253,240,213,0.018)"]
        : ["rgba(255,255,255,0.02)", "rgba(177,18,38,0.013)", "rgba(191,194,199,0.016)"];
      const lightEdge = isLight ? "rgba(253,240,213,0)" : "rgba(5,5,5,0)";
      lights.forEach((l, i) => {
        l.x += l.vx; l.y += l.vy;
        if (l.x < -l.r || l.x > W + l.r) l.vx *= -1;
        if (l.y < -l.r || l.y > H + l.r) l.vy *= -1;

        const lg = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
        lg.addColorStop(0, lightColors[i]); lg.addColorStop(1, lightEdge);
        ctx.fillStyle = lg; ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2); ctx.fill();
      });

      // 4 · Crystal shards (scroll influences y drift slightly)
      const scrollInfluence = scrollY * 0.00012;
      shards.forEach(s => {
        s.x += s.vx; s.y += s.vy + scrollInfluence * (s.type === 2 ? 0.6 : 0.3);
        if (s.x < -120) s.x = W + 120;
        if (s.x > W + 120) s.x = -120;
        if (s.y < -120) s.y = H + 120;
        if (s.y > H + 120) s.y = -120;
        s.rot += s.rotSpeed;
        s.a += s.aDir * 0.0009;
        if (s.a > 0.88 || s.a < 0.45) s.aDir *= -1;
        drawShard(s);
      });

      // 6 · Ruby energy trails
      trails.forEach(t => {
        t.hx += Math.cos(t.angle) * t.speed;
        t.hy += Math.sin(t.angle) * t.speed;
        t.angle += (Math.random() - 0.5) * 0.038;

        if (t.hx < 0 || t.hx > W || t.hy < 0 || t.hy > H) {
          t.hx = Math.random() * W; t.hy = Math.random() * H; t.pts = [];
        }

        t.pts.push({ x: t.hx, y: t.hy });
        if (t.pts.length > t.maxLen) t.pts.shift();

        t.a += t.aDir * 0.0025;
        if (t.a > 0.16) t.aDir = -1;
        if (t.a < 0.015) t.aDir = 1;

        if (t.pts.length > 1) {
          ctx.globalAlpha = 1;
          const trailColor = isLight ? "193,18,31" : "177,18,38";
          for (let i = 1; i < t.pts.length; i++) {
            const prog = i / t.pts.length;
            ctx.beginPath();
            ctx.moveTo(t.pts[i - 1].x, t.pts[i - 1].y);
            ctx.lineTo(t.pts[i].x, t.pts[i].y);
            ctx.strokeStyle = `rgba(${trailColor},${t.a * prog * (isLight ? 0.6 : 1)})`;
            ctx.lineWidth = prog * 1.1;
            ctx.stroke();
          }
        }
      });

      // 7 · Constellation particles + connection lines
      ctx.globalAlpha = 1;
      const particleColor = isLight ? "0,48,73" : "191,194,199";
      const particleMaxA = isLight ? 0.18 : 0.26;
      const lineMaxA = isLight ? 0.045 : 0.065;
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        p.a += p.aDir * 0.0012;
        if (p.a > particleMaxA || p.a < 0.04) p.aDir *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor},${p.a})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 155) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${particleColor},${(1 - d / 155) * lineMaxA})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      });

      // 8 · Film scratches — dark mode only (cinematic look)
      if (!isLight) {
        if (Math.random() < 0.038) {
          scratches.push({
            x: Math.random() * W, w: Math.random() * 0.75 + 0.2,
            opacity: Math.random() * 0.055 + 0.018, life: Math.floor(Math.random() * 8) + 2,
          });
        }
        scratches.forEach((s, idx) => {
          ctx.strokeStyle = `rgba(248,248,248,${s.opacity})`;
          ctx.lineWidth = s.w; ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.moveTo(s.x, 0); ctx.lineTo(s.x + (Math.random() - 0.5) * 2, H); ctx.stroke();
          s.life -= 1;
          if (s.life <= 0) scratches.splice(idx, 1);
        });
      }

      // 9 · Film grain
      ctx.globalAlpha = 1;
      const grainColor = isLight ? "rgba(0,48,73,0.008)" : "rgba(248,248,248,0.014)";
      ctx.fillStyle = grainColor;
      for (let i = 0; i < 260; i++) {
        ctx.fillRect(Math.random() * W, Math.random() * H, Math.random() * 1.1, Math.random() * 1.1);
      }

      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-50 w-full h-full block pointer-events-none"
    />
  );
}
