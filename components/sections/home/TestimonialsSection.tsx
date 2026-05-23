import { Star } from "lucide-react";
import type { TestimonialItem } from "@/lib/cms/testimonials";
import ScrollReveal, { StaggerItem, StaggerReveal } from "@/components/animations/ScrollReveal";

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: TestimonialItem[];
}) {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="testimonials-heading" className="section-padding bg-surface">
      <div className="container-content">
        <ScrollReveal className="mb-10">
          <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">
            Guest Reviews
          </p>
          <h2
            id="testimonials-heading"
            className="font-display text-4xl sm:text-5xl font-bold text-text-primary"
          >
            What Guests Say
          </h2>
        </ScrollReveal>

        <StaggerReveal className="grid gap-5 md:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <article className="h-full rounded-lg border border-border bg-white p-5">
                <div className="mb-4 flex gap-0.5 text-amber-400">
                  {Array.from({ length: Math.round(testimonial.rating) }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-text-muted">
                  {testimonial.review}
                </p>
                <div className="mt-5">
                  <p className="font-semibold text-text-primary">
                    {testimonial.guest_name}
                  </p>
                  {testimonial.guest_origin ? (
                    <p className="text-sm text-text-muted">{testimonial.guest_origin}</p>
                  ) : null}
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
