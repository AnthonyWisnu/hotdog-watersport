export type FAQCategory =
  | "general"
  | "booking"
  | "safety"
  | "equipment"
  | "location";

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  // General
  {
    id: "g1",
    category: "general",
    question: "What water sports do you offer?",
    answer:
      "We offer surfboard rental, jet ski rental, diving equipment rental, and a full range of swimming and snorkeling gear. Each service is available for individual hire or as part of a package.",
  },
  {
    id: "g2",
    category: "general",
    question: "Do I need prior experience to rent equipment?",
    answer:
      "No prior experience is required for most equipment. We provide a mandatory safety briefing before every session, and guided beginner sessions can be arranged for surfing and diving on request.",
  },
  {
    id: "g3",
    category: "general",
    question: "What languages do your staff speak?",
    answer:
      "Our team is fluent in English and Indonesian. We are experienced in serving international guests and will ensure clear communication throughout your experience.",
  },
  // Booking
  {
    id: "b1",
    category: "booking",
    question: "How do I make a booking?",
    answer:
      "Simply contact us via WhatsApp using the button on this page. Tell us which service you are interested in, your preferred date, and the number of participants. We will confirm availability and details promptly.",
  },
  {
    id: "b2",
    category: "booking",
    question: "Is advance booking required?",
    answer:
      "Walk-ins are welcome, but we strongly recommend booking in advance, especially during peak season, to secure your preferred time slot.",
  },
  {
    id: "b3",
    category: "booking",
    question: "Are prices available on the website?",
    answer:
      "To give you the most accurate and up-to-date pricing, rates are provided directly via WhatsApp. Prices may vary based on duration, group size, and season.",
  },
  {
    id: "b4",
    category: "booking",
    question: "What is your cancellation policy?",
    answer:
      "We understand plans change. Please contact us as soon as possible if you need to cancel or reschedule. Policies are discussed at the time of booking via WhatsApp.",
  },
  // Safety
  {
    id: "s1",
    category: "safety",
    question: "What safety measures are in place?",
    answer:
      "All equipment undergoes regular safety inspections. Every participant receives a safety briefing before their session. Life jackets and mandatory safety gear are provided for all water activities.",
  },
  {
    id: "s2",
    category: "safety",
    question: "What happens in bad weather or rough seas?",
    answer:
      "Guest safety is our top priority. Activities may be postponed or cancelled if weather or sea conditions are deemed unsafe. We monitor conditions daily and will notify you immediately if your session is affected.",
  },
  {
    id: "s3",
    category: "safety",
    question: "Do I need to know how to swim?",
    answer:
      "Basic swimming ability is recommended for most activities. All participants must wear a life jacket for jet ski and water sports sessions. Please inform us if you have limited swimming ability so we can advise accordingly.",
  },
  {
    id: "s4",
    category: "safety",
    question: "Are children allowed?",
    answer:
      "Children are welcome on many of our activities with adult supervision. Jet ski requires a minimum age of 18 (or 16 with a consenting adult). Please enquire via WhatsApp for child-specific recommendations.",
  },
  // Equipment
  {
    id: "e1",
    category: "equipment",
    question: "How often is equipment maintained?",
    answer:
      "All equipment is inspected before each rental. Mechanical equipment such as jet skis undergo scheduled service checks, and diving gear is professionally serviced annually.",
  },
  {
    id: "e2",
    category: "equipment",
    question: "What if equipment is damaged during my session?",
    answer:
      "Normal wear is covered. Damage resulting from misuse may incur additional charges. We encourage guests to review the usage guidelines provided during the briefing.",
  },
  {
    id: "e3",
    category: "equipment",
    question: "Do you provide wetsuits and protective gear?",
    answer:
      "Yes. Wetsuits (1.5mm–3mm), rash guards, helmets (where applicable), and life jackets are available in all sizes. Safety gear is included as standard with every rental.",
  },
  // Location
  {
    id: "l1",
    category: "location",
    question: "Where are you located?",
    answer:
      "We are located at 66FF+G34, Jl. Pratama No.62E, Benoa, Kec. Kuta Sel., Kabupaten Badung, Bali 80361. Our exact location is available on the Contact page with a Google Maps embed. You can also reach us via WhatsApp for directions.",
  },
  {
    id: "l2",
    category: "location",
    question: "What are your operating hours?",
    answer:
      "We are open Monday to Sunday, 08:00 – 18:00 WIB. Last rentals typically begin 1–2 hours before closing, depending on the activity.",
  },
  {
    id: "l3",
    category: "location",
    question: "Is parking available?",
    answer:
      "Yes, parking is available near our location. Please contact us via WhatsApp for specific parking guidance depending on your arrival method.",
  },
];

export const FAQ_CATEGORIES: { id: FAQCategory; label: string }[] = [
  { id: "general", label: "General" },
  { id: "booking", label: "Booking" },
  { id: "safety", label: "Safety" },
  { id: "equipment", label: "Equipment" },
  { id: "location", label: "Location" },
];
