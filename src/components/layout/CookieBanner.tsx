"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

const key = "jmartins-cookie-consent";
const consentEvent = "jmartins:analytics-consent";

function subscribe(callback: () => void) {
  window.addEventListener(consentEvent, callback);
  return () => window.removeEventListener(consentEvent, callback);
}

function getSnapshot() {
  return window.localStorage.getItem(key) === null;
}

export function CookieBanner() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, () => false);
  if (!visible) return null;
  function choose(value: "accepted" | "rejected") {
    window.localStorage.setItem(key, value);
    window.dispatchEvent(new Event(consentEvent));
  }
  return <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-black/10 bg-white p-5 shadow-2xl" aria-label="Preferências de cookies"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><p className="flex-1 text-sm leading-relaxed text-brand-dark/70">Usamos cookies opcionais para entender o uso do site. Eles só são ativados com sua escolha. <Link href="/privacidade" className="font-semibold text-brand-red underline">Saiba mais</Link>.</p><div className="flex shrink-0 gap-2"><button type="button" onClick={() => choose("rejected")} className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-bold">Rejeitar opcionais</button><button type="button" onClick={() => choose("accepted")} className="rounded-xl bg-brand-red px-4 py-2.5 text-sm font-bold text-white">Aceitar todos</button></div></div></aside>;
}
