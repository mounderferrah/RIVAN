"use client";

import { useTheme } from "@/context/ThemeContext";

// A single continuous volumetric light source shared behind Process, Manifesto
// and Team. One element, one gradient, vertically centered — no per-section
// restarts or offsets, so it reads as one ray of light passing through all three.
export default function AtmosphereBeam() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Light mode is already correct and untouched: same gradient + slow breathing.
  if (isLight) {
    return (
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: "min(70vw, 900px)",
            background: "linear-gradient(to bottom, rgba(193,18,31,0.015) 0%, rgba(248,225,180,0.045) 26%, rgba(248,225,180,0.085) 44%, rgba(248,225,180,0.045) 62%, rgba(193,18,31,0.015) 100%)",
            filter: "blur(40px)",
            animation: "beamBreathe 22s ease-in-out infinite",
            willChange: "opacity",
          }}
        />
      </div>
    );
  }

  // Dark mode: no shared cross-section glow at all. A wide-but-flattened ellipse
  // centered partway down the Process+Manifesto+Team wrapper inevitably reads as a
  // horizontal band/stripe wherever its vertical center lands — exactly the "light
  // leak" / visible divider this was meant to avoid. The manifesto artwork's own
  // seam atmosphere (mist, fog, dust in Manifesto.tsx) already provides light that
  // genuinely originates inside the artwork, so nothing is needed here.
  return null;
}
