"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/components/analytics/AnalyticsProvider";

export function ViewEvent({
  name,
  properties,
}: {
  name: "product_view" | "project_view";
  properties: Record<string, string>;
}) {
  const capturedRef = useRef(false);

  useEffect(() => {
    if (capturedRef.current) return;
    capturedRef.current = true;
    trackEvent(name, properties);
  }, [name, properties]);

  return null;
}
