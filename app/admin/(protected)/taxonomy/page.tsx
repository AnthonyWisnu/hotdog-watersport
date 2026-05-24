import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmButton from "@/components/admin/ConfirmButton";
import MoveOrderButtons from "@/components/admin/MoveOrderButtons";
import {
  getAdminTaxonomyGroups,
  isTaxonomyGroup,
  type AdminTaxonomyRow,
  type TaxonomyGroup,
} from "@/lib/cms/taxonomies";
import {
  archiveTaxonomy,
  createTaxonomy,
  deleteTaxonomy,
  moveTaxonomy,
  updateTaxonomy,
} from "./actions";

type SearchParams = Promise<{
  group?: string;
}>;

export default async function AdminTaxonomyPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const groups = await getAdminTaxonomyGroups();
  const requestedGroup = params.group || "service_category";
  const activeGroupValue: TaxonomyGroup = isTaxonomyGroup(requestedGroup)
    ? requestedGroup
    : "service_category";
  const activeGroup =
    groups.find((group) => group.value === activeGroupValue) || groups[0];

  return (
    <div className="max-w-7xl">
      <AdminPageHeader
        eyebrow="Admin Module"
        title="Taxonomy"
        description="Manage controlled category and badge options used by services, gallery, and FAQ forms."
      />

      <div className="mb-6 flex flex-wrap gap-3">
        {groups.map((group) => (
          <a
            key={group.value}
            href={`/admin/taxonomy?group=${group.value}`}
            aria-current={activeGroup.value === group.value ? "page" : undefined}
            className={`rounded-full border px-7 py-3 text-sm font-bold transition-colors ${
              activeGroup.value === group.value
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-text-primary hover:border-primary hover:text-primary"
            }`}
          >
            {group.label}
          </a>
        ))}
      </div>

      <AdminCard title={activeGroup.label} description={activeGroup.description}>
        <div className="space-y-3">
          {activeGroup.items.length > 0 ? (
            activeGroup.items.map((item, index) => (
              <TaxonomyItemForm
                key={item.id}
                item={item}
                disableUp={index === 0}
                disableDown={index === activeGroup.items.length - 1}
              />
            ))
          ) : (
            <p className="rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-text-muted">
              No taxonomy options in this group yet.
            </p>
          )}
        </div>

        <form action={createTaxonomy} className="mt-5 rounded-md border border-dashed border-border p-4">
          <input type="hidden" name="taxonomy_group" value={activeGroup.value} />
          <div className="grid gap-3 md:grid-cols-2">
            <Field name="value" label="Value" required />
            <Field name="label" label="Label" required />
            <Field
              name="description"
              label="Description"
              className="md:col-span-2"
            />
            <StatusSelect defaultValue="active" />
          </div>
          <button className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">
            Add Option
          </button>
        </form>
      </AdminCard>
    </div>
  );
}

function TaxonomyItemForm({
  item,
  disableUp,
  disableDown,
}: {
  item: AdminTaxonomyRow;
  disableUp: boolean;
  disableDown: boolean;
}) {
  const valueIsLocked = item.usage_count > 0;

  return (
    <form
      action={updateTaxonomy.bind(null, item.id)}
      className="rounded-md border border-border p-4"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Field
          name="value"
          label="Value"
          defaultValue={item.value}
          readOnly={valueIsLocked}
          title={
            valueIsLocked
              ? "This value is locked because existing content uses it."
              : undefined
          }
          required
        />
        <Field name="label" label="Label" defaultValue={item.label} required />
        <Field
          name="description"
          label="Description"
          defaultValue={item.description || ""}
          className="md:col-span-2"
        />
        <StatusSelect defaultValue={item.status} />
        <div className="flex items-end">
          <span className="rounded-md bg-surface-muted px-3 py-2 text-sm text-text-muted">
            Used by {item.usage_count} item{item.usage_count === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white">
          Save
        </button>
        <MoveOrderButtons
          moveUpAction={moveTaxonomy.bind(null, item.id, "up")}
          moveDownAction={moveTaxonomy.bind(null, item.id, "down")}
          disableUp={disableUp}
          disableDown={disableDown}
        />
        <ConfirmButton
          formAction={archiveTaxonomy.bind(null, item.id)}
          message="Archive this taxonomy option?"
          className="rounded-md border border-border px-3 py-2 text-sm text-text-primary"
        >
          Archive
        </ConfirmButton>
        <ConfirmButton
          formAction={deleteTaxonomy.bind(null, item.id)}
          message="Delete this unused taxonomy option?"
          disabled={item.usage_count > 0}
          className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Delete
        </ConfirmButton>
      </div>
    </form>
  );
}

function Field(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
  }
) {
  const { label, className = "", ...inputProps } = props;

  return (
    <label className={`block text-sm font-medium text-text-primary ${className}`}>
      {label}
      <input
        {...inputProps}
        className="mt-2 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 read-only:bg-surface-muted"
      />
    </label>
  );
}

function StatusSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <label className="block text-sm font-medium text-text-primary">
      Status
      <select
        name="status"
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-md border border-border px-3 py-2 text-sm"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="archived">Archived</option>
      </select>
    </label>
  );
}
