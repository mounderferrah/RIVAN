import type { Metadata, Viewport } from "next";
import { Sora, Plus_Jakarta_Sans, Cairo } from "next/font/google";
import "./globals.css";
import CanvasBackground from "@/components/CanvasBackground";
import FloatingCrystals from "@/components/FloatingCrystals";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "RIVAN | Premium Digital & Creative Agency",
  description:
    "RIVAN is a multidisciplinary creative and technology agency. We combine high-end software development, visual production, corporate photography, videography, marketing, and media direction to deliver complete digital products.",
  keywords: [
    "digital agency",
    "creative studio",
    "software development",
    "media production",
    "commercial videography",
    "corporate photography",
    "digital marketing",
    "RIVAN",
    "premium web design",
    "branding agency",
  ],
  authors: [{ name: "RIVAN Team" }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${plusJakartaSans.variable} ${cairo.variable} scroll-smooth antialiased`}
    >
      {/* Prevent FOUC: set data-theme before first paint — must run before React hydrates */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('rivan-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();` }} />
      </head>
      <body className="font-sans text-foreground min-h-screen relative overflow-x-hidden selection:bg-primary/30 selection:text-white">
        <ThemeProvider>
          <LanguageProvider>
            <SmoothScroll>
              <CanvasBackground />
              <FloatingCrystals />
              <CustomCursor />
              {children}
            </SmoothScroll>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
