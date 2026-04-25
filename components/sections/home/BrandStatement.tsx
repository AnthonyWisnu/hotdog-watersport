import ScrollReveal from "@/components/animations/ScrollReveal";

export default function BrandStatement() {
  return (
    <section
      aria-labelledby="brand-statement-heading"
      className="section-padding bg-surface-dark text-text-inverse overflow-hidden"
    >
      <div className="container-content max-w-4xl">
        <ScrollReveal direction="up" distance={48} delay={0.05}>
          <p
            id="brand-statement-heading"
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight [text-wrap:balance] text-primary-light"
          >
            Every wave deserves{" "}
            <span className="text-white italic">world-class equipment</span>{" "}
            and a team that puts your safety first.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
