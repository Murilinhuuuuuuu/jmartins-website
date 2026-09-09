import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.15em] text-brand-red">
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="heading-display text-balance text-3xl md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-brand-dark/75 md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
