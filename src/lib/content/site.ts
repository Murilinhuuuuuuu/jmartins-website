import type { ContactInfo } from "@/types";

const deploymentUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;

const productionUrl =
  process.env.VERCEL_ENV === "production"
    ? "https://www.jmartinsmoveis.com.br"
    : deploymentUrl;

export const allowIndexing = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV !== "production";

export const site = {
  name: "JMartins Móveis",
  shortName: "JMartins",
  legalName: "J. MARTINS MOVEIS LTDA",
  cnpj: "69.338.507/0001-56",
  tagline: "Desde 1988, tradição, qualidade e cuidado em cada móvel.",
  foundedYear: 1988,
  founder: "João Serafim de Melo",
  description:
    "Empresa familiar especializada em reforma e venda de cadeiras e mobiliário em São Paulo, com oficina e execução próprias.",
  locale: "pt_BR",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    productionUrl ??
    "http://localhost:3000",
} as const;

export const contact: ContactInfo = {
  phone: "(11) 3825-8297",
  phoneHref: "tel:+551138258297",
  whatsapp: "(11) 3825-8297",
  whatsappHref: "https://wa.me/551138258297",
  address: "Av. São João, 2023 — Santa Cecília — São Paulo/SP — CEP 01211-100",
  addressLine: "Av. São João, 2023, Santa Cecília, São Paulo, SP, 01211-100",
};

export const about = {
  eyebrow: "Desde 1988",
  title: "Uma empresa familiar que une experiência e renovação",
  paragraphs: [
    "A história da JMartins começou em 1988, em Santa Cecília, São Paulo, com João Serafim de Melo.",
    "Ao longo dos anos, a empresa permaneceu familiar e construiu sua trajetória com atenção à qualidade, ao trabalho artesanal e ao relacionamento com os clientes.",
    "Hoje, João continua à frente do negócio ao lado de sua família, preservando a tradição enquanto a JMartins incorpora novas formas de atender pessoas e empresas.",
  ],
  stats: [
    { value: "1988", label: "Início da história" },
    { value: "+35", label: "Anos de trajetória" },
    { value: "SP", label: "Capital e outras regiões" },
  ],
};

export const hero = {
  eyebrow: "Desde 1988",
  title: "Cadeiras renovadas. Conforto recuperado.",
  subtitle:
    "Reforma e venda de cadeiras com tradição, qualidade e atendimento próximo desde 1988.",
  primaryCta: "Solicitar orçamento",
  secondaryCta: "Falar no WhatsApp",
};

export const cta = {
  title: "Seu móvel pode ter solução.",
  description:
    "Envie as informações da peça ou conte que tipo de cadeira procura. A equipe avalia e orienta o próximo passo.",
  button: "Solicitar orçamento",
};

export const seo = {
  title: "JMartins Móveis | Reforma e Venda de Cadeiras em São Paulo",
  description:
    "Reforma e venda de cadeiras em São Paulo desde 1988. Atendimento para pessoas, empresas e condomínios. Solicite um orçamento.",
  keywords: [
    "reforma de móveis",
    "móveis sob medida",
    "móveis para escritório",
    "JMartins Móveis",
    "Santa Cecília São Paulo",
    "revitalização de móveis",
  ],
};
