import { z } from "zod";

const optionalEmail = z.union([
  z.literal(""),
  z.string().trim().email("Informe um e-mail válido.").max(254),
]);

const whatsapp = z
  .string()
  .trim()
  .max(32)
  .refine((value) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 13;
  }, "Informe um WhatsApp válido.");

const postalCode = z
  .string()
  .trim()
  .max(12)
  .refine(
    (value) => value.replace(/\D/g, "").length === 8,
    "Informe um CEP válido.",
  );

const optionalIsoDate = z
  .string()
  .optional()
  .default("")
  .refine((value) => {
    if (!value) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Informe uma data válida.");

const common = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(120),
  whatsapp,
  email: optionalEmail,
  postal_code: postalCode,
  street: z.string().trim().max(160).optional().default(""),
  neighborhood: z.string().trim().max(120).optional().default(""),
  city: z.string().trim().min(2, "Informe a cidade.").max(120),
  state: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{2}$/, "Informe a UF.")
    .transform((value) => value.toUpperCase()),
  quantity: z.coerce.number().int().positive().max(10000),
  chair_type: z.string().trim().min(1, "Informe o tipo de móvel ou cadeira.").max(120),
  desired_date: optionalIsoDate,
  needs_delivery: z.boolean(),
  customer_type: z.enum(["individual", "company", "condominium", "public_body"]),
  company_name: z.string().trim().max(160).optional().default(""),
  cnpj: z.string().trim().max(32).optional().default(""),
});

const repair = common.extend({
  type: z.literal("repair"),
  description: z.string().trim().min(10, "Conte um pouco mais sobre o que precisa.").max(4000),
  services: z.array(z.string().trim().min(1).max(100)).max(20).default([]),
  needs_pickup: z.boolean(),
  budget_range: z.string().trim().max(120).optional().default(""),
});

const purchase = common.extend({
  type: z.literal("purchase"),
  description: z.string().trim().max(4000).optional().default(""),
  services: z.array(z.string().trim().min(1).max(100)).max(20).default([]),
  needs_pickup: z.boolean().optional().default(false),
  budget_range: z.string().trim().min(1, "Informe a faixa de orçamento.").max(120),
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
