import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin(permission = "admin.access") {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    redirect("/admin/login?erro=configuracao");
  }

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;

  if (!userId) {
    redirect("/admin/login");
  }

  const { data: allowed } = await supabase.rpc("current_user_can", {
    required_permission: permission,
  });

  if (!allowed) {
    redirect("/admin/login?erro=permissao");
  }

  return {
    supabase,
    userId,
    email:
      typeof claims.claims.email === "string"
        ? claims.claims.email
        : "Equipe JMartins",
  };
}
