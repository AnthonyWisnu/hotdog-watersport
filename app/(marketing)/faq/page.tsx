import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import FAQAccordion from "@/components/sections/faq/FAQAccordion";
import SafetyStandards from "@/components/sections/faq/SafetyStandards";

export const metadata: Metadata = buildMetadata({
  title: "FAQ & Safety",
  description:
    "Frequently asked questions about water sports rentals, booking, safety standards, and equipment at PT Hot Dog Water Sport.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <>
      <SafetyStandards />
      <FAQAccordion />
    </>
  );
}
