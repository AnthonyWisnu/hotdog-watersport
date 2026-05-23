"use client";

import { useState } from "react";
import type { CmsService } from "@/lib/cms/services";
import ServiceCard, { type ServiceCardMeta } from "./ServiceCard";

const CATEGORIES = [
  "All",
  "Speed",
  "Adrenaline Rush",
  "Sky Experience",
  "Fun & Leisure",
  "Ocean Discovery",
] as const;

type Category = (typeof CATEGORIES)[number];

function getServiceMeta(service: CmsService): ServiceCardMeta {
  return {
    category: service.categoryLabels[0] || "Fun & Leisure",
    duration: service.duration || "Ask for duration",
    price: service.price || "Ask for price",
    rating: Math.round(service.rating || 5),
    popular: service.isPopular || service.badge === "Popular",
  };
}

export default function ServicesGrid({ services }: { services: CmsService[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter(
          (service) => getServiceMeta(service).category === activeCategory
        );

  return (
    <section aria-labelledby="services-heading" className="pt-32 pb-24">
      <div className="container-content">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Water Sports Rental
          </p>
          <h1
            id="services-heading"
            className="mt-3 font-display text-5xl font-bold text-primary sm:text-6xl"
          >
            Our Services
          </h1>
        </div>

        <div
          aria-label="Filter services by category"
          className="mb-20 flex gap-3 overflow-x-auto pb-2"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-7 py-3 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "bg-primary text-white"
                    : "border border-slate-300 bg-white text-[#0A0F1A] hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                meta={getServiceMeta(service)}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-cyan-100 bg-cyan-50 px-6 py-5 text-slate-600">
            No services available in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
