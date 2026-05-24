import AdminCard from "@/components/admin/AdminCard";
import AdminFormActions from "@/components/admin/AdminFormActions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getAdminMediaAssets } from "@/lib/cms/media";
import { getSiteSettings } from "@/lib/cms/settings";
import { updateBrandMedia, updateSiteSettings } from "./actions";
import HeroMediaUploader from "./HeroMediaUploader";
import LogoMediaUploader from "./LogoMediaUploader";
import OgImageUploader from "./OgImageUploader";
import AdminState from "@/components/admin/AdminState";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  const imageAssets = await getAdminMediaAssets({ mediaType: "image" });
  const missingSeo = !settings.meta_title || !settings.meta_description;
  const missingHeroMedia = !settings.hero_media_id;
  const missingLogo = !settings.logo_media_id;

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        eyebrow="Settings"
        title="Hero, Contact, and Location"
        description="Update logo media, homepage hero copy, contact details, social links, map embed, and SEO defaults."
      />
      <div className="space-y-6">
      <AdminCard
        title="Logo and Brand Media"
        description="Choose existing images from the media library or upload new logo files directly from admin."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <MediaPreview label="Header Logo" src={settings.logo_url || "/logo/logo.jpg"} />
          <MediaPreview label="Footer Logo" src={settings.footer_logo_url || settings.logo_url || "/logo/logo.jpg"} />
          <MediaPreview label="Favicon" src={settings.favicon_url || "/favicon.ico"} />
        </div>
        {missingLogo ? (
          <div className="mt-4">
            <AdminState
              variant="error"
              title="CMS logo missing"
              description="Select or upload a header logo so production does not rely on the local fallback logo."
            />
          </div>
        ) : null}
        <form action={updateBrandMedia} className="mt-5 grid gap-4 md:grid-cols-3">
          <MediaSelect
            name="logo_media_id"
            label="Header Logo"
            value={settings.logo_media_id || ""}
            assets={imageAssets}
          />
          <MediaSelect
            name="footer_logo_media_id"
            label="Footer Logo"
            value={settings.footer_logo_media_id || ""}
            assets={imageAssets}
          />
          <MediaSelect
            name="favicon_media_id"
            label="Favicon"
            value={settings.favicon_media_id || ""}
            assets={imageAssets}
          />
          <div className="md:col-span-3">
            <AdminFormActions>
              <button className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
                Save Brand Media
              </button>
            </AdminFormActions>
          </div>
        </form>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <LogoMediaUploader target="logo" label="Upload Header Logo" />
          <LogoMediaUploader target="footer_logo" label="Upload Footer Logo" />
          <LogoMediaUploader target="favicon" label="Upload Favicon" />
        </div>
      </AdminCard>

      <form action={updateSiteSettings}>
        <AdminCard>
          <div className="mb-6">
            <div className="grid gap-4 md:grid-cols-2">
              <HeroMediaUploader />
              <OgImageUploader />
            </div>
            {missingSeo ? (
              <div className="mt-4">
                <AdminState
                  variant="error"
                  title="SEO fields incomplete"
                  description="Fill in Default Meta Title and Default Meta Description before publishing final SEO changes."
                />
              </div>
            ) : null}
            {missingHeroMedia ? (
              <div className="mt-4">
                <AdminState
                  variant="error"
                  title="Hero media missing"
                  description="Upload a hero image or video so the homepage does not rely on the local fallback video."
                />
              </div>
            ) : null}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field name="hero_title" label="Hero Title" defaultValue={settings.hero_title} />
            <Field name="hero_cta_text" label="Hero CTA" defaultValue={settings.hero_cta_text} />
            <Field name="hero_secondary_cta_text" label="Secondary CTA" defaultValue={settings.hero_secondary_cta_text} />
            <Field name="whatsapp_number" label="WhatsApp" defaultValue={settings.whatsapp_number || ""} />
            <Field name="business_email" label="Email" defaultValue={settings.business_email || ""} />
            <Field name="location_city" label="Location City" defaultValue={settings.location_city || ""} />
            <Field name="operating_hours" label="Operating Hours" defaultValue={settings.operating_hours || ""} />
            <Field name="instagram_url" label="Instagram URL" defaultValue={settings.instagram_url || ""} />
            <Field name="facebook_url" label="Facebook URL" defaultValue={settings.facebook_url || ""} />
            <Field name="tiktok_url" label="TikTok URL" defaultValue={settings.tiktok_url || ""} />
            <Textarea name="hero_subtitle" label="Hero Subtitle" defaultValue={settings.hero_subtitle} className="md:col-span-2" />
            <Textarea name="location_address" label="Address" defaultValue={settings.location_address || ""} className="md:col-span-2" />
            <Textarea name="maps_embed_url" label="Google Maps Embed URL" defaultValue={settings.maps_embed_url || ""} className="md:col-span-2" />
            <Field name="meta_title" label="Default Meta Title" defaultValue={settings.meta_title || ""} />
            <Field name="meta_description" label="Default Meta Description" defaultValue={settings.meta_description || ""} />
          </div>
          <div className="mt-6">
            <AdminFormActions>
              <button className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
                Save Settings
              </button>
            </AdminFormActions>
          </div>
        </AdminCard>
      </form>
      </div>
    </div>
  );
}

function MediaPreview({ label, src }: { label: string; src: string }) {
  return (
    <div className="rounded-md border border-border bg-surface-muted p-4">
      <p className="text-sm font-medium text-text-primary">{label}</p>
      <div className="mt-3 flex h-28 items-center justify-center overflow-hidden rounded-md bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={label} className="max-h-full max-w-full object-contain" />
      </div>
    </div>
  );
}

function MediaSelect({
  label,
  name,
  value,
  assets,
}: {
  label: string;
  name: string;
  value: string;
  assets: Array<{ id: string; path: string }>;
}) {
  return (
    <label className="block text-sm font-medium text-text-primary">
      {label}
      <select
        name={name}
        defaultValue={value}
        className="mt-2 w-full rounded-md border border-border px-3 py-2 text-sm"
      >
        <option value="">Fallback default</option>
        {assets.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.path}
          </option>
        ))}
      </select>
    </label>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, className = "", ...inputProps } = props;
  return (
    <label className={`block text-sm font-medium text-text-primary ${className}`}>
      {label}
      <input {...inputProps} className="mt-2 w-full rounded-md border border-border px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
  );
}

function Textarea({ label, className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; name: string }) {
  return (
    <label className={`block text-sm font-medium text-text-primary ${className}`}>
      {label}
      <textarea {...props} rows={4} className="mt-2 w-full rounded-md border border-border px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
  );
}
