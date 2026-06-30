import { AnimateIn, AnimateItem } from "@/components/ui/AnimateIn";
import { ProcessStepCard } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSection, processSteps } from "@/lib/content/process";

export function ProcessSection() {
  return (
    <section
      id="processo"
      className="bg-brand-light section-padding"
      aria-label="Processo de trabalho"
    >
      <Container>
        <AnimateIn>
          <SectionHeading
            eyebrow={processSection.eyebrow}
            title={processSection.title}
            description={processSection.description}
            align="center"
            className="mx-auto"
          />
        </AnimateIn>

        <AnimateIn stagger className="mt-16 flex flex-col gap-10 md:flex-row md:gap-6">
          {processSteps.map((step, index) => (
            <AnimateItem key={step.id} className="flex-1">
              <ProcessStepCard
                step={step}
                isLast={index === processSteps.length - 1}
                orientation="horizontal"
              />
            </AnimateItem>
          ))}
        </AnimateIn>
      </Container>
    </section>
  );
}
