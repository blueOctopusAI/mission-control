"use client";

import { motion } from "framer-motion";

interface EyesProps {
  hasBlocker: boolean;
}

export default function Eyes({ hasBlocker }: EyesProps) {
  const blinkDuration = hasBlocker ? 2 : 5;

  return (
    <g>
      {/* Left eye */}
      <ellipse cx="235" cy="122" rx="10" ry="12" fill="#0f172a" />
      <motion.ellipse
        cx="235"
        cy="122"
        rx="10"
        ry="12"
        fill="#1e3a8a"
        animate={{ ry: [12, 1, 12] }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: blinkDuration,
          times: [0, 0.5, 1],
        }}
      />
      <ellipse cx="237" cy="119" rx="4" ry="5" fill="#3b82f6" />
      <circle cx="238" cy="117" r="2" fill="#93c5fd" />

      {/* Right eye */}
      <ellipse cx="265" cy="122" rx="10" ry="12" fill="#0f172a" />
      <motion.ellipse
        cx="265"
        cy="122"
        rx="10"
        ry="12"
        fill="#1e3a8a"
        animate={{ ry: [12, 1, 12] }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: blinkDuration,
          times: [0, 0.5, 1],
          delay: 0.05,
        }}
      />
      <ellipse cx="267" cy="119" rx="4" ry="5" fill="#3b82f6" />
      <circle cx="268" cy="117" r="2" fill="#93c5fd" />
    </g>
  );
}
