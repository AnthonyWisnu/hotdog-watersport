import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: admin, error } = await supabase
    .from("admin_users")
    .select("user_id,email,display_name,status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (error || !admin) {
    return null;
  }

  return {
    user,
    admin,
  };
}

export async function requireAdmin() {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  return currentAdmin;
}
