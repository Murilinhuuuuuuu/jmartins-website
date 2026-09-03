import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ protocol: z.string().regex(/^JM-\d{6}$/i), contact: z.string().min(5).max(160) });

async function fingerprint(request: NextRequest) {
  const raw = [request.headers.get("x-forwarded-for")?.split(",")[0], request.headers.get("user-agent"), process.env.RATE_LIMIT_SALT ?? "jmartins-track"].join("|");
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: "Não foi possível localizar a solicitação." }, { status: 400 });
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return NextResponse.json({ message: "Não foi possível localizar a solicitação." }, { status: 503 });
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase.rpc("track_quote", { public_protocol: parsed.data.protocol, contact_value: parsed.data.contact, fingerprint: await fingerprint(request) });
    if (error?.message.includes("rate limit")) return NextResponse.json({ message: "Aguarde alguns minutos antes de tentar novamente." }, { status: 429 });
    if (error || !data?.[0]) return NextResponse.json({ message: "Não foi possível localizar a solicitação." }, { status: 404 });
    return NextResponse.json({ protocol: data[0].protocol, status: data[0].status, updatedAt: data[0].updated_at });
  } catch {
    return NextResponse.json({ message: "Não foi possível localizar a solicitação." }, { status: 400 });
  }
}
