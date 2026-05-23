import Image from "next/image";
import ScrollReveal from "@/components/animations/ScrollReveal";
import type { BusinessProfileData } from "@/lib/cms/settings";

export default function BrandStory({ profile }: { profile: BusinessProfileData }) {
  const paragraphs = (profile.brand_story || profile.about_text || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section aria-labelledby="brand-story-heading" className="section-padding bg-surface">
      <div className="container-content grid lg:grid-cols-2 gap-16 items-center">
        <ScrollReveal direction="left" distance={40}>
          <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-3">
            Who We Are
          </p>
          <h2 id="brand-story-heading" className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-8">
            {profile.business_name} <br />
            <span className="italic">{profile.tagline || "Driven by Passion"}</span>
          </h2>
          <div className="space-y-5 text-text-muted leading-relaxed">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <>
                <p>
                  PT Hot Dog Water Sport was born from a simple belief: everyone deserves access to premium water sports experiences, regardless of skill level. We started as a small operation at one of the most stunning coastal destinations in Indonesia, and we&apos;ve grown by putting safety and quality above everything else.
                </p>
                <p>
                  Today, we serve hundreds of international guests every year, from first-time snorkelers to seasoned surfers and certified divers. Our equipment is top-tier, our team is experienced, and our commitment to your safety is absolute.
                </p>
                <p>
                  We don&apos;t believe in overcomplicated booking systems or hidden fees. A quick WhatsApp message is all it takes to secure your adventure.
                </p>
              </>
            )}
          </div>
        </ScrollReveal>

        {/* Editorial photo composition */}
        <ScrollReveal direction="right" distance={40} delay={0.1}>
          <div className="relative h-[480px]">
            <div className="absolute top-0 right-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/about/bali-watersport.jpg"
                alt="Water sports team preparing equipment at sunrise"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 75vw, 37.5vw"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 rounded-2xl overflow-hidden border-4 border-surface shadow-xl">
              <Image
                src="/images/about/jetski.jpg"
                alt="Jet ski equipment ready for rental"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
