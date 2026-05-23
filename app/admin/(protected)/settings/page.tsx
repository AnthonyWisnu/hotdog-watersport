import AdminCard from "@/components/admin/AdminCard";
import AdminFormActions from "@/components/admin/AdminFormActions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSiteSettings } from "@/lib/cms/settings";
import { updateSiteSettings } from "./actions";
import HeroMediaUploader from "./HeroMediaUploader";
import OgImageUploader from "./OgImageUploader";
import AdminState from "@/components/admin/AdminState";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  const missingSeo = !settings.meta_title || !settings.meta_description;

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        eyebrow="Settings"
        title="Hero, Contact, and Location"
        description="Update homepage hero copy, contact details, social links, map embed, and SEO defaults."
      />
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
