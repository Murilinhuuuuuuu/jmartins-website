import type { Service } from "@/types";

export const servicesSection = {
  eyebrow: "Serviços de reforma",
  title: "Da estrutura ao acabamento",
  description:
    "Avaliamos cada peça e agrupamos o serviço necessário para recuperar funcionalidade, conforto e aparência.",
};

export const services: Service[] = [
  {
    id: "reforma",
    title: "Estofamento e revestimento",
    description:
      "Troca de tecido, courvin ou couro, com opções de cores e acabamentos.",
    icon: "Paintbrush",
  },
  {
    id: "escritorio",
    title: "Espuma e conforto",
    description:
      "Troca ou reforço de espuma para recuperar o apoio e o conforto da peça.",
    icon: "Briefcase",
  },
  {
    id: "manutencao",
    title: "Mecanismos e regulagens",
    description:
      "Pistões, inclinação, altura, rodízios, braços, bases e mecanismos.",
    icon: "Wrench",
  },
  {
    id: "projetos",
    title: "Estrutura e acabamento",
    description:
      "Solda, reparo estrutural, pintura, limpeza e restauração completa.",
    icon: "Ruler",
  },
];
