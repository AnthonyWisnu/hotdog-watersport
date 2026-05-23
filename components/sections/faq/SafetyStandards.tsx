import Link from "next/link";
import { ShieldCheck, Wrench, MessageCircle, HardHat, AlertTriangle } from "lucide-react";

const STANDARDS = [
  {
    icon: ShieldCheck,
    title: "Certified Operations",
    description: "Our operations comply with local maritime safety regulations. All equipment meets or exceeds required safety standards.",
  },
  {
    icon: Wrench,
    title: "Routine Inspections",
    description: "Every piece of equipment is checked before each rental. Mechanical equipment is professionally serviced on schedule.",
  },
  {
    icon: MessageCircle,
    title: "Mandatory Briefing",
    description: "All participants attend a safety briefing before their session. No exceptions. Your understanding of the rules protects everyone.",
  },
  {
    icon: HardHat,
    title: "Safety Gear Provided",
    description: "Life jackets, helmets (where applicable), and all required protective equipment are included in every rental at no extra cost.",
  },
];

export default function SafetyStandards() {
  return (
    <section aria-labelledby="safety-standards-heading" className="pt-32 pb-16 bg-surface-dark text-text-inverse">
      <div className="container-content">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-white/50 list-none p-0">
            <li><Link href="/" className="hover:text-white/80 transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-white/80 font-medium">FAQ & Safety</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-secondary font-semibold tracking-widest uppercase text-sm mb-3">
              Safety First
            </p>
            <h1 id="safety-standards-heading" className="font-display text-5xl sm:text-6xl font-bold mb-6">
              Your Safety, Our Standard
            </h1>
            <p className="text-white/70 leading-relaxed text-lg max-w-lg">
              We don&apos;t cut corners when it comes to safety. Here&apos;s what every guest can expect at PT Hot Dog Water Sport.
            </p>

            {/* Weather warning callout */}
            <div className="mt-8 rounded-xl bg-amber-500/10 border border-amber-500/30 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-amber-200 text-sm leading-relaxed">
                  <strong className="text-amber-100">Weather policy:</strong> Activities are suspended in extreme weather or when wave conditions exceed safe operating limits. We monitor conditions continuously and notify you immediately of any changes.
                </p>
              </div>
            </div>
          </div>

          <ul className="grid sm:grid-cols-2 gap-5 list-none p-0">
            {STANDARDS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-3">
                  <Icon size={18} aria-hidden="true" />
                </div>
                <h2 className="font-semibold text-white mb-1.5">{title}</h2>
                <p className="text-white/60 text-sm leading-relaxed">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
