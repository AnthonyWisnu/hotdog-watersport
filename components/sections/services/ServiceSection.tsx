import Image from "next/image";
import { CheckCircle } from "lucide-react";
import type { ServiceData } from "@/lib/services-data";
import { WhatsAppButton } from "@/components/ui/Button";

interface Props {
  service: ServiceData;
}

export default function ServiceSection({ service }: Props) {
  return (
    <section
      id={service.slug}
      aria-labelledby={`service-heading-${service.id}`}
      className="section-padding border-b border-border last:border-0"
    >
      <div className="container-content">
        {/* Section header */}
        <div className="mb-12">
          <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">
            Rental Service
          </p>
          <h2
            id={`service-heading-${service.id}`}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary leading-tight"
          >
            {service.headline}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: info */}
          <div>
            <h3 className="font-display text-2xl font-bold text-text-primary mb-4">
              {service.title}
            </h3>
            <p className="text-text-muted leading-relaxed mb-8">{service.description}</p>

            {/* Equipment list */}
            <div className="mb-8">
              <h4 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wider">
                Available Equipment
              </h4>
              <ul className="space-y-2">
                {service.equipment.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-text-muted">
                    <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Rental info */}
            <div className="rounded-xl bg-surface-muted border border-border p-5 mb-8 space-y-2 text-sm">
              <div>
                <span className="font-semibold text-text-primary">Rental duration: </span>
                <span className="text-text-muted">{service.rentalInfo}</span>
              </div>
              <div>
                <span className="font-semibold text-text-primary">Notes: </span>
                <span className="text-text-muted">{service.operationalNotes}</span>
              </div>
            </div>

            <WhatsAppButton message={service.whatsappMessage}>
              Inquire about {service.title}
            </WhatsAppButton>
          </div>

          {/* Right: photo gallery */}
          <div className="grid grid-cols-2 gap-3">
            {service.images.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-xl bg-surface-card ${i === 0 ? "col-span-2 h-64" : "h-44"}`}
              >
                <Image
                  src={src}
                  alt={`${service.title}, photo ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
