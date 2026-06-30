import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { DifferentialsSection } from "@/components/sections/DifferentialsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main id="conteudo-principal">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <DifferentialsSection />
      <GallerySection />
      <ProcessSection />
      <CtaSection />
      <ContactSection />
    </main>
  );
}
