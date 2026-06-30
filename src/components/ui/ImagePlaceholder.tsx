import type { AspectRatio } from "@/types";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

const aspectClasses: Record<AspectRatio, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
};

interface ImagePlaceholderProps {
  aspectRatio?: AspectRatio;
  label?: string;
  category?: string;
  className?: string;
}

export function ImagePlaceholder({
  aspectRatio = "4/3",
  label = "Foto em breve",
  category,
  className,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-light via-white to-brand-light",
        aspectClasses[aspectRatio],
        className,
      )}
      role="img"
      aria-label={label}
    >
      <div className="placeholder-stripes absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark/5">
          <ImageIcon className="h-5 w-5 text-brand-dark/30" strokeWidth={1.5} />
        </div>
        {category && (
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-brand-red/70">
            {category}
          </span>
        )}
        <span className="max-w-[12rem] text-sm text-brand-dark/40">{label}</span>
      </div>
    </div>
  );
}
