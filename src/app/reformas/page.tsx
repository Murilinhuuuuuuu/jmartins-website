import type { Metadata } from "next";
import { CheckCircle2, Clock3, MapPin, Truck } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { services } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Reforma de cadeiras e móveis em São Paulo",
  description: "Da estrutura ao acabamento, a JMartins recupera conforto, funcionalidade e aparência. Solicite uma avaliação.",
  alternates: { canonical: "/reformas" },
};

const furnitureTypes = ["Cadeira de escritório", "Executiva", "Presidente", "Secretária", "Ergonômica", "Caixa", "Recepção", "Fixa", "Longarina", "Poltrona", "Sofá", "Banco", "Banqueta", "Mocho"];

export default function RepairsPage() {
  return (
    <main id="conteudo-principal">
      <PageHero eyebrow="Reformas" title="Reforma de cadeiras e móveis em São Paulo" description="Da estrutura ao acabamento, a JMartins recupera conforto, funcionalidade e aparência." />

      <section className="section-padding bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-red">O que atendemos</p>
              <h2 className="heading-display mt-3 text-3xl sm:text-4xl">Uma avaliação para cada tipo de peça</h2>
              <p className="mt-5 leading-relaxed text-brand-dark/70">Você pode enviar fotos pelo orçamento. Em alguns casos elas já ajudam na avaliação inicial; quando necessário, a equipe orienta o próximo passo.</p>
              <Button href="/orcamento?tipo=reforma" className="mt-8">Solicitar avaliação</Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {furnitureTypes.map((type) => <div key={type} className="flex items-center gap-3 rounded-2xl border border-black/5 bg-brand-light px-5 py-4"><CheckCircle2 className="h-5 w-5 shrink-0 text-brand-red" /><span className="font-semibold">{type}</span></div>)}
            </div>
          </div>
        </Container>
      </section>

      <section className="section-padding bg-brand-light">
        <Container>
          <div className="max-w-3xl">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-red">Serviços</p>
            <h2 className="heading-display mt-3 text-3xl sm:text-4xl">Tudo o que a peça precisa, sem dezenas de categorias</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => <article key={service.id} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm"><p className="font-heading text-lg font-bold">{service.title}</p><p className="mt-3 text-sm leading-relaxed text-brand-dark/65">{service.description}</p></article>)}
          </div>
        </Container>
      </section>

      <ProcessSection />

      <section className="section-padding bg-white">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-black/5 p-7"><Clock3 className="h-7 w-7 text-brand-red" /><h2 className="mt-5 font-heading text-xl font-bold">Prazo informado após avaliação</h2><p className="mt-3 text-sm leading-relaxed text-brand-dark/65">Reformas simples podem ser concluídas em cerca de três dias. O prazo definitivo depende do serviço e da quantidade.</p></div>
            <div className="rounded-3xl border border-black/5 p-7"><Truck className="h-7 w-7 text-brand-red" /><h2 className="mt-5 font-heading text-xl font-bold">Retirada e entrega</h2><p className="mt-3 text-sm leading-relaxed text-brand-dark/65">Você pode levar a peça à loja ou solicitar retirada. O frete de entrega é calculado conforme a distância e informado antes do fechamento.</p></div>
            <div className="rounded-3xl border border-black/5 p-7"><MapPin className="h-7 w-7 text-brand-red" /><h2 className="mt-5 font-heading text-xl font-bold">Atendimento regional</h2><p className="mt-3 text-sm leading-relaxed text-brand-dark/65">São Paulo, Grande São Paulo, ABC, Osasco, Guarulhos, Barueri, Alphaville, interior e litoral. Outras regiões sob avaliação.</p></div>
          </div>
        </Container>
      </section>
    </main>
  );
}
