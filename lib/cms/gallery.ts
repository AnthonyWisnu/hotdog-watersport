import { createClient } from "@/lib/supabase/server";
import { GALLERY_ITEMS, type GalleryItem } from "@/lib/gallery-data";
import { SITE_MEDIA_BUCKET } from "@/lib/media/config";
import { isAdminPreviewEnabled } from "@/lib/admin/preview";

interface GalleryRow {
  id: string;
  media_asset_id: string;
  category: GalleryItem["category"];
  alt_text: string | null;
  caption: string | null;
  is_featured: boolean;
  sort_order: number;
  status: "draft" | "published" | "archived";
  media_assets: {
    path: string;
    media_type: "image" | "video";
    status: "draft" | "published" | "archived";
  } | null;
}

async function signPath(path: string) {
  const supabase = await createClient();
  const { data } = await supabase.storage
    .from(SITE_MEDIA_BUCKET)
    .createSignedUrl(path, 3600);
  return data?.signedUrl || null;
}

export async function getPublishedGalleryItems(): Promise<GalleryItem[]> {
  const preview = await isAdminPreviewEnabled();
  const supabase = await createClient();
  let query = supabase
    .from("gallery_items")
    .select("id,category,alt_text,caption,is_featured,sort_order,status,media_assets(path,media_type,status)")
    .order("sort_order", { ascending: true });

  query = preview ? query.neq("status", "archived") : query.eq("status", "published");

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return GALLERY_ITEMS;
  }

  const rows = data as unknown as GalleryRow[];
  const items = await Promise.all(
    rows.map(async (row) => {
      const src = row.media_assets?.path
        ? await signPath(row.media_assets.path)
        : null;

      if (!src) return null;

      return {
        id: row.id,
        category: row.category,
        type: row.media_assets?.media_type || "image",
        src,
        alt: row.alt_text || row.caption || "Gallery media",
        width: 1200,
        height: 800,
      } satisfies GalleryItem;
    })
  );

  return items.filter((item): item is GalleryItem => Boolean(item));
}

export async function getGalleryPreviewItems() {
  const items = await getPublishedGalleryItems();
  return items.slice(0, 6);
}

export async function getAdminGalleryItems() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("id,media_asset_id,category,alt_text,caption,is_featured,sort_order,status,media_assets(path,media_type,status)")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  const rows = (data || []) as GalleryRow[];
  const items = await Promise.all(
    rows.map(async (row) => ({
      ...row,
      signed_url: row.media_assets?.path
        ? await signPath(row.media_assets.path)
        : null,
    }))
  );

  return items;
}
