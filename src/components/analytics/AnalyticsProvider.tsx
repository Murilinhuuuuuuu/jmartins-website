"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import posthog from "posthog-js";

const consentKey = "jmartins-cookie-consent";
let analyticsStarted = false;

function startAnalytics() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || analyticsStarted) return;
  posthog.init(key, { api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com", capture_pageview: false, capture_pageleave: true, autocapture: false, person_profiles: "identified_only" });
  analyticsStarted = true;
}

export function AnalyticsProvider() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.localStorage.getItem(consentKey) === "accepted") startAnalytics();
    const listener = () => startAnalytics();
    window.addEventListener("jmartins:analytics-consent", listener);
    return () => window.removeEventListener("jmartins:analytics-consent", listener);
  }, []);
  useEffect(() => { if (analyticsStarted) posthog.capture("page_view", { path: pathname }); }, [pathname]);
  return null;
}

export function trackEvent(event: string, properties: Record<string, string | number | boolean> = {}) {
  if (analyticsStarted) posthog.capture(event, properties);
}
