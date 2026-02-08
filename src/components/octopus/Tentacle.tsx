"use client";

import { motion } from "framer-motion";

interface TentacleProps {
  angle: number;
  color: string;
  thickness: number;
  momentum: "healthy" | "stale" | "blocked";
  label: string;
  index: number;
}

export default function Tentacle({
  angle,
  color,
  thickness,
  momentum,
  index,
}: TentacleProps) {
  const radian = ((angle - 90) * Math.PI) / 180;
  const startX = 250 + Math.cos(radian) * 45;
  const startY = 165 + Math.sin(radian) * 35;
  const endX = 250 + Math.cos(radian) * 140;
  const endY = 200 + Math.sin(radian) * 110;

  const ctrlX1 = startX + Math.cos(radian) * 40 + Math.sin(radian) * 15;
  const ctrlY1 = startY + Math.sin(radian) * 40 - Math.cos(radian) * 15;
  const ctrlX2 = endX - Math.cos(radian) * 30 - Math.sin(radian) * 10;
  const ctrlY2 = endY - Math.sin(radian) * 30 + Math.cos(radian) * 10;

  const pathD = `M ${startX} ${startY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${endX} ${endY}`;

  const waveAmount = momentum === "blocked" ? 6 : momentum === "stale" ? 2 : 3;
  const waveDuration = momentum === "blocked" ? 0.8 : momentum === "stale" ? 6 : 3;

  return (
    <g>
      {/* Glow for blocked */}
      {momentum === "blocked" && (
        <motion.path
          d={pathD}
          fill="none"
          stroke="#ef4444"
          strokeWidth={thickness + 4}
          strokeLinecap="round"
          opacity={0.3}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}

      {/* Main tentacle */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={momentum === "blocked" ? "#ef4444" : color}
        strokeWidth={thickness}
        strokeLinecap="round"
        animate={{
          d: [
            pathD,
            `M ${startX} ${startY} C ${ctrlX1 + waveAmount} ${ctrlY1 - waveAmount}, ${ctrlX2 - waveAmount} ${ctrlY2 + waveAmount}, ${endX} ${endY}`,
            pathD,
          ],
        }}
        transition={{
          duration: waveDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2,
        }}
      />

      {/* Tip dot */}
      <motion.circle
        cx={endX}
        cy={endY}
        r={thickness * 0.6}
        fill={momentum === "blocked" ? "#ef4444" : color}
        animate={{
          r: [thickness * 0.6, thickness * 0.8, thickness * 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.3,
        }}
      />
    </g>
  );
}
