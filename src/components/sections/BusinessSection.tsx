import { Building2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const audiences = ["Escritórios", "Clínicas", "Condomínios", "Escolas", "Restaurantes", "Igrejas", "Órgãos públicos"];

export function BusinessSection() {
  return (
    <section className="section-padding bg-brand-dark text-white" aria-labelledby="empresas-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red"><Building2 className="h-7 w-7" /></span>
            <p className="mt-8 font-heading text-sm font-bold uppercase tracking-[0.18em] text-white/55">Atendimento corporativo</p>
            <h2 id="empresas-title" className="heading-display mt-3 text-3xl text-white sm:text-4xl">Soluções para empresas e grandes volumes</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/65">Sem quantidade mínima, com condições por volume e logística avaliada caso a caso para São Paulo e outras regiões.</p>
            <Button href="/orcamento" className="mt-8">Solicitar orçamento corporativo</Button>
          </div>
          <div className="grid content-center gap-3 sm:grid-cols-2">
            {audiences.map((audience) => (
              <div key={audience} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                <Check className="h-5 w-5 shrink-0 text-brand-red" />
                <span className="font-semibold text-white/85">{audience}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
