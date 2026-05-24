"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import {
  getNextSortOrder,
  moveSortOrder,
  parseSortOrder,
  type SortDirection,
} from "@/lib/admin/sort-order";
import { parseActiveTaxonomyValue } from "@/lib/cms/taxonomies";
import { createClient } from "@/lib/supabase/server";

function nullableText(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text || null;
}

function statusValue(formData: FormData): "draft" | "published" | "archived" {
  const status = String(formData.get("status") || "draft");
  return status === "published" || status === "archived" ? status : "draft";
}

function validatePublishedGalleryAltText(formData: FormData) {
  const status = statusValue(formData);
  const altText = nullableText(formData.get("alt_text"));

  if (status === "published" && !altText) {
    throw new Error("Published gallery media must include alt text.");
  }

  return { status, altText };
}

async function galleryCategoryValue(formData: FormData) {
  return parseActiveTaxonomyValue(
    formData.get("category"),
    "gallery_category",
    "gallery category",
    "watersport"
  );
}

export async function createGalleryItem(mediaAssetId: string, formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const { status, altText } = validatePublishedGalleryAltText(formData);
  const { error } = await supabase.from("gallery_items").insert({
    media_asset_id: mediaAssetId,
    category: await galleryCategoryValue(formData),
    alt_text: altText,
    caption: nullableText(formData.get("caption")),
    is_featured: formData.get("is_featured") === "on",
    sort_order: parseSortOrder(
      formData.get("sort_order"),
      await getNextSortOrder("gallery_items")
    ),
    status,
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
  const { status, altText } = validatePublishedGalleryAltText(formData);
  const { error } = await supabase
    .from("gallery_items")
    .update({
      category: await galleryCategoryValue(formData),
      alt_text: altText,
      caption: nullableText(formData.get("caption")),
      is_featured: formData.get("is_featured") === "on",
      sort_order: parseSortOrder(formData.get("sort_order"), 0),
      status,
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function moveGalleryItem(id: string, direction: SortDirection) {
  const { user } = await requireAdmin();
  await moveSortOrder("gallery_items", id, direction, user.id);

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function replaceGalleryItemMedia(
  id: string,
  mediaAssetId: string
) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_items")
    .update({
      media_asset_id: mediaAssetId,
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
