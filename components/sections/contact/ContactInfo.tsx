import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { BUSINESS_EMAIL, LOCATION_ADDRESS, OPERATING_HOURS, SOCIAL, WHATSAPP_NUMBER } from "@/lib/constants";
import GoogleMap from "./GoogleMap";
import { WhatsAppButton } from "@/components/ui/Button";
import type { SiteSettingsData } from "@/lib/cms/settings";

export default function ContactInfo({ settings }: { settings: SiteSettingsData }) {
  const whatsappNumber = settings.whatsapp_number || WHATSAPP_NUMBER;
  const email = settings.business_email || BUSINESS_EMAIL;
  const address = settings.location_address || LOCATION_ADDRESS;
  const operatingHours = settings.operating_hours || OPERATING_HOURS;

  return (
    <section aria-labelledby="contact-heading" className="pt-32 pb-16 bg-surface">
      <div className="container-content">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-muted list-none p-0">
            <li><Link href="/" className="hover:text-text-primary transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-text-primary font-medium">Contact</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-3">
              Get in Touch
            </p>
            <h1 id="contact-heading" className="font-display text-5xl sm:text-6xl font-bold text-text-primary mb-6">
              We&apos;d Love to Hear From You
            </h1>
            <p className="text-text-muted leading-relaxed mb-10 text-lg max-w-lg">
              The quickest way to reach us is via WhatsApp. We respond fast and can answer any question, from equipment specs to availability.
            </p>

            <WhatsAppButton size="xl" className="mb-10" />

            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-text-primary text-sm mb-0.5">Address</p>
                  <p className="text-text-muted text-sm">{address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-text-primary text-sm mb-0.5">Phone / WhatsApp</p>
                  <a href={`tel:${whatsappNumber}`} className="text-sm text-text-muted hover:text-primary transition-colors">
                    {whatsappNumber}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-text-primary text-sm mb-0.5">Email</p>
                  <a href={`mailto:${email}`} className="text-sm text-text-muted hover:text-primary transition-colors">
                    {email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-text-primary text-sm mb-0.5">Operating Hours</p>
                  <p className="text-text-muted text-sm">{operatingHours}</p>
                </div>
              </li>
            </ul>

            {/* Socials */}
            <div className="flex gap-3 mt-8">
              <a href={settings.instagram_url || SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-surface-muted border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors">
                <Instagram size={16} aria-hidden="true" />
              </a>
              <a href={settings.facebook_url || SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-surface-muted border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors">
                <Facebook size={16} aria-hidden="true" />
              </a>
              <a href={settings.tiktok_url || SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-10 h-10 rounded-full bg-surface-muted border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06Z" />
                </svg>
              </a>
            </div>
          </div>

          <GoogleMap embedUrl={settings.maps_embed_url} city={settings.location_city} />
        </div>
      </div>
    </section>
  );
}
