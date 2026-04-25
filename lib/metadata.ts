import type { Metadata } from "next";
import { BASE_URL } from "./constants";

interface PageMetaParams {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

export function buildMetadata({
  title,
  description,
  path,
  ogImage = "/og-default.jpg",
}: PageMetaParams): Metadata {
  const url = `${BASE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | PT Hot Dog Water Sport`,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      title: `${title} | PT Hot Dog Water Sport`,
      description,
      images: [ogImage],
    },
  };
}
