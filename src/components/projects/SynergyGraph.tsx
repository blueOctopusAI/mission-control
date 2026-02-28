"use client";

import { useEffect, useRef, useState } from "react";
import type { Project, SynergyFlow } from "@/lib/types";

interface SynergyGraphProps {
  projects: Project[];
  flows: SynergyFlow[];
}

const TIER_COLORS: Record<string, string> = {
  ACTIVE: "#2563eb",
  READY: "#0d9488",
  INCUBATING: "#7c3aed",
  SUPPORTING: "#64748b",
  DORMANT: "#94a3b8",
  PORTFOLIO: "#cbd5e1",
};

interface NodePos {
  x: number;
  y: number;
  project: Project;
}

function normalize(name: string): string {
  return name.toLowerCase().replace(/[-_\s.]/g, "");
}

function findNode(nodes: NodePos[], name: string): NodePos | undefined {
  const norm = normalize(name);
  return nodes.find((n) => {
    const projNorm = normalize(n.project.name);
    return projNorm.includes(norm) || norm.includes(projNorm);
  });
}

export default function SynergyGraph({ projects, flows }: SynergyGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredFlow, setHoveredFlow] = useState<number | null>(null);
  const nodesRef = useRef<NodePos[]>([]);
  const flowLinesRef = useRef<{ fromX: number; fromY: number; toX: number; toY: number; label: string }[]>([]);

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

    // Only show ACTIVE tier projects
    const activeProjects = projects.filter((p) => p.tier === "ACTIVE");
    const nodes: NodePos[] = [];
    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(w, h) * 0.35;

    activeProjects.forEach((p, i) => {
      const angle = (i / activeProjects.length) * Math.PI * 2 - Math.PI / 2;
      nodes.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        project: p,
      });
    });

    nodesRef.current = nodes;

    ctx.clearRect(0, 0, w, h);

    // Draw flows
    const flowLines: typeof flowLinesRef.current = [];
    for (const flow of flows) {
      const fromNode = findNode(nodes, flow.from);
      const toNode = findNode(nodes, flow.to);

      if (fromNode && toNode) {
        const flowIdx = flowLines.length;
        const isHovered = hoveredFlow === flowIdx;
        const fromColor = TIER_COLORS[fromNode.project.tier] || "#2563eb";

        flowLines.push({
          fromX: fromNode.x, fromY: fromNode.y,
          toX: toNode.x, toY: toNode.y,
          label: flow.label,
        });

        // Connection line
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = isHovered ? `${fromColor}` : `${fromColor}40`;
        ctx.lineWidth = isHovered ? 3 : 2;
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
          ctx.lineTo(mx - nx * 8 - ny * 5, my - ny * 8 + nx * 5);
          ctx.moveTo(mx, my);
          ctx.lineTo(mx - nx * 8 + ny * 5, my - ny * 8 - nx * 5);
          ctx.strokeStyle = isHovered ? fromColor : `${fromColor}60`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Flow label — only on hover
        if (isHovered) {
          const labelX = (fromNode.x + toNode.x) / 2;
          const labelY = (fromNode.y + toNode.y) / 2 - 12;
          ctx.font = "600 11px -apple-system, system-ui, sans-serif";
          const labelWidth = ctx.measureText(flow.label).width;
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.beginPath();
          ctx.roundRect(labelX - labelWidth / 2 - 6, labelY - 10, labelWidth + 12, 20, 4);
          ctx.fill();
          ctx.strokeStyle = `${fromColor}40`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = "#334155";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(flow.label, labelX, labelY);
        }
      }
    }
    flowLinesRef.current = flowLines;

    // Draw nodes
    for (const node of nodes) {
      const color = TIER_COLORS[node.project.tier] || "#2563eb";

      // Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Inner dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Label with white pill background
      ctx.font = "600 13px -apple-system, system-ui, sans-serif";
      const textWidth = ctx.measureText(node.project.name).width;
      const pillX = node.x - textWidth / 2 - 8;
      const pillY = node.y + 26;
      const pillW = textWidth + 16;
      const pillH = 22;

      ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 6);
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "#1e293b";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.project.name, node.x, pillY + pillH / 2);
    }
  }, [projects, flows, hoveredFlow]);

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let closest = -1;
    let closestDist = 20; // threshold in pixels

    flowLinesRef.current.forEach((fl, i) => {
      // Distance from point to line segment
      const dx = fl.toX - fl.fromX;
      const dy = fl.toY - fl.fromY;
      const len2 = dx * dx + dy * dy;
      if (len2 === 0) return;
      const t = Math.max(0, Math.min(1, ((mx - fl.fromX) * dx + (my - fl.fromY) * dy) / len2));
      const px = fl.fromX + t * dx;
      const py = fl.fromY + t * dy;
      const dist = Math.sqrt((mx - px) * (mx - px) + (my - py) * (my - py));
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });

    if (closest !== hoveredFlow) {
      setHoveredFlow(closest >= 0 ? closest : null);
    }
  }

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
        <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>
          Hover connections to see data flows
        </span>
      </div>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredFlow(null)}
        className="w-full rounded-lg cursor-crosshair"
        style={{ height: 400, background: "var(--bg-secondary)" }}
      />
    </div>
  );
}
