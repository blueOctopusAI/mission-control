"use client";

import { useEffect, useRef } from "react";
import type { Project, SynergyFlow } from "@/lib/types";

interface SynergyGraphProps {
  projects: Project[];
  flows: SynergyFlow[];
}

const TIER_COLORS: Record<string, string> = {
  ACTIVE: "#60a5fa",
  READY: "#2dd4bf",
  INCUBATING: "#a78bfa",
  SUPPORTING: "#94a3b8",
  DORMANT: "#475569",
  PORTFOLIO: "#334155",
};

interface NodePos {
  x: number;
  y: number;
  project: Project;
}

export default function SynergyGraph({ projects, flows }: SynergyGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const nodes: NodePos[] = [];
    const centerX = w / 2;
    const centerY = h / 2;

    const activeProjects = projects.filter((p) => p.tier === "ACTIVE");
    const otherProjects = projects.filter((p) => p.tier !== "ACTIVE");

    activeProjects.forEach((p, i) => {
      const angle = (i / activeProjects.length) * Math.PI * 2 - Math.PI / 2;
      nodes.push({
        x: centerX + Math.cos(angle) * 110,
        y: centerY + Math.sin(angle) * 85,
        project: p,
      });
    });

    otherProjects.forEach((p, i) => {
      const angle = (i / otherProjects.length) * Math.PI * 2 - Math.PI / 2;
      nodes.push({
        x: centerX + Math.cos(angle) * 210,
        y: centerY + Math.sin(angle) * 155,
        project: p,
      });
    });

    ctx.clearRect(0, 0, w, h);

    // Draw flows with gradient lines
    for (const flow of flows) {
      const fromNode = nodes.find((n) =>
        n.project.name.toLowerCase().includes(flow.from.toLowerCase().replace(/-/g, "")) ||
        flow.from.toLowerCase().includes(n.project.name.toLowerCase())
      );
      const toNode = nodes.find((n) =>
        n.project.name.toLowerCase().includes(flow.to.toLowerCase().replace(/-/g, "")) ||
        flow.to.toLowerCase().includes(n.project.name.toLowerCase())
      );

      if (fromNode && toNode) {
        const fromColor = TIER_COLORS[fromNode.project.tier] || "#60a5fa";

        // Gradient line
        const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
        gradient.addColorStop(0, `${fromColor}40`);
        gradient.addColorStop(1, `${fromColor}10`);

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Arrow
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0) {
          const mx = fromNode.x + dx * 0.65;
          const my = fromNode.y + dy * 0.65;
          const nx = dx / len;
          const ny = dy / len;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(mx - nx * 7 - ny * 4, my - ny * 7 + nx * 4);
          ctx.moveTo(mx, my);
          ctx.lineTo(mx - nx * 7 + ny * 4, my - ny * 7 - nx * 4);
          ctx.strokeStyle = `${fromColor}50`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Flow label
        const labelX = (fromNode.x + toNode.x) / 2;
        const labelY = (fromNode.y + toNode.y) / 2 - 10;
        ctx.font = "9px -apple-system, system-ui, sans-serif";
        ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
        ctx.textAlign = "center";
        ctx.fillText(flow.label, labelX, labelY);
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const color = TIER_COLORS[node.project.tier] || "#60a5fa";

      // Outer glow
      ctx.beginPath();
      ctx.arc(node.x, node.y, 24, 0, Math.PI * 2);
      ctx.fillStyle = `${color}08`;
      ctx.fill();

      // Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
      ctx.fillStyle = "#0f172a";
      ctx.fill();
      ctx.strokeStyle = `${color}80`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Label
      ctx.font = "10px -apple-system, system-ui, sans-serif";
      ctx.fillStyle = "#f1f5f9";
      ctx.textAlign = "center";
      ctx.fillText(node.project.name, node.x, node.y + 28);
    }
  }, [projects, flows]);

  return (
    <div className="card-static">
      <div className="flex items-center gap-2 mb-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" x2="22" y1="12" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Synergy Map
        </h3>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg"
        style={{ height: 400, background: "rgba(6, 9, 15, 0.5)" }}
      />
    </div>
  );
}
