import assert from "node:assert/strict";
import test from "node:test";
import { quoteSchema } from "./schema.ts";

const repairPayload = {
  type: "repair",
  name: "Cliente Teste",
  whatsapp: "(11) 99999-9999",
  email: "",
  postal_code: "01211-100",
  street: "Av. São João",
  neighborhood: "Santa Cecília",
  city: "São Paulo",
  state: "sp",
  quantity: 1,
  chair_type: "Cadeira",
  description: "Precisa trocar o revestimento.",
  services: ["Tecido / revestimento"],
  desired_date: "",
  needs_pickup: true,
  needs_delivery: true,
  customer_type: "individual",
  company_name: "",
  cnpj: "",
  budget_range: "",
};

test("aceita uma solicitação de reforma válida e normaliza a UF", () => {
  const result = quoteSchema.safeParse(repairPayload);
  assert.equal(result.success, true);
  assert.equal(result.data.state, "SP");
});

test("rejeita WhatsApp, CEP e data inválidos", () => {
  for (const change of [
    { whatsapp: "abcdefghij" },
    { postal_code: "abcdefgh" },
    { desired_date: "2026-02-30" },
  ]) {
    assert.equal(quoteSchema.safeParse({ ...repairPayload, ...change }).success, false);
  }
});

test("exige empresa e CNPJ em compra para pessoa jurídica", () => {
  const result = quoteSchema.safeParse({
    ...repairPayload,
    type: "purchase",
    description: "",
    services: [],
    customer_type: "company",
    company_name: "",
    cnpj: "",
    budget_range: "Preciso de orientação",
  });
  assert.equal(result.success, false);
});

test("limita a quantidade de serviços enviados", () => {
  const services = Array.from({ length: 21 }, (_, index) => "Serviço " + index);
  assert.equal(quoteSchema.safeParse({ ...repairPayload, services }).success, false);
});
