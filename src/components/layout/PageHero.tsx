import { Container } from "@/components/ui/Container";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-black/5 bg-brand-light pt-20">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_75%_30%,rgba(207,17,29,0.12),transparent_58%)]" />
      <Container className="relative py-20 sm:py-24 lg:py-28">
        <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-red">{eyebrow}</p>
        <h1 className="heading-display mt-4 max-w-4xl text-balance text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-dark/70">{description}</p>
      </Container>
    </section>
  );
}
