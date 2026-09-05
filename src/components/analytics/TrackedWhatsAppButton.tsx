"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/components/analytics/AnalyticsProvider";
import { Button } from "@/components/ui/Button";

type AnalyticsProperties = Record<string, string | number | boolean>;

export function TrackedWhatsAppButton({
  href,
  context,
  properties,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  context: string;
  properties?: AnalyticsProperties;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  return (
    <Button
      href={href}
      external
      variant={variant}
      className={className}
      onLinkClick={() => trackEvent("click_whatsapp", { context, ...properties })}
    >
      {children}
    </Button>
  );
}
