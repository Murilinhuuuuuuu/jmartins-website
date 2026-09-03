import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Cadeiras e mobiliário",
  description: "Consulte cadeiras novas, seminovas, usadas ou reformadas para pessoas e empresas. Catálogo sem preço público.",
  alternates: { canonical: "/cadeiras" },
};

export default function ChairsPage() {
  return <main id="conteudo-principal"><PageHero eyebrow="Catálogo" title="Cadeiras para trabalhar, receber e viver melhor" description="Explore categorias de referência e converse com a equipe sobre modelos, condições e disponibilidade. Não exibimos preços porque cada atendimento é consultivo." /><section className="section-padding bg-white"><Container><ProductCatalog /></Container></section></main>;
}
