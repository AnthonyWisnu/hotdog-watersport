import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getPublishedServices } from "@/lib/cms/services";
import { getSiteSettings } from "@/lib/cms/settings";
import { getGalleryPreviewItems } from "@/lib/cms/gallery";
import { getPublishedTestimonials } from "@/lib/cms/testimonials";
import HeroSection from "@/components/sections/home/HeroSection";
import BrandStatement from "@/components/sections/home/BrandStatement";
import ServicesPreview from "@/components/sections/home/ServicesPreview";
import GalleryTeaser from "@/components/sections/home/GalleryTeaser";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import WhyChooseUs from "@/components/sections/home/WhyChooseUs";
import CTABanner from "@/components/sections/home/CTABanner";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return buildMetadata({
    title: settings.meta_title || "PT Hot Dog Water Sport | Premium Water Sports Rental",
    description:
      settings.meta_description ||
      "Rent surfboards, jet skis, diving equipment, and swimming gear. Premium water sports rental with top safety standards. Book instantly via WhatsApp.",
    path: "/",
    ogImage: settings.og_image_url || "/og-default.jpg",
  });
}

export default async function HomePage() {
  const [services, settings, galleryItems, testimonials] = await Promise.all([
    getPublishedServices(),
    getSiteSettings(),
    getGalleryPreviewItems(),
    getPublishedTestimonials(),
  ]);

  return (
    <>
      <HeroSection settings={settings} fallbackHeroMediaUrl={galleryItems[0]?.src} />
      <BrandStatement />
      <ServicesPreview services={services} />
      <GalleryTeaser items={galleryItems} />
      <WhyChooseUs />
      <TestimonialsSection testimonials={testimonials} />
      <CTABanner backgroundUrl={galleryItems[0]?.src} />
    </>
  );
}
