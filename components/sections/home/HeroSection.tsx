"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { WhatsAppButton, Button } from "@/components/ui/Button";
import BlurText from "@/components/animations/BlurText";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const handleVisibility = () => {
      if (!videoRef.current) return;
      if (document.visibilityState === "hidden") {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <section
      aria-label="Hero"
      className="relative min-h-svh flex items-center justify-center overflow-hidden bg-surface-dark"
    >
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        src="/videos/jetski.mp4"
        poster="/images/about/bali-watersport.jpg"
        muted
        autoPlay
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-surface-dark/60 via-surface-dark/30 to-surface-dark/80"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 container-content text-center text-text-inverse px-4">
        {/* Label */}
        <motion.p
          className="text-secondary font-semibold tracking-[0.2em] uppercase text-sm mb-6 opacity-90"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
        >
          Premium Water Sports Rental
        </motion.p>

        {/* Headline with BlurText */}
        <BlurText
          text="Ride the Wave. Feel Alive."
          as="h1"
          delay={0.15}
          stagger={0.09}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 text-white"
        />

        {/* Subheadline */}
        <motion.p
          className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed [text-wrap:balance]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          Surfboards, jet skis, diving gear, and more. Premium equipment,
          safety-first standards, and instant booking via WhatsApp.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: reduced ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <WhatsAppButton size="xl" />
          <Button
            variant="ghost"
            size="lg"
            href="#services-preview"
            className="text-white border-white/30 hover:bg-white/10"
          >
            Explore Services
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 1.2, duration: 0.5 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className="animate-bounce [@media(prefers-reduced-motion:reduce)]:animate-none"
        />
      </motion.div>
    </section>
  );
}
