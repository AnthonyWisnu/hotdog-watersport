import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { SERVICES } from "@/lib/services-data";
import ServiceSection from "@/components/sections/services/ServiceSection";

export const metadata: Metadata = buildMetadata({
  title: "Our Services",
  description:
    "Explore our full range of water sports rentals: surfboards, jet skis, diving equipment, and swimming gear. Inquire via WhatsApp for pricing and availability.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      {/* Sticky anchor nav */}
      <nav
        aria-label="Services navigation"
        className="sticky top-16 z-30 bg-surface/90 backdrop-blur-md border-b border-border"
      >
        <div className="container-content">
          <ul className="flex gap-6 py-3 overflow-x-auto text-sm font-medium">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.slug}`}
                  className="text-text-muted hover:text-text-primary transition-colors whitespace-nowrap"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {SERVICES.map((service) => (
        <ServiceSection key={service.id} service={service} />
      ))}
    </>
  );
}
