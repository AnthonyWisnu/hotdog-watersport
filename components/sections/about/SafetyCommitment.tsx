import { CheckCircle, AlertTriangle } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/Button";

const STANDARDS = [
  "Pre-session equipment inspection before every rental",
  "Mandatory safety briefing for all participants",
  "Life jackets provided for all water activities",
  "Helmets and protective gear for applicable activities",
  "Continuous monitoring of weather and sea conditions",
  "Emergency protocols and first aid on-site",
];

export default function SafetyCommitment() {
  return (
    <section aria-labelledby="safety-commitment-heading" className="section-padding bg-surface">
      <div className="container-content grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-3">
            Safety Standards
          </p>
          <h2 id="safety-commitment-heading" className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Your Safety Is Our Responsibility
          </h2>
          <p className="text-text-muted leading-relaxed mb-8">
            We take safety seriously at every step. From the moment you arrive to the moment you leave the water, our team is vigilant, prepared, and committed to your well-being.
          </p>

          <ul className="space-y-3 mb-8">
            {STANDARDS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-text-muted">
                <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <WhatsAppButton>Ask About Safety</WhatsAppButton>
        </div>

        {/* Warning callout */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">
                  Weather & Conditions Policy
                </h3>
                <p className="text-sm text-amber-800 leading-relaxed">
                  All activities are subject to weather and ocean conditions. We reserve the right to postpone or cancel sessions if conditions are deemed unsafe. No exceptions. Your safety always comes first.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-surface-muted border border-border p-6">
            <h3 className="font-semibold text-text-primary mb-3">Before You Arrive</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>• Inform us of any medical conditions or swimming ability concerns</li>
              <li>• Arrive at least 15 minutes before your session</li>
              <li>• Listen to all instructions during the safety briefing</li>
              <li>• Follow all guidelines from our team throughout your session</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
