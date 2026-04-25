import { WHATSAPP_NUMBER } from "./constants";

const DEFAULT_MESSAGE =
  "Hi Hot Dog Water Sport, I'm interested in your water sports rentals!";

export function buildWhatsAppURL(message = DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export const WA_MESSAGES = {
  general: DEFAULT_MESSAGE,
  surfing:
    "Hi Hot Dog Water Sport, I would like to ask about Surfboard rental. Could you share the details and availability?",
  jetski:
    "Hi Hot Dog Water Sport, I would like to ask about Jet Ski rental. Could you share the details and availability?",
  diving:
    "Hi Hot Dog Water Sport, I would like to ask about Diving Equipment rental. Could you share the details and availability?",
  swimming:
    "Hi Hot Dog Water Sport, I would like to ask about Swimming Gear rental. Could you share the details and availability?",
} as const;
