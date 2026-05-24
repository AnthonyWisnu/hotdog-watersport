import { SITE_MEDIA_BUCKET } from "@/lib/media/config";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type MediaAssetRow = Database["public"]["Tables"]["media_assets"]["Row"];

export interface MediaUsage {
  labels: string[];
  site_settings: number;
  service_media: number;
  gallery_items: number;
  testimonials: number;
  total: number;
}

export interface AdminMediaAsset extends MediaAssetRow {
  signed_url: string | null;
  usage: MediaUsage;
}

export interface AdminMediaFilters {
  q?: string;
  mediaType?: "all" | "image" | "video";
  status?: "all" | "draft" | "published" | "archived";
}

const emptyUsage = (): MediaUsage => ({
  labels: [],
  site_settings: 0,
  service_media: 0,
  gallery_items: 0,
  testimonials: 0,
  total: 0,
});

function addUsage(usage: MediaUsage, key: keyof Omit<MediaUsage, "labels" | "total">, label: string) {
  usage[key] += 1;
  usage.total += 1;
  if (!usage.labels.includes(label)) {
    usage.labels.push(label);
  }
}

export async function getAdminMediaAssets(filters: AdminMediaFilters = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.mediaType && filters.mediaType !== "all") {
    query = query.eq("media_type", filters.mediaType);
  }

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const q = filters.q?.trim().toLowerCase();
  const rows = (data || []).filter((item) => {
    if (!q) {
      return true;
    }

    return [item.path, item.alt_text, item.caption, item.mime_type, item.media_type, item.status]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q));
  });

  const usageById = await getUsageMap(rows.map((item) => item.id));

  return Promise.all(
    rows.map(async (item): Promise<AdminMediaAsset> => {
      const { data: signed } = await supabase.storage
        .from(SITE_MEDIA_BUCKET)
        .createSignedUrl(item.path, 3600);

      return {
        ...item,
        signed_url: signed?.signedUrl || null,
        usage: usageById.get(item.id) || emptyUsage(),
      };
    })
  );
}

export async function getMediaUsageForAsset(assetId: string) {
  const usageById = await getUsageMap([assetId]);
  return usageById.get(assetId) || emptyUsage();
}

async function getUsageMap(assetIds: string[]) {
  const supabase = await createClient();
  const usageById = new Map<string, MediaUsage>();

  for (const id of assetIds) {
    usageById.set(id, emptyUsage());
  }

  if (assetIds.length === 0) {
    return usageById;
  }

  const [
    { data: settings },
    { data: serviceMedia },
    { data: galleryItems },
    { data: testimonials },
  ] = await Promise.all([
    supabase
      .from("site_settings")
      .select("hero_media_id,og_image_id,logo_media_id,footer_logo_media_id,favicon_media_id")
      .eq("settings_key", "default")
      .maybeSingle(),
    supabase
      .from("service_media")
      .select("media_asset_id,media_role")
      .in("media_asset_id", assetIds),
    supabase
      .from("gallery_items")
      .select("media_asset_id,category")
      .in("media_asset_id", assetIds),
    supabase
      .from("testimonials")
      .select("image_asset_id,guest_name")
      .in("image_asset_id", assetIds),
  ]);

  const settingLabels: Array<[keyof NonNullable<typeof settings>, string]> = [
    ["hero_media_id", "Hero"],
    ["og_image_id", "Open Graph image"],
    ["logo_media_id", "Header logo"],
    ["footer_logo_media_id", "Footer logo"],
    ["favicon_media_id", "Favicon"],
  ];

  if (settings) {
    for (const [key, label] of settingLabels) {
      const id = settings[key];
      const usage = typeof id === "string" ? usageById.get(id) : null;
      if (usage) {
        addUsage(usage, "site_settings", label);
      }
    }
  }

  for (const row of serviceMedia || []) {
    const usage = usageById.get(row.media_asset_id);
    if (usage) {
      addUsage(usage, "service_media", `Service ${row.media_role}`);
    }
  }

  for (const row of galleryItems || []) {
    const usage = usageById.get(row.media_asset_id);
    if (usage) {
      addUsage(usage, "gallery_items", `Gallery ${row.category}`);
    }
  }

  for (const row of testimonials || []) {
    if (!row.image_asset_id) {
      continue;
    }

    const usage = usageById.get(row.image_asset_id);
    if (usage) {
      addUsage(usage, "testimonials", `Testimonial ${row.guest_name}`);
    }
  }

  return usageById;
}
