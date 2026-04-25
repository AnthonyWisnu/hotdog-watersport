"use client";

import { useRef, useCallback, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface GlareHoverProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // degrees
}

export default function GlareHover({
  children,
  className = "",
  maxTilt = 6,
}: GlareHoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      setGlare({ x: px * 100, y: py * 100, opacity: 0.18 });
      setTilt({
        rx: (py - 0.5) * -maxTilt,
        ry: (px - 0.5) * maxTilt,
      });
    },
    [reduced, maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setGlare((g) => ({ ...g, opacity: 0 }));
    setTilt({ rx: 0, ry: 0 });
  }, []);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform: `perspective(600px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: "transform 0.15s ease-out",
        willChange: "transform",
      }}
    >
      {children}
      {/* Glare layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity * 2}) 0%, rgba(255,255,255,${glare.opacity}) 30%, transparent 70%)`,
          transition: "opacity 0.2s ease-out",
        }}
      />
    </div>
  );
}
