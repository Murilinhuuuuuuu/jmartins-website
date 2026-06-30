import type { GalleryCategory, GalleryItem } from "@/types";

export const gallerySection = {
  eyebrow: "Galeria de Projetos",
  title: "Trabalhos realizados",
  description:
    "Conheça alguns dos nossos projetos. Em breve, fotos profissionais dos nossos trabalhos.",
};

export const galleryCategories: GalleryCategory[] = [
  "Todos",
  "Reforma",
  "Escritório",
  "Manutenção",
  "Projetos",
];

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: "Revitalização de móveis corporativos",
    category: "Reforma",
    aspectRatio: "4/3",
    placeholder: true,
  },
  {
    id: "g2",
    title: "Estação de trabalho sob medida",
    category: "Escritório",
    aspectRatio: "3/2",
    placeholder: true,
  },
  {
    id: "g3",
    title: "Reparo e reforço estrutural",
    category: "Manutenção",
    aspectRatio: "1/1",
    placeholder: true,
  },
  {
    id: "g4",
    title: "Projeto personalizado residencial",
    category: "Projetos",
    aspectRatio: "4/3",
    placeholder: true,
  },
  {
    id: "g5",
    title: "Pintura e revestimento premium",
    category: "Reforma",
    aspectRatio: "3/2",
    placeholder: true,
  },
  {
    id: "g6",
    title: "Mobiliário para sala de reuniões",
    category: "Escritório",
    aspectRatio: "16/9",
    placeholder: true,
  },
  {
    id: "g7",
    title: "Ajustes e manutenção preventiva",
    category: "Manutenção",
    aspectRatio: "4/3",
    placeholder: true,
  },
  {
    id: "g8",
    title: "Solução sob medida para condomínio",
    category: "Projetos",
    aspectRatio: "1/1",
    placeholder: true,
  },
  {
    id: "g9",
    title: "Renovação completa de ambiente",
    category: "Reforma",
    aspectRatio: "3/2",
    placeholder: true,
  },
];
