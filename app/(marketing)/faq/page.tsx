import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import FAQAccordion from "@/components/sections/faq/FAQAccordion";
import SafetyStandards from "@/components/sections/faq/SafetyStandards";
import { getPublishedFAQs } from "@/lib/cms/faqs";
import { getActiveTaxonomyOptions } from "@/lib/cms/taxonomies";

export const metadata: Metadata = buildMetadata({
  title: "FAQ & Safety",
  description:
    "Frequently asked questions about water sports rentals, booking, safety standards, and equipment at PT Hot Dog Water Sport.",
  path: "/faq",
});

export default async function FAQPage() {
  const [items, categories] = await Promise.all([
    getPublishedFAQs(),
    getActiveTaxonomyOptions("faq_category"),
  ]);

  return (
    <>
      <SafetyStandards />
      <FAQAccordion items={items} categories={categories} />
    </>
  );
}
