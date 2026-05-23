"use client";

import { useState, useRef, useEffect } from "react";
import { LOCATION_CITY } from "@/lib/constants";

const EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.095288928217!2d115.22457120000001!3d-8.777105299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd24396f8de109f%3A0x226f2304e347f287!2sPT.%20Hot%20Dog%20Water%20Sport%20and%20Dive%20Center!5e0!3m2!1sid!2sid!4v1777089551920!5m2!1sid!2sid";

export default function GoogleMap({
  embedUrl,
  city,
}: {
  embedUrl?: string | null;
  city?: string | null;
}) {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setLoaded(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="rounded-2xl overflow-hidden border border-border h-full min-h-96"
    >
      {loaded ? (
        <iframe
          title={`Google Maps, ${city || LOCATION_CITY}`}
          src={embedUrl || EMBED_SRC}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="w-full h-full bg-surface-muted flex items-center justify-center text-text-muted text-sm">
          Loading map…
        </div>
      )}
    </div>
  );
}
