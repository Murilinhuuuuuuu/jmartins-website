import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cta } from "@/lib/content/site";

export function CtaSection() {
  return (
    <section className="bg-brand-red section-padding" aria-label="Chamada para ação">
      <Container>
        <AnimateIn className="mx-auto max-w-3xl text-center">
          <h2 className="heading-display text-balance text-3xl text-white md:text-4xl">
            {cta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            {cta.description}
          </p>
          <div className="mt-10">
            <Button
              href="#contato"
              variant="secondary"
              className="border-white/30 bg-white text-brand-red hover:border-white hover:bg-white/90 hover:text-brand-red"
            >
              {cta.button}
            </Button>
          </div>
        </AnimateIn>
      </Container>
    </section>
  );
}
