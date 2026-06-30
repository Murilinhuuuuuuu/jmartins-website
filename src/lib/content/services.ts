import type { Service } from "@/types";

export const servicesSection = {
  eyebrow: "Nossos Serviços",
  title: "Soluções completas para móveis e ambientes",
  description:
    "Do escritório ao condomínio, oferecemos serviços especializados com acabamento profissional e atenção a cada detalhe.",
};

export const services: Service[] = [
  {
    id: "reforma",
    title: "Reforma e revitalização de móveis",
    description:
      "Revitalização completa com pintura, troca de revestimentos e melhorias estruturais para devolver vida e valor aos seus móveis.",
    icon: "Paintbrush",
  },
  {
    id: "escritorio",
    title: "Móveis para escritório",
    description:
      "Fabricação e adaptação de mobiliário corporativo sob medida, pensado para funcionalidade, conforto e identidade profissional.",
    icon: "Briefcase",
  },
  {
    id: "manutencao",
    title: "Manutenção e ajustes",
    description:
      "Reparos, reforços e melhorias para aumentar a durabilidade e preservar a qualidade do seu mobiliário ao longo do tempo.",
    icon: "Wrench",
  },
  {
    id: "projetos",
    title: "Projetos personalizados",
    description:
      "Soluções sob medida conforme necessidade e orçamento, com atendimento personalizado do projeto à entrega.",
    icon: "Ruler",
  },
];
