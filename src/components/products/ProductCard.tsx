import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductReference } from "@/lib/content/catalog";

export function ProductCard({ product }: { product: ProductReference }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/cadeiras/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-brand-light">
          <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-dark shadow-sm backdrop-blur">{product.condition}</span>
        </div>
        <div className="p-6">
          <p className="text-sm font-semibold text-brand-red">{product.category}</p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <h2 className="font-heading text-xl font-bold text-brand-dark">{product.name}</h2>
            <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-brand-red transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-brand-dark/65">Imagem ilustrativa. Consulte modelos disponíveis.</p>
        </div>
      </Link>
    </article>
  );
}
