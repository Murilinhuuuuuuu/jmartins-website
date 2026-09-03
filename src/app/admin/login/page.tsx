import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = { title: "Acesso administrativo", robots: { index: false, follow: false } };
export default function LoginPage() { return <main id="conteudo-principal" className="flex min-h-screen items-center justify-center bg-brand-light px-5 py-24"><AdminLoginForm /></main>; }
