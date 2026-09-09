"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import {
  productCategories,
  products,
  type ProductCategory,
  type ProductReference,
} from "@/lib/content/catalog";
import { cn } from "@/lib/utils";

type ConditionFilter = "Todas" | ProductReference["condition"];
type AvailabilityFilter = "Todas" | ProductReference["availability"];

const conditions: ConditionFilter[] = [
  "Todas",
  "Nova",
  "Seminova",
  "Usada",
  "Reformada",
  "Condição sob consulta",
];

const availabilityOptions: AvailabilityFilter[] = [
  "Todas",
  "Disponibilidade sob consulta",
  "Sob encomenda",
];

export function ProductCatalog() {
  const [category, setCategory] = useState<"Todos" | ProductCategory>("Todos");
  const [condition, setCondition] = useState<ConditionFilter>("Todas");
  const [availability, setAvailability] = useState<AvailabilityFilter>("Todas");

  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === "Todos" || product.category === category) &&
          (condition === "Todas" || product.condition === condition) &&
          (availability === "Todas" || product.availability === availability),
      ),
    [availability, category, condition],
  );

  return (
    <>
      <div className="relative">
        <div
          className="scrollbar-none flex snap-x gap-2 overflow-x-auto pb-3 lg:flex-wrap lg:overflow-visible"
          aria-label="Filtrar cadeiras por categoria"
        >
          {productCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={cn(
                "shrink-0 snap-start rounded-full px-4 py-2 text-sm font-bold transition",
                category === item
                  ? "bg-brand-red text-white"
                  : "bg-brand-light text-brand-dark/70 hover:text-brand-red",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 rounded-2xl bg-brand-light p-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-brand-dark/75">
          Condição
          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value as ConditionFilter)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-body text-sm text-brand-dark"
          >
            {conditions.map((item) => (
              <option key={item} value={item}>
                {item === "Todas" ? "Todas as condições" : item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-brand-dark/75">
          Disponibilidade
          <select
            value={availability}
            onChange={(event) => setAvailability(event.target.value as AvailabilityFilter)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-body text-sm text-brand-dark"
          >
            {availabilityOptions.map((item) => (
              <option key={item} value={item}>
                {item === "Todas" ? "Todas as disponibilidades" : item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-black/15 bg-brand-light p-10 text-center">
          <p className="font-heading text-lg font-bold">
            Nenhuma referência publicada com estes filtros.
          </p>
          <p className="mt-2 text-sm text-brand-dark/60">
            Ajuste os filtros ou fale com a equipe para consultar os modelos atuais.
          </p>
        </div>
      )}
    </>
  );
}
