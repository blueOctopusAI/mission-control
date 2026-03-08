import Link from "next/link";
import type { ToolEval } from "@/lib/types";

interface ToolGridProps {
  tools: ToolEval[];
}

const STATUS_COLORS: Record<string, string> = {
  Documented: "#06B6D4",
  Installed: "#0d9488",
  Tested: "#34d399",
  "In Use": "#34d399",
  Rejected: "#fb7185",
  Pending: "#64748b",
};

function ToolCard({ tool }: { tool: ToolEval }) {
  const statusColor = STATUS_COLORS[tool.status] || "#64748b";

  return (
    <Link
      href={`/tools/${encodeURIComponent(tool.slug)}`}
      className="rounded-xl p-4 hover-lift block"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderTop: `2px solid ${statusColor}`,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {tool.name}
        </h4>
        <span
          className="badge text-[9px]"
          style={{
            background: `${statusColor}15`,
            color: statusColor,
            border: `1px solid ${statusColor}20`,
          }}
        >
          {tool.status}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {tool.what.slice(0, 150)}
        {tool.what.length > 150 ? "..." : ""}
      </p>
      {tool.useCases.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tool.useCases.slice(0, 3).map((uc, i) => (
            <span
              key={i}
              className="text-[9px] px-1.5 py-0.5 rounded"
              style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}
            >
              {uc.slice(0, 30)}{uc.length > 30 ? "..." : ""}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

export default function ToolGrid({ tools }: ToolGridProps) {
  const statusCounts = tools.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const stages = ["Pending", "Documented", "Installed", "Tested", "In Use", "Rejected"];

  return (
    <div>
      {/* Progress bar */}
      <div className="card-static mb-6">
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Evaluation Progress
          </h3>
        </div>
        <div className="flex gap-3">
          {stages.map((stage) => {
            const count = statusCounts[stage] || 0;
            const color = STATUS_COLORS[stage] || "#64748b";
            return (
              <div
                key={stage}
                className="text-center flex-1 py-2 rounded-lg"
                style={{
                  background: count > 0 ? `${color}08` : "transparent",
                  border: `1px solid ${count > 0 ? `${color}12` : "transparent"}`,
                }}
              >
                <div
                  className="text-lg font-bold font-mono-data"
                  style={{ color: count > 0 ? color : "var(--text-muted)" }}
                >
                  {count}
                </div>
                <div className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                  {stage}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
