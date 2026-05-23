"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useInView } from "framer-motion";

interface CountUpProps {
  end: number;
  duration?: number; // seconds
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export default function CountUp({
  end,
  duration = 1.8,
  prefix = "",
  suffix = "",
  className = "",
  decimals = 0,
}: CountUpProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!inView || hasStarted.current) return;
    if (reduced) {
      hasStarted.current = true;
      return;
    }

    hasStarted.current = true;
    const startTime = performance.now();
    const totalMs = duration * 1000;
    let animationFrame = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalMs, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [inView, reduced, end, duration, decimals]);

  const displayValue = reduced && inView ? end : value;

  return (
    <span ref={ref} className={className} aria-live="polite">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}
