import { ArrowRight, Info } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/lib/content/catalog";

export function FeaturedProductsSection() {
  return (
    <section className="section-padding bg-white" aria-labelledby="cadeiras-destaque-title">
      <Container>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            id="cadeiras-destaque-title"
            eyebrow="Cadeiras e mobiliário"
            title="Referências para encontrar a solução certa"
            description="Conheça algumas categorias e fale com a equipe para consultar modelos, condições e disponibilidade atuais."
          />
          <Button href="/cadeiras" variant="secondary" className="shrink-0">
            Ver catálogo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-red/10 bg-brand-red/[0.035] p-4 text-sm text-brand-dark/65">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
          <p>
            As imagens do catálogo são referências ilustrativas e não confirmam estoque,
            marca ou características exatas. A equipe apresenta as opções disponíveis no atendimento.
          </p>
        </div>
      </Container>
    </section>
  );
}
