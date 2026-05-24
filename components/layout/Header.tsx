"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/Button";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const FOCUSABLE = 'a[href], button, input, [tabindex]:not([tabindex="-1"])';

interface HeaderProps {
  logoUrl?: string | null;
}

export default function Header({ logoUrl }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Lock body scroll + focus management for mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (mobileOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const id = requestAnimationFrame(() => {
        menuRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
      });
      return () => {
        cancelAnimationFrame(id);
        document.body.style.overflow = "";
      };
    } else {
      previousFocusRef.current?.focus();
      return () => { document.body.style.overflow = ""; };
    }
  }, [mobileOpen]);

  // Focus trap for mobile menu
  const handleMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!mobileOpen || !menuRef.current) return;
    if (e.key === "Escape") { setMobileOpen(false); return; }
    if (e.key !== "Tab") return;
    const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`
          fixed top-0.5 inset-x-0 z-40 transition-all duration-300
          bg-[#4BB8FA] border-b border-white/20 shadow-sm
        `}
      >
        <div className="container-content flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-white" aria-label="PT Hot Dog Water Sport, Home">
            <Image src={logoUrl || "/logo/logo.jpg"} alt="Hot Dog Water Sport" width={40} height={40} className="rounded-sm object-contain" />
            <span className="hidden sm:inline">Hot Dog Water Sport</span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`
                    relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                    ${active
                      ? "text-white"
                      : "text-white/85 hover:text-white"
                    }
                  `}
                >
                  {label}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-white rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <WhatsAppButton size="sm" />
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md text-white hover:bg-white/15 transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onKeyDown={handleMenuKeyDown}
            className="fixed inset-0 z-30 bg-surface flex flex-col pt-20 px-6 pb-8 lg:hidden"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1 flex-1">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      py-4 text-2xl font-display font-semibold border-b border-border-muted
                      transition-colors
                      ${active ? "text-primary" : "text-text-primary hover:text-primary"}
                    `}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
            <WhatsAppButton size="lg" className="w-full justify-center mt-6" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
