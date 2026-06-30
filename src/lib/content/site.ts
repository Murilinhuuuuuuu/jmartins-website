import type { ContactInfo } from "@/types";

export const site = {
  name: "JMartins Móveis",
  shortName: "JMartins",
  tagline: "Transformamos móveis. Renovamos ambientes. Valorizamos espaços.",
  foundedYear: 1988,
  experienceYears: "30+",
  description:
    "Empresa familiar especializada em móveis, reformas e revitalização de ambientes corporativos e condominiais em São Paulo.",
  locale: "pt_BR",
  url: "https://jmartinsmoveis.com.br",
} as const;

export const contact: ContactInfo = {
  phone: "(11) 3825-8297",
  phoneHref: "tel:+551138258297",
  whatsapp: "(11) 94825-0380",
  whatsappHref: "https://wa.me/5511948250380",
  email: "jmartins.expressao@gmail.com",
  address: "Av. São João, 2023 — Santa Cecília, São Paulo",
  addressLine: "Av. São João, 2023, Santa Cecília, São Paulo, SP",
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
  eyebrow: "Tradição desde 1988",
  title: "Móveis e reformas com excelência em São Paulo",
  subtitle:
    "Há mais de três décadas transformamos móveis, renovamos ambientes e valorizamos espaços com acabamento profissional e atendimento personalizado.",
  primaryCta: "Solicite um orçamento",
  secondaryCta: "Conheça nossos serviços",
};

export const cta = {
  title: "Pronto para transformar seu ambiente?",
  description:
    "Entre em contato e receba um atendimento personalizado. Estamos prontos para revitalizar seus móveis e valorizar seus espaços.",
  button: "Solicite um orçamento",
};

export const seo = {
  title: "JMartins Móveis | Reforma e Móveis sob Medida em São Paulo",
  description:
    "Empresa familiar desde 1988. Reforma e revitalização de móveis, móveis para escritório, manutenção e projetos personalizados em Santa Cecília, SP.",
  keywords: [
    "reforma de móveis",
    "móveis sob medida",
    "móveis para escritório",
    "JMartins Móveis",
    "Santa Cecília São Paulo",
    "revitalização de móveis",
  ],
};
