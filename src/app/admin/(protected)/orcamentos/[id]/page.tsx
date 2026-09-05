import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  UserRound,
} from "lucide-react";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { addQuoteNote, updateQuoteStatus } from "@/app/admin/(protected)/actions";
import { createClient } from "@/lib/supabase/server";
import {
  formatDate,
  formatDateTime,
  quoteStatuses,
  quoteStatusClasses,
  quoteStatusLabels,
  quoteTypeLabels,
  type QuoteStatus,
  type QuoteType,
} from "@/lib/admin/quotes";

type Customer = {
  name: string;
  whatsapp: string;
  email: string | null;
  type: "individual" | "company";
  company_name: string | null;
  cnpj: string | null;
};

type Quote = {
  id: string;
  protocol: string;
  type: QuoteType;
  chair_type: string | null;
  quantity: number;
  problem_description: string | null;
  budget_range: string | null;
  desired_date: string | null;
  needs_pickup: boolean | null;
  needs_delivery: boolean | null;
  postal_code: string | null;
  street: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  source: string;
  status: QuoteStatus;
  created_at: string;
  updated_at: string;
  customer: Customer | null;
};

type Attachment = {
  id: string;
  storage_path: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
  signedUrl?: string;
};

type Note = {
  id: string;
  content: string;
  created_at: string;
  author: { full_name: string } | null;
};

type StatusHistory = {
  id: string;
  from_status: QuoteStatus | null;
  to_status: QuoteStatus;
  created_at: string;
  author: { full_name: string } | null;
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-black/5 py-4 last:border-0">
      <dt className="text-xs font-bold uppercase tracking-wider text-brand-dark/40">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-brand-dark/80">{value || "Não informado"}</dd>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1_024 * 1_024) return `${Math.max(1, Math.round(bytes / 1_024))} KB`;
  return `${(bytes / (1_024 * 1_024)).toFixed(1)} MB`;
}

