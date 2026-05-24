import { createClient } from "@/lib/supabase/server";

export type SortDirection = "up" | "down";

type SortableTable = "services" | "gallery_items" | "faqs" | "testimonials";

interface SortableRow {
  id: string;
  sort_order: number;
  created_at: string;
}

export function parseSortOrder(
  value: FormDataEntryValue | null,
  fallback: number
) {
  if (value === null) {
    return fallback;
  }

  const text = String(value).trim();
  if (!text) {
    return fallback;
  }

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function getNextSortOrder(table: SortableTable) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.sort_order ?? 0) + 10;
}

export async function moveSortOrder(
  table: SortableTable,
  id: string,
  direction: SortDirection,
  updatedBy: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table)
    .select("id,sort_order,created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data || []) as SortableRow[];
  const currentIndex = rows.findIndex((row) => row.id === id);
  const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= rows.length) {
    return;
  }

  const currentRow = rows[currentIndex];
  const nextRow = rows[nextIndex];

  const updates = [
    supabase
      .from(table)
      .update({
        sort_order: nextRow.sort_order,
        updated_by: updatedBy,
      })
      .eq("id", currentRow.id),
    supabase
      .from(table)
      .update({
        sort_order: currentRow.sort_order,
        updated_by: updatedBy,
      })
      .eq("id", nextRow.id),
  ];

  const results = await Promise.all(updates);
  for (const result of results) {
    if (result.error) {
      throw result.error;
    }
  }
}
