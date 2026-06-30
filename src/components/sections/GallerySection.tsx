"use client";

import { useState } from "react";
import { AnimateIn, AnimateItem } from "@/components/ui/AnimateIn";
import { Container } from "@/components/ui/Container";
import { GalleryItemCard } from "@/components/ui/GalleryItemCard";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  galleryCategories,
  galleryItems,
  gallerySection,
} from "@/lib/content/gallery";
import type { GalleryCategory, GalleryItem } from "@/types";
import { cn } from "@/lib/utils";

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("Todos");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filtered =
    activeCategory === "Todos"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section
      id="galeria"
      className="bg-white section-padding"
      aria-label="Galeria de projetos"
    >
      <Container>
        <AnimateIn>
          <SectionHeading
            eyebrow={gallerySection.eyebrow}
            title={gallerySection.title}
            description={gallerySection.description}
            align="center"
            className="mx-auto"
          />
        </AnimateIn>

        <AnimateIn className="mt-10">
          <div
            className="flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label="Filtrar projetos por categoria"
          >
            {galleryCategories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "rounded-full px-5 py-2 font-heading text-sm font-semibold transition-all duration-300",
                  activeCategory === category
                    ? "bg-brand-red text-white shadow-sm"
                    : "bg-brand-light text-brand-dark/70 hover:text-brand-red",
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </AnimateIn>

        <AnimateIn stagger className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((item) => (
            <AnimateItem key={item.id} className="mb-4 break-inside-avoid">
              <GalleryItemCard item={item} onOpen={setLightboxItem} />
            </AnimateItem>
          ))}
        </AnimateIn>
      </Container>

      <GalleryLightbox
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
      />
    </section>
  );
}
