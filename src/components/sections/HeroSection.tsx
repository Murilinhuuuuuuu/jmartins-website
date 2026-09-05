"use client";

import Image from "next/image";
import { Building2, MessageCircle, RefreshCcw, ShoppingBag } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { TrackedWhatsAppButton } from "@/components/analytics/TrackedWhatsAppButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { hero } from "@/lib/content/site";
import { buildDefaultWhatsAppUrl } from "@/lib/whatsapp";

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-white pt-20"
      aria-label="Apresentação"
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] bg-[radial-gradient(circle_at_62%_42%,rgba(207,17,29,0.10),transparent_58%)] lg:block" />
      <Container className="hero-padding relative">
        <div className="grid min-h-[calc(100svh-5rem)] items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
          <AnimateIn>
            <p className="mb-4 font-heading text-sm font-bold uppercase tracking-[0.15em] text-brand-red">
              {hero.eyebrow}
            </p>
            <h1 className="heading-display text-balance text-5xl sm:text-6xl lg:text-[4.4rem]">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-dark/70">
              {hero.subtitle}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="/orcamento" variant="primary">
                {hero.primaryCta}
              </Button>
              <TrackedWhatsAppButton
                href={buildDefaultWhatsAppUrl()}
                context="home_hero"
                variant="secondary"
              >
                <MessageCircle className="h-4 w-4" />
                {hero.secondaryCta}
              </TrackedWhatsAppButton>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-brand-dark/65">
              <li className="inline-flex items-center gap-2"><RefreshCcw className="h-4 w-4 text-brand-red" /> Reforma</li>
              <li className="inline-flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-brand-red" /> Venda</li>
              <li className="inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-brand-red" /> Empresas e particulares</li>
            </ul>
          </AnimateIn>

          <AnimateIn className="relative min-h-[34rem] lg:min-h-[42rem]">
            <div className="absolute left-[4%] top-[11%] z-10 w-[39%] overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_80px_rgba(32,25,26,0.13)]">
              <Image src="/media/portfolio/page-04-image-02.png" alt="Cadeiras de escritório renovadas pela JMartins" width={548} height={692} className="aspect-[4/5] h-auto w-full object-cover" priority sizes="(max-width: 1024px) 40vw, 18vw" />
            </div>
            <div className="absolute right-[2%] top-[3%] w-[45%] overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_80px_rgba(32,25,26,0.12)]">
              <Image src="/media/portfolio/page-04-image-03.png" alt="Poltrona reformada com novo revestimento" width={617} height={509} className="aspect-[5/4] h-auto w-full object-cover" priority sizes="(max-width: 1024px) 45vw, 21vw" />
            </div>
            <div className="absolute bottom-[7%] right-[10%] z-20 w-[43%] overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_90px_rgba(32,25,26,0.16)]">
              <Image src="/media/portfolio/page-04-image-05.png" alt="Banco estofado produzido pela JMartins" width={545} height={512} className="aspect-[1/1] h-auto w-full object-cover" sizes="(max-width: 1024px) 43vw, 20vw" />
            </div>
            <div className="absolute bottom-[2%] left-[12%] z-0 w-[36%] overflow-hidden rounded-[2rem] bg-white shadow-[0_22px_70px_rgba(32,25,26,0.10)]">
              <Image src="/media/portfolio/page-04-image-07.png" alt="Poltrona antes da restauração" width={547} height={507} className="aspect-[1/1] h-auto w-full object-cover" sizes="(max-width: 1024px) 36vw, 17vw" />
            </div>
            <div className="absolute left-[37%] top-[48%] z-30 rounded-2xl border border-black/5 bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
              <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-brand-red">Oficina própria</p>
              <p className="mt-1 text-sm font-semibold text-brand-dark">Execução sem terceirização</p>
            </div>
          </AnimateIn>
        </div>
      </Container>
    </section>
  );
}
