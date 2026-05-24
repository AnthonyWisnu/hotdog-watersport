"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/taxonomy", label: "Taxonomy" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/faqs", label: "FAQ" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/business", label: "Business" },
  { href: "/admin/settings", label: "Settings" },
];

interface AdminNavigationProps {
  orientation?: "vertical" | "horizontal";
}

export default function AdminNavigation({
  orientation = "vertical",
}: AdminNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin navigation"
      className={
        orientation === "vertical"
          ? "p-3"
          : "flex gap-2 overflow-x-auto border-b border-border bg-white px-5 py-3 lg:hidden"
      }
    >
      {ADMIN_NAV.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={
              orientation === "vertical"
                ? `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-white"
                      : "text-text-muted hover:bg-surface-muted hover:text-text-primary"
                  }`
                : `shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-white"
                      : "border border-border text-text-muted hover:text-text-primary"
                  }`
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
