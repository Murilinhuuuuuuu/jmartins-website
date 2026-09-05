import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = { title: "Acesso administrativo", robots: { index: false, follow: false } };
export default function LoginPage() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  return <main id="conteudo-principal" className="flex min-h-screen items-center justify-center bg-brand-light px-5 py-24"><AdminLoginForm configured={configured} /></main>;
}
