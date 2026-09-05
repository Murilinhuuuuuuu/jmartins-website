export const quoteStatuses = [
  "new",
  "under_review",
  "quote_sent",
  "waiting_customer",
  "approved",
  "in_progress",
  "completed",
  "lost",
  "cancelled",
] as const;

export type QuoteStatus = (typeof quoteStatuses)[number];
export type QuoteType = "repair" | "purchase";

export const quoteStatusLabels: Record<QuoteStatus, string> = {
  new: "Novo",
  under_review: "Em análise",
  quote_sent: "Orçamento enviado",
  waiting_customer: "Aguardando cliente",
  approved: "Aprovado",
  in_progress: "Em execução",
  completed: "Concluído",
  lost: "Não convertido",
  cancelled: "Cancelado",
};

export const quoteStatusClasses: Record<QuoteStatus, string> = {
  new: "bg-blue-50 text-blue-700",
  under_review: "bg-amber-50 text-amber-800",
  quote_sent: "bg-violet-50 text-violet-700",
  waiting_customer: "bg-orange-50 text-orange-800",
  approved: "bg-emerald-50 text-emerald-700",
  in_progress: "bg-cyan-50 text-cyan-800",
  completed: "bg-green-50 text-green-800",
  lost: "bg-zinc-100 text-zinc-700",
  cancelled: "bg-red-50 text-red-700",
};

export const quoteTypeLabels: Record<QuoteType, string> = {
  repair: "Reforma",
  purchase: "Compra",
};

export function isQuoteStatus(value: string): value is QuoteStatus {
  return quoteStatuses.includes(value as QuoteStatus);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

export function formatDate(value: string | null) {
  if (!value) return "Não informado";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}
