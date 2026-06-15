"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [cursorType, setCursorType] = useState<"default" | "drag">("default");

  // Motion values for exact cursor coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Inertial springs for lag/smoothing effect
  const springConfig = { damping: 30, stiffness: 220, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device is mobile/touch
    const checkDevice = () => {
      const mobile =
        window.matchMedia("(max-width: 768px)").matches ||
        ("ontouchstart" in window) ||
        (navigator.maxTouchPoints > 0);
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Detect if cursor is inside the draggable team section
      const target = e.target as HTMLElement;
      if (target) {
        const inTeamSection = !!target.closest(".team-draggable-section");
        setCursorType(inTeamSection ? "drag" : "default");
      }
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    // Hover listener for clickable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".clickable") ||
        target.classList.contains("clickable");

      setIsHovered(!!isClickable);
      
      const inTeamSection = !!target.closest(".team-draggable-section");
      setCursorType(inTeamSection ? "drag" : "default");
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible, isMobile]);

  if (isMobile || !isVisible) return null;

  const isDragCursor = cursorType === "drag";

  return (
    <>
      {/* Dynamic Cursor Ring / Circular Drag Banner */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          width: isDragCursor ? 70 : 32,
          height: isDragCursor ? 70 : 32,
          borderWidth: isDragCursor ? 0 : 1,
          borderColor: isHovered ? "#B11226" : "#BFC2C7",
          backgroundColor: isDragCursor
            ? "#B11226"
            : isHovered
            ? "rgba(177, 18, 38, 0.15)"
            : "rgba(255, 255, 255, 0)",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      >
        {isDragCursor && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-sans font-bold tracking-widest text-[#F8F8F8] uppercase"
          >
            Drag
          </motion.span>
        )}
      </motion.div>

      {/* Core Center Dot - Hidden in drag mode for clean visuals */}
      {!isDragCursor && (
        <motion.div
          className="fixed top-0 left-0 w-2 h-2 bg-[#F8F8F8] rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
          style={{
            x: cursorX,
            y: cursorY,
          }}
        />
      )}
    </>
  );
}
