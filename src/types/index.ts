export type GalleryCategory =
  | "Todos"
  | "Reforma"
  | "Escritório"
  | "Manutenção"
  | "Projetos";

export type AspectRatio = "16/9" | "4/3" | "3/2" | "4/5" | "1/1";

export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Differential {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProcessStep {
  id: string;
  step: number;
  title: string;
  description: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, "Todos">;
  aspectRatio: AspectRatio;
  placeholder: true;
  src?: never;
}

export interface ContactInfo {
  phone: string;
  phoneHref: string;
  whatsapp: string;
  whatsappHref: string;
  email: string;
  address: string;
  addressLine: string;
}
