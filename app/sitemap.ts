import type { MetadataRoute } from "next";

const BASE_URL = "https://hotdogwatersport.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1.0, changeFreq: "weekly" as const },
    { path: "/about", priority: 0.8, changeFreq: "monthly" as const },
    { path: "/services", priority: 0.9, changeFreq: "monthly" as const },
    { path: "/gallery", priority: 0.7, changeFreq: "weekly" as const },
    { path: "/faq", priority: 0.7, changeFreq: "monthly" as const },
    { path: "/contact", priority: 0.8, changeFreq: "monthly" as const },
  ];

  return routes.map(({ path, priority, changeFreq }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority,
  }));
}
