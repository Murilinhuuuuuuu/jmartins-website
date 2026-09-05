"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { quoteStatuses } from "@/lib/admin/quotes";

const quoteStatusSchema = z.object({
  quoteId: z.string().uuid(),
  status: z.enum(quoteStatuses),
});

const quoteNoteSchema = z.object({
  quoteId: z.string().uuid(),
  content: z.string().trim().min(2).max(4_000),
});

export async function updateQuoteStatus(formData: FormData) {
  const parsed = quoteStatusSchema.safeParse({
    quoteId: formData.get("quoteId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    throw new Error("Status inválido.");
  }

  const { supabase } = await requireAdmin("quotes.manage");
  const { error } = await supabase.rpc("admin_update_quote_status", {
    request_quote_id: parsed.data.quoteId,
    request_status: parsed.data.status,
  });

  if (error) {
    throw new Error("Não foi possível atualizar o status.");
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/orcamentos");
  revalidatePath(`/admin/orcamentos/${parsed.data.quoteId}`);
  redirect(`/admin/orcamentos/${parsed.data.quoteId}?sucesso=status`);
}

export async function addQuoteNote(formData: FormData) {
  const parsed = quoteNoteSchema.safeParse({
    quoteId: formData.get("quoteId"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    throw new Error("Escreva uma observação válida.");
  }

  const { supabase, userId } = await requireAdmin("quotes.manage");
  const { error } = await supabase.from("quote_internal_notes").insert({
    quote_id: parsed.data.quoteId,
    author_id: userId,
    content: parsed.data.content,
  });

  if (error) {
    throw new Error("Não foi possível salvar a observação.");
  }

  revalidatePath(`/admin/orcamentos/${parsed.data.quoteId}`);
  redirect(`/admin/orcamentos/${parsed.data.quoteId}?sucesso=observacao`);
}

export async function signOutAdmin() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
