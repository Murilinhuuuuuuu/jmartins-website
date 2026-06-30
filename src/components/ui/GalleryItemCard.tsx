"use client";

import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import type { GalleryItem } from "@/types";
import { ImagePlaceholder } from "./ImagePlaceholder";

interface GalleryItemCardProps {
  item: GalleryItem;
  onOpen: (item: GalleryItem) => void;
}

export function GalleryItemCard({ item, onOpen }: GalleryItemCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(item)}
      className="group relative w-full overflow-hidden rounded-2xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      aria-label={`Ver projeto: ${item.title}`}
    >
      <ImagePlaceholder
        aspectRatio={item.aspectRatio}
        label={item.title}
        category={item.category}
        className="w-full transition-transform duration-700 group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="flex w-full items-center justify-between p-5">
          <div>
            <p className="font-heading text-sm font-bold text-white">
              {item.title}
            </p>
            <p className="text-xs text-white/70">{item.category}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <ZoomIn className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}
