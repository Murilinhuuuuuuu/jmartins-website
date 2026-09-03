import { HeroSection } from "@/components/sections/HeroSection";
import { SolutionsSection } from "@/components/sections/SolutionsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { DifferentialsSection } from "@/components/sections/DifferentialsSection";
import { PortfolioPreviewSection } from "@/components/sections/PortfolioPreviewSection";
import { BusinessSection } from "@/components/sections/BusinessSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main id="conteudo-principal">
      <HeroSection />
      <SolutionsSection />
      <ServicesSection />
      <DifferentialsSection />
      <PortfolioPreviewSection />
      <BusinessSection />
      <CtaSection />
      <ContactSection />
    </main>
  );
}
