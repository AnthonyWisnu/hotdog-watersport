import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getPublishedGalleryItems } from "@/lib/cms/gallery";
import { getActiveTaxonomyOptions } from "@/lib/cms/taxonomies";
import GalleryGrid from "@/components/sections/gallery/GalleryGrid";

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description:
    "Browse our photo and video gallery of surfing, jet skiing, diving, and swimming at its finest.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const [items, categoryOptions] = await Promise.all([
    getPublishedGalleryItems(),
    getActiveTaxonomyOptions("gallery_category"),
  ]);
  const categories = [{ value: "all", label: "All" }, ...categoryOptions];

  return <GalleryGrid items={items} categories={categories} />;
}
