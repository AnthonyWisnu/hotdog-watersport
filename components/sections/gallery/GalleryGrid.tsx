"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { GALLERY_CATEGORIES, GALLERY_PAGE_SIZE, type GalleryCategory, type GalleryItem } from "@/lib/gallery-data";
import GlareHover from "@/components/animations/GlareHover";
import Lightbox from "./Lightbox";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [visibleCount, setVisibleCount] = useState(GALLERY_PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const tablistRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const openLightbox = (localIndex: number) => {
    const item = visible[localIndex];
    const globalIndex = filtered.findIndex((i) => i.id === item.id);
    setLightboxIndex(globalIndex);
  };

  const selectCategory = (id: GalleryCategory) => {
    setActiveCategory(id);
    setVisibleCount(GALLERY_PAGE_SIZE);
    setLightboxIndex(null);
  };

  // Arrow-key navigation between tabs per ARIA tabs pattern
  const handleTabKeyDown = useCallback((e: React.KeyboardEvent, currentId: GalleryCategory) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const ids = GALLERY_CATEGORIES.map((c) => c.id);
    const currentIndex = ids.indexOf(currentId);
    const nextIndex = e.key === "ArrowRight"
      ? (currentIndex + 1) % ids.length
      : (currentIndex - 1 + ids.length) % ids.length;
    const nextId = ids[nextIndex];
    selectCategory(nextId);
    // Move focus to the newly active tab
    const tabs = tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[nextIndex]?.focus();
  }, []);

  return (
    <>
      <section aria-labelledby="gallery-heading" className="pt-32 pb-24">
        <div className="container-content">
          {/* Page header */}
          <div className="mb-10">
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-2 text-sm text-text-muted list-none p-0">
                <li><Link href="/" className="hover:text-text-primary transition-colors">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-text-primary font-medium">Gallery</li>
              </ol>
            </nav>
            <h1 id="gallery-heading" className="font-display text-5xl sm:text-6xl font-bold text-text-primary">
              Gallery
            </h1>
          </div>

          {/* Filter tabs, ARIA tablist with arrow-key navigation */}
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Filter gallery by category"
            className="flex flex-wrap gap-2 mb-10"
          >
            {GALLERY_CATEGORIES.map(({ id, label }) => {
              const isActive = activeCategory === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectCategory(id)}
                  onKeyDown={(e) => handleTabKeyDown(e, id)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary
                    ${isActive
                      ? "bg-primary text-white shadow-sm"
                      : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0A0F1A] border border-[#E2E8F0]"
                    }
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Masonry grid */}
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {visible.map((item, i) => (
              <button
                key={item.id}
                onClick={() => openLightbox(i)}
                className="break-inside-avoid block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:rounded-xl"
                aria-label={`View full image: ${item.alt}`}
              >
                <GlareHover className="rounded-xl overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </GlareHover>
              </button>
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + GALLERY_PAGE_SIZE)}
                className="px-8 py-3 rounded-full border border-[#E2E8F0] text-sm font-medium text-[#64748B] hover:text-[#0A0F1A] hover:border-primary transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                Load more ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      </section>

      <Lightbox
        items={filtered}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
        onNext={() => setLightboxIndex((i) => (i !== null && i < filtered.length - 1 ? i + 1 : i))}
      />
    </>
  );
}
