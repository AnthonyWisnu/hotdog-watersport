import { WA_MESSAGES } from "./whatsapp";

export type ServiceId = "surfing" | "jetski" | "diving" | "swimming";

export interface ServiceData {
  id: ServiceId;
  slug: string;
  title: string;
  headline: string;
  description: string;
  equipment: string[];
  rentalInfo: string;
  operationalNotes: string;
  images: string[];
  whatsappMessage: string;
  icon: string; // lucide icon name
}

export const SERVICES: ServiceData[] = [
  {
    id: "surfing",
    slug: "surfing",
    title: "Surfing Boards",
    headline: "Ride the Perfect Wave",
    description:
      "From beginner-friendly foam boards to performance shortboards, our selection covers every skill level. All boards are inspected before each rental to ensure your safety and the best ride possible.",
    equipment: [
      "Foam beginner boards (7'–9')",
      "Fiberglass shortboards (5'6\"–6'4\")",
      "Midlength / funboard options",
      "Leashes and board bags included",
      "Optional rash guards available",
    ],
    rentalInfo: "Minimum 2-hour rental. Full-day and multi-day rates available.",
    operationalNotes:
      "Prices and availability confirmed via WhatsApp. Instructor-guided sessions can be arranged on request.",
    images: [
      "/images/services/surfing-board1.jpg",
      "/images/services/surfing-board2.jpg",
      "/images/services/surfing-board3.jpg",
    ],
    whatsappMessage: WA_MESSAGES.surfing,
    icon: "Waves",
  },
  {
    id: "jetski",
    slug: "jet-ski",
    title: "Jet Ski",
    headline: "Full Throttle on Open Water",
    description:
      "Experience the rush of open water on our regularly serviced jet skis. All units undergo pre-session mechanical checks, and all riders receive a mandatory safety briefing before departure.",
    equipment: [
      "Single & double-rider jet ski models",
      "Life jackets (all sizes)",
      "Safety whistle and lanyard",
      "Waterproof storage pouch",
    ],
    rentalInfo:
      "Minimum 30-minute session. 60-minute and extended packages available.",
    operationalNotes:
      "Minimum age 18 years (or 16 with adult accompaniment). Prices and time slots via WhatsApp.",
    images: [
      "/images/services/jetski1.jpg",
      "/images/services/jetski2.jpg",
      "/images/services/jetski3.jpg",
    ],
    whatsappMessage: WA_MESSAGES.jetski,
    icon: "Zap",
  },
  {
    id: "diving",
    slug: "diving",
    title: "Diving Equipment",
    headline: "Explore What Lies Beneath",
    description:
      "Discover the underwater world with our complete diving kit. Equipment is professionally maintained and disinfected between every use. Suitable for certified divers and guided introductory sessions.",
    equipment: [
      "BCD (Buoyancy Control Device), all sizes",
      "Regulators (serviced annually)",
      "Wetsuits (1.5mm–3mm)",
      "Masks, fins, and snorkels",
      "Dive computers available",
      "Tank fills available on-site",
    ],
    rentalInfo:
      "Half-day and full-day packages. Individual equipment rental also available.",
    operationalNotes:
      "PADI / SSI certification required for independent diving. Guided introductory dives available for beginners.",
    images: [
      "/images/services/divingequipment1.jpg",
      "/images/services/divingequipment2.jpg",
      "/images/services/divingequipment3.png",
    ],
    whatsappMessage: WA_MESSAGES.diving,
    icon: "Anchor",
  },
  {
    id: "swimming",
    slug: "swimming",
    title: "Swimming Gear",
    headline: "Gear Up for the Water",
    description:
      "Whether you are heading to the beach or the pool, our swimming and water sports accessories have you covered. High-quality gear for a comfortable and safe experience.",
    equipment: [
      "Swim fins (all sizes)",
      "Snorkel sets (mask + snorkel + fins)",
      "Life jackets and buoyancy vests",
      "Waterproof bags and dry bags",
      "Goggles and swim caps",
      "Beach and water toys",
    ],
    rentalInfo: "Hourly, half-day, and full-day rental available.",
    operationalNotes:
      "Mix-and-match individual items or take a complete set. Details and pricing via WhatsApp.",
    images: [
      "/images/services/swimminggear1.jpg",
      "/images/services/swimminggear2.jpg",
      "/images/services/swimminggear3.jpg",
    ],
    whatsappMessage: WA_MESSAGES.swimming,
    icon: "Droplets",
  },
];
