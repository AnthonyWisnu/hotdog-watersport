"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import {
  getNextSortOrder,
  moveSortOrder,
  parseSortOrder,
  type SortDirection,
} from "@/lib/admin/sort-order";
import { parseActiveTaxonomyValue } from "@/lib/cms/taxonomies";
import { createClient } from "@/lib/supabase/server";

async function faqCategoryValue(formData: FormData) {
  return parseActiveTaxonomyValue(
    formData.get("category"),
    "faq_category",
    "FAQ category",
    "general"
  );
}

export async function createFAQ(formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").insert({
    question: String(formData.get("question") || "").trim(),
    answer: String(formData.get("answer") || "").trim(),
    category: await faqCategoryValue(formData),
    sort_order: parseSortOrder(
      formData.get("sort_order"),
      await getNextSortOrder("faqs")
    ),
    status: String(formData.get("status") || "draft") as "draft" | "published" | "archived",
    created_by: user.id,
    updated_by: user.id,
  });

  if (error) throw error;
  revalidatePath("/faq");
  revalidatePath("/admin/faqs");
}

export async function updateFAQ(id: string, formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("faqs")
    .update({
      question: String(formData.get("question") || "").trim(),
      answer: String(formData.get("answer") || "").trim(),
      category: await faqCategoryValue(formData),
      sort_order: parseSortOrder(formData.get("sort_order"), 0),
      status: String(formData.get("status") || "draft") as "draft" | "published" | "archived",
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/faq");
  revalidatePath("/admin/faqs");
}

export async function moveFAQ(id: string, direction: SortDirection) {
  const { user } = await requireAdmin();
  await moveSortOrder("faqs", id, direction, user.id);

  revalidatePath("/faq");
  revalidatePath("/admin/faqs");
}

export async function deleteFAQ(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/faq");
  revalidatePath("/admin/faqs");
}
