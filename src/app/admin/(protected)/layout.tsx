import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/admin/login");
  const { data: allowed } = await supabase.rpc("current_user_can", { required_permission: "admin.access" });
  if (!allowed) redirect("/admin/login?erro=permissao");
  return children;
}
