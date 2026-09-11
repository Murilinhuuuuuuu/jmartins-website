import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({
  inverse = false,
  compact = false,
  className,
}: {
  inverse?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center", compact ? "gap-2" : "gap-2.5", className)}>
      <Image
        src="/brand/logo-symbol.png"
        alt=""
        width={244}
        height={166}
        className={cn("h-auto shrink-0 object-contain", compact ? "w-10" : "w-12")}
        priority={compact}
      />
      <span className={cn("flex flex-col font-heading font-bold uppercase leading-none", inverse ? "text-white" : "text-brand-red")}>
        <span className={compact ? "text-lg tracking-[0.02em]" : "text-xl tracking-[0.03em]"}>Martins</span>
        <span className={cn("self-end tracking-[0.08em]", compact ? "text-[0.52rem]" : "text-[0.58rem]")}>Móveis</span>
      </span>
    </span>
  );
}
