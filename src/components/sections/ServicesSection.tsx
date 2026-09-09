import { AnimateIn, AnimateItem } from "@/components/ui/AnimateIn";
import { ServiceCard } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services, servicesSection } from "@/lib/content/services";

export function ServicesSection() {
  return (
    <section
      id="servicos"
      className="bg-white section-padding"
      aria-label="Serviços"
    >
      <Container>
        <AnimateIn>
          <SectionHeading
            eyebrow={servicesSection.eyebrow}
            title={servicesSection.title}
            description={servicesSection.description}
            align="center"
            className="mx-auto"
          />
        </AnimateIn>

        <AnimateIn stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <AnimateItem key={service.id}>
              <ServiceCard service={service} />
            </AnimateItem>
          ))}
        </AnimateIn>
      </Container>
    </section>
  );
}
