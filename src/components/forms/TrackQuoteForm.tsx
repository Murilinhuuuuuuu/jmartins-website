"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

const statusLabels: Record<string, string> = { new: "Recebido", under_review: "Em análise", quote_sent: "Orçamento enviado", waiting_customer: "Aguardando cliente", approved: "Aprovado", in_progress: "Em andamento", completed: "Concluído", lost: "Cancelado", cancelled: "Cancelado" };
const inputClass = "w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-base outline-none transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/10";

export function TrackQuoteForm() {
  const [protocol, setProtocol] = useState("");
  const [contact, setContact] = useState("");
  const [result, setResult] = useState<{ protocol: string; status: string; updatedAt: string } | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setMessage(""); setResult(null);
    try { const response = await fetch("/api/quotes/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ protocol: protocol.toUpperCase(), contact }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message); setResult(data); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível localizar a solicitação."); }
    finally { setLoading(false); }
  }

  return <form onSubmit={submit} className="mx-auto max-w-2xl rounded-3xl border border-black/5 bg-white p-7 shadow-sm sm:p-10"><div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="protocol" className="mb-2 block text-sm font-bold">Protocolo</label><input id="protocol" value={protocol} onChange={(event) => setProtocol(event.target.value)} placeholder="JM-000001" className={inputClass} required /></div><div><label htmlFor="contact" className="mb-2 block text-sm font-bold">WhatsApp ou e-mail</label><input id="contact" value={contact} onChange={(event) => setContact(event.target.value)} className={inputClass} required /></div></div><Button type="submit" disabled={loading} className="mt-6 w-full"><Search className="h-4 w-4" />{loading ? "Consultando..." : "Consultar andamento"}</Button>{message && <p className="mt-5 rounded-2xl bg-brand-light p-4 text-sm text-brand-dark/70" role="alert">{message}</p>}{result && <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6"><p className="text-sm font-semibold text-emerald-800">{result.protocol}</p><p className="mt-2 font-heading text-2xl font-bold text-emerald-950">{statusLabels[result.status] ?? result.status}</p><p className="mt-2 text-sm text-emerald-800">Atualizado em {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" }).format(new Date(result.updatedAt))}</p></div>}</form>;
}
