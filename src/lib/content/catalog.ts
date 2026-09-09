export type ProductCategory =
  | "Escritório"
  | "Ergonômicas"
  | "Executivas"
  | "Presidente"
  | "Secretária"
  | "Caixa"
  | "Fixas"
  | "Longarinas"
  | "Recepção"
  | "Poltronas"
  | "Banquetas"
  | "Mocho"
  | "Outros móveis";

export type ProductReference = {
  slug: string;
  name: string;
  category: ProductCategory;
  condition: "Nova" | "Seminova" | "Usada" | "Reformada" | "Condição sob consulta";
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
  "Longarinas",
  "Recepção",
  "Poltronas",
  "Banquetas",
  "Mocho",
  "Outros móveis",
];

export const products: ProductReference[] = [
  {
    slug: "cadeira-ergonomica-referencia",
    name: "Cadeira ergonômica",
    category: "Ergonômicas",
    condition: "Condição sob consulta",
    description:
      "Referência visual da linha ergonômica para jornadas de trabalho prolongadas. Os ajustes e especificações variam conforme o modelo disponível.",
    features: ["Encosto telado", "Apoio lombar", "Regulagens conforme o modelo"],
    material: "Tela, tecido e estrutura conforme o modelo",
    color: "Cores sob consulta",
    availability: "Disponibilidade sob consulta",
    image: "/media/catalogo/ergonomica.webp",
    imageAlt: "Imagem ilustrativa de cadeira ergonômica em fundo neutro",
    isIllustrative: true,
  },
  {
    slug: "linha-executiva-referencia",
    name: "Cadeira executiva",
    category: "Executivas",
    condition: "Condição sob consulta",
    description:
      "Referência visual de cadeira para ambientes profissionais. Consulte a equipe para conhecer os modelos, materiais e condições disponíveis.",
    features: ["Uso corporativo", "Opções de acabamento", "Atendimento por unidade ou volume"],
    material: "Materiais variam conforme o modelo disponível",
    color: "Cores sob consulta",
    availability: "Disponibilidade sob consulta",
    image: "/media/catalogo/executiva.webp",
    imageAlt: "Imagem ilustrativa de cadeira executiva em fundo neutro",
    isIllustrative: true,
  },
  {
    slug: "cadeira-presidente-referencia",
    name: "Cadeira presidente",
    category: "Presidente",
    condition: "Condição sob consulta",
    description:
      "Referência visual de cadeira presidente com encosto alto e estofamento amplo. Consulte as opções disponíveis e seus acabamentos.",
    features: ["Encosto alto", "Apoio para braços", "Conforto executivo"],
    material: "Revestimento e estrutura conforme o modelo",
    color: "Cores sob consulta",
    availability: "Disponibilidade sob consulta",
    image: "/media/catalogo/presidente.webp",
    imageAlt: "Imagem ilustrativa de cadeira presidente em fundo neutro",
    isIllustrative: true,
  },
  {
    slug: "cadeira-secretaria-referencia",
    name: "Cadeira secretária",
    category: "Secretária",
    condition: "Condição sob consulta",
    description:
      "Referência visual de cadeira compacta para tarefas administrativas e estações com pouco espaço.",
    features: ["Formato compacto", "Altura regulável conforme o modelo", "Uso profissional"],
    material: "Tecido e estrutura conforme o modelo",
    color: "Cores sob consulta",
    availability: "Disponibilidade sob consulta",
    image: "/media/catalogo/secretaria.webp",
    imageAlt: "Imagem ilustrativa de cadeira secretária em fundo neutro",
    isIllustrative: true,
  },
  {
    slug: "cadeira-caixa-referencia",
    name: "Cadeira caixa",
    category: "Caixa",
    condition: "Condição sob consulta",
    description:
      "Referência visual de cadeira elevada para balcões, caixas e postos de trabalho altos.",
    features: ["Assento elevado", "Apoio circular para os pés", "Regulagens conforme o modelo"],
    material: "Tela, tecido e estrutura conforme o modelo",
    color: "Cores sob consulta",
    availability: "Disponibilidade sob consulta",
    image: "/media/catalogo/caixa.webp",
    imageAlt: "Imagem ilustrativa de cadeira caixa em fundo neutro",
    isIllustrative: true,
  },
  {
    slug: "cadeira-fixa-referencia",
    name: "Cadeira fixa",
    category: "Fixas",
    condition: "Condição sob consulta",
    description:
      "Referência visual de cadeira fixa para salas de espera, reunião, treinamento e atendimento.",
    features: ["Estrutura de quatro pés", "Uso coletivo", "Atendimento por unidade ou volume"],
    material: "Tecido e metal conforme o modelo",
    color: "Cores sob consulta",
    availability: "Disponibilidade sob consulta",
    image: "/media/catalogo/fixa.webp",
    imageAlt: "Imagem ilustrativa de cadeira fixa em fundo neutro",
    isIllustrative: true,
  },
  {
    slug: "longarina-tres-lugares-referencia",
    name: "Longarina de 3 lugares",
    category: "Longarinas",
    condition: "Condição sob consulta",
    description:
      "Referência visual de longarina para recepções e áreas de espera. Quantidade de lugares e acabamento dependem da disponibilidade.",
    features: ["Assentos independentes", "Estrutura para uso coletivo", "Configurações sob consulta"],
    material: "Tecido e metal conforme o modelo",
    color: "Cores sob consulta",
    availability: "Disponibilidade sob consulta",
    image: "/media/catalogo/longarina.webp",
    imageAlt: "Imagem ilustrativa de longarina de três lugares em fundo neutro",
    isIllustrative: true,
  },
  {
    slug: "poltrona-recepcao-referencia",
    name: "Poltrona para recepção",
    category: "Poltronas",
    condition: "Condição sob consulta",
    description:
      "Referência visual de poltrona compacta para recepções, salas de espera e ambientes de atendimento.",
    features: ["Assento estofado", "Formato compacto", "Revestimentos sob consulta"],
    material: "Tecido e estrutura conforme o modelo",
    color: "Cores sob consulta",
    availability: "Sob encomenda",
    image: "/media/catalogo/recepcao.webp",
    imageAlt: "Imagem ilustrativa de poltrona para recepção em fundo neutro",
    isIllustrative: true,
  },
  {
    slug: "banqueta-estofada-referencia",
    name: "Banqueta estofada",
    category: "Banquetas",
    condition: "Condição sob consulta",
    description:
      "Referência visual de banqueta alta estofada para balcões e áreas de apoio.",
    features: ["Assento estofado", "Apoio para os pés", "Altura conforme o modelo"],
    material: "Tecido e metal conforme o modelo",
    color: "Cores sob consulta",
    availability: "Disponibilidade sob consulta",
    image: "/media/catalogo/banqueta.webp",
    imageAlt: "Imagem ilustrativa de banqueta estofada em fundo neutro",
    isIllustrative: true,
  },
  {
    slug: "mocho-profissional-referencia",
    name: "Mocho profissional",
    category: "Mocho",
    condition: "Condição sob consulta",
    description:
      "Referência visual de mocho giratório para atendimento, estética, saúde e postos compactos.",
    features: ["Assento compacto", "Rodízios", "Altura regulável conforme o modelo"],
    material: "Revestimento e estrutura conforme o modelo",
    color: "Cores sob consulta",
    availability: "Disponibilidade sob consulta",
    image: "/media/catalogo/mocho.webp",
    imageAlt: "Imagem ilustrativa de mocho profissional vermelho em fundo neutro",
    isIllustrative: true,
  },
];

