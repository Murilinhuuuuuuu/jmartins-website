"use client";

import { motion } from "framer-motion";
import {
  Award,
  Briefcase,
  Clock,
  Paintbrush,
  PenTool,
  Ruler,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Differential, Service } from "@/types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Paintbrush,
  Briefcase,
  Wrench,
  Ruler,
  Award,
  Users,
  Sparkles,
  Clock,
  PenTool,
  ShieldCheck,
};

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = iconMap[service.icon] ?? Briefcase;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="card-premium group flex h-full flex-col p-8"
    >
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-red/8 text-brand-red transition-colors duration-500 group-hover:bg-brand-red group-hover:text-white">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-xl font-bold text-brand-dark">
        {service.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-dark/70">
        {service.description}
      </p>
    </motion.article>
  );
}

interface DifferentialItemProps {
  differential: Differential;
}

export function DifferentialItem({ differential }: DifferentialItemProps) {
  const Icon = iconMap[differential.icon] ?? Award;

  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-red">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="font-heading text-base font-bold text-brand-dark">
          {differential.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-brand-dark/70">
          {differential.description}
        </p>
      </div>
    </div>
  );
}

interface ProcessStepCardProps {
  step: import("@/types").ProcessStep;
  isLast?: boolean;
  orientation?: "horizontal" | "vertical";
}

export function ProcessStepCard({
  step,
  isLast = false,
  orientation = "horizontal",
}: ProcessStepCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col",
        orientation === "horizontal" && !isLast && "md:pr-8",
      )}
    >
      {orientation === "horizontal" && !isLast && (
        <div
          className="absolute right-0 top-6 hidden h-px w-full bg-brand-dark/10 md:block"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-red font-heading text-sm font-bold text-white">
        {String(step.step).padStart(2, "0")}
      </div>
      <h3 className="font-heading text-lg font-bold text-brand-dark">
        {step.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-dark/70">
        {step.description}
      </p>
    </div>
  );
}
