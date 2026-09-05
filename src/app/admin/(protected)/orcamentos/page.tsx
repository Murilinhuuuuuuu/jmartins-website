import Link from "next/link";
import { ClipboardList, Search } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import {
  formatDateTime,
  isQuoteStatus,
  quoteStatuses,
  quoteStatusClasses,
  quoteStatusLabels,
  quoteTypeLabels,
  type QuoteStatus,
  type QuoteType,
} from "@/lib/admin/quotes";
import { cn } from "@/lib/utils";

type QuoteListItem = {
  id: string;
  protocol: string;
  type: QuoteType;
  status: QuoteStatus;
  quantity: number;
  city: string | null;
  state: string | null;
  created_at: string;
  customer: {
    name: string;
    whatsapp: string;
    email: string | null;
    company_name: string | null;
  } | null;
};

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string; status?: string }>;
}) {
  const params = await searchParams;
  const search = params.busca?.trim().toLocaleLowerCase("pt-BR") ?? "";
  const selectedStatus = params.status && isQuoteStatus(params.status) ? params.status : "";
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("quotes")
    .select(
      "id, protocol, type, status, quantity, city, state, created_at, customer:customers(name, whatsapp, email, company_name)",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (selectedStatus) {
    query = query.eq("status", selectedStatus);
  }

  const { data } = await query;
  const quotes = ((data ?? []) as unknown as QuoteListItem[]).filter((quote) => {
    if (!search) return true;
    const searchable = [
      quote.protocol,
      quote.customer?.name,
      quote.customer?.whatsapp,
      quote.customer?.email,
      quote.customer?.company_name,
      quote.city,
      quote.state,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("pt-BR");
    return searchable.includes(search);
  });

  return (
    <main id="conteudo-principal" className="px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-red">
          Atendimento
        </p>
        <h1 className="heading-display mt-2 text-3xl sm:text-4xl">Orçamentos</h1>
        <p className="mt-3 text-brand-dark/60">
          Consulte dados, anexos, histórico e observações internas de cada solicitação.
        </p>

        <section className="mt-8 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
          <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]" method="get">
            <label className="relative">
              <span className="sr-only">Buscar orçamento</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-dark/35" />
              <input
                type="search"
                name="busca"
                defaultValue={params.busca ?? ""}
                placeholder="Protocolo, cliente, telefone ou e-mail"
                className="w-full rounded-xl border border-black/10 py-3 pl-12 pr-4 text-base outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
              />
            </label>
            <label>
              <span className="sr-only">Filtrar por status</span>
              <select
                name="status"
                defaultValue={selectedStatus}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
              >
                <option value="">Todos os status</option>
                {quoteStatuses.map((status) => (
                  <option key={status} value={status}>
                    {quoteStatusLabels[status]}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="rounded-xl bg-brand-dark px-6 py-3 font-heading text-sm font-bold text-white">
              Filtrar
            </button>
          </form>
        </section>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-brand-dark/55">
            {quotes.length} {quotes.length === 1 ? "solicitação" : "solicitações"}
          </p>
          {search || selectedStatus ? (
            <Link href="/admin/orcamentos" className="text-sm font-bold text-brand-red hover:underline">
              Limpar filtros
            </Link>
          ) : null}
        </div>

        <section className="mt-4 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
          {quotes.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-brand-light/70 text-xs uppercase tracking-wider text-brand-dark/45">
                  <tr>
                    <th className="px-6 py-3 font-bold">Protocolo</th>
                    <th className="px-6 py-3 font-bold">Cliente</th>
                    <th className="px-6 py-3 font-bold">Tipo</th>
                    <th className="px-6 py-3 font-bold">Local</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                    <th className="px-6 py-3 font-bold">Recebido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="transition hover:bg-brand-light/45">
                      <td className="px-6 py-4 align-top">
                        <Link href={`/admin/orcamentos/${quote.id}`} className="font-heading text-sm font-bold text-brand-red hover:underline">
                          {quote.protocol}
                        </Link>
                        <p className="mt-1 text-xs text-brand-dark/45">{quote.quantity} unidade(s)</p>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <p className="text-sm font-bold">{quote.customer?.name ?? "Cliente"}</p>
                        <p className="mt-1 text-xs text-brand-dark/50">{quote.customer?.whatsapp ?? "—"}</p>
                      </td>
                      <td className="px-6 py-4 align-top text-sm text-brand-dark/65">{quoteTypeLabels[quote.type]}</td>
                      <td className="px-6 py-4 align-top text-sm text-brand-dark/65">
                        {[quote.city, quote.state].filter(Boolean).join("/") || "Não informado"}
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className={cn("rounded-full px-3 py-1.5 text-xs font-bold", quoteStatusClasses[quote.status])}>
                          {quoteStatusLabels[quote.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top text-sm text-brand-dark/55">{formatDateTime(quote.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <ClipboardList className="mx-auto h-9 w-9 text-brand-dark/25" />
              <p className="mt-4 font-heading text-lg font-bold">Nenhum orçamento encontrado</p>
              <p className="mt-2 text-sm text-brand-dark/50">Ajuste os filtros ou aguarde uma nova solicitação.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
