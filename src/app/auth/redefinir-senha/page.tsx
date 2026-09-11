import type { Metadata } from "next";
import { SetPasswordForm } from "@/components/admin/SetPasswordForm";

export const metadata: Metadata = {
  title: "Definir senha administrativa",
  robots: { index: false, follow: false },
};

export default function SetPasswordPage() {
  return (
    <main
      id="conteudo-principal"
      className="flex min-h-screen items-center justify-center bg-brand-light px-5 py-24"
    >
      <SetPasswordForm />
    </main>
  );
}
