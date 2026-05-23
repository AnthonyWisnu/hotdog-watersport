import AdminCard from "@/components/admin/AdminCard";
import AdminFormActions from "@/components/admin/AdminFormActions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getBusinessProfile } from "@/lib/cms/settings";
import { updateBusinessProfile } from "./actions";

export default async function AdminBusinessPage() {
  const profile = await getBusinessProfile();

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        eyebrow="Business Profile"
        title="About Content"
        description="Update business identity, brand story, about text, and safety commitment."
      />
      <form action={updateBusinessProfile}>
        <AdminCard>
          <div className="grid gap-5 md:grid-cols-2">
            <Field name="business_name" label="Business Name" defaultValue={profile.business_name} />
            <Field name="tagline" label="Tagline" defaultValue={profile.tagline || ""} />
            <Textarea name="brand_story" label="Brand Story" defaultValue={profile.brand_story || ""} className="md:col-span-2" />
            <Textarea name="about_text" label="About Text" defaultValue={profile.about_text || ""} className="md:col-span-2" />
            <Textarea name="safety_commitment" label="Safety Commitment" defaultValue={profile.safety_commitment || ""} className="md:col-span-2" />
          </div>
          <div className="mt-6">
            <AdminFormActions>
              <button className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
                Save Profile
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
      <textarea {...props} rows={6} className="mt-2 w-full rounded-md border border-border px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
  );
}
