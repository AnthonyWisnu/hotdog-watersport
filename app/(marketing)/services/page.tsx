import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getPublishedServices } from "@/lib/cms/services";
import ServicesGrid from "@/components/sections/services/ServicesGrid";

export const metadata: Metadata = buildMetadata({
  title: "Our Services",
  description:
    "Explore our full range of water sports rentals: surfboards, jet skis, diving equipment, and swimming gear. Inquire via WhatsApp for pricing and availability.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getPublishedServices();
  return <ServicesGrid services={services} />;
}
