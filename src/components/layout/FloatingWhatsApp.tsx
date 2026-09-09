"use client";

import { MessageCircle } from "lucide-react";
import { trackEvent } from "@/components/analytics/AnalyticsProvider";
import { buildDefaultWhatsAppUrl } from "@/lib/whatsapp";

export function FloatingWhatsApp() { return <a href={buildDefaultWhatsAppUrl()} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("click_whatsapp", { context: "floating_button" })} className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-white shadow-xl transition hover:-translate-y-1 hover:bg-brand-dark sm:bottom-5 sm:right-5 sm:h-14 sm:w-14" aria-label="Falar no WhatsApp"><MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" /></a>; }
