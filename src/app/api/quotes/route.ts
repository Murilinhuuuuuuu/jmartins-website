import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { quoteSchema } from "@/features/quotes/schema";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function fingerprint(request: NextRequest) {
  const raw = [request.headers.get("x-forwarded-for")?.split(",")[0], request.headers.get("user-agent"), process.env.RATE_LIMIT_SALT ?? "jmartins"].join("|");
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ message: "Envie os dados em formato JSON." }, 415);
  }

  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch {
    return json({ message: "Dados inválidos." }, 400);
  }

  try {
    const parsed = quoteSchema.safeParse(rawPayload);
    if (!parsed.success) return json({ message: parsed.error.issues[0]?.message ?? "Revise os campos." }, 400);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return json({ message: "Serviço temporariamente indisponível." }, 503);
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase.rpc("submit_quote", { payload: parsed.data, fingerprint: await fingerprint(request) });
    if (error || !data?.[0]) {
      const status = error?.message.includes("rate limit") ? 429 : 500;
      return json({ message: status === 429 ? "Aguarde alguns minutos antes de tentar novamente." : "Não foi possível registrar a solicitação." }, status);
    }

    const { protocol, upload_token: uploadToken } = data[0] as { protocol: string; upload_token: string };

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
      const summary = `Protocolo: ${protocol}\nTipo: ${parsed.data.type === "repair" ? "Reforma" : "Compra"}\nNome: ${parsed.data.name}\nWhatsApp: ${parsed.data.whatsapp}\nCidade: ${parsed.data.city}/${parsed.data.state}`;
      await resend.emails.send({ from: `JMartins Móveis <${from}>`, to: [process.env.CONTACT_TO_EMAIL ?? "juliflex1988@gmail.com"], subject: `Novo orçamento ${protocol}`, text: summary }).catch(() => undefined);
      if (parsed.data.email) await resend.emails.send({ from: `JMartins Móveis <${from}>`, to: [parsed.data.email], subject: `Recebemos sua solicitação ${protocol}`, text: `Olá, ${parsed.data.name}. Recebemos sua solicitação. Seu protocolo é ${protocol}. Nossa equipe analisará e retornará em até 24 horas.` }).catch(() => undefined);
    }

    return json({ protocol, uploadToken });
  } catch {
    return json({ message: "Não foi possível enviar agora. Tente novamente." }, 500);
  }
}
