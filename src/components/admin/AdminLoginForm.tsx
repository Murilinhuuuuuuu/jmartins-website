"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

const inputClass = "w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-base outline-none transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/10";

export function AdminLoginForm({ configured = true }: { configured?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent) { event.preventDefault(); if (!configured) return; setLoading(true); setMessage(""); const { error } = await createClient().auth.signInWithPassword({ email, password }); setLoading(false); if (error) return setMessage("Não foi possível entrar. Verifique os dados e tente novamente."); router.push("/admin/dashboard"); router.refresh(); }
  async function recover() { if (!configured) return; if (!email) return setMessage("Informe seu e-mail para recuperar a senha."); const { error } = await createClient().auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/redefinir-senha` }); setMessage(error ? "Não foi possível iniciar a recuperação." : "Se o e-mail estiver cadastrado, você receberá as instruções."); }
  return <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 shadow-xl"><span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-brand-red text-white"><LockKeyhole className="h-6 w-6" /></span><h1 className="heading-display mt-7 text-3xl">Acesso administrativo</h1><p className="mt-3 text-sm leading-relaxed text-brand-dark/60">Área protegida para a equipe JMartins.</p>{!configured ? <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900" role="status">O painel está aguardando a configuração segura da conexão com o banco de dados.</p> : null}<div className="mt-8 space-y-5"><div><label htmlFor="admin-email" className="mb-2 block text-sm font-bold">E-mail</label><input id="admin-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} required disabled={!configured} /></div><div><label htmlFor="admin-password" className="mb-2 block text-sm font-bold">Senha</label><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} required disabled={!configured} /></div></div><Button type="submit" disabled={loading || !configured} className="mt-7 w-full">{loading ? "Entrando..." : "Entrar"}</Button><button type="button" onClick={recover} disabled={!configured} className="mt-5 w-full text-center text-sm font-semibold text-brand-red disabled:text-brand-dark/30">Esqueci minha senha</button>{message && <p className="mt-5 rounded-2xl bg-brand-light p-4 text-sm text-brand-dark/70" role="status">{message}</p>}</form>;
}
