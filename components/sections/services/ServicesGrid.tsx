"use client";

import { useState } from "react";
import type { CmsService } from "@/lib/cms/services";
import { SERVICE_CATEGORY_OPTIONS, type TaxonomyOption } from "@/lib/taxonomy";
import ServiceCard, { type ServiceCardMeta } from "./ServiceCard";

function getServiceMeta(
  service: CmsService,
  labelByValue: Map<string, string>
): ServiceCardMeta {
  const categoryValue = service.categoryLabels[0] || "Fun & Leisure";

  return {
    category: labelByValue.get(categoryValue) || categoryValue,
    duration: service.duration || "Ask for duration",
    price: service.price || "Ask for price",
    rating: Math.round(service.rating || 5),
    popular: service.isPopular || service.badge === "Popular",
  };
}

export default function ServicesGrid({
  services,
  categories = SERVICE_CATEGORY_OPTIONS,
}: {
  services: CmsService[];
  categories?: readonly TaxonomyOption[];
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const labelByValue = new Map(
    categories.map((category) => [category.value, category.label])
  );

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((service) =>
          service.categoryLabels.includes(activeCategory)
        );
  const categoryTabs = [
    { value: "All", label: "All" },
    ...categories,
  ];

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
          {categoryTabs.map((category) => {
            const isActive = activeCategory === category.value;
            return (
              <button
                key={category.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category.value)}
                className={`shrink-0 rounded-full px-7 py-3 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "bg-primary text-white"
                    : "border border-slate-300 bg-white text-[#0A0F1A] hover:border-primary hover:text-primary"
                }`}
              >
                {category.label}
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
                meta={getServiceMeta(service, labelByValue)}
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
