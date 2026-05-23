import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import ContactInfo from "@/components/sections/contact/ContactInfo";
import { getSiteSettings } from "@/lib/cms/settings";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Get in touch with PT Hot Dog Water Sport. Book via WhatsApp, find our location, or drop us a message.",
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <ContactInfo settings={settings} />;
}
