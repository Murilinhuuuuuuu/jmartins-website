import { z } from "zod";

const optionalEmail = z.union([z.literal(""), z.string().email("Informe um e-mail válido.")]);

const common = z.object({
  name: z.string().trim().min(2, "Informe seu nome."),
  whatsapp: z.string().min(10, "Informe um WhatsApp válido."),
  email: optionalEmail,
  postal_code: z.string().min(8, "Informe o CEP."),
  street: z.string().trim().optional().default(""),
  neighborhood: z.string().trim().optional().default(""),
  city: z.string().trim().min(2, "Informe a cidade."),
  state: z.string().trim().length(2, "Informe a UF."),
  quantity: z.coerce.number().int().positive().max(10000),
  chair_type: z.string().trim().min(1, "Informe o tipo de móvel ou cadeira."),
  desired_date: z.string().optional().default(""),
  needs_delivery: z.boolean(),
  customer_type: z.enum(["individual", "company", "condominium", "public_body"]),
  company_name: z.string().trim().optional().default(""),
  cnpj: z.string().trim().optional().default(""),
});

const repair = common.extend({
  type: z.literal("repair"),
  description: z.string().trim().min(10, "Conte um pouco mais sobre o que precisa."),
  services: z.array(z.string()).default([]),
  needs_pickup: z.boolean(),
  budget_range: z.string().optional().default(""),
});

const purchase = common.extend({
  type: z.literal("purchase"),
  description: z.string().trim().optional().default(""),
  services: z.array(z.string()).default([]),
  needs_pickup: z.boolean().optional().default(false),
  budget_range: z.string().trim().min(1, "Informe a faixa de orçamento."),
}).superRefine((value, context) => {
  if (["company", "public_body"].includes(value.customer_type) && !value.company_name) {
    context.addIssue({ code: "custom", path: ["company_name"], message: "Informe o nome da empresa ou órgão." });
  }
  if (["company", "public_body"].includes(value.customer_type) && value.cnpj.replace(/\D/g, "").length !== 14) {
    context.addIssue({ code: "custom", path: ["cnpj"], message: "Informe um CNPJ válido." });
  }
});

export const quoteSchema = z.union([repair, purchase]);
export type QuotePayload = z.infer<typeof quoteSchema>;
