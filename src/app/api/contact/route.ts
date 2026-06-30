import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema, serviceOptions } from "@/lib/validations/contact";

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const lastRequest = rateLimitMap.get(ip);
  const now = Date.now();

  if (lastRequest && now - lastRequest < RATE_LIMIT_MS) {
    return true;
  }

  rateLimitMap.set(ip, now);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: "Aguarde um momento antes de enviar outra mensagem.",
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dados inválidos. Verifique os campos e tente novamente.",
        },
        { status: 400 },
      );
    }

    const { name, email, phone, service, message } = parsed.data;
    const serviceLabel =
      serviceOptions.find((s) => s.value === service)?.label ?? service;

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL ?? "jmartins.expressao@gmail.com";
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Serviço de e-mail não configurado. Configure RESEND_API_KEY no arquivo .env.local.",
        },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: `JMartins Móveis <${fromEmail}>`,
      to: [toEmail],
      replyTo: email,
      subject: `Novo contato via site — ${serviceLabel}`,
      html: `
        <h2>Novo contato via site institucional</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone || "Não informado"}</p>
        <p><strong>Serviço:</strong> ${serviceLabel}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Mensagem enviada com sucesso.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao enviar mensagem. Tente novamente mais tarde.",
      },
      { status: 500 },
    );
  }
}
