"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import Tentacle from "./Tentacle";
import Eyes from "./Eyes";

interface OctopusProps {
  projects: Project[];
}

const TENTACLE_ANGLES = [-70, -50, -30, -10, 10, 30, 50, 70];

const TIER_COLORS: Record<string, string> = {
  ACTIVE: "#3b82f6",
  READY: "#14b8a6",
  INCUBATING: "#8b5cf6",
  SUPPORTING: "#64748b",
  DORMANT: "#475569",
  PORTFOLIO: "#334155",
};

function getMomentum(project: Project): "healthy" | "stale" | "blocked" {
  if (project.blockers && project.blockers !== "None") return "blocked";
  const lastTouched = new Date(project.lastTouched);
  const daysSince = Math.floor(
    (Date.now() - lastTouched.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSince > 7) return "stale";
  return "healthy";
}

export default function Octopus({ projects }: OctopusProps) {
  // Get top 8 projects for tentacles (prioritize ACTIVE)
  const sortedProjects = [...projects].sort((a, b) => {
    const tierOrder = ["ACTIVE", "READY", "INCUBATING", "SUPPORTING", "DORMANT", "PORTFOLIO"];
    return tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
  });
  const tentacleProjects = sortedProjects.slice(0, 8);

  const hasBlocker = tentacleProjects.some((p) => getMomentum(p) === "blocked");

  return (
    <div className="relative flex items-center justify-center" style={{ height: 340 }}>
      <svg viewBox="0 0 500 340" width="500" height="340" className="overflow-visible">
        {/* Tentacles */}
        {tentacleProjects.map((project, i) => (
          <Tentacle
            key={project.name}
            angle={TENTACLE_ANGLES[i]}
            color={TIER_COLORS[project.tier] || "#3b82f6"}
            thickness={project.tier === "ACTIVE" ? 5 : project.tier === "READY" ? 4 : 3}
            momentum={getMomentum(project)}
            label={project.name}
            index={i}
          />
        ))}

        {/* Body */}
        <motion.ellipse
          cx="250"
          cy="130"
          rx="65"
          ry="55"
          fill="url(#bodyGradient)"
          stroke="#2563eb"
          strokeWidth="1.5"
          animate={{
            ry: [55, 57, 55],
            rx: [65, 63, 65],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Head highlight */}
        <motion.ellipse
          cx="250"
          cy="115"
          rx="40"
          ry="25"
          fill="rgba(59, 130, 246, 0.15)"
          animate={{
            ry: [25, 27, 25],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Eyes */}
        <Eyes hasBlocker={hasBlocker} />

        {/* Gradients */}
        <defs>
          <radialGradient id="bodyGradient" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>
      </svg>

      {/* Project labels around the octopus */}
      {tentacleProjects.map((project, i) => {
        const angle = TENTACLE_ANGLES[i];
        const radian = ((angle - 90) * Math.PI) / 180;
        const labelRadius = 170;
        const x = 250 + Math.cos(radian) * labelRadius;
        const y = 200 + Math.sin(radian) * labelRadius * 0.7;

        return (
          <div
            key={project.name}
            className="absolute text-[10px] font-medium whitespace-nowrap"
            style={{
              left: `${(x / 500) * 100}%`,
              top: `${(y / 340) * 100}%`,
              transform: "translate(-50%, -50%)",
              color: TIER_COLORS[project.tier],
              opacity: 0.8,
            }}
          >
            {project.name}
          </div>
        );
      })}
    </div>
  );
}
