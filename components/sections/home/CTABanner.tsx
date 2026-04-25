import Image from "next/image";
import { WhatsAppButton } from "@/components/ui/Button";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function CTABanner() {
  return (
    <section
      aria-labelledby="cta-banner-heading"
      className="relative py-28 sm:py-36 overflow-hidden bg-surface-dark"
    >
      <Image
        src="/images/placeholder/cta-bg.jpg"
        alt=""
        fill
        className="object-cover opacity-40"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-surface-dark/50 to-surface-dark/80" aria-hidden="true" />

      <ScrollReveal direction="up" distance={40} className="relative z-10 container-content text-center text-text-inverse">
        <p className="text-secondary font-semibold tracking-[0.2em] uppercase text-sm mb-4">
          Ready to Go?
        </p>
        <h2
          id="cta-banner-heading"
          className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 [text-wrap:balance] leading-tight"
        >
          Your next adventure is one message away.
        </h2>
        <p className="text-white/70 text-lg max-w-xl mx-auto mb-10 [text-wrap:balance]">
          Chat with us on WhatsApp, tell us what you need, and we&apos;ll handle the rest.
        </p>
        <WhatsAppButton size="xl" />
      </ScrollReveal>
    </section>
  );
}
