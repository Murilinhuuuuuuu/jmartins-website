export type ProductCategory =
  | "Escritório"
  | "Ergonômicas"
  | "Executivas"
  | "Presidente"
  | "Secretária"
  | "Caixa"
  | "Fixas"
  | "Recepção"
  | "Poltronas"
  | "Outros móveis";

export type ProductReference = {
  slug: string;
  name: string;
  category: ProductCategory;
  condition: "Nova" | "Seminova" | "Usada" | "Reformada";
  description: string;
  features: string[];
  material?: string;
  color?: string;
  availability: "Disponibilidade sob consulta" | "Sob encomenda";
  image: string;
  imageAlt: string;
  isIllustrative: true;
};

export const productCategories: Array<"Todos" | ProductCategory> = [
  "Todos",
  "Escritório",
  "Ergonômicas",
  "Executivas",
  "Presidente",
  "Secretária",
  "Caixa",
  "Fixas",
  "Recepção",
  "Poltronas",
  "Outros móveis",
];

export const products: ProductReference[] = [
  {
    slug: "linha-executiva-referencia",
    name: "Linha executiva",
    category: "Executivas",
    condition: "Nova",
    description:
      "Referência visual de cadeira para ambientes profissionais. Consulte a equipe para conhecer os modelos, materiais e condições disponíveis.",
    features: ["Uso corporativo", "Opções de acabamento", "Atendimento por unidade ou volume"],
    material: "Materiais variam conforme o modelo disponível",
    color: "Cores sob consulta",
    availability: "Disponibilidade sob consulta",
    image: "/media/portfolio/page-04-image-02.png",
    imageAlt: "Referência visual de cadeiras executivas",
    isIllustrative: true,
  },
  {
    slug: "poltrona-estofada-referencia",
    name: "Poltrona estofada",
    category: "Poltronas",
    condition: "Reformada",
    description:
      "Referência de acabamento para poltronas estofadas. A disponibilidade e as possibilidades de personalização são avaliadas com a equipe.",
    features: ["Revestimentos variados", "Escolha de tecidos", "Avaliação personalizada"],
    material: "Tecido e estrutura conforme avaliação",
    color: "Cores sob consulta",
    availability: "Sob encomenda",
    image: "/media/portfolio/page-04-image-03.png",
    imageAlt: "Referência visual de poltrona estofada reformada",
    isIllustrative: true,
  },
  {
    slug: "banco-estofado-referencia",
    name: "Banco estofado",
    category: "Recepção",
    condition: "Reformada",
    description:
      "Referência visual de banco estofado para recepção ou apoio. Consulte opções atuais e possibilidade de reforma.",
    features: ["Formato compacto", "Revestimento sob consulta", "Uso residencial ou comercial"],
    material: "Tecido e madeira",
    color: "Cores sob consulta",
    availability: "Disponibilidade sob consulta",
    image: "/media/portfolio/page-04-image-05.png",
    imageAlt: "Referência visual de banco estofado",
    isIllustrative: true,
  },
  {
    slug: "mobiliario-corporativo-referencia",
    name: "Mobiliário corporativo",
    category: "Outros móveis",
    condition: "Nova",
    description:
      "Referência de composição para escritório. A equipe avalia medidas, quantidade, logística e alternativas disponíveis para cada ambiente.",
    features: ["Atendimento a empresas", "Projetos por volume", "Logística avaliada caso a caso"],
    material: "Acabamentos sob consulta",
    availability: "Sob encomenda",
    image: "/media/portfolio/page-04-image-06.png",
    imageAlt: "Referência visual de mobiliário corporativo",
    isIllustrative: true,
  },
];

export type PortfolioProject = {
  slug: string;
  title: string;
  category: "Cadeiras" | "Poltronas" | "Bancos" | "Mobiliário corporativo";
  description: string;
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
};

export const projects: PortfolioProject[] = [
  {
    slug: "renovacao-poltrona-estofada",
    title: "Renovação de poltrona estofada",
    category: "Poltronas",
    description:
      "Um exemplo real de transformação com recuperação do conforto e renovação completa da aparência.",
    before: "/media/portfolio/page-04-image-07.png",
    after: "/media/portfolio/page-04-image-03.png",
    beforeAlt: "Poltrona antes da reforma",
    afterAlt: "Poltrona depois da reforma",
  },
  {
    slug: "cadeiras-para-ambiente-profissional",
    title: "Cadeiras para ambiente profissional",
    category: "Cadeiras",
    description:
      "Cadeiras apresentadas em um trabalho real da JMartins, com acabamento uniforme para uso profissional.",
    before: "/media/portfolio/page-04-image-02.png",
    after: "/media/portfolio/page-04-image-02.png",
    beforeAlt: "Cadeiras em ambiente de trabalho",
    afterAlt: "Cadeiras com acabamento uniforme",
  },
  {
    slug: "banco-estofado",
    title: "Banco estofado",
    category: "Bancos",
    description:
      "Peça estofada registrada no portfólio da empresa, com atenção ao revestimento e ao acabamento.",
    before: "/media/portfolio/page-04-image-05.png",
    after: "/media/portfolio/page-04-image-05.png",
    beforeAlt: "Banco estofado visto de frente",
    afterAlt: "Detalhe do acabamento do banco estofado",
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
