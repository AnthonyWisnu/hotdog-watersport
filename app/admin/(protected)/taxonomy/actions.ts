"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import {
  getTaxonomyUsageCount,
  isTaxonomyGroup,
  type TaxonomyGroup,
  type TaxonomyStatus,
} from "@/lib/cms/taxonomies";
import type { SortDirection } from "@/lib/admin/sort-order";

function taxonomyGroupValue(formData: FormData) {
  const group = String(formData.get("taxonomy_group") || "");

  if (!isTaxonomyGroup(group)) {
    throw new Error("Invalid taxonomy group.");
  }

  return group;
}

function taxonomyStatusValue(formData: FormData): TaxonomyStatus {
  const status = String(formData.get("status") || "active");
  return status === "inactive" || status === "archived" ? status : "active";
}

function requiredText(value: FormDataEntryValue | null, label: string) {
  const text = String(value || "").trim();

  if (!text) {
    throw new Error(`${label} is required.`);
  }

  return text;
}

function nullableText(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text || null;
}

function revalidateTaxonomyPaths() {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/gallery");
  revalidatePath("/faq");
  revalidatePath("/admin");
  revalidatePath("/admin/taxonomy");
  revalidatePath("/admin/services");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/faqs");
}

async function getNextTaxonomySortOrder(group: TaxonomyGroup) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("taxonomies")
    .select("sort_order")
    .eq("taxonomy_group", group)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.sort_order ?? 0) + 10;
}

async function getTaxonomy(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("taxonomies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createTaxonomy(formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const taxonomyGroup = taxonomyGroupValue(formData);
  const value = requiredText(formData.get("value"), "Value");
  const label = requiredText(formData.get("label"), "Label");

  const { error } = await supabase.from("taxonomies").insert({
    taxonomy_group: taxonomyGroup,
    value,
    label,
    description: nullableText(formData.get("description")),
    sort_order: await getNextTaxonomySortOrder(taxonomyGroup),
    status: taxonomyStatusValue(formData),
    created_by: user.id,
    updated_by: user.id,
  });

  if (error) {
    throw error;
  }

  revalidateTaxonomyPaths();
}

export async function updateTaxonomy(id: string, formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const current = await getTaxonomy(id);
  const nextValue = requiredText(formData.get("value"), "Value");

  if (nextValue !== current.value) {
    const usageCount = await getTaxonomyUsageCount(
      current.taxonomy_group,
      current.value
    );

    if (usageCount > 0) {
      throw new Error("Value cannot be changed while this taxonomy is in use.");
    }
  }

  const { error } = await supabase
    .from("taxonomies")
    .update({
      value: nextValue,
      label: requiredText(formData.get("label"), "Label"),
      description: nullableText(formData.get("description")),
      status: taxonomyStatusValue(formData),
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidateTaxonomyPaths();
}

export async function archiveTaxonomy(id: string) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("taxonomies")
    .update({
      status: "archived",
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidateTaxonomyPaths();
}

export async function deleteTaxonomy(id: string) {
  await requireAdmin();
  const current = await getTaxonomy(id);
  const usageCount = await getTaxonomyUsageCount(
    current.taxonomy_group,
    current.value
  );

  if (usageCount > 0) {
    throw new Error("Taxonomy values that are in use cannot be deleted.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("taxonomies").delete().eq("id", id);

  if (error) {
    throw error;
  }

  revalidateTaxonomyPaths();
}

export async function moveTaxonomy(id: string, direction: SortDirection) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const current = await getTaxonomy(id);
  const { data, error } = await supabase
    .from("taxonomies")
    .select("id,sort_order,created_at")
    .eq("taxonomy_group", current.taxonomy_group)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = data || [];
  const currentIndex = rows.findIndex((row) => row.id === id);
  const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= rows.length) {
    return;
  }

  const currentRow = rows[currentIndex];
  const nextRow = rows[nextIndex];
  const results = await Promise.all([
    supabase
      .from("taxonomies")
      .update({
        sort_order: nextRow.sort_order,
        updated_by: user.id,
      })
      .eq("id", currentRow.id),
    supabase
      .from("taxonomies")
      .update({
        sort_order: currentRow.sort_order,
        updated_by: user.id,
      })
      .eq("id", nextRow.id),
  ]);

  for (const result of results) {
    if (result.error) {
      throw result.error;
    }
  }

  revalidateTaxonomyPaths();
}
