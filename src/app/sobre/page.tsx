import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Sobre a JMartins",
  description: "Conheça a história da empresa familiar fundada em 1988 por João Serafim de Melo em Santa Cecília, São Paulo.",
  alternates: { canonical: "/sobre" },
};

const timeline = [{ year: "1988", title: "Início da história" }, { year: "Décadas de experiência", title: "Crescimento e especialização" }, { year: "Hoje", title: "Tradição que se renova" }];

export default function AboutPage() {
  return <main id="conteudo-principal"><PageHero eyebrow="Sobre" title="Uma empresa familiar com raízes em 1988" description="Tradição, trabalho artesanal e atendimento próximo, agora apresentados em uma plataforma preparada para continuar evoluindo." image={{ src: "/media/illustrative/cuidado-artesanal.webp", alt: "Mãos trabalhando no estofamento de uma cadeira", caption: "Imagem de ambientação ilustrativa", objectPosition: "center 58%" }} /><section className="section-padding bg-white"><Container><div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"><figure className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-light"><Image src="/media/portfolio/page-05-image-02.png" alt="Fachada da JMartins na Avenida São João, em Santa Cecília" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /><figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-dark/70 shadow-sm backdrop-blur">Localização real em Santa Cecília</figcaption></figure><div className="space-y-5 text-lg leading-relaxed text-brand-dark/70"><p>A história da JMartins começa em 1988, em Santa Cecília, São Paulo, com João Serafim de Melo. Desde o início, o negócio esteve ligado ao universo dos móveis e das cadeiras.</p><p>Ao longo dos anos, a empresa permaneceu familiar e construiu sua trajetória com atenção à qualidade, ao trabalho artesanal e ao relacionamento com os clientes.</p><p>Hoje, João continua à frente do negócio ao lado de sua família, mantendo a tradição da empresa enquanto a JMartins incorpora novas formas de atender, apresentar seus produtos e se relacionar com clientes particulares e empresas.</p></div></div></Container></section><section className="section-padding bg-brand-light"><Container><div className="grid gap-6 md:grid-cols-3">{timeline.map((item, index) => <article key={item.year} className="relative rounded-3xl border border-black/5 bg-white p-8 shadow-sm"><span className="font-heading text-sm font-bold text-brand-red">0{index + 1}</span><h2 className="mt-6 font-heading text-2xl font-bold">{item.year}</h2><p className="mt-2 text-brand-dark/65">{item.title}</p></article>)}</div></Container></section></main>;
}
