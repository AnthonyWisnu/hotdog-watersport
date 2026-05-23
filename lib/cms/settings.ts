import { createClient } from "@/lib/supabase/server";
import { SITE_MEDIA_BUCKET } from "@/lib/media/config";
import { BUSINESS_TAGLINE, LOCATION_ADDRESS, LOCATION_CITY, OPERATING_HOURS, WHATSAPP_NUMBER, BUSINESS_EMAIL, SOCIAL } from "@/lib/constants";

export interface SiteSettingsData {
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_secondary_cta_text: string;
  whatsapp_number: string | null;
  business_email: string | null;
  location_city: string | null;
  location_address: string | null;
  operating_hours: string | null;
  maps_embed_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url?: string | null;
  hero_media_url?: string | null;
  hero_media_type?: "image" | "video" | null;
}

export interface BusinessProfileData {
  business_name: string;
  tagline: string | null;
  brand_story: string | null;
  about_text: string | null;
  safety_commitment: string | null;
}

export const FALLBACK_SITE_SETTINGS: SiteSettingsData = {
  hero_title: "Ride the Wave. Feel Alive.",
  hero_subtitle:
    "Surfboards, jet skis, diving gear, and more. Premium equipment, safety-first standards, and instant booking via WhatsApp.",
  hero_cta_text: "Book via WhatsApp",
  hero_secondary_cta_text: "Explore Services",
  whatsapp_number: WHATSAPP_NUMBER,
  business_email: BUSINESS_EMAIL,
  location_city: LOCATION_CITY,
  location_address: LOCATION_ADDRESS,
  operating_hours: OPERATING_HOURS,
  maps_embed_url: null,
  instagram_url: SOCIAL.instagram,
  facebook_url: SOCIAL.facebook,
  tiktok_url: SOCIAL.tiktok,
  meta_title: null,
  meta_description: null,
  og_image_url: null,
  hero_media_url: null,
  hero_media_type: null,
};

export const FALLBACK_BUSINESS_PROFILE: BusinessProfileData = {
  business_name: "PT Hot Dog Water Sport",
  tagline: BUSINESS_TAGLINE,
  brand_story: null,
  about_text: null,
  safety_commitment: null,
};

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select(
      "hero_title,hero_subtitle,hero_cta_text,hero_secondary_cta_text,hero_media_id,og_image_id,whatsapp_number,business_email,location_city,location_address,operating_hours,maps_embed_url,instagram_url,facebook_url,tiktok_url,meta_title,meta_description"
    )
    .eq("settings_key", "default")
    .maybeSingle();

  if (!data) {
    return FALLBACK_SITE_SETTINGS;
  }

  const result: SiteSettingsData = { ...data };

  if (data.hero_media_id) {
    const { data: media } = await supabase
      .from("media_assets")
      .select("path,media_type")
      .eq("id", data.hero_media_id)
      .maybeSingle();

    if (media) {
      const { data: signed } = await supabase.storage
        .from(SITE_MEDIA_BUCKET)
        .createSignedUrl(media.path, 3600);

      result.hero_media_url = signed?.signedUrl || null;
      result.hero_media_type = media.media_type;
    }
  }

  if (data.og_image_id) {
    const { data: ogImage } = await supabase
    .from("media_assets")
      .select("path")
      .eq("id", data.og_image_id)
    .maybeSingle();

    if (ogImage) {
      const { data: signedOg } = await supabase.storage
        .from(SITE_MEDIA_BUCKET)
        .createSignedUrl(ogImage.path, 3600);

      result.og_image_url = signedOg?.signedUrl || null;
    }
  }

  return result;
}

export async function getBusinessProfile() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("business_profile")
    .select("business_name,tagline,brand_story,about_text,safety_commitment")
    .eq("profile_key", "default")
    .maybeSingle();

  return data || FALLBACK_BUSINESS_PROFILE;
}
