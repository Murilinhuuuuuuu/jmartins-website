"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type BeforeAfterSliderProps = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  beforeObjectPosition?: string;
  afterObjectPosition?: string;
  aspect?: "landscape" | "portrait";
};

export function BeforeAfterSlider({
  before,
  after,
  beforeAlt,
  afterAlt,
  beforeObjectPosition = "center",
  afterObjectPosition = "center",
  aspect = "landscape",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const controlId = `before-after-${before.replace(/\W/g, "")}-${aspect}`;

  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-brand-light shadow-[0_24px_70px_rgba(32,25,26,0.12)]", aspect === "portrait" ? "mx-auto aspect-[377/510] w-full max-w-[32rem]" : "aspect-[4/3]")}>
      <Image src={before} alt={beforeAlt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" style={{ objectPosition: beforeObjectPosition }} />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={after} alt={afterAlt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" style={{ objectPosition: afterObjectPosition }} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${position}%` }}>
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-brand-red text-sm font-bold text-white shadow-lg">↔</span>
      </div>
      <span className="absolute left-4 top-4 rounded-full bg-black/65 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Depois</span>
      <span className="absolute right-4 top-4 rounded-full bg-black/65 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Antes</span>
      <label className="sr-only" htmlFor={controlId}>Comparar antes e depois</label>
      <input
        id={controlId}
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        aria-valuetext={`${position}% da imagem depois visível`}
      />
    </div>
  );
}
