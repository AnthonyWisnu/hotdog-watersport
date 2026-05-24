export interface TaxonomyOption<TValue extends string = string> {
  value: TValue;
  label: string;
}

export const SERVICE_CATEGORY_OPTIONS = [
  { value: "Speed", label: "Speed" },
  { value: "Adrenaline Rush", label: "Adrenaline Rush" },
  { value: "Sky Experience", label: "Sky Experience" },
  { value: "Fun & Leisure", label: "Fun & Leisure" },
  { value: "Ocean Discovery", label: "Ocean Discovery" },
  { value: "Family Friendly", label: "Family Friendly" },
  { value: "Beginner Friendly", label: "Beginner Friendly" },
] as const satisfies readonly TaxonomyOption[];

export const SERVICE_BADGE_OPTIONS = [
  { value: "Popular", label: "Popular" },
  { value: "Best Seller", label: "Best Seller" },
  { value: "New", label: "New" },
  { value: "Limited", label: "Limited" },
] as const satisfies readonly TaxonomyOption[];

export const GALLERY_CATEGORY_OPTIONS = [
  { value: "watersport", label: "Water Sports" },
  { value: "diving", label: "Diving" },
  { value: "snorkeling", label: "Snorkeling" },
  { value: "tour", label: "Tours" },
  { value: "promo", label: "Promo" },
  { value: "facility", label: "Facility" },
] as const satisfies readonly TaxonomyOption[];

export const FAQ_CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "booking", label: "Booking" },
  { value: "safety", label: "Safety" },
  { value: "equipment", label: "Equipment" },
  { value: "location", label: "Location" },
  { value: "payment", label: "Payment" },
] as const satisfies readonly TaxonomyOption[];

export type ServiceCategoryValue = (typeof SERVICE_CATEGORY_OPTIONS)[number]["value"];
export type ServiceBadgeValue = (typeof SERVICE_BADGE_OPTIONS)[number]["value"];
export type GalleryCategoryValue = (typeof GALLERY_CATEGORY_OPTIONS)[number]["value"];
export type FAQCategoryValue = (typeof FAQ_CATEGORY_OPTIONS)[number]["value"];

function optionValues(options: readonly TaxonomyOption[]) {
  return new Set(options.map((option) => option.value));
}

export function parseTaxonomyValues(
  values: FormDataEntryValue[],
  options: readonly TaxonomyOption[],
  fieldLabel: string
) {
  const allowedValues = optionValues(options);
  const selected = values
    .map((value) => String(value).trim())
    .filter(Boolean);
  const invalid = selected.find((value) => !allowedValues.has(value));

  if (invalid) {
    throw new Error(`Invalid ${fieldLabel}: ${invalid}`);
  }

  return Array.from(new Set(selected));
}

export function parseTaxonomyValue(
  value: FormDataEntryValue | null,
  options: readonly TaxonomyOption[],
  fieldLabel: string,
  fallback: string
) {
  const selected = String(value || fallback).trim();
  const allowedValues = optionValues(options);

  if (!allowedValues.has(selected)) {
    throw new Error(`Invalid ${fieldLabel}: ${selected}`);
  }

  return selected;
}

export function parseNullableTaxonomyValue(
  value: FormDataEntryValue | null,
  options: readonly TaxonomyOption[],
  fieldLabel: string
) {
  const selected = String(value || "").trim();

  if (!selected) {
    return null;
  }

  const allowedValues = optionValues(options);

  if (!allowedValues.has(selected)) {
    throw new Error(`Invalid ${fieldLabel}: ${selected}`);
  }

  return selected;
}
