import type { ProcessStep } from "@/types";

export const processSection = {
  eyebrow: "Como funciona",
  title: "Da avaliação ao móvel renovado",
  description:
    "Um processo claro e estruturado para garantir a melhor experiência em cada projeto.",
};

export const processSteps: ProcessStep[] = [
  {
    id: "contato",
    step: 1,
    title: "Conte o que precisa",
    description: "Explique a necessidade pelo site, WhatsApp, telefone ou presencialmente.",
  },
  {
    id: "orcamento",
    step: 2,
    title: "Envie informações",
    description: "Fotos são opcionais e podem ajudar na primeira avaliação.",
  },
  {
    id: "execucao",
    step: 3,
    title: "Avaliamos o serviço",
    description: "A equipe verifica a viabilidade, as opções e a logística.",
  },
  {
    id: "entrega",
    step: 4,
    title: "Você recebe o orçamento",
    description: "Prazo, condições e frete são informados antes do fechamento.",
  },
  { id: "retirada", step: 5, title: "Retirada ou entrega na loja", description: "Você pode levar o móvel ou solicitar a retirada." },
  { id: "reforma", step: 6, title: "Executamos a reforma", description: "O trabalho é realizado na oficina própria da JMartins." },
  { id: "entrega", step: 7, title: "Entregamos renovado", description: "A entrega é combinada conforme a região e o serviço." },
];
