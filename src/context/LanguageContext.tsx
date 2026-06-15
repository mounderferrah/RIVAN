"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import translations, { Language } from "@/translations";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (section: string, key: string) => string;
  tArr: (section: string, key: string) => string[];
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("rivan-lang", l);
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = l;
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("rivan-lang") as Language | null;
    if (saved && ["en", "fr", "ar"].includes(saved)) {
      setLang(saved);
    }
  }, [setLang]);

  const t = useCallback((section: string, key: string): string => {
    const sec = (translations[lang] as Record<string, Record<string, unknown>>)[section];
    if (!sec) return key;
    // Support dot notation: "tech.title" → sec.tech.title
    const parts = key.split(".");
    let val: unknown = sec;
    for (const part of parts) {
      if (typeof val !== "object" || val === null) return key;
      val = (val as Record<string, unknown>)[part];
    }
    return typeof val === "string" ? val : key;
  }, [lang]);

  const tArr = useCallback((section: string, key: string): string[] => {
    const sec = (translations[lang] as Record<string, Record<string, unknown>>)[section];
    if (!sec) return [];
    const val = sec[key];
    return Array.isArray(val) ? val as string[] : [];
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tArr, isRTL: lang === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
