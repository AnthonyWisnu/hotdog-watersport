import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Waves, Zap, Anchor, Droplets } from "lucide-react";
import type { CmsService } from "@/lib/cms/services";
import ScrollReveal, { StaggerReveal, StaggerItem } from "@/components/animations/ScrollReveal";
import SpotlightCard from "@/components/animations/SpotlightCard";

const ICON_MAP: Record<string, React.ElementType> = {
  Waves, Zap, Anchor, Droplets,
};

export default function ServicesPreview({ services }: { services: CmsService[] }) {
  return (
    <section
      id="services-preview"
      aria-labelledby="services-preview-heading"
      className="section-padding bg-surface"
    >
      <div className="container-content">
        {/* Header */}
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">
              What We Offer
            </p>
            <h2
              id="services-preview-heading"
              className="font-display text-4xl sm:text-5xl font-bold text-text-primary"
            >
              Our Services
            </h2>
          </div>
          <Link
            href="/services"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors shrink-0"
          >
            View all services <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </ScrollReveal>

        {/* Cards */}
        <StaggerReveal
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          stagger={0.1}
          delay={0.1}
        >
          {services.slice(0, 4).map((service) => {
            const Icon = ICON_MAP[service.icon] ?? Waves;
            return (
              <StaggerItem key={service.id}>
                <SpotlightCard className="group h-full rounded-2xl overflow-hidden bg-surface-card border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                  <Link href={`/services#${service.slug}`} className="flex flex-col h-full">
                    {/* Image */}
                    <div className="relative h-48 bg-surface-muted overflow-hidden">
                      <Image
                        src={service.images[0]}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-surface-dark/20 group-hover:bg-surface-dark/10 transition-colors" />
                      <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-primary">
                        <Icon size={18} aria-hidden="true" />
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="font-display text-lg font-semibold text-text-primary mb-1.5">
                        {service.title}
                      </h3>
                      <p className="text-sm text-text-muted leading-relaxed flex-1">
                        {service.description.slice(0, 90)}…
                      </p>
                      <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                        Learn more <ArrowRight size={14} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
