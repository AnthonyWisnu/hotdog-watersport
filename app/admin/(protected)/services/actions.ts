"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

function textArray(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function nullableText(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text.length > 0 ? text : null;
}

function numberValue(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text ? Number(text) : null;
}

export async function createService(formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .insert({
      title: String(formData.get("title") || "").trim(),
      slug: String(formData.get("slug") || "").trim(),
      headline: nullableText(formData.get("headline")),
      description: nullableText(formData.get("description")),
      category_labels: textArray(formData.get("category_labels")),
      price: nullableText(formData.get("price")),
      duration: nullableText(formData.get("duration")),
      rating: numberValue(formData.get("rating")),
      badge: nullableText(formData.get("badge")),
      is_popular: formData.get("is_popular") === "on",
      equipment: textArray(formData.get("equipment")),
      rental_info: nullableText(formData.get("rental_info")),
      operational_notes: nullableText(formData.get("operational_notes")),
      whatsapp_message: nullableText(formData.get("whatsapp_message")),
      sort_order: Number(formData.get("sort_order") || 0),
      status: String(formData.get("status") || "draft") as "draft" | "published" | "archived",
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/services");
  redirect(`/admin/services/${data.id}`);
}

export async function updateService(id: string, formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("services")
    .update({
      title: String(formData.get("title") || "").trim(),
      slug: String(formData.get("slug") || "").trim(),
      headline: nullableText(formData.get("headline")),
      description: nullableText(formData.get("description")),
      category_labels: textArray(formData.get("category_labels")),
      price: nullableText(formData.get("price")),
      duration: nullableText(formData.get("duration")),
      rating: numberValue(formData.get("rating")),
      badge: nullableText(formData.get("badge")),
      is_popular: formData.get("is_popular") === "on",
      equipment: textArray(formData.get("equipment")),
      rental_info: nullableText(formData.get("rental_info")),
      operational_notes: nullableText(formData.get("operational_notes")),
      whatsapp_message: nullableText(formData.get("whatsapp_message")),
      sort_order: Number(formData.get("sort_order") || 0),
      status: String(formData.get("status") || "draft") as "draft" | "published" | "archived",
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function deleteService(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/services");
  redirect("/admin/services");
}

export async function linkServiceMedia(serviceId: string, mediaAssetId: string) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("service_media").insert({
    service_id: serviceId,
    media_asset_id: mediaAssetId,
    media_role: "gallery",
    created_by: user.id,
    updated_by: user.id,
  });

  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath(`/admin/services/${serviceId}`);
}
