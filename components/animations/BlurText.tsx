"use client";

import { useReducedMotion, motion } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number; // base delay in seconds
  stagger?: number; // per-word stagger in seconds
}

export default function BlurText({
  text,
  className = "",
  as: Tag = "h1",
  delay = 0.1,
  stagger = 0.08,
}: BlurTextProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={`${className} overflow-hidden`} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block mr-[0.25em] last:mr-0"
          initial={{ opacity: 0, filter: "blur(12px)", y: 16 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.65,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
