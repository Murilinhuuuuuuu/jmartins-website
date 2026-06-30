import { AnimateIn, AnimateItem } from "@/components/ui/AnimateIn";
import { DifferentialItem } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  differentials,
  differentialsSection,
} from "@/lib/content/differentials";

export function DifferentialsSection() {
  return (
    <section
      id="diferenciais"
      className="bg-brand-light section-padding"
      aria-label="Diferenciais"
    >
      <Container>
        <AnimateIn>
          <SectionHeading
            eyebrow={differentialsSection.eyebrow}
            title={differentialsSection.title}
            description={differentialsSection.description}
            align="center"
            className="mx-auto"
          />
        </AnimateIn>

        <AnimateIn stagger className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {differentials.map((item) => (
            <AnimateItem key={item.id}>
              <DifferentialItem differential={item} />
            </AnimateItem>
          ))}
        </AnimateIn>
      </Container>
    </section>
  );
}
