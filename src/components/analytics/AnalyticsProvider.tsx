"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import posthog from "posthog-js";

const consentKey = "jmartins-cookie-consent";
export const analyticsReadyEvent = "jmartins:analytics-ready";
let analyticsStarted = false;

function startAnalytics() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return false;
  if (analyticsStarted) return true;
  posthog.init(key, { api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com", capture_pageview: false, capture_pageleave: true, autocapture: false, person_profiles: "identified_only" });
  analyticsStarted = true;
  return true;
}

export function AnalyticsProvider() {
  const pathname = usePathname();
  useEffect(() => {
    const capturePageView = () => {
      if (window.localStorage.getItem(consentKey) !== "accepted") return;
      const wasStarted = analyticsStarted;
      if (!startAnalytics()) return;
      posthog.capture("page_view", { path: pathname });
      if (!wasStarted) window.dispatchEvent(new Event(analyticsReadyEvent));
    };

    capturePageView();
    window.addEventListener("jmartins:analytics-consent", capturePageView);
    return () => window.removeEventListener("jmartins:analytics-consent", capturePageView);
  }, [pathname]);
  return null;
}

export function trackEvent(event: string, properties: Record<string, string | number | boolean> = {}) {
  if (!analyticsStarted) return false;
  posthog.capture(event, properties);
  return true;
}
