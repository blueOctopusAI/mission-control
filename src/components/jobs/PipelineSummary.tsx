import type { Opportunity } from "@/lib/types";

interface PipelineSummaryProps {
  opportunities: Opportunity[];
}

const STAGE_ORDER = [
  "discovered",
  "analyzing",
  "identified",
  "tailoring",
  "applied",
  "phone-screen",
  "technical",
  "final",
  "offer",
];

const STAGE_COLORS: Record<string, string> = {
  discovered: "#64748b",
  analyzing: "#7c3aed",
  identified: "#2563eb",
  tailoring: "#d97706",
  applied: "#0284c7",
  "phone-screen": "#0d9488",
  technical: "#059669",
  final: "#059669",
  offer: "#047857",
};

export default function PipelineSummary({ opportunities }: PipelineSummaryProps) {
  const stageCounts = new Map<string, number>();
  for (const op of opportunities) {
    if (STAGE_ORDER.includes(op.status)) {
      stageCounts.set(op.status, (stageCounts.get(op.status) || 0) + 1);
    }
  }

  const activeStages = STAGE_ORDER.filter((s) => stageCounts.has(s));

  return (
    <div className="space-y-2">
      {activeStages.map((stage) => {
        const count = stageCounts.get(stage) || 0;
        const color = STAGE_COLORS[stage] || "#94a3b8";
        return (
          <div
            key={stage}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl"
            style={{
              background: `${color}15`,
              border: `1px solid ${color}30`,
            }}
          >
            <span className="text-sm font-semibold" style={{ color }}>
              {stage}
            </span>
            <span className="text-lg font-bold font-mono-data" style={{ color }}>
              {count}
            </span>
          </div>
        );
      })}
      {activeStages.length === 0 && (
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          No active opportunities
        </p>
      )}
    </div>
  );
}
