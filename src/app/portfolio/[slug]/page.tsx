import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { TrackedWhatsAppButton } from "@/components/analytics/TrackedWhatsAppButton";
import { ViewEvent } from "@/components/analytics/ViewEvent";
import { BeforeAfterSlider } from "@/components/portfolio/BeforeAfterSlider";
import { Container } from "@/components/ui/Container";
import { getProject, projects } from "@/lib/content/catalog";
import { buildProjectWhatsAppUrl } from "@/lib/whatsapp";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/portfolio/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const hasComparison = Boolean(project.before && project.beforeAlt);

  return (
    <main id="conteudo-principal" className="pt-20">
      <ViewEvent
        name="project_view"
        properties={{ slug: project.slug, category: project.category }}
      />
      <section className="section-padding bg-white">
        <Container>
          <div className="mx-auto max-w-5xl">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark/60 transition hover:text-brand-red"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao portfólio
            </Link>
            <p className="mt-8 font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-red">
              {project.category}
            </p>
            <h1 className="heading-display mt-3 text-4xl sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-dark/70">
              {project.description}
            </p>

            <div className="mt-10">
              {hasComparison && project.comparisonLayout === "split-source" ? (
                <figure className="relative mx-auto aspect-[786/542] w-full max-w-3xl overflow-hidden rounded-3xl bg-brand-light shadow-[0_24px_70px_rgba(32,25,26,0.12)]">
                  <Image
                    src={project.after}
                    alt={`${project.beforeAlt}; ao lado, ${project.afterAlt}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 48rem"
                    className="object-cover"
                  />
                  <figcaption className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-dark/70 shadow-sm backdrop-blur">
                    A mesma poltrona · antes e depois
                  </figcaption>
                </figure>
              ) : hasComparison ? (
                <BeforeAfterSlider
                  before={project.before!}
                  after={project.after}
                  beforeAlt={project.beforeAlt!}
                  afterAlt={project.afterAlt}
                  beforeObjectPosition={project.comparisonLayout === "split-source" ? "left" : undefined}
                  afterObjectPosition={project.comparisonLayout === "split-source" ? "right" : undefined}
                  aspect={project.comparisonLayout === "split-source" ? "portrait" : "landscape"}
                />
              ) : (
                <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-light shadow-[0_24px_70px_rgba(32,25,26,0.12)]">
                  <Image
                    src={project.after}
                    alt={project.afterAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 64rem"
                    className="object-cover"
                  />
                  <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-dark/70 shadow-sm backdrop-blur">
                    Registro real do acervo JMartins
                  </figcaption>
                </figure>
              )}
            </div>

            <p className="mt-5 text-sm text-brand-dark/55">
              {hasComparison && project.comparisonLayout === "split-source"
                ? "Comparação original do acervo JMartins, mostrando a mesma poltrona antes e depois."
                : hasComparison
                  ? "Arraste ou use as setas do teclado para comparar."
                : "Este projeto possui um registro único publicado; não simulamos uma comparação sem as duas fotos autênticas."}
            </p>
            <TrackedWhatsAppButton
              href={buildProjectWhatsAppUrl(project.title)}
              context="project_detail"
              properties={{ project_slug: project.slug }}
              className="mt-8"
            >
              Quero avaliar uma peça
            </TrackedWhatsAppButton>
          </div>
        </Container>
      </section>
    </main>
  );
}
