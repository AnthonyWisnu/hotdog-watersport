import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import {
  FAQ_CATEGORY_OPTIONS,
  GALLERY_CATEGORY_OPTIONS,
  SERVICE_BADGE_OPTIONS,
  SERVICE_CATEGORY_OPTIONS,
  parseNullableTaxonomyValue,
  parseTaxonomyValue,
  parseTaxonomyValues,
  type TaxonomyOption,
} from "@/lib/taxonomy";

export type TaxonomyGroup =
  Database["public"]["Tables"]["taxonomies"]["Row"]["taxonomy_group"];
export type TaxonomyStatus =
  Database["public"]["Tables"]["taxonomies"]["Row"]["status"];
export type TaxonomyRow = Database["public"]["Tables"]["taxonomies"]["Row"];

export interface TaxonomyGroupMeta {
  value: TaxonomyGroup;
  label: string;
  description: string;
}

export interface AdminTaxonomyRow extends TaxonomyRow {
  usage_count: number;
}

export interface AdminTaxonomyGroup extends TaxonomyGroupMeta {
  items: AdminTaxonomyRow[];
  createDefaultValue: string;
}

export const TAXONOMY_GROUPS = [
  {
    value: "service_category",
    label: "Service Categories",
    description: "Options used by service category checkboxes and service filters.",
  },
  {
    value: "service_badge",
    label: "Service Badges",
    description: "Optional labels such as Popular, Best Seller, New, or Limited.",
  },
  {
    value: "gallery_category",
    label: "Gallery Categories",
    description: "Options used by gallery admin forms and public gallery filters.",
  },
  {
    value: "faq_category",
    label: "FAQ Categories",
    description: "Options used by FAQ admin forms and public FAQ filters.",
  },
] as const satisfies readonly TaxonomyGroupMeta[];

const DEFAULT_OPTIONS = {
  service_category: SERVICE_CATEGORY_OPTIONS,
  service_badge: SERVICE_BADGE_OPTIONS,
  gallery_category: GALLERY_CATEGORY_OPTIONS,
  faq_category: FAQ_CATEGORY_OPTIONS,
} as const satisfies Record<TaxonomyGroup, readonly TaxonomyOption[]>;

export function isTaxonomyGroup(value: string): value is TaxonomyGroup {
  return TAXONOMY_GROUPS.some((group) => group.value === value);
}

export function getTaxonomyGroupMeta(group: TaxonomyGroup) {
  return TAXONOMY_GROUPS.find((item) => item.value === group);
}

function fallbackOptions(group: TaxonomyGroup) {
  return [...DEFAULT_OPTIONS[group]];
}

function mapRowsToOptions(rows: Array<Pick<TaxonomyRow, "value" | "label">>) {
  return rows.map((row) => ({
    value: row.value,
    label: row.label,
  }));
}

export async function getActiveTaxonomyOptions(group: TaxonomyGroup) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("taxonomies")
    .select("value,label")
    .eq("taxonomy_group", group)
    .eq("status", "active")
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });

  if (error || !data || data.length === 0) {
    return fallbackOptions(group);
  }

  return mapRowsToOptions(data);
}

export async function getServiceFormTaxonomyOptions() {
  const [serviceCategories, serviceBadges] = await Promise.all([
    getActiveTaxonomyOptions("service_category"),
    getActiveTaxonomyOptions("service_badge"),
  ]);

  return { serviceCategories, serviceBadges };
}

export async function parseActiveTaxonomyValues(
  values: FormDataEntryValue[],
  group: TaxonomyGroup,
  fieldLabel: string
) {
  const options = await getActiveTaxonomyOptions(group);
  return parseTaxonomyValues(values, options, fieldLabel);
}

export async function parseActiveTaxonomyValue(
  value: FormDataEntryValue | null,
  group: TaxonomyGroup,
  fieldLabel: string,
  fallback: string
) {
  const options = await getActiveTaxonomyOptions(group);
  return parseTaxonomyValue(value, options, fieldLabel, fallback);
}

export async function parseNullableActiveTaxonomyValue(
  value: FormDataEntryValue | null,
  group: TaxonomyGroup,
  fieldLabel: string
) {
  const options = await getActiveTaxonomyOptions(group);
  return parseNullableTaxonomyValue(value, options, fieldLabel);
}

async function getUsageCount(row: Pick<TaxonomyRow, "taxonomy_group" | "value">) {
  const supabase = await createClient();

  if (row.taxonomy_group === "service_category") {
    const { count, error } = await supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .contains("category_labels", [row.value]);

    if (error) throw error;
    return count ?? 0;
  }

  if (row.taxonomy_group === "service_badge") {
    const { count, error } = await supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("badge", row.value);

    if (error) throw error;
    return count ?? 0;
  }

  if (row.taxonomy_group === "gallery_category") {
    const { count, error } = await supabase
      .from("gallery_items")
      .select("id", { count: "exact", head: true })
      .eq("category", row.value);

    if (error) throw error;
    return count ?? 0;
  }

  const { count, error } = await supabase
    .from("faqs")
    .select("id", { count: "exact", head: true })
    .eq("category", row.value);

  if (error) throw error;
  return count ?? 0;
}

export async function getTaxonomyUsageCount(
  group: TaxonomyGroup,
  value: string
) {
  return getUsageCount({ taxonomy_group: group, value });
}

export async function getAdminTaxonomyGroups(): Promise<AdminTaxonomyGroup[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("taxonomies")
    .select("*")
    .order("taxonomy_group", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = data || [];
  const rowsWithUsage = await Promise.all(
    rows.map(async (row) => ({
      ...row,
      usage_count: await getUsageCount(row),
    }))
  );

  return TAXONOMY_GROUPS.map((group) => ({
    ...group,
    items: rowsWithUsage.filter((row) => row.taxonomy_group === group.value),
    createDefaultValue: "",
  }));
}
