"use client";

import { MessageCircle } from "lucide-react";
import { trackEvent } from "@/components/analytics/AnalyticsProvider";
import { buildDefaultWhatsAppUrl } from "@/lib/whatsapp";

export function FloatingWhatsApp() { return <a href={buildDefaultWhatsAppUrl()} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("click_whatsapp", { context: "floating_button" })} className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-white shadow-xl transition hover:-translate-y-1 hover:bg-brand-dark" aria-label="Falar no WhatsApp"><MessageCircle className="h-6 w-6" /></a>; }
