import type { Metadata } from "next";
import { QuoteWizard } from "@/components/forms/QuoteWizard";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Solicitar orçamento", description: "Peça uma avaliação para reforma ou consulte cadeiras e mobiliário com a JMartins.", alternates: { canonical: "/orcamento" } };

export default async function QuotePage({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  const type = (await searchParams).tipo === "compra" ? "purchase" : "repair";
  return <main id="conteudo-principal"><PageHero eyebrow="Orçamento" title="Conte o que você precisa, em poucos passos" description="O formulário mostra apenas as perguntas necessárias e mantém seus dados quando você volta uma etapa." /><section className="section-padding bg-brand-light"><Container><QuoteWizard initialType={type} /></Container></section></main>;
}
