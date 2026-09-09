import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Images } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { projects } from "@/lib/content/catalog";

export const metadata: Metadata = {
  title: "Portfólio de reformas",
  description:
    "Veja registros reais de trabalhos da JMartins em cadeiras, poltronas, bancos e mobiliário corporativo.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <main id="conteudo-principal">
      <PageHero
        eyebrow="Portfólio"
        title="Transformações que preservam histórias e recuperam conforto"
        description="Registros reais de trabalhos da JMartins. Informações de clientes, valores e dados internos não são publicados."
        image={{
          src: "/media/portfolio/page-04-image-04.webp",
          alt: "Registro real de uma poltrona antes e depois da reforma",
          caption: "Antes e depois real do acervo JMartins",
        }}
      />

      <section className="section-padding bg-white" aria-labelledby="projetos-title">
        <Container>
          <div className="flex items-start gap-4 rounded-2xl border border-black/5 bg-brand-light p-5 text-sm text-brand-dark/65">
            <Images className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
            <p>
              O comparador aparece somente quando há um par autêntico da mesma peça.
              Os demais cards são registros únicos de trabalhos realizados.
            </p>
          </div>
          <h2 id="projetos-title" className="sr-only">Projetos realizados</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-light">
                  <Image
                    src={project.after}
                    alt={project.afterAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-red shadow-sm backdrop-blur">
                    {project.before ? "ANTES | DEPOIS" : "REGISTRO REAL"}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-sm font-semibold text-brand-red">{project.category}</p>
                  <div className="mt-2 flex items-start justify-between gap-4">
                    <h3 className="font-heading text-xl font-bold">{project.title}</h3>
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-brand-red" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-brand-dark/65">
                    {project.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
