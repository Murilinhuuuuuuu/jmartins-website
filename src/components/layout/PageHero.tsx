import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

type PageHeroImage = {
  src: string;
  alt: string;
  caption?: string;
  objectPosition?: string;
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image?: PageHeroImage;
  compact?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  compact = false,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-black/5 bg-brand-light pt-20">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_75%_30%,rgba(207,17,29,0.12),transparent_58%)]" />
      <Container
        className={cn(
          "relative",
          compact ? "py-10 sm:py-12" : image ? "py-12 sm:py-16 lg:py-20" : "py-16 sm:py-20 lg:py-24",
        )}
      >
        <div
          className={cn(
            "grid items-center gap-10",
            image && "lg:grid-cols-[0.92fr_1.08fr] lg:gap-16",
          )}
        >
          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-red">
              {eyebrow}
            </p>
            <h1
              className={cn(
                "heading-display mt-4 max-w-4xl text-balance",
                compact ? "text-3xl sm:text-4xl lg:text-5xl" : "text-4xl sm:text-5xl lg:text-6xl",
              )}
            >
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-dark/70">
              {description}
            </p>
          </div>

          {image && (
            <figure className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-white shadow-[0_22px_65px_rgba(32,25,26,0.13)]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover"
                style={{ objectPosition: image.objectPosition }}
              />
              {image.caption && (
                <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-dark/70 shadow-sm backdrop-blur">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </Container>
    </section>
  );
}
