"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { GalleryItem } from "@/lib/gallery-data";

interface LightboxProps {
  items: GalleryItem[];
  activeIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function Lightbox({ items, activeIndex, onClose, onPrev, onNext }: LightboxProps) {
  const reduced = useReducedMotion();
  const isOpen = activeIndex !== null;
  const item = activeIndex !== null ? items[activeIndex] : null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowLeft") { onPrev(); return; }
      if (e.key === "ArrowRight") { onNext(); return; }

      // Tab focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    },
    [isOpen, onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Focus management: save previous focus, move into dialog, restore on close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Defer to let AnimatePresence render the dialog first
      const id = requestAnimationFrame(() => {
        const closeBtn = dialogRef.current?.querySelector<HTMLElement>('[aria-label="Close lightbox"]');
        closeBtn?.focus();
      });
      return () => cancelAnimationFrame(id);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Image: ${item.alt}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
          onClick={onClose}
        >
          {/* Image container, stops backdrop click */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
            transition={{ duration: reduced ? 0 : 0.22 }}
            className="relative max-w-5xl max-h-[80vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
            <p className="mt-3 text-center text-white/60 text-sm">{item.alt}</p>
          </motion.div>

          {/* Close */}
          <button
            aria-label="Close lightbox"
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <X size={20} />
          </button>

          {activeIndex > 0 && (
            <button
              aria-label="Previous image"
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {activeIndex < items.length - 1 && (
            <button
              aria-label="Next image"
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Counter */}
          <div aria-live="polite" aria-atomic="true" className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs">
            {activeIndex + 1} / {items.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
