import { createClient } from "@/lib/supabase/server";
import { SITE_MEDIA_BUCKET } from "@/lib/media/config";
import { isAdminPreviewEnabled } from "@/lib/admin/preview";

export interface TestimonialItem {
  id: string;
  guest_name: string;
  guest_origin: string | null;
  rating: number;
  review: string;
  reviewed_at: string | null;
  is_featured: boolean;
  image_url?: string | null;
}

interface TestimonialRow extends TestimonialItem {
  media_assets?: { path: string } | null;
}

export async function getPublishedTestimonials() {
  const preview = await isAdminPreviewEnabled();
  const supabase = await createClient();
  let query = supabase
    .from("testimonials")
    .select("id,guest_name,guest_origin,rating,review,reviewed_at,is_featured,media_assets:image_asset_id(path)")
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true });

  query = preview ? query.neq("status", "archived") : query.eq("status", "published");

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  const rows = data as unknown as TestimonialRow[];

  return Promise.all(
    rows.map(async (row) => {
      if (!row.media_assets?.path) return row;

      const { data: signed } = await supabase.storage
        .from(SITE_MEDIA_BUCKET)
        .createSignedUrl(row.media_assets.path, 3600);

      return { ...row, image_url: signed?.signedUrl || null };
    })
  );
}

export async function getAdminTestimonials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id,guest_name,guest_origin,rating,review,reviewed_at,is_featured,sort_order,status")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data || []) as Array<{
    id: string;
    guest_name: string;
    guest_origin: string | null;
    rating: number;
    review: string;
    reviewed_at: string | null;
    is_featured: boolean;
    sort_order: number;
    status: "draft" | "published" | "archived";
  }>;
}
