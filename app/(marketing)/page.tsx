import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import HeroSection from "@/components/sections/home/HeroSection";
import BrandStatement from "@/components/sections/home/BrandStatement";
import ServicesPreview from "@/components/sections/home/ServicesPreview";
import GalleryTeaser from "@/components/sections/home/GalleryTeaser";
import WhyChooseUs from "@/components/sections/home/WhyChooseUs";
import CTABanner from "@/components/sections/home/CTABanner";

export const metadata: Metadata = buildMetadata({
  title: "PT Hot Dog Water Sport | Premium Water Sports Rental",
  description:
    "Rent surfboards, jet skis, diving equipment, and swimming gear. Premium water sports rental with top safety standards. Book instantly via WhatsApp.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandStatement />
      <ServicesPreview />
      <GalleryTeaser />
      <WhyChooseUs />
      <CTABanner />
    </>
  );
}
