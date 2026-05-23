import { FAQ_ITEMS, type FAQItem } from "@/lib/faq-data";
import { createClient } from "@/lib/supabase/server";
import { isAdminPreviewEnabled } from "@/lib/admin/preview";

export async function getPublishedFAQs(): Promise<FAQItem[]> {
  const preview = await isAdminPreviewEnabled();
  const supabase = await createClient();
  let query = supabase
    .from("faqs")
    .select("id,category,question,answer")
    .order("sort_order", { ascending: true });

  query = preview ? query.neq("status", "archived") : query.eq("status", "published");

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return FAQ_ITEMS;
  }

  return data as FAQItem[];
}

export async function getAdminFAQs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id,category,question,answer,sort_order,status")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data || []) as Array<{
    id: string;
    category: string;
    question: string;
    answer: string;
    sort_order: number;
    status: "draft" | "published" | "archived";
  }>;
}
