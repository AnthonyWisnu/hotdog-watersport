"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { SITE_MEDIA_BUCKET, type MediaStatus } from "@/lib/media/config";
import { createClient } from "@/lib/supabase/server";
import { getMediaUsageForAsset } from "@/lib/cms/media";

function value(formData: FormData, key: string) {
  const text = String(formData.get(key) || "").trim();
  return text || null;
}

function statusValue(formData: FormData): MediaStatus {
  const status = String(formData.get("status") || "draft");
  return status === "published" || status === "archived" ? status : "draft";
}

function revalidateMediaPaths() {
  revalidatePath("/");
  revalidatePath("/admin/media");
  revalidatePath("/admin/settings");
  revalidatePath("/gallery");
  revalidatePath("/services");
  revalidatePath("/testimonials");
}

export async function updateMediaAsset(assetId: string, formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("media_assets")
    .update({
      alt_text: value(formData, "alt_text"),
      caption: value(formData, "caption"),
      status: statusValue(formData),
      updated_by: user.id,
    })
    .eq("id", assetId);

  if (error) {
    throw error;
  }

  revalidateMediaPaths();
}

export async function archiveMediaAsset(assetId: string) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("media_assets")
    .update({
      status: "archived",
      updated_by: user.id,
    })
    .eq("id", assetId);

  if (error) {
    throw error;
  }

  revalidateMediaPaths();
}

export async function deleteMediaAsset(assetId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const usage = await getMediaUsageForAsset(assetId);

  if (usage.total > 0) {
    throw new Error(
      `Media is still used in: ${usage.labels.join(", ")}. Archive it or remove the usage first.`
    );
  }

  const { data: asset, error: selectError } = await supabase
    .from("media_assets")
    .select("id,path")
    .eq("id", assetId)
    .single();

  if (selectError) {
    throw selectError;
  }

  const { error: removeError } = await supabase.storage
    .from(SITE_MEDIA_BUCKET)
    .remove([asset.path]);

  if (removeError) {
    throw removeError;
  }

  const { error: deleteError } = await supabase
    .from("media_assets")
    .delete()
    .eq("id", asset.id);

  if (deleteError) {
    throw deleteError;
  }

  revalidateMediaPaths();
}
