"use client";

import { createClient } from "@/lib/supabase/client";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_MEDIA_MIME_TYPES,
  MAX_MEDIA_FILE_SIZE,
  SITE_MEDIA_BUCKET,
  type MediaFolder,
  type MediaStatus,
  type MediaType,
} from "./config";

interface UploadMediaAssetParams {
  file: File;
  folder: MediaFolder;
  altText?: string;
  caption?: string;
  status?: MediaStatus;
}

function getMediaType(file: File): MediaType {
  return ALLOWED_IMAGE_MIME_TYPES.includes(
    file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number]
  )
    ? "image"
    : "video";
}

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension ? `.${extension}` : "";
}

export function validateMediaFile(file: File) {
  if (!ALLOWED_MEDIA_MIME_TYPES.includes(file.type as never)) {
    throw new Error("Unsupported media type.");
  }

  if (file.size > MAX_MEDIA_FILE_SIZE) {
    throw new Error("Media file is larger than 100MB.");
  }
}

export async function uploadMediaAsset({
  file,
  folder,
  altText,
  caption,
  status = "draft",
}: UploadMediaAssetParams) {
  validateMediaFile(file);

  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to upload media.");
  }

  const path = `${folder}/${crypto.randomUUID()}${getFileExtension(file)}`;
  const mediaType = getMediaType(file);

  const { error: uploadError } = await supabase.storage
    .from(SITE_MEDIA_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: asset, error: insertError } = await supabase
    .from("media_assets")
    .insert({
      bucket: SITE_MEDIA_BUCKET,
      path,
      media_type: mediaType,
      mime_type: file.type,
      size_bytes: file.size,
      alt_text: altText || null,
      caption: caption || null,
      status,
      created_by: user.id,
      updated_by: user.id,
    })
    .select()
    .single();

  if (insertError) {
    await supabase.storage.from(SITE_MEDIA_BUCKET).remove([path]);
    throw insertError;
  }

  return asset;
}

export async function deleteMediaAsset(assetId: string) {
  const supabase = createClient();

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
}

export async function createSignedMediaUrl(path: string, expiresIn = 3600) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(SITE_MEDIA_BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}
