import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Informe seu nome completo.")
    .max(100, "Nome muito longo."),
  email: z.string().email("Informe um e-mail válido."),
  phone: z
    .string()
    .max(20, "Telefone muito longo.")
    .optional()
    .or(z.literal("")),
  service: z.string().min(1, "Selecione um serviço de interesse."),
  message: z
    .string()
    .min(10, "A mensagem deve ter pelo menos 10 caracteres.")
    .max(2000, "Mensagem muito longa."),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const serviceOptions = [
  { value: "reforma", label: "Reforma e revitalização de móveis" },
  { value: "escritorio", label: "Móveis para escritório" },
  { value: "manutencao", label: "Manutenção e ajustes" },
  { value: "projetos", label: "Projetos personalizados" },
  { value: "outro", label: "Outro" },
] as const;
