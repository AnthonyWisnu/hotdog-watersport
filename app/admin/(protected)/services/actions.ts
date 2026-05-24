"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import {
  getNextSortOrder,
  moveSortOrder,
  parseSortOrder,
  type SortDirection,
} from "@/lib/admin/sort-order";
import {
  parseActiveTaxonomyValues,
  parseNullableActiveTaxonomyValue,
} from "@/lib/cms/taxonomies";
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

function statusValue(formData: FormData): "draft" | "published" | "archived" {
  const status = String(formData.get("status") || "draft");
  return status === "published" || status === "archived" ? status : "draft";
}

async function serviceCategoryValues(formData: FormData) {
  return parseActiveTaxonomyValues(
    formData.getAll("category_labels"),
    "service_category",
    "service category"
  );
}

async function serviceBadgeValue(formData: FormData) {
  return parseNullableActiveTaxonomyValue(
    formData.get("badge"),
    "service_badge",
    "service badge"
  );
}

async function serviceHasCoverImage(serviceId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_media")
    .select("id, media_assets!inner(media_type,status)")
    .eq("service_id", serviceId)
    .eq("media_role", "cover")
    .eq("media_assets.media_type", "image")
    .eq("media_assets.status", "published")
    .limit(1);

  if (error) {
    throw error;
  }

  return Boolean(data && data.length > 0);
}

async function getMediaType(mediaAssetId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("media_type")
    .eq("id", mediaAssetId)
    .single();

  if (error) {
    throw error;
  }

  return data.media_type;
}

export async function createService(formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const status = statusValue(formData);

  if (status === "published") {
    throw new Error("Create the service as draft, attach a cover image, then publish it.");
  }

  const { data, error } = await supabase
    .from("services")
    .insert({
      title: String(formData.get("title") || "").trim(),
      slug: String(formData.get("slug") || "").trim(),
      headline: nullableText(formData.get("headline")),
      description: nullableText(formData.get("description")),
      category_labels: await serviceCategoryValues(formData),
      price: nullableText(formData.get("price")),
      duration: nullableText(formData.get("duration")),
      rating: numberValue(formData.get("rating")),
      badge: await serviceBadgeValue(formData),
      is_popular: formData.get("is_popular") === "on",
      equipment: textArray(formData.get("equipment")),
      rental_info: nullableText(formData.get("rental_info")),
      operational_notes: nullableText(formData.get("operational_notes")),
      whatsapp_message: nullableText(formData.get("whatsapp_message")),
      sort_order: parseSortOrder(
        formData.get("sort_order"),
        await getNextSortOrder("services")
      ),
      status,
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
  const status = statusValue(formData);

  if (status === "published" && !(await serviceHasCoverImage(id))) {
    throw new Error("A service needs one published cover image before it can be published.");
  }

  const { error } = await supabase
    .from("services")
    .update({
      title: String(formData.get("title") || "").trim(),
      slug: String(formData.get("slug") || "").trim(),
      headline: nullableText(formData.get("headline")),
      description: nullableText(formData.get("description")),
      category_labels: await serviceCategoryValues(formData),
      price: nullableText(formData.get("price")),
      duration: nullableText(formData.get("duration")),
      rating: numberValue(formData.get("rating")),
      badge: await serviceBadgeValue(formData),
      is_popular: formData.get("is_popular") === "on",
      equipment: textArray(formData.get("equipment")),
      rental_info: nullableText(formData.get("rental_info")),
      operational_notes: nullableText(formData.get("operational_notes")),
      whatsapp_message: nullableText(formData.get("whatsapp_message")),
      sort_order: parseSortOrder(formData.get("sort_order"), 0),
      status,
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

export async function moveService(id: string, direction: SortDirection) {
  const { user } = await requireAdmin();
  await moveSortOrder("services", id, direction, user.id);

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

export async function linkServiceMedia(
  serviceId: string,
  mediaAssetId: string,
  input: {
    mediaRole?: "cover" | "gallery" | "promo_video";
    altText?: string;
    caption?: string;
  } = {}
) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const mediaRole = input.mediaRole || "gallery";
  const mediaType = await getMediaType(mediaAssetId);

  if (mediaRole === "cover" && mediaType !== "image") {
    throw new Error("Cover media must be an image.");
  }

  if (mediaRole === "promo_video" && mediaType !== "video") {
    throw new Error("Promo media must be a video.");
  }

  if (mediaRole === "cover") {
    const { error: demoteError } = await supabase
      .from("service_media")
      .update({
        media_role: "gallery",
        updated_by: user.id,
      })
      .eq("service_id", serviceId)
      .eq("media_role", "cover");

    if (demoteError) {
      throw demoteError;
    }
  }

  const { error } = await supabase.from("service_media").insert({
    service_id: serviceId,
    media_asset_id: mediaAssetId,
    media_role: mediaRole,
    alt_text: input.altText || null,
    caption: input.caption || null,
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
