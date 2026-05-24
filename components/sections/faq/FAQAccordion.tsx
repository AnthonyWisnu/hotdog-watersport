"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_CATEGORIES, type FAQCategory, type FAQItem } from "@/lib/faq-data";
import type { TaxonomyOption } from "@/lib/taxonomy";

export default function FAQAccordion({
  items,
  categories = FAQ_CATEGORIES,
}: {
  items: FAQItem[];
  categories?: readonly TaxonomyOption[];
}) {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>(
    categories[0]?.value || "general"
  );
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = items.filter((item) => item.category === activeCategory);

  return (
    <section aria-labelledby="faq-heading" className="section-padding bg-surface">
      <div className="container-content max-w-3xl">
        <div className="mb-10">
          <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">
            Have Questions?
          </p>
          <h2 id="faq-heading" className="font-display text-4xl sm:text-5xl font-bold text-text-primary">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Category tabs */}
        <div role="tablist" aria-label="FAQ categories" className="flex flex-wrap gap-2 mb-8">
          {categories.map(({ value, label }) => (
            <button
              key={value}
              role="tab"
              aria-selected={activeCategory === value}
              onClick={() => { setActiveCategory(value); setOpenId(null); }}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${activeCategory === value
                  ? "bg-primary text-text-inverse"
                  : "bg-surface-muted text-text-muted hover:text-text-primary border border-border"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <dl className="divide-y divide-border">
          {filtered.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id}>
                <dt>
                  <button
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                    id={`faq-question-${item.id}`}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="flex w-full items-center justify-between py-5 text-left text-text-primary font-semibold hover:text-primary transition-colors gap-4"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </dt>
                <dd
                  id={`faq-answer-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-question-${item.id}`}
                  hidden={!isOpen}
                  className="pb-5 text-text-muted leading-relaxed text-sm"
                >
                  {item.answer}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
