import AdminCard from "./AdminCard";
import AdminFormActions from "./AdminFormActions";

interface ServiceFormProps {
  action: (formData: FormData) => void | Promise<void>;
  service?: {
    title: string;
    slug: string;
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
    status: string;
  };
}

export default function ServiceForm({ action, service }: ServiceFormProps) {
  return (
    <form action={action}>
      <AdminCard title="Service Details">
        <div className="grid gap-5 md:grid-cols-2">
          <Field name="title" label="Name" defaultValue={service?.title} required />
          <Field name="slug" label="Slug" defaultValue={service?.slug} required />
          <Field name="headline" label="Tagline" defaultValue={service?.headline || ""} />
          <Field name="price" label="Price" defaultValue={service?.price || ""} />
          <Field name="duration" label="Duration" defaultValue={service?.duration || ""} />
          <Field name="rating" label="Rating" type="number" step="0.1" min="0" max="5" defaultValue={service?.rating?.toString()} />
          <Field name="badge" label="Badge" defaultValue={service?.badge || ""} />
          <Field name="sort_order" label="Sort Order" type="number" defaultValue={String(service?.sort_order ?? 0)} />
          <Select name="status" label="Status" defaultValue={service?.status || "draft"} />
          <label className="flex items-center gap-2 self-end text-sm font-medium text-text-primary">
            <input name="is_popular" type="checkbox" defaultChecked={service?.is_popular} />
            Popular
          </label>
          <Textarea name="description" label="Description" defaultValue={service?.description || ""} className="md:col-span-2" />
          <Textarea name="category_labels" label="Categories" defaultValue={service?.category_labels.join("\n")} />
          <Textarea name="equipment" label="Equipment" defaultValue={service?.equipment.join("\n")} />
          <Textarea name="rental_info" label="Rental Info" defaultValue={service?.rental_info || ""} />
          <Textarea name="operational_notes" label="Operational Notes" defaultValue={service?.operational_notes || ""} />
          <Textarea name="whatsapp_message" label="WhatsApp Message" defaultValue={service?.whatsapp_message || ""} className="md:col-span-2" />
        </div>
        <div className="mt-6">
          <AdminFormActions>
            <button className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
              Save Service
            </button>
          </AdminFormActions>
        </div>
      </AdminCard>
    </form>
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
      <textarea {...props} rows={5} className="mt-2 w-full rounded-md border border-border px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
  );
}

function Select({ label, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; name: string }) {
  return (
    <label className="block text-sm font-medium text-text-primary">
      {label}
      <select {...props} className="mt-2 w-full rounded-md border border-border px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
    </label>
  );
}
