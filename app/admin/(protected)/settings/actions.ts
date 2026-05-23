"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  const text = String(formData.get(key) || "").trim();
  return text || null;
}

export async function updateSiteSettings(formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_settings")
    .update({
      hero_title: String(formData.get("hero_title") || "").trim(),
      hero_subtitle: String(formData.get("hero_subtitle") || "").trim(),
      hero_cta_text: String(formData.get("hero_cta_text") || "").trim(),
      hero_secondary_cta_text: String(
        formData.get("hero_secondary_cta_text") || ""
      ).trim(),
      whatsapp_number: value(formData, "whatsapp_number"),
      business_email: value(formData, "business_email"),
      location_city: value(formData, "location_city"),
      location_address: value(formData, "location_address"),
      operating_hours: value(formData, "operating_hours"),
      maps_embed_url: value(formData, "maps_embed_url"),
      instagram_url: value(formData, "instagram_url"),
      facebook_url: value(formData, "facebook_url"),
      tiktok_url: value(formData, "tiktok_url"),
      meta_title: value(formData, "meta_title"),
      meta_description: value(formData, "meta_description"),
      updated_by: user.id,
    })
    .eq("settings_key", "default");

  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/contact");
}

export async function setHeroMedia(mediaAssetId: string) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      hero_media_id: mediaAssetId,
      updated_by: user.id,
    })
    .eq("settings_key", "default");

  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function setOgImage(mediaAssetId: string) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      og_image_id: mediaAssetId,
      updated_by: user.id,
    })
    .eq("settings_key", "default");

  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
