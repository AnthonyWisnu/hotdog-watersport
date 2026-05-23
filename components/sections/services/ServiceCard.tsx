import Image from "next/image";
import { Clock, Star } from "lucide-react";
import type { ServiceData } from "@/lib/services-data";
import { buildWhatsAppURL } from "@/lib/whatsapp";

export interface ServiceCardMeta {
  category: string;
  duration: string;
  price: string;
  rating: number;
  popular?: boolean;
}

interface ServiceCardProps {
  service: ServiceData;
  meta: ServiceCardMeta;
}

export default function ServiceCard({ service, meta }: ServiceCardProps) {
  return (
    <article
      id={service.slug}
      className="overflow-hidden rounded-xl border border-cyan-100 bg-white shadow-[0_12px_32px_rgba(8,145,178,0.10)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-card">
        <Image
          src={service.images[0]}
          alt={`${service.title} service`}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
          {meta.category}
        </span>
        {meta.popular ? (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-[#0A0F1A]">
            <Star size={13} fill="currentColor" aria-hidden="true" />
            Popular
          </span>
        ) : null}
      </div>

      <div className="flex min-h-[390px] flex-col p-7">
        <h2 className="font-display text-3xl font-bold text-primary">
          {service.title}
        </h2>
        <p className="mt-2 font-semibold text-primary">{service.headline}</p>
        <p className="mt-5 flex-1 text-base leading-relaxed text-slate-600">
          {service.description}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-cyan-100 pt-5 text-sm font-semibold text-slate-700">
          <span className="inline-flex items-center gap-2">
            <Clock size={16} className="text-primary" aria-hidden="true" />
            {meta.duration}
          </span>
          <span className="inline-flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: meta.rating }).map((_, index) => (
              <Star
                key={index}
                size={15}
                fill="currentColor"
                aria-hidden="true"
              />
            ))}
            <span className="sr-only">{meta.rating} star rating</span>
          </span>
        </div>

        <a
          href={buildWhatsAppURL(service.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 block w-full rounded-xl border border-cyan-300 bg-cyan-100 px-5 py-4 text-center text-xl font-bold text-primary transition-colors hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {meta.price}
        </a>
      </div>
    </article>
  );
}