export type PortfolioProject = {
  slug: string;
  title: string;
  category: "Cadeiras" | "Poltronas" | "Bancos" | "Mobiliário corporativo";
  description: string;
  before?: string;
  after: string;
  beforeAlt?: string;
  afterAlt: string;
  comparisonLayout?: "split-source";
};

export const projects: PortfolioProject[] = [
  {
    slug: "renovacao-poltrona-estofada",
    title: "Renovação de poltrona estofada",
    category: "Poltronas",
    description:
      "Registro real de uma poltrona antes e depois da renovação do estofamento e da aparência.",
    before: "/media/portfolio/page-04-image-04.webp",
    after: "/media/portfolio/page-04-image-04.webp",
    beforeAlt: "Poltrona danificada antes da reforma",
    afterAlt: "Poltrona renovada depois da reforma",
    comparisonLayout: "split-source",
  },
  {
    slug: "cadeiras-para-ambiente-profissional",
    title: "Cadeiras para ambiente profissional",
    category: "Cadeiras",
    description:
      "Cadeiras apresentadas em um trabalho real da JMartins, com acabamento uniforme para uso profissional.",
    after: "/media/portfolio/page-04-image-02.png",
    afterAlt: "Cadeiras com acabamento uniforme",
  },
  {
    slug: "banco-estofado",
    title: "Banco estofado",
    category: "Bancos",
    description:
      "Peça estofada registrada no portfólio da empresa, com atenção ao revestimento e ao acabamento.",
    after: "/media/portfolio/page-04-image-05.png",
    afterAlt: "Banco estofado visto de frente",
  },
  {
    slug: "mobiliario-para-ambiente-profissional",
    title: "Mobiliário para ambiente profissional",
    category: "Mobiliário corporativo",
    description:
      "Registro de mobiliário corporativo apresentado no acervo da JMartins, sem divulgação de dados do cliente.",
    after: "/media/portfolio/page-04-image-07.png",
    afterAlt: "Mesa e armários em madeira para ambiente profissional",
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
