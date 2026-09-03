import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cta } from "@/lib/content/site";

export function CtaSection() {
  return (
    <section className="border-y border-black/5 bg-brand-light section-padding" aria-label="Chamada para ação">
      <Container>
        <AnimateIn className="mx-auto max-w-3xl text-center">
          <h2 className="heading-display text-balance text-3xl md:text-4xl">
            {cta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-brand-dark/70">
            {cta.description}
          </p>
          <div className="mt-10">
            <Button
              href="/orcamento"
              variant="primary"
            >
              {cta.button}
            </Button>
          </div>
        </AnimateIn>
      </Container>
    </section>
  );
}
