"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { hero } from "@/lib/content/site";

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-white pt-20"
      aria-label="Apresentação"
    >
      <Container className="section-padding">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <AnimateIn>
            <p className="mb-4 font-heading text-sm font-bold uppercase tracking-[0.15em] text-brand-red">
              {hero.eyebrow}
            </p>
            <h1 className="heading-display text-balance text-4xl md:text-5xl lg:text-[3rem]">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-brand-dark/75">
              {hero.subtitle}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="#contato" variant="primary">
                {hero.primaryCta}
              </Button>
              <Button href="#servicos" variant="secondary">
                {hero.secondaryCta}
              </Button>
            </div>
          </AnimateIn>

          <AnimateIn className="lg:pl-8">
            <ImagePlaceholder
              aspectRatio="16/9"
              label="Ambiente corporativo revitalizado"
              category="Projeto em destaque"
              className="shadow-lg"
            />
          </AnimateIn>
        </div>
      </Container>
    </section>
  );
}
