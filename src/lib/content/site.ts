import type { ContactInfo } from "@/types";

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
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const contact: ContactInfo = {
  phone: "(11) 3825-8297",
  phoneHref: "tel:+551138258297",
  whatsapp: "(11) 3825-8297",
  whatsappHref: "https://wa.me/551138258297",
  email: "jmartins.expressao@gmail.com",
  address: "Av. São João, 2023 — Santa Cecília — São Paulo/SP — CEP 01211-100",
  addressLine: "Av. São João, 2023, Santa Cecília, São Paulo, SP, 01211-100",
};

export const about = {
  eyebrow: "Sobre a JMartins",
  title: "Tradição, qualidade e compromisso desde 1988",
  paragraphs: [
    "Desde 1988, a JMartins atua no mercado de móveis e reformas com tradição, qualidade e compromisso.",
    "Somos uma empresa familiar localizada em Santa Cecília (SP), especializada na modernização de móveis e ambientes corporativos e condominiais.",
    "Com mais de 30 anos de experiência, entregamos soluções personalizadas, acabamento profissional e respeito aos prazos.",
  ],
  stats: [
    { value: "1988", label: "Ano de fundação" },
    { value: "+30", label: "Anos de experiência" },
    { value: "100%", label: "Compromisso com qualidade" },
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
