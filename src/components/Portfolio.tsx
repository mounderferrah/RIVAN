"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, FolderOpen } from "lucide-react";

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = [
    "All",
    "Websites",
    "Mobile Apps",
    "Photography",
    "Video Production",
    "Branding",
    "Marketing",
  ];

  const projects = [
    {
      id: 1,
      title: "Aether Storefront",
      category: "Websites",
      desc: "Headless e-commerce platform built with Next.js and WebGL product renders.",
      color: "from-white/[0.05] via-white/[0.02] to-transparent",
      tag: "Next.js / Tailwind",
    },
    {
      id: 2,
      title: "Nova Wallet",
      category: "Mobile Apps",
      desc: "A premium Web3 finance dashboard featuring secure biometric authentication.",
      color: "from-[#BFC2C7]/[0.06] via-[#BFC2C7]/[0.02] to-transparent",
      tag: "React Native / iOS & Android",
    },
    {
      id: 3,
      title: "Lumina Studio Setup",
      category: "Photography",
      desc: "Bespoke studio photography showcasing high-end industrial product design.",
      color: "from-white/[0.05] via-white/[0.02] to-transparent",
      tag: "Product Photography / Lighting",
    },
    {
      id: 4,
      title: "Vanguard Fashion Film",
      category: "Video Production",
      desc: "4K commercial cinematic promo and advertising reel for high-end fashion lines.",
      color: "from-[#B11226]/[0.08] via-[#B11226]/[0.03] to-transparent",
      tag: "Video Production / VFX / Editing",
    },
    {
      id: 5,
      title: "Iris Design System",
      category: "Branding",
      desc: "Complete visual guidelines, layout design, typography, and logo system.",
      color: "from-[#BFC2C7]/[0.06] via-[#BFC2C7]/[0.02] to-transparent",
      tag: "UI/UX / Graphic Design",
    },
    {
      id: 6,
      title: "Pulse SaaS Growth",
      category: "Marketing",
      desc: "Comprehensive organic positioning, SEO, and social funnels generating 10x ROI.",
      color: "from-white/[0.05] via-white/[0.02] to-transparent",
      tag: "SaaS Marketing / Brand Strategy",
    },
  ];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 md:py-32 relative overflow-hidden px-6 md:px-12">
      {/* Background gradients */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-[0.25em] text-secondary uppercase">
              Our Showcase
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight">
              Selected <span style={{ color: "var(--th-brand)" }}>Masterpieces</span>
            </h2>
            <p className="text-sm md:text-base text-foreground/60 font-sans font-light max-w-md">
              A curated display of digital interfaces, marketing solutions, and premium media assets engineered by our studio.
            </p>
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-2.5 max-w-2xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-sans font-semibold tracking-wide border transition-all duration-300 clickable ${
                  activeFilter === cat
                    ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(177,18,38,0.25)]"
                    : "border-white/5 bg-white/5 text-foreground/70 hover:bg-white/10 hover:border-white/15"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 15 }}
                key={proj.id}
                className="group p-6 rounded-2xl glassmorphism border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col justify-between h-[380px] relative overflow-hidden"
              >
                {/* Premium Abstract Gradient Graphic Placeholder */}
                <div className="absolute inset-0 z-0 bg-radial-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className={`absolute top-0 left-0 right-0 h-48 bg-gradient-to-b ${proj.color} flex items-center justify-center p-6 border-b border-white/5`}>
                  <div className="w-12 h-12 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center text-white/50 group-hover:scale-110 group-hover:text-primary transition-all duration-500">
                    <FolderOpen size={20} />
                  </div>
                  
                  {/* Subtle Grid overlay inside the thumbnail area */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-[0.02] pointer-events-none" />
                </div>

                <div className="relative z-10 pt-48 flex-1 flex flex-col justify-between mt-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary-light">
                      {proj.category}
                    </span>
                    <h3 className="text-xl font-heading font-extrabold text-white mt-1 group-hover:text-secondary transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-sm font-sans text-foreground/60 leading-relaxed mt-2 line-clamp-2">
                      {proj.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                    <span className="text-[11px] font-sans font-semibold text-zinc-500 uppercase tracking-wide">
                      {proj.tag}
                    </span>
                    <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white opacity-60 group-hover:opacity-100 group-hover:bg-primary group-hover:border-primary group-hover:rotate-45 transition-all duration-300">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
