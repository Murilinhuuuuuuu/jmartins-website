import { AnimateIn, AnimateItem } from "@/components/ui/AnimateIn";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about } from "@/lib/content/site";

export function AboutSection() {
  return (
    <section
      id="sobre"
      className="bg-brand-light section-padding"
      aria-label="Sobre a empresa"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <AnimateIn>
            <SectionHeading
              eyebrow={about.eyebrow}
              title={about.title}
            />
            <div className="mt-8 space-y-4">
              {about.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 30)}
                  className="text-base leading-relaxed text-brand-dark/75"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <blockquote className="mt-8 border-l-2 border-brand-red pl-5 font-heading text-lg font-bold italic text-brand-dark">
              Transformamos móveis. Renovamos ambientes. Valorizamos espaços.
            </blockquote>
          </AnimateIn>

          <AnimateIn stagger className="space-y-6">
            <AnimateItem>
              <ImagePlaceholder
                aspectRatio="4/5"
                label="Nossa história e oficina"
                category="Sobre"
                className="shadow-md"
              />
            </AnimateItem>
            <div className="grid grid-cols-3 gap-4">
              {about.stats.map((stat) => (
                <AnimateItem
                  key={stat.label}
                  className="rounded-2xl bg-white p-5 text-center shadow-sm"
                >
                  <p className="font-heading text-2xl font-bold text-brand-red md:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-brand-dark/60">{stat.label}</p>
                </AnimateItem>
              ))}
            </div>
          </AnimateIn>
        </div>
      </Container>
    </section>
  );
}
