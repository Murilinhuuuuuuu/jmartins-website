import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = { title: "Contato", description: "Fale com a JMartins Móveis em Santa Cecília, São Paulo.", alternates: { canonical: "/contato" } };

export default function ContactPage() { return <main id="conteudo-principal"><PageHero compact eyebrow="Contato" title="Vamos conversar sobre o que você precisa" description="Peça uma avaliação, consulte cadeiras ou fale diretamente com a equipe da JMartins." /><ContactSection showIntro={false} /></main>; }
