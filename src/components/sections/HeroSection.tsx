"use client";

import Image from "next/image";
import {
  Building2,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { TrackedWhatsAppButton } from "@/components/analytics/TrackedWhatsAppButton";
import { AnimateIn } from "@/components/ui/AnimateIn";
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
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_65%_42%,rgba(207,17,29,0.11),transparent_62%)] lg:block" />
      <Container className="relative py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:min-h-[calc(100svh-10rem)] lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <AnimateIn>
            <p className="mb-4 font-heading text-sm font-bold uppercase tracking-[0.15em] text-brand-red">
              {hero.eyebrow}
            </p>
            <h1 className="heading-display text-balance text-5xl sm:text-6xl lg:text-[4.35rem]">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-dark/70">
              {hero.subtitle}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
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
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-brand-dark/65">
              <li className="inline-flex items-center gap-2">
                <RefreshCcw className="h-4 w-4 text-brand-red" /> Reforma
              </li>
              <li className="inline-flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-brand-red" /> Venda
              </li>
              <li className="inline-flex items-center gap-2">
                <Building2 className="h-4 w-4 text-brand-red" /> Empresas e particulares
              </li>
            </ul>
          </AnimateIn>

          <AnimateIn className="relative">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-brand-light shadow-[0_28px_80px_rgba(32,25,26,0.16)]">
              <Image
                src="/media/illustrative/cadeiras-ambiente.webp"
                alt="Composição ilustrativa com quatro cadeiras estofadas em ambiente contemporâneo"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-dark/55 to-transparent" />
              <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-dark/70 shadow-sm backdrop-blur">
                Imagem ilustrativa · consulte modelos disponíveis
              </figcaption>
            </figure>

            <div className="absolute -left-3 top-6 rounded-2xl border border-black/5 bg-white p-4 shadow-xl sm:-left-6 sm:top-10 sm:p-5">
              <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-brand-red">
                Desde 1988
              </p>
              <p className="mt-1 text-sm font-semibold text-brand-dark">
                Tradição que se renova
              </p>
            </div>

            <div className="absolute -bottom-5 right-3 flex max-w-64 items-start gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-xl sm:right-8 sm:p-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
              <div>
                <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-brand-red">
                  Oficina própria
                </p>
                <p className="mt-1 text-sm font-semibold text-brand-dark">
                  Execução própria, sem terceirização
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </Container>
    </section>
  );
}
