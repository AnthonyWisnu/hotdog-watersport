"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

function nullableText(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text || null;
}

export async function createTestimonial(formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({
    guest_name: String(formData.get("guest_name") || "").trim(),
    guest_origin: nullableText(formData.get("guest_origin")),
    rating: Number(formData.get("rating") || 5),
    review: String(formData.get("review") || "").trim(),
    reviewed_at: nullableText(formData.get("reviewed_at")),
    is_featured: formData.get("is_featured") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
    status: String(formData.get("status") || "draft") as "draft" | "published" | "archived",
    created_by: user.id,
    updated_by: user.id,
  });

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function updateTestimonial(id: string, formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .update({
      guest_name: String(formData.get("guest_name") || "").trim(),
      guest_origin: nullableText(formData.get("guest_origin")),
      rating: Number(formData.get("rating") || 5),
      review: String(formData.get("review") || "").trim(),
      reviewed_at: nullableText(formData.get("reviewed_at")),
      is_featured: formData.get("is_featured") === "on",
      sort_order: Number(formData.get("sort_order") || 0),
      status: String(formData.get("status") || "draft") as "draft" | "published" | "archived",
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function setTestimonialImage(id: string, mediaAssetId: string) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .update({ image_asset_id: mediaAssetId, updated_by: user.id })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}
