import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { GalleryItem } from "@/lib/gallery-data";
import ScrollReveal, { StaggerReveal, StaggerItem } from "@/components/animations/ScrollReveal";
import GlareHover from "@/components/animations/GlareHover";

export default function GalleryTeaser({ items }: { items: GalleryItem[] }) {
  const preview = items.slice(0, 6);
  return (
    <section
      aria-labelledby="gallery-teaser-heading"
      className="section-padding bg-surface-muted"
    >
      <div className="container-content">
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">
              In Action
            </p>
            <h2
              id="gallery-teaser-heading"
              className="font-display text-4xl sm:text-5xl font-bold text-text-primary"
            >
              Life on the Water
            </h2>
          </div>
          <Link
            href="/gallery"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors shrink-0"
          >
            Full gallery <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </ScrollReveal>

        <StaggerReveal className="columns-2 sm:columns-3 gap-3 space-y-3" stagger={0.07}>
          {preview.map((item) => (
            <StaggerItem key={item.id}>
              <GlareHover className="break-inside-avoid rounded-xl overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </GlareHover>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
