import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, MapPin, Phone, Mail, Clock } from "lucide-react";
import { BUSINESS_NAME, LOCATION_ADDRESS, OPERATING_HOURS, SOCIAL, BUSINESS_EMAIL, WHATSAPP_NUMBER } from "@/lib/constants";
import { WhatsAppButton } from "@/components/ui/Button";

const QUICK_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ & Safety" },
  { href: "/contact", label: "Contact" },
];

const SERVICES_LINKS = [
  { href: "/services#surfing", label: "Surfing Boards" },
  { href: "/services#jet-ski", label: "Jet Ski" },
  { href: "/services#diving", label: "Diving Equipment" },
  { href: "/services#swimming", label: "Swimming Gear" },
];

interface FooterProps {
  logoUrl?: string | null;
}

export default function Footer({ logoUrl }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-dark text-text-inverse">
      <div className="container-content py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 text-primary mb-4" aria-label="Home">
            <Image src={logoUrl || "/logo/logo.jpg"} alt="Hot Dog Water Sport" width={40} height={40} className="rounded-sm object-contain" />
            <span className="font-display font-bold text-lg">Hot Dog Water Sport</span>
          </Link>
          <p className="text-text-subtle text-sm leading-relaxed mb-6">
            Premium water sports rental, crafted for adventure seekers who demand quality, safety, and unforgettable experiences.
          </p>
          <WhatsAppButton size="sm" className="w-full justify-center sm:w-auto" />
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-widest text-text-subtle mb-4">
            Navigate
          </h3>
          <ul className="space-y-2">
            {QUICK_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-text-subtle hover:text-text-inverse text-sm transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-widest text-text-subtle mb-4">
            Services
          </h3>
          <ul className="space-y-2">
            {SERVICES_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-text-subtle hover:text-text-inverse text-sm transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-widest text-text-subtle mb-4">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-text-subtle">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="shrink-0 mt-0.5 text-primary" aria-hidden="true" />
              <span>{LOCATION_ADDRESS}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="shrink-0 text-primary" aria-hidden="true" />
              <a href={`tel:${WHATSAPP_NUMBER}`} className="hover:text-text-inverse transition-colors">
                {WHATSAPP_NUMBER}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="shrink-0 text-primary" aria-hidden="true" />
              <a href={`mailto:${BUSINESS_EMAIL}`} className="hover:text-text-inverse transition-colors">
                {BUSINESS_EMAIL}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={15} className="shrink-0 text-primary" aria-hidden="true" />
              <span>{OPERATING_HOURS}</span>
            </li>
          </ul>

          {/* Socials */}
          <div className="flex gap-3 mt-5">
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary/80 flex items-center justify-center transition-colors">
              <Instagram size={16} aria-hidden="true" />
            </a>
            <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary/80 flex items-center justify-center transition-colors">
              <Facebook size={16} aria-hidden="true" />
            </a>
            <a href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary/80 flex items-center justify-center transition-colors">
              {/* TikTok icon via SVG, not in lucide */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-content py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-text-subtle">
          <p>© {year} {BUSINESS_NAME}. All rights reserved.</p>
          <p>Built with care for adventurers worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
