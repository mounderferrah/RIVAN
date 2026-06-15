"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

function CrystalRipple({ toLight }: { toLight: boolean }) {
  const color = toLight ? "rgba(253,240,213," : "rgba(5,5,5,";
  const border = toLight ? "rgba(253,240,213," : "rgba(0,48,73,";

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.55 } }}
    >
      {/* Central radial flash */}
      <motion.div
        className="absolute rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}0.35) 0%, ${color}0.08) 45%, transparent 70%)`,
          width: "80vmax",
          height: "80vmax",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 2], opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Refraction rings — staggered */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ border: `1px solid ${border}${0.22 - i * 0.04})` }}
          initial={{ width: 0, height: 0, opacity: 0.7 }}
          animate={{ width: "200vmax", height: "200vmax", opacity: 0 }}
          transition={{ duration: 0.88, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      {/* Crystal glint — tiny bright center spark */}
      <motion.div
        className="absolute w-2 h-2 rounded-full"
        style={{ background: toLight ? "rgba(253,240,213,0.9)" : "rgba(5,5,5,0.9)", filter: "blur(2px)" }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 8, 0], opacity: [1, 0.4, 0] }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

export default function ThemeSwitcher() {
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <AnimatePresence>
        {isTransitioning && (
          <CrystalRipple key="ripple" toLight={isDark} />
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleTheme}
        disabled={isTransitioning}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="relative flex items-center gap-2 px-3 py-1.5 rounded-full overflow-hidden clickable"
        style={{
          background: "var(--th-glass)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid var(--th-border)",
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.18 }}
      >
        {/* Crystal edge highlight */}
        <span
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)" }}
        />
        {/* Shimmer on hover */}
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.07) 50%, transparent 65%)",
            x: "-150%",
          }}
          whileHover={{ x: "250%" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />

        {/* Icon — animates out/in on theme change */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ opacity: 0, rotate: -35, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 35, scale: 0.5 }}
            transition={{ duration: 0.22 }}
            style={{ color: "var(--th-brand)", display: "flex", alignItems: "center" }}
          >
            {isDark ? <Sun size={13} strokeWidth={2.2} /> : <Moon size={13} strokeWidth={2.2} />}
          </motion.span>
        </AnimatePresence>

        {/* Label — shows what you'd switch TO */}
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.20em",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "var(--th-muted)",
            fontFamily: "var(--font-jakarta)",
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          {isDark ? "Light" : "Dark"}
        </span>
      </motion.button>
    </>
  );
}
