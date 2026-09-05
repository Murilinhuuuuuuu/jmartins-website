import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Wrench,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import {
  formatDateTime,
  quoteStatusClasses,
  quoteStatusLabels,
  quoteTypeLabels,
  type QuoteStatus,
  type QuoteType,
} from "@/lib/admin/quotes";

type RecentQuote = {
  id: string;
  protocol: string;
  type: QuoteType;
  status: QuoteStatus;
  created_at: string;
  customer: { name: string } | null;
};

async function getDashboardData() {
  const { supabase } = await requireAdmin();
  const [newQuotes, activeQuotes, approvedQuotes, completedQuotes, recentQuotes] =
    await Promise.all([
      supabase.from("quotes").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase
        .from("quotes")
        .select("id", { count: "exact", head: true })
        .in("status", ["under_review", "quote_sent", "waiting_customer", "in_progress"]),
      supabase.from("quotes").select("id", { count: "exact", head: true }).eq("status", "approved"),
      supabase.from("quotes").select("id", { count: "exact", head: true }).eq("status", "completed"),
      supabase
        .from("quotes")
        .select("id, protocol, type, status, created_at, customer:customers(name)")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

  return {
    counts: {
      new: newQuotes.count ?? 0,
      active: activeQuotes.count ?? 0,
      approved: approvedQuotes.count ?? 0,
      completed: completedQuotes.count ?? 0,
    },
    recent: (recentQuotes.data ?? []) as unknown as RecentQuote[],
  };
}

export default async function DashboardPage() {
  const { counts, recent } = await getDashboardData();
  const cards = [
    { label: "Novos orçamentos", value: counts.new, icon: ClipboardList, tone: "bg-blue-50 text-blue-700" },
    { label: "Em andamento", value: counts.active, icon: Clock3, tone: "bg-amber-50 text-amber-800" },
    { label: "Aprovados", value: counts.approved, icon: Wrench, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Concluídos", value: counts.completed, icon: CheckCircle2, tone: "bg-green-50 text-green-800" },
  ];

  return (
    <main id="conteudo-principal" className="px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-red">
          Administração
        </p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="heading-display text-3xl sm:text-4xl">Visão geral</h1>
            <p className="mt-3 text-brand-dark/60">
              Acompanhe as solicitações recebidas e os próximos atendimentos.
            </p>
          </div>
          <Link
            href="/admin/orcamentos"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-brand-red px-5 py-3 font-heading text-sm font-bold text-white"
          >
            Ver orçamentos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <section className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores">
          {cards.map(({ label, value, icon: Icon, tone }) => (
            <article key={label} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-7 text-sm font-semibold text-brand-dark/55">{label}</p>
              <p className="mt-1 font-heading text-4xl font-bold">{value}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
            <div>
              <h2 className="font-heading text-xl font-bold">Solicitações recentes</h2>
              <p className="mt-1 text-sm text-brand-dark/50">Últimos orçamentos enviados pelo site.</p>
            </div>
            <Link href="/admin/orcamentos" className="text-sm font-bold text-brand-red hover:underline">
              Ver todos
            </Link>
          </div>

          {recent.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left">
                <thead className="bg-brand-light/70 text-xs uppercase tracking-wider text-brand-dark/45">
                  <tr>
                    <th className="px-6 py-3 font-bold">Protocolo</th>
                    <th className="px-6 py-3 font-bold">Cliente</th>
                    <th className="px-6 py-3 font-bold">Tipo</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                    <th className="px-6 py-3 font-bold">Recebido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {recent.map((quote) => (
                    <tr key={quote.id} className="transition hover:bg-brand-light/45">
                      <td className="px-6 py-4">
                        <Link href={`/admin/orcamentos/${quote.id}`} className="font-heading text-sm font-bold text-brand-red hover:underline">
                          {quote.protocol}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">{quote.customer?.name ?? "Cliente"}</td>
                      <td className="px-6 py-4 text-sm text-brand-dark/65">{quoteTypeLabels[quote.type]}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${quoteStatusClasses[quote.status]}`}>
                          {quoteStatusLabels[quote.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-brand-dark/55">{formatDateTime(quote.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-14 text-center">
              <ClipboardList className="mx-auto h-8 w-8 text-brand-dark/25" />
              <p className="mt-4 font-heading font-bold">Nenhuma solicitação recebida ainda</p>
              <p className="mt-2 text-sm text-brand-dark/50">Os novos orçamentos aparecerão aqui.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
