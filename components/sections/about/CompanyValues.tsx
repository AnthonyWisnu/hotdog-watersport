import { ShieldCheck, Wrench, Globe } from "lucide-react";
import ScrollReveal, { StaggerReveal, StaggerItem } from "@/components/animations/ScrollReveal";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    description:
      "Every activity begins with a thorough safety briefing. Life jackets, helmets, and all mandatory safety gear are always provided. We never compromise on the well-being of our guests.",
  },
  {
    icon: Wrench,
    title: "Well-Maintained Equipment",
    description:
      "Our equipment goes through systematic pre-session inspections and scheduled professional servicing. We invest in quality gear so you can focus on enjoying every moment.",
  },
  {
    icon: Globe,
    title: "Local Expertise",
    description:
      "We know our waters: the tides, the conditions, the best spots. Years of operating in this destination means we can give you the authentic, insider experience that tourists rarely find on their own.",
  },
];

export default function CompanyValues() {
  return (
    <section aria-labelledby="values-heading" className="section-padding bg-surface-muted">
      <div className="container-content">
        <ScrollReveal className="text-center mb-14">
          <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">
            What We Stand For
          </p>
          <h2 id="values-heading" className="font-display text-4xl sm:text-5xl font-bold text-text-primary">
            Our Values
          </h2>
        </ScrollReveal>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-8" stagger={0.12}>
          {VALUES.map(({ icon: Icon, title, description }) => (
            <StaggerItem key={title}>
              <div className="bg-surface rounded-2xl p-8 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold text-text-primary mb-3">{title}</h3>
                <p className="text-text-muted leading-relaxed text-sm">{description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
