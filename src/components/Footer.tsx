"use client";

import { motion } from "framer-motion";
import { ArrowUp, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/translations";

export default function Footer() {
  const { t, lang } = useLanguage();
  const footerT = translations[lang].footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden pt-20 pb-10 px-6 md:px-12" style={{ background: "var(--th-glass)", borderTop: "1px solid var(--th-border)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
      {/* Background glowing gradients */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/5">
          
          {/* Col 1: Brand & Logo (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <a href="#" className="flex items-center gap-2 group w-fit clickable">
              <span className="text-3xl font-heading font-black tracking-widest text-[#F8F8F8] group-hover:filter group-hover:drop-shadow-[0_0_8px_rgba(177,18,38,0.5)] transition-all">
                RIVAN
              </span>
              <span className="w-1.5 h-1.5 bg-[#B11226] rounded-full group-hover:scale-150 transition-transform" />
            </a>
            
            <p className="text-sm font-sans text-foreground/60 leading-relaxed max-w-sm">
              {t("footer", "tagline")}
            </p>

            <div className="flex gap-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 clickable"
                style={{ border: "1px solid var(--th-border)", background: "var(--th-glass2)", color: "var(--th-muted)" }}
                aria-label="Instagram"
              >
                <svg className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 clickable"
                style={{ border: "1px solid var(--th-border)", background: "var(--th-glass2)", color: "var(--th-muted)" }}
                aria-label="LinkedIn"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 clickable"
                style={{ border: "1px solid var(--th-border)", background: "var(--th-glass2)", color: "var(--th-muted)" }}
                aria-label="YouTube"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                  <path d="M23.498 6.163c-.272-.997-1.09-1.781-2.115-2.052-1.867-.511-9.383-.511-9.383-.511s-7.516 0-9.383.511c-1.025.271-1.843 1.055-2.115 2.052-.512 1.867-.512 5.769-.512 5.769s0 3.902.512 5.769c.272.997 1.09 1.781 2.115 2.052 1.867.511 9.383.511 9.383.511s7.516 0 9.383-.511c1.025-.271 1.843-1.055 2.115-2.052.512-1.867.512-5.769.512-5.769s0-3.902-.512-5.769zm-13.498 9.337v-7l6 3.5-6 3.5z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h4 className="text-xs uppercase font-heading font-bold tracking-widest text-zinc-400">
              {t("footer", "agency")}
            </h4>
            <ul className="flex flex-col gap-3">
              {(footerT.links as unknown as string[]).map((name, i) => (
                { name, href: ["#services","#about","#why-choose-us","#process","#team","#contact"][i] }
              )).map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm font-sans text-foreground/60 hover:text-primary transition-colors clickable"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h4 className="text-xs uppercase font-heading font-bold tracking-widest text-zinc-400">
              {t("footer", "focusAreas")}
            </h4>
            <ul className="flex flex-col gap-3">
              {(footerT.focus as unknown as string[]).map((svc) => (
                <li key={svc}>
                  <span className="text-sm font-sans text-foreground/60 hover:text-secondary transition-colors cursor-default">
                    {svc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact info (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <h4 className="text-xs uppercase font-heading font-bold tracking-widest text-zinc-400">
              {t("footer", "contact")}
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold block">
                    {t("footer", "writeUs")}
                  </span>
                  <a
                    href="mailto:contact@livan.agency"
                    className="text-sm font-sans text-foreground/80 hover:text-primary transition-colors clickable"
                  >
                    contact@livan.agency
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-secondary mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold block">
                    {t("footer", "location")}
                  </span>
                  <span className="text-sm font-sans text-foreground/75 cursor-default">
                    {t("footer", "locationVal")}
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom footer bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10">
          <p className="text-xs font-sans text-foreground/50 tracking-wider text-center sm:text-left select-none">
            &copy; {currentYear} {t("footer", "copyright")}
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-xs font-sans text-foreground/50 hover:text-white transition-colors clickable">
              {t("footer", "privacy")}
            </a>
            <a href="#" className="text-xs font-sans text-foreground/50 hover:text-white transition-colors clickable">
              {t("footer", "terms")}
            </a>

            {/* Scroll back to top */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:border-primary hover:bg-primary/20 transition-all duration-300 clickable"
              aria-label="Back to Top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
