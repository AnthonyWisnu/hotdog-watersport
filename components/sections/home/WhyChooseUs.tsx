import { ShieldCheck, Wrench, MapPin, Star } from "lucide-react";
import ScrollReveal, { StaggerReveal, StaggerItem } from "@/components/animations/ScrollReveal";
import CountUp from "@/components/animations/CountUp";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    description:
      "Mandatory briefings, life jackets on every session, and regular equipment inspections. Your safety is never negotiable.",
    statType: "text" as const,
    statText: "100%",
    statLabel: "safety briefing compliance",
  },
  {
    icon: Wrench,
    title: "Well-Maintained Equipment",
    description:
      "Every piece of gear is inspected before use and serviced on schedule. You get equipment that performs like new, every time.",
    statType: "text" as const,
    statText: "Pre-session",
    statLabel: "equipment inspection",
  },
  {
    icon: Star,
    title: "Experienced Team",
    description:
      "Our team has served hundreds of international guests. We speak English and know exactly what adventurers need.",
    statType: "number" as const,
    statEnd: 500,
    statSuffix: "+",
    statLabel: "happy guests served",
  },
  {
    icon: MapPin,
    title: "Prime Location",
    description:
      "Strategically positioned at a top water sports destination, giving you more time on the water and less time travelling.",
    statType: "text" as const,
    statText: "Beachfront",
    statLabel: "access",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      aria-labelledby="why-choose-heading"
      className="section-padding bg-surface"
    >
      <div className="container-content">
        <ScrollReveal className="text-center mb-14">
          <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">
            Why Us
          </p>
          <h2
            id="why-choose-heading"
            className="font-display text-4xl sm:text-5xl font-bold text-text-primary"
          >
            The Hot Dog Difference
          </h2>
        </ScrollReveal>

        <StaggerReveal
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          stagger={0.12}
        >
          {PILLARS.map(({ icon: Icon, title, description, statType, statLabel, ...stat }) => (
            <StaggerItem key={title}>
              <div className="flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Icon size={22} aria-hidden="true" />
                </div>

                <div className="text-3xl font-display font-bold text-text-primary mb-0.5">
                  {statType === "number" ? (
                    <CountUp
                      end={"statEnd" in stat ? (stat.statEnd ?? 0) : 0}
                      suffix={"statSuffix" in stat ? stat.statSuffix : ""}
                    />
                  ) : (
                    ("statText" in stat ? stat.statText : "")
                  )}
                </div>
                <div className="text-xs text-text-muted uppercase tracking-wider mb-3">
                  {statLabel}
                </div>
                <h3 className="font-display font-semibold text-lg text-text-primary mb-2">
                  {title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">{description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
