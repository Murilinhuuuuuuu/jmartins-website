import type { ProcessStep } from "@/types";

export const processSection = {
  eyebrow: "Processo de Trabalho",
  title: "Do contato à entrega, com transparência",
  description:
    "Um processo claro e estruturado para garantir a melhor experiência em cada projeto.",
};

export const processSteps: ProcessStep[] = [
  {
    id: "contato",
    step: 1,
    title: "Contato",
    description:
      "Entre em contato conosco e conte sobre suas necessidades. Estamos prontos para ouvir e orientar.",
  },
  {
    id: "orcamento",
    step: 2,
    title: "Orçamento",
    description:
      "Elaboramos um orçamento detalhado e personalizado, alinhado ao seu projeto e expectativas.",
  },
  {
    id: "execucao",
    step: 3,
    title: "Execução",
    description:
      "Iniciamos a execução com materiais de qualidade e acompanhamento em cada etapa do serviço.",
  },
  {
    id: "entrega",
    step: 4,
    title: "Entrega",
    description:
      "Entregamos o projeto finalizado com acabamento profissional e sua total satisfação.",
  },
];
