"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);

  const reviews = [
    {
      name: "Sarah Jenkins",
      position: "CEO, Aether Labs",
      quote:
        "LIVAN built our web app and directed the launch trailer. Working with their developers and film specialists simultaneously was a game changer. The speed and production value were outstanding.",
      stars: 5,
      project: "Web Development & Media",
    },
    {
      name: "Boualem Khaled",
      position: "Founder, Nova Fintech",
      quote:
        "The level of programming rigor paired with high-fidelity corporate marketing media was exactly what we needed to launch our fintech application. LIVAN has my highest endorsement.",
      stars: 5,
      project: "Mobile App & Strategy",
    },
    {
      name: "Elena Rostova",
      position: "Creative Director, Lumina Group",
      quote:
        "Our product photography assets and corporate brand guidelines look absolutely breathtaking. LIVAN combines modern coding execution with true artistic and cinematic vision.",
      stars: 5,
      project: "Branding & Photography",
    },
  ];

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % reviews.length);
    }, 6000); // Change slides every 6 seconds

    return () => clearInterval(timer);
  }, [reviews.length]);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden px-6 md:px-12 bg-black/20">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center flex flex-col items-center gap-4 mb-16">
          <motion.span
            className="text-xs font-semibold tracking-[0.25em] text-accent uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Client Reviews
          </motion.span>
          <motion.h2
            className="text-3xl md:text-5xl font-heading font-black tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            What Our <span style={{ color: "var(--th-brand)" }}>Partners Say</span>
          </motion.h2>
        </div>

        {/* Carousel Slider */}
        <div className="relative min-h-[320px] md:min-h-[260px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full p-8 md:p-12 rounded-3xl glassmorphism border border-white/5 flex flex-col justify-between gap-6"
            >
              {/* Stars & Quote Icon */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {Array.from({ length: reviews[activeIdx].stars }).map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <Quote className="text-white/10 w-10 h-10" />
              </div>

              {/* Quote text */}
              <p className="text-base md:text-xl font-sans text-foreground/80 font-light leading-relaxed italic">
                &ldquo;{reviews[activeIdx].quote}&rdquo;
              </p>

              {/* Author & project info */}
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div>
                  <h4 className="text-lg font-heading font-bold text-white">
                    {reviews[activeIdx].name}
                  </h4>
                  <p className="text-xs text-foreground/50 mt-0.5">
                    {reviews[activeIdx].position}
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-secondary">
                  {reviews[activeIdx].project}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-8">
          {/* Indicator dots */}
          <div className="flex gap-2">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 clickable ${
                  activeIdx === idx ? "w-8 bg-primary" : "w-2 bg-zinc-700"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-white/5 bg-white/5 text-white hover:bg-white/10 transition-colors clickable"
              aria-label="Previous Review"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-white/5 bg-white/5 text-white hover:bg-white/10 transition-colors clickable"
              aria-label="Next Review"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
