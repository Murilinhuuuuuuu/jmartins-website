import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { quoteSchema } from "@/features/quotes/schema";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "video/mp4", "video/quicktime", "application/pdf"]);

function sizeLimit(type: string) {
  if (type.startsWith("image/")) return 15 * 1024 * 1024;
  if (type.startsWith("video/")) return 80 * 1024 * 1024;
  return 20 * 1024 * 1024;
}

async function fingerprint(request: NextRequest) {
  const raw = [request.headers.get("x-forwarded-for")?.split(",")[0], request.headers.get("user-agent"), process.env.RATE_LIMIT_SALT ?? "jmartins"].join("|");
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const rawPayload = formData.get("payload");
    if (typeof rawPayload !== "string") return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
    const parsed = quoteSchema.safeParse(JSON.parse(rawPayload));
    if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Revise os campos." }, { status: 400 });

    const files = formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
    if (files.length > 20) return NextResponse.json({ message: "Envie no máximo 20 anexos." }, { status: 400 });
    for (const file of files) {
      if (!allowedTypes.has(file.type) || file.size > sizeLimit(file.type)) return NextResponse.json({ message: `O arquivo ${file.name} não atende aos limites permitidos.` }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return NextResponse.json({ message: "Serviço temporariamente indisponível." }, { status: 503 });
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase.rpc("submit_quote", { payload: parsed.data, fingerprint: await fingerprint(request) });
    if (error || !data?.[0]) {
      const status = error?.message.includes("rate limit") ? 429 : 500;
      return NextResponse.json({ message: status === 429 ? "Aguarde alguns minutos antes de tentar novamente." : "Não foi possível registrar a solicitação." }, { status });
    }

    const { protocol, upload_token: uploadToken } = data[0] as { protocol: string; upload_token: string };
    let attachmentWarning = "";
    for (const file of files) {
      const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
      const path = `${uploadToken}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("private-quotes").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) { attachmentWarning = "A solicitação foi recebida, mas um ou mais anexos não puderam ser enviados."; continue; }
      const { data: registered } = await supabase.rpc("register_quote_attachment", { upload_token: uploadToken, storage_path: path, original_name: file.name, mime_type: file.type, size_bytes: file.size });
      if (!registered) attachmentWarning = "A solicitação foi recebida, mas um ou mais anexos não puderam ser vinculados.";
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
      const summary = `Protocolo: ${protocol}\nTipo: ${parsed.data.type === "repair" ? "Reforma" : "Compra"}\nNome: ${parsed.data.name}\nWhatsApp: ${parsed.data.whatsapp}\nCidade: ${parsed.data.city}/${parsed.data.state}`;
      await resend.emails.send({ from: `JMartins Móveis <${from}>`, to: [process.env.CONTACT_TO_EMAIL ?? "juliflex1988@gmail.com"], subject: `Novo orçamento ${protocol}`, text: summary }).catch(() => undefined);
      if (parsed.data.email) await resend.emails.send({ from: `JMartins Móveis <${from}>`, to: [parsed.data.email], subject: `Recebemos sua solicitação ${protocol}`, text: `Olá, ${parsed.data.name}. Recebemos sua solicitação. Seu protocolo é ${protocol}. Nossa equipe analisará e retornará em até 24 horas.` }).catch(() => undefined);
    }

    return NextResponse.json({ protocol, attachmentWarning });
  } catch {
    return NextResponse.json({ message: "Não foi possível enviar agora. Tente novamente." }, { status: 500 });
  }
}
