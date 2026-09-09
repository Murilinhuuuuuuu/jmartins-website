import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BeforeAfterSlider } from "@/components/portfolio/BeforeAfterSlider";
import { Container } from "@/components/ui/Container";
import { projects } from "@/lib/content/catalog";

export function PortfolioPreviewSection() {
  const project = projects.find((item) => item.before);

  if (!project?.before || !project.beforeAlt) return null;

  return (
    <section className="section-padding bg-white" aria-labelledby="transformacoes-title">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          {project.comparisonLayout === "split-source" ? (
            <figure className="relative aspect-[786/542] w-full overflow-hidden rounded-3xl bg-brand-light shadow-[0_24px_70px_rgba(32,25,26,0.12)]">
              <Image
                src={project.after}
                alt={`${project.beforeAlt}; ao lado, ${project.afterAlt}`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <figcaption className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-dark/70 shadow-sm backdrop-blur">
                A mesma poltrona · antes e depois
              </figcaption>
            </figure>
          ) : (
            <BeforeAfterSlider
              before={project.before}
              after={project.after}
              beforeAlt={project.beforeAlt}
              afterAlt={project.afterAlt}
            />
          )}
          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-red">Transformações reais</p>
            <h2 id="transformacoes-title" className="heading-display mt-3 text-3xl sm:text-4xl">Seu móvel pode ter solução.</h2>
            <p className="mt-5 text-lg leading-relaxed text-brand-dark/70">Do diagnóstico ao acabamento, cada reforma é avaliada de acordo com a peça, o uso e o resultado esperado.</p>
            <p className="mt-4 text-sm leading-relaxed text-brand-dark/55">
              A comparação mostra a mesma poltrona antes e depois da reforma.
            </p>
            <Link href="/portfolio" className="mt-8 inline-flex items-center gap-2 font-heading text-sm font-bold text-brand-red">Ver portfólio<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
