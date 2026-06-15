"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, PhoneCall, Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/translations";

export default function Contact() {
  const { t, lang } = useLanguage();
  const contactT = translations[lang].contact;
  const [formData, setFormData] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const servicesList = contactT.services as unknown as string[];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.service) return;

    setIsSubmitting(true);
    
    // Simulate API Submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", company: "", service: "", message: "" });
      
      // Auto reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden px-6 md:px-12">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Side: Text and direct contact actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-12">
            <div className="flex flex-col gap-6">
              <span className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                {t("contact", "badge")}
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-tight">
                {t("contact", "heading1")} <br />
                <span style={{ color: "var(--th-brand)" }}>{t("contact", "heading2")}</span>
              </h2>
              <p className="text-base text-foreground/75 font-sans font-light leading-relaxed max-w-sm">
                {t("contact", "desc")}
              </p>
            </div>

            {/* Quick Contact buttons */}
            <div className="flex flex-col gap-4">
              <a
                href="https://wa.me/213000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl glassmorphism border border-white/5 hover:border-[#BFC2C7]/15 hover:shadow-[0_0_20px_rgba(191,194,199,0.06)] flex items-center gap-4 transition-all duration-300 clickable"
              >
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-[#BFC2C7] group-hover:bg-white/10 group-hover:border-[#B11226]/30 group-hover:text-[#F8F8F8] transition-colors">
                  <PhoneCall size={20} />
                </div>
                <div>
                  <h4 className="text-sm uppercase font-heading font-extrabold text-zinc-400">
                    {t("contact", "quickChat")}
                  </h4>
                  <p className="text-base font-sans font-semibold text-white mt-0.5">
                    {t("contact", "whatsapp")}
                  </p>
                </div>
              </a>

              <a
                href="mailto:contact@livan.agency"
                className="group p-5 rounded-2xl glassmorphism border border-white/5 hover:border-[#BFC2C7]/15 hover:shadow-[0_0_20px_rgba(191,194,199,0.06)] flex items-center gap-4 transition-all duration-300 clickable"
              >
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-[#BFC2C7] group-hover:bg-white/10 group-hover:border-[#B11226]/30 group-hover:text-[#F8F8F8] transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-sm uppercase font-heading font-extrabold text-zinc-400">
                    {t("contact", "emailUs")}
                  </h4>
                  <p className="text-base font-sans font-semibold text-white mt-0.5">
                    contact@livan.agency
                  </p>
                </div>
              </a>
            </div>

            {/* Social media icons */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                {t("contact", "followUs")}
              </span>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:border-primary hover:bg-primary/20 transition-all duration-300 clickable"
                  aria-label="Instagram"
                >
                  <svg className="w-5.5 h-5.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:border-primary hover:bg-primary/20 transition-all duration-300 clickable"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:border-primary hover:bg-primary/20 transition-all duration-300 clickable"
                  aria-label="YouTube"
                >
                  <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                    <path d="M23.498 6.163c-.272-.997-1.09-1.781-2.115-2.052-1.867-.511-9.383-.511-9.383-.511s-7.516 0-9.383.511c-1.025.271-1.843 1.055-2.115 2.052-.512 1.867-.512 5.769-.512 5.769s0 3.902.512 5.769c.272.997 1.09 1.781 2.115 2.052 1.867.511 9.383.511 9.383.511s7.516 0 9.383-.511c1.025-.271 1.843-1.055 2.115-2.052.512-1.867.512-5.769.512-5.769s0-3.902-.512-5.769zm-13.498 9.337v-7l6 3.5-6 3.5z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-10 rounded-3xl glassmorphism border border-white/5 relative">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                        {t("contact", "labelName")}
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t("contact", "placeName")}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/5 text-sm font-sans text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:bg-white/10 focus:shadow-[0_0_15px_rgba(177,18,38,0.1)] transition-all"
                      />
                    </div>

                    {/* Email & Company (Row) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                          {t("contact", "labelEmail")}
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={t("contact", "placeEmail")}
                          className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/5 text-sm font-sans text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:bg-white/10 focus:shadow-[0_0_15px_rgba(177,18,38,0.1)] transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="company" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                          {t("contact", "labelCompany")}
                        </label>
                        <input
                          id="company"
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder={t("contact", "placeCompany")}
                          className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/5 text-sm font-sans text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:bg-white/10 focus:shadow-[0_0_15px_rgba(177,18,38,0.1)] transition-all"
                        />
                      </div>
                    </div>

                    {/* Service Needed Dropdown */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="service" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                        {t("contact", "labelService")}
                      </label>
                      <select
                        id="service"
                        required
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/5 text-sm font-sans text-zinc-300 focus:outline-none focus:border-primary focus:bg-white/10 focus:shadow-[0_0_15px_rgba(177,18,38,0.1)] transition-all appearance-none"
                      >
                        <option value="" disabled className="bg-zinc-950 text-zinc-500">
                          {t("contact", "placeService")}
                        </option>
                        {servicesList.map((svc) => (
                          <option key={svc} value={svc} className="bg-zinc-950 text-white">
                            {svc}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="message" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                        {t("contact", "labelMessage")}
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t("contact", "placeMessage")}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/5 text-sm font-sans text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:bg-white/10 focus:shadow-[0_0_15px_rgba(177,18,38,0.1)] transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4.5 rounded-xl bg-[#B11226] text-sm font-semibold tracking-wider text-white shadow-lg disabled:opacity-50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(177,18,38,0.35)] hover:bg-[#c4142b] clickable"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          {t("contact", "submitting")}
                        </>
                      ) : (
                        <>
                          {t("contact", "submit")}
                          <Send size={15} />
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    className="flex flex-col items-center justify-center py-16 text-center gap-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <CheckCircle2 size={48} className="animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-heading font-black text-white">
                        {t("contact", "successTitle")}
                      </h3>
                      <p className="text-sm font-sans text-foreground/60 leading-relaxed max-w-sm mt-3">
                        {t("contact", "successDesc")}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
