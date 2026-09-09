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
          <BeforeAfterSlider
            before={project.before}
            after={project.after}
            beforeAlt={project.beforeAlt}
            afterAlt={project.afterAlt}
            beforeObjectPosition={project.comparisonLayout === "split-source" ? "left" : undefined}
            afterObjectPosition={project.comparisonLayout === "split-source" ? "right" : undefined}
            aspect={project.comparisonLayout === "split-source" ? "portrait" : "landscape"}
          />
          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-red">Transformações reais</p>
            <h2 id="transformacoes-title" className="heading-display mt-3 text-3xl sm:text-4xl">Seu móvel pode ter solução.</h2>
            <p className="mt-5 text-lg leading-relaxed text-brand-dark/70">Do diagnóstico ao acabamento, cada reforma é avaliada de acordo com a peça, o uso e o resultado esperado.</p>
            <p className="mt-4 text-sm leading-relaxed text-brand-dark/55">Arraste a comparação para ver o antes e o depois deste registro real da JMartins.</p>
            <Link href="/portfolio" className="mt-8 inline-flex items-center gap-2 font-heading text-sm font-bold text-brand-red">Ver portfólio<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
