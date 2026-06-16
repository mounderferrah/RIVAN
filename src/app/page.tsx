"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Process from "@/components/Process";
import Manifesto from "@/components/Manifesto";
import Team from "@/components/Team";
import AtmosphereBeam from "@/components/AtmosphereBeam";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Disable body scroll when loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading]);

  return (
    <>
      {/* Cinematic Preloader */}
      <Preloader onComplete={() => setIsLoading(false)} />

      {/* Main Site Container */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="flex flex-col min-h-screen"
          >
            {/* Navigation Header */}
            <Navbar />

            {/* Main Content Layout */}
            <main className="flex-grow">
              <Hero />
              <Services />
              <About />
              <WhyChooseUs />
              <div className="relative">
                <AtmosphereBeam />
                <Process />
                <Manifesto />
                <Team />
              </div>
              <Contact />
            </main>

            {/* Footer */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
