import AdminCard from "./AdminCard";
import AdminFormActions from "./AdminFormActions";
import {
  SERVICE_BADGE_OPTIONS,
  SERVICE_CATEGORY_OPTIONS,
  type TaxonomyOption,
} from "@/lib/taxonomy";

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
  categoryOptions?: readonly TaxonomyOption[];
  badgeOptions?: readonly TaxonomyOption[];
}

export default function ServiceForm({
  action,
  service,
  categoryOptions = SERVICE_CATEGORY_OPTIONS,
  badgeOptions = SERVICE_BADGE_OPTIONS,
}: ServiceFormProps) {
  return (
    <form action={action}>
      {service ? (
        <input type="hidden" name="sort_order" value={service.sort_order} />
      ) : null}
      <AdminCard title="Service Details">
        <div className="grid gap-5 md:grid-cols-2">
          <Field name="title" label="Name" defaultValue={service?.title} required />
          <Field name="slug" label="Slug" defaultValue={service?.slug} required />
          <Field name="headline" label="Tagline" defaultValue={service?.headline || ""} />
          <Field name="price" label="Price" defaultValue={service?.price || ""} />
          <Field name="duration" label="Duration" defaultValue={service?.duration || ""} />
          <Field name="rating" label="Rating" type="number" step="0.1" min="0" max="5" defaultValue={service?.rating?.toString()} />
          <BadgeSelect
            defaultValue={service?.badge || ""}
            options={badgeOptions}
          />
          <Select name="status" label="Status" defaultValue={service?.status || "draft"} />
          <label className="flex items-center gap-2 self-end text-sm font-medium text-text-primary">
            <input name="is_popular" type="checkbox" defaultChecked={service?.is_popular} />
            Popular
          </label>
          <Textarea name="description" label="Description" defaultValue={service?.description || ""} className="md:col-span-2" />
          <CategoryCheckboxes
            selected={service?.category_labels || []}
            options={categoryOptions}
          />
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

function BadgeSelect({
  defaultValue,
  options,
}: {
  defaultValue: string;
  options: readonly TaxonomyOption[];
}) {
  return (
    <label className="block text-sm font-medium text-text-primary">
      Badge
      <select
        name="badge"
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-md border border-border px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <option value="">None</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CategoryCheckboxes({
  selected,
  options,
}: {
  selected: string[];
  options: readonly TaxonomyOption[];
}) {
  const selectedSet = new Set(selected);

  return (
    <fieldset className="rounded-md border border-border p-4">
      <legend className="px-1 text-sm font-medium text-text-primary">
        Categories
      </legend>
      <div className="mt-2 grid gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 text-sm text-text-primary"
          >
            <input
              name="category_labels"
              type="checkbox"
              value={option.value}
              defaultChecked={selectedSet.has(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
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
