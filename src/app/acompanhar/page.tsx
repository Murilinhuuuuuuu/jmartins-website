import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { TrackQuoteForm } from "@/components/forms/TrackQuoteForm";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Acompanhar solicitação", description: "Consulte o andamento do seu orçamento com protocolo e WhatsApp ou e-mail.", robots: { index: false, follow: false }, alternates: { canonical: "/acompanhar" } };

export default function TrackPage() { return <main id="conteudo-principal"><PageHero eyebrow="Acompanhamento" title="Consulte seu pedido sem criar uma conta" description="Use o protocolo e o mesmo WhatsApp ou e-mail informado no orçamento." /><section className="section-padding bg-brand-light"><Container><TrackQuoteForm /></Container></section></main>; }
