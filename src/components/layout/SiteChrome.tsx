"use client";

import { usePathname } from "next/navigation";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFloatingWhatsApp = pathname === "/orcamento" || pathname === "/acompanhar";

  if (pathname.startsWith("/admin")) {
    return children;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      {!hideFloatingWhatsApp && <FloatingWhatsApp />}
      <CookieBanner />
      <AnalyticsProvider />
    </>
  );
}
