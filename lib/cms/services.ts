import { createClient } from "@/lib/supabase/server";
import { SERVICES, type ServiceData } from "@/lib/services-data";
import { SITE_MEDIA_BUCKET } from "@/lib/media/config";
import { isAdminPreviewEnabled } from "@/lib/admin/preview";

export interface CmsService extends ServiceData {
  databaseId?: string;
  categoryLabels: string[];
  price?: string | null;
  duration?: string | null;
  rating?: number | null;
  badge?: string | null;
  isPopular?: boolean;
  status?: "draft" | "published" | "archived";
  sortOrder?: number;
}

interface ServiceMediaRow {
  media_role: "cover" | "gallery" | "promo_video";
  sort_order: number;
  alt_text: string | null;
  media_assets: {
    path: string;
    media_type: "image" | "video";
    status: "draft" | "published" | "archived";
  } | null;
}

interface ServiceRow {
  id: string;
  slug: string;
  title: string;
  headline: string | null;
  description: string | null;
  category_labels: string[];
  price: string | null;
  duration: string | null;
  rating: number | null;
  badge: string | null;
  is_popular: boolean;
  equipment: string[];
  rental_info: string | null;
  operational_notes: string | null;
  whatsapp_message: string | null;
  sort_order: number;
  status: "draft" | "published" | "archived";
  service_media?: ServiceMediaRow[];
}

const DEFAULT_ICONS = ["Waves", "Zap", "Anchor", "Droplets"];

async function createSignedImageUrls(media: ServiceMediaRow[] = []) {
  const supabase = await createClient();
  const imageMedia = media
    .filter(
      (item) =>
        item.media_assets?.media_type === "image" &&
        item.media_assets.status === "published"
    )
    .sort((a, b) => {
      if (a.media_role === b.media_role) {
        return a.sort_order - b.sort_order;
      }

      return a.media_role === "cover" ? -1 : 1;
    });

  const urls = await Promise.all(
    imageMedia.map(async (item) => {
      const path = item.media_assets?.path;
      if (!path) return null;
      const { data } = await supabase.storage
        .from(SITE_MEDIA_BUCKET)
        .createSignedUrl(path, 3600);
      return data?.signedUrl || null;
    })
  );

  return urls.filter((url): url is string => Boolean(url));
}

async function getGalleryFallbackImages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("sort_order, media_assets(path, media_type, status)")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .limit(12);

  if (error || !data) {
    return [];
  }

  const rows = data as unknown as Array<{
    media_assets: {
      path: string;
      media_type: "image" | "video";
      status: "draft" | "published" | "archived";
    } | null;
  }>;

  const urls = await Promise.all(
    rows
      .filter(
        (item) =>
          item.media_assets?.media_type === "image" &&
          item.media_assets.status === "published"
      )
      .map(async (item) => {
        const path = item.media_assets?.path;
        if (!path) return null;

        const { data: signed } = await supabase.storage
          .from(SITE_MEDIA_BUCKET)
          .createSignedUrl(path, 3600);

        return signed?.signedUrl || null;
      })
  );

  return urls.filter((url): url is string => Boolean(url));
}

async function mapServiceRow(
  row: ServiceRow,
  index: number,
  fallbackImages: string[]
): Promise<CmsService> {
  const fallback = SERVICES[index % SERVICES.length];
  const signedImages = await createSignedImageUrls(row.service_media);
  const cmsFallbackImage = fallbackImages[index % fallbackImages.length];

  return {
    id: row.id,
    databaseId: row.id,
    slug: row.slug,
    title: row.title,
    headline: row.headline || row.title,
    description: row.description || "",
    categoryLabels: row.category_labels || [],
    price: row.price,
    duration: row.duration,
    rating: row.rating,
    badge: row.badge,
    isPopular: row.is_popular,
    equipment: row.equipment || [],
    rentalInfo: row.rental_info || "",
    operationalNotes: row.operational_notes || "",
    images:
      signedImages.length > 0
        ? signedImages
        : cmsFallbackImage
          ? [cmsFallbackImage]
          : fallback.images,
    whatsappMessage: row.whatsapp_message || "",
    icon: fallback.icon || DEFAULT_ICONS[index % DEFAULT_ICONS.length],
    status: row.status,
    sortOrder: row.sort_order,
  };
}

export async function getPublishedServices(): Promise<CmsService[]> {
  const preview = await isAdminPreviewEnabled();
  const supabase = await createClient();
  let query = supabase
    .from("services")
    .select(
      "*, service_media(media_role, sort_order, alt_text, media_assets(path, media_type, status))"
    )
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  query = preview ? query.neq("status", "archived") : query.eq("status", "published");

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return SERVICES.map((service, index) => ({
      ...service,
      categoryLabels: [],
      sortOrder: index,
      status: "published",
    }));
  }

  const fallbackImages = await getGalleryFallbackImages();

  return Promise.all(
    (data as unknown as ServiceRow[]).map((row, index) =>
      mapServiceRow(row, index, fallbackImages)
    )
  );
}

export async function getAdminServices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id,slug,title,headline,price,duration,rating,badge,is_popular,status,sort_order,category_labels")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getAdminService(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      "*, service_media(id, media_role, sort_order, alt_text, caption, media_assets(id, path, media_type, mime_type, status))"
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data as unknown as ServiceRow & {
    service_media?: Array<
      ServiceMediaRow & {
        id: string;
        media_role: "cover" | "gallery" | "promo_video";
        caption: string | null;
        media_assets: {
          id: string;
          path: string;
          media_type: "image" | "video";
          mime_type: string | null;
          status: "draft" | "published" | "archived";
        } | null;
      }
    >;
  };
}
