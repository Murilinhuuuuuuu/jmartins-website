"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-base outline-none transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/10";

export function SetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Validando seu convite...");

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const checkSession = async () => {
      const currentUrl = new URL(window.location.href);
      const authError = currentUrl.searchParams.get("error_description");
      const code = currentUrl.searchParams.get("code");
      const hash = new URLSearchParams(currentUrl.hash.replace(/^#/, ""));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      if (authError) {
        if (!active) return;
        setMessage("Este link expirou ou já foi utilizado. Solicite um novo link na tela de acesso.");
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error && active) {
          setMessage("Não foi possível validar este link neste navegador. Solicite outro link e abra-o no mesmo aparelho.");
          return;
        }
      } else if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error && active) {
          setMessage("Este link expirou ou já foi utilizado. Solicite um novo link na tela de acesso.");
          return;
        }
      }

      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      const hasSession = Boolean(data.session) && !error;
      setReady(hasSession);
      setMessage(
        hasSession
          ? "Convite confirmado. Crie sua senha para acessar o painel."
          : "Este link é inválido ou expirou. Solicite um novo link na tela de acesso.",
      );

      if (hasSession && (code || currentUrl.hash)) {
        window.history.replaceState({}, "", currentUrl.pathname);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active || !session) return;
      setReady(true);
      setMessage("Convite confirmado. Crie sua senha para acessar o painel.");
    });

    void checkSession();

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmation) {
      setMessage("As senhas informadas não são iguais.");
      return;
    }

    setLoading(true);
    const { error } = await createClient().auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMessage("Não foi possível salvar a senha. Solicite um novo link e tente novamente.");
      return;
    }

    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 shadow-xl"
    >
      <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-brand-red text-white">
        <KeyRound className="h-6 w-6" />
      </span>
      <p className="mt-7 font-heading text-sm font-bold uppercase tracking-[0.16em] text-brand-red">
        Acesso administrativo
      </p>
      <h1 className="heading-display mt-2 text-3xl">Defina sua senha</h1>
      <p className="mt-3 text-sm leading-relaxed text-brand-dark/60">{message}</p>

      {ready ? (
        <div className="mt-8 space-y-5">
          <div>
            <label htmlFor="new-password" className="mb-2 block text-sm font-bold">
              Nova senha
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-sm font-bold">
              Confirmar senha
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className={inputClass}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Salvando..." : "Salvar senha e entrar"}
          </Button>
        </div>
      ) : (
        <Button href="/admin/login" variant="secondary" className="mt-7 w-full">
          Voltar ao acesso administrativo
        </Button>
      )}
    </form>
  );
}
