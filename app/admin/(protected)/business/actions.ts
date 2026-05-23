"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  const text = String(formData.get(key) || "").trim();
  return text || null;
}

export async function updateBusinessProfile(formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("business_profile")
    .update({
      business_name: String(formData.get("business_name") || "").trim(),
      tagline: value(formData, "tagline"),
      brand_story: value(formData, "brand_story"),
      about_text: value(formData, "about_text"),
      safety_commitment: value(formData, "safety_commitment"),
      updated_by: user.id,
    })
    .eq("profile_key", "default");

  if (error) {
    throw error;
  }

  revalidatePath("/about");
}
