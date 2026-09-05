"use client";

import { useEffect, useRef } from "react";
import { analyticsReadyEvent, trackEvent } from "@/components/analytics/AnalyticsProvider";

export function ViewEvent({
  name,
  properties,
}: {
  name: "product_view" | "project_view";
  properties: Record<string, string>;
}) {
  const capturedRef = useRef(false);

  useEffect(() => {
    const capture = () => {
      if (capturedRef.current) return;
      capturedRef.current = trackEvent(name, properties);
    };

    capture();
    window.addEventListener(analyticsReadyEvent, capture);
    return () => window.removeEventListener(analyticsReadyEvent, capture);
  }, [name, properties]);

  return null;
}
