import Link from "next/link";
import { ArrowRight, Armchair, RefreshCcw } from "lucide-react";
import { Container } from "@/components/ui/Container";

const solutions = [
  {
    title: "Reforme sua cadeira",
    description: "Recupere estrutura, conforto e acabamento com avaliação cuidadosa e execução na oficina própria.",
    href: "/reformas",
    cta: "Conhecer as reformas",
    icon: RefreshCcw,
  },
  {
    title: "Encontre sua próxima cadeira",
    description: "Conheça categorias para escritório, recepção e outros ambientes, sempre com disponibilidade sob consulta.",
    href: "/cadeiras",
    cta: "Explorar cadeiras",
    icon: Armchair,
  },
];

export function SolutionsSection() {
  return (
    <section className="section-padding bg-brand-light" aria-labelledby="solucoes-title">
      <Container>
        <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-red">Duas soluções. O mesmo cuidado.</p>
        <h2 id="solucoes-title" className="heading-display mt-3 max-w-3xl text-3xl sm:text-4xl">Reforma e venda com o mesmo peso</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {solutions.map(({ title, description, href, cta, icon: Icon }, index) => (
            <Link key={title} href={href} className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl sm:p-10">
              <span className="absolute right-8 top-8 font-heading text-7xl font-bold text-brand-red/[0.06]">0{index + 1}</span>
              <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-brand-red text-white"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-10 font-heading text-2xl font-bold text-brand-dark sm:text-3xl">{title}</h3>
              <p className="mt-4 max-w-xl leading-relaxed text-brand-dark/65">{description}</p>
              <span className="mt-8 inline-flex items-center gap-2 font-heading text-sm font-bold text-brand-red">{cta}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
