import Image from "next/image";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { AnimateIn, AnimateItem } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about } from "@/lib/content/site";

export function AboutSection() {
  return (
    <section
      id="sobre"
      className="section-padding bg-brand-light"
      aria-labelledby="sobre-home-title"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          <AnimateIn className="relative">
            <figure className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(32,25,26,0.12)]">
              <Image
                src="/media/illustrative/cuidado-artesanal.webp"
                alt="Mãos trabalhando cuidadosamente no estofamento de uma cadeira"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-dark/70 shadow-sm backdrop-blur">
                Imagem de ambientação ilustrativa
              </figcaption>
            </figure>
            <div className="absolute -bottom-5 right-3 max-w-56 rounded-2xl border border-black/5 bg-white p-5 shadow-xl sm:right-8">
              <BadgeCheck className="h-6 w-6 text-brand-red" />
              <p className="mt-3 font-heading text-sm font-bold text-brand-dark">
                Empresa familiar, oficina e execução próprias
              </p>
            </div>
          </AnimateIn>

          <AnimateIn>
            <SectionHeading
              eyebrow={about.eyebrow}
              title={about.title}
              id="sobre-home-title"
            />
            <div className="mt-7 space-y-4">
              {about.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 30)}
                  className="leading-relaxed text-brand-dark/70"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {about.stats.map((stat) => (
                <AnimateItem
                  key={stat.label}
                  className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
                >
                  <p className="font-heading text-2xl font-bold text-brand-red">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-brand-dark/60">
                    {stat.label}
                  </p>
                </AnimateItem>
              ))}
            </div>
            <Button href="/sobre" variant="secondary" className="mt-8">
              Conhecer nossa história
              <ArrowRight className="h-4 w-4" />
            </Button>
          </AnimateIn>
        </div>
      </Container>
    </section>
  );
}