export default async function QuoteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sucesso?: string }>;
}) {
  const { id } = await params;
  const { sucesso } = await searchParams;
  const supabase = await createClient();

  const [quoteResult, attachmentResult, noteResult, historyResult] = await Promise.all([
    supabase
      .from("quotes")
      .select(
        "id, protocol, type, chair_type, quantity, problem_description, budget_range, desired_date, needs_pickup, needs_delivery, postal_code, street, neighborhood, city, state, source, status, created_at, updated_at, customer:customers(name, whatsapp, email, type, company_name, cnpj)",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("quote_attachments")
      .select("id, storage_path, original_name, mime_type, size_bytes, created_at")
      .eq("quote_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("quote_internal_notes")
      .select("id, content, created_at, author:profiles(full_name)")
      .eq("quote_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("quote_status_history")
      .select("id, from_status, to_status, created_at, author:profiles(full_name)")
      .eq("quote_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!quoteResult.data) {
    notFound();
  }

  const quote = quoteResult.data as unknown as Quote;
  const attachments = (attachmentResult.data ?? []) as Attachment[];
  const notes = (noteResult.data ?? []) as unknown as Note[];
  const history = (historyResult.data ?? []) as unknown as StatusHistory[];

  const attachmentsWithLinks = await Promise.all(
    attachments.map(async (attachment) => {
      const { data } = await supabase.storage
        .from("private-quotes")
        .createSignedUrl(attachment.storage_path, 60 * 30);
      return { ...attachment, signedUrl: data?.signedUrl };
    }),
  );

  const location = [quote.street, quote.neighborhood, quote.city, quote.state]
    .filter(Boolean)
    .join(", ");

  return (
    <main id="conteudo-principal" className="px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin/orcamentos" className="inline-flex items-center gap-2 text-sm font-bold text-brand-dark/55 hover:text-brand-red">
          <ArrowLeft className="h-4 w-4" /> Voltar aos orçamentos
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-red">
              {quoteTypeLabels[quote.type]}
            </p>
            <h1 className="heading-display mt-2 text-3xl sm:text-4xl">{quote.protocol}</h1>
            <p className="mt-3 text-sm text-brand-dark/55">Recebido em {formatDateTime(quote.created_at)}</p>
          </div>
          <span className={`self-start rounded-full px-4 py-2 text-sm font-bold ${quoteStatusClasses[quote.status]}`}>
            {quoteStatusLabels[quote.status]}
          </span>
        </div>

        {sucesso ? (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800" role="status">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {sucesso === "observacao" ? "Observação interna salva." : "Status atualizado com sucesso."}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <UserRound className="h-5 w-5 text-brand-red" />
                <h2 className="font-heading text-xl font-bold">Cliente</h2>
              </div>
              <dl className="mt-5 grid gap-x-8 sm:grid-cols-2">
                <InfoRow label="Nome" value={quote.customer?.name} />
                <InfoRow label="Perfil" value={quote.customer?.type === "company" ? "Empresa" : "Pessoa física"} />
                <InfoRow
                  label="WhatsApp"
                  value={
                    quote.customer?.whatsapp ? (
                      <a className="inline-flex items-center gap-2 text-brand-red hover:underline" href={`https://wa.me/${quote.customer.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                        <Phone className="h-4 w-4" /> {quote.customer.whatsapp}
                      </a>
                    ) : null
                  }
                />
                <InfoRow
                  label="E-mail"
                  value={
                    quote.customer?.email ? (
                      <a className="inline-flex items-center gap-2 text-brand-red hover:underline" href={`mailto:${quote.customer.email}`}>
                        <Mail className="h-4 w-4" /> {quote.customer.email}
                      </a>
                    ) : null
                  }
                />
                {quote.customer?.company_name ? <InfoRow label="Empresa" value={quote.customer.company_name} /> : null}
                {quote.customer?.cnpj ? <InfoRow label="CNPJ" value={quote.customer.cnpj} /> : null}
              </dl>
            </section>

            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-brand-red" />
                <h2 className="font-heading text-xl font-bold">Solicitação</h2>
              </div>
              <dl className="mt-5 grid gap-x-8 sm:grid-cols-2">
                <InfoRow label="Tipo" value={quoteTypeLabels[quote.type]} />
                <InfoRow label="Quantidade" value={`${quote.quantity} unidade(s)`} />
                <InfoRow label="Tipo de cadeira ou móvel" value={quote.chair_type} />
                <InfoRow label="Faixa de investimento" value={quote.budget_range} />
                <InfoRow label="Data desejada" value={formatDate(quote.desired_date)} />
                <InfoRow label="Origem" value={quote.source === "website" ? "Site" : quote.source} />
                <InfoRow label="Precisa de retirada" value={quote.needs_pickup == null ? null : quote.needs_pickup ? "Sim" : "Não"} />
                <InfoRow label="Precisa de entrega" value={quote.needs_delivery == null ? null : quote.needs_delivery ? "Sim" : "Não"} />
              </dl>
              <div className="mt-3 rounded-2xl bg-brand-light p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-dark/40">Descrição</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-brand-dark/75">
                  {quote.problem_description || "Nenhuma descrição informada."}
                </p>
              </div>
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-black/5 p-5">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-dark/40">Local</p>
                  <p className="mt-1 text-sm font-semibold text-brand-dark/75">
                    {location || "Não informado"}{quote.postal_code ? ` — CEP ${quote.postal_code}` : ""}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-brand-red" />
                <h2 className="font-heading text-xl font-bold">Anexos</h2>
              </div>
              {attachmentsWithLinks.length ? (
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {attachmentsWithLinks.map((attachment) => (
                    <li key={attachment.id}>
                      {attachment.signedUrl ? (
                        <a href={attachment.signedUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 rounded-2xl border border-black/8 p-4 transition hover:border-brand-red/30 hover:bg-brand-light">
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold">{attachment.original_name}</span>
                            <span className="mt-1 block text-xs text-brand-dark/45">{formatFileSize(attachment.size_bytes)}</span>
                          </span>
                          <Download className="h-4 w-4 shrink-0 text-brand-red" />
                        </a>
                      ) : (
                        <div className="rounded-2xl border border-black/8 p-4 text-sm text-brand-dark/50">
                          {attachment.original_name} — indisponível
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 rounded-2xl bg-brand-light p-5 text-sm text-brand-dark/55">Nenhum arquivo foi enviado.</p>
              )}
            </section>

            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <MessageSquareText className="h-5 w-5 text-brand-red" />
                <h2 className="font-heading text-xl font-bold">Observações internas</h2>
              </div>
              <form action={addQuoteNote} className="mt-5">
                <input type="hidden" name="quoteId" value={quote.id} />
                <label htmlFor="quote-note" className="sr-only">Nova observação interna</label>
                <textarea id="quote-note" name="content" required minLength={2} maxLength={4000} rows={4} placeholder="Registre uma ligação, prazo combinado ou detalhe importante..." className="w-full resize-y rounded-2xl border border-black/10 p-4 text-base outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10" />
                <AdminSubmitButton className="mt-3" pendingLabel="Salvando observação...">
                  Salvar observação
                </AdminSubmitButton>
              </form>

              {notes.length ? (
                <ol className="mt-7 space-y-4">
                  {notes.map((note) => (
                    <li key={note.id} className="rounded-2xl bg-brand-light p-5">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-brand-dark/75">{note.content}</p>
                      <p className="mt-3 text-xs font-semibold text-brand-dark/45">
                        {note.author?.full_name ?? "Equipe JMartins"} · {formatDateTime(note.created_at)}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : null}
            </section>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-bold">Atualizar atendimento</h2>
              <form action={updateQuoteStatus} className="mt-5">
                <input type="hidden" name="quoteId" value={quote.id} />
                <label htmlFor="quote-status" className="mb-2 block text-sm font-bold">Status atual</label>
                <select id="quote-status" name="status" defaultValue={quote.status} className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10">
                  {quoteStatuses.map((status) => (
                    <option key={status} value={status}>{quoteStatusLabels[status]}</option>
                  ))}
                </select>
                <AdminSubmitButton className="mt-4 w-full" pendingLabel="Atualizando...">
                  Atualizar status
                </AdminSubmitButton>
              </form>
            </section>

            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-brand-red" />
                <h2 className="font-heading text-lg font-bold">Histórico</h2>
              </div>
              <ol className="mt-5 space-y-5 border-l border-black/10 pl-5">
                {history.map((event) => (
                  <li key={event.id} className="relative">
                    <span className="absolute -left-[1.56rem] top-1 h-2.5 w-2.5 rounded-full bg-brand-red ring-4 ring-white" />
                    <p className="text-sm font-bold">{quoteStatusLabels[event.to_status]}</p>
                    <p className="mt-1 text-xs text-brand-dark/45">
                      {formatDateTime(event.created_at)} · {event.author?.full_name ?? "Sistema"}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
