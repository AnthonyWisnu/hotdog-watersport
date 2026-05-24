import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import AboutHero from "@/components/sections/about/AboutHero";
import BrandStory from "@/components/sections/about/BrandStory";
import CompanyValues from "@/components/sections/about/CompanyValues";
import SafetyCommitment from "@/components/sections/about/SafetyCommitment";
import { getBusinessProfile } from "@/lib/cms/settings";
import { getGalleryPreviewItems } from "@/lib/cms/gallery";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about PT Hot Dog Water Sport: our story, values, and commitment to safety and quality in water sports rental.",
  path: "/about",
});

export default async function AboutPage() {
  const [profile, galleryItems] = await Promise.all([
    getBusinessProfile(),
    getGalleryPreviewItems(),
  ]);

  return (
    <>
      <AboutHero />
      <BrandStory profile={profile} images={galleryItems.slice(0, 2)} />
      <CompanyValues />
      <SafetyCommitment />
    </>
  );
}
