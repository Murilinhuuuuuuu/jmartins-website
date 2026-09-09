import type { Service } from "@/types";

export const servicesSection = {
  eyebrow: "Serviços de reforma",
  title: "Da estrutura ao acabamento",
  description:
    "Avaliamos cada peça e agrupamos o serviço necessário para recuperar funcionalidade, conforto e aparência.",
};

export const services: Service[] = [
  {
    id: "estofamento",
    title: "Estofamento e revestimento",
    description:
      "Troca de tecido, courvin ou couro, com opções de cores e acabamentos.",
    icon: "Paintbrush",
  },
  {
    id: "espuma",
    title: "Espuma e conforto",
    description:
      "Troca ou reforço de espuma para recuperar o apoio e o conforto da peça.",
    icon: "Briefcase",
  },
  {
    id: "pistoes",
    title: "Pistões e regulagens",
    description:
      "Avaliação de pistão, inclinação e regulagem de altura para recuperar o uso correto.",
    icon: "Wrench",
  },
  {
    id: "componentes",
    title: "Rodízios, braços e bases",
    description:
      "Troca ou reparo de componentes conforme o modelo e a disponibilidade de peças.",
    icon: "Ruler",
  },
  {
    id: "mecanismos",
    title: "Mecanismos",
    description:
      "Diagnóstico e manutenção de mecanismos de cadeiras para recuperar movimento e estabilidade.",
    icon: "PenTool",
  },
  {
    id: "estrutura",
    title: "Estrutura e solda",
    description:
      "Reparo estrutural em metal ou madeira, solda e avaliação de peças plásticas.",
    icon: "Wrench",
  },
  {
    id: "acabamento",
    title: "Pintura e acabamento",
    description:
      "Pintura, revitalização estética e cuidado nos detalhes finais da peça.",
    icon: "Paintbrush",
  },
  {
    id: "restauracao",
    title: "Restauração completa",
    description:
      "Combinação de reparos, limpeza, higienização e acabamento após avaliação completa.",
    icon: "Sparkles",
  },
];
