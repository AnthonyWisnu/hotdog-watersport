"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

function nullableText(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text || null;
}

export async function createGalleryItem(mediaAssetId: string, formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_items").insert({
    media_asset_id: mediaAssetId,
    category: String(formData.get("category") || "watersport"),
    alt_text: nullableText(formData.get("alt_text")),
    caption: nullableText(formData.get("caption")),
    is_featured: formData.get("is_featured") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
    status: String(formData.get("status") || "draft") as "draft" | "published" | "archived",
    created_by: user.id,
    updated_by: user.id,
  });

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function updateGalleryItem(id: string, formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_items")
    .update({
      category: String(formData.get("category") || "watersport"),
      alt_text: nullableText(formData.get("alt_text")),
      caption: nullableText(formData.get("caption")),
      is_featured: formData.get("is_featured") === "on",
      sort_order: Number(formData.get("sort_order") || 0),
      status: String(formData.get("status") || "draft") as "draft" | "published" | "archived",
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryItem(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}
