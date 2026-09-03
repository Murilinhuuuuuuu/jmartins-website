"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { productCategories, products, type ProductCategory } from "@/lib/content/catalog";
import { cn } from "@/lib/utils";

export function ProductCatalog() {
  const [category, setCategory] = useState<"Todos" | ProductCategory>("Todos");
  const filtered = useMemo(() => category === "Todos" ? products : products.filter((product) => product.category === category), [category]);

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-3" aria-label="Filtrar cadeiras por categoria">
        {productCategories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-bold transition", category === item ? "bg-brand-red text-white" : "bg-brand-light text-brand-dark/70 hover:text-brand-red")}>{item}</button>)}
      </div>
      {filtered.length ? <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{filtered.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : <div className="mt-10 rounded-3xl border border-dashed border-black/15 bg-brand-light p-10 text-center"><p className="font-heading text-lg font-bold">Nenhuma referência publicada nesta categoria.</p><p className="mt-2 text-sm text-brand-dark/60">Fale com a equipe para consultar os modelos atuais.</p></div>}
    </>
  );
}
