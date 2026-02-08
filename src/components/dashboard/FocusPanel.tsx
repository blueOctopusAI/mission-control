import type { Recommendation, Project } from "@/lib/types";

interface FocusPanelProps {
  recommendations: Recommendation[];
  projects: Project[];
}

export default function FocusPanel({ recommendations, projects }: FocusPanelProps) {
  const pending = recommendations
    .filter((r) => r.status === "pending")
    .sort((a, b) => b.votes - a.votes);

  const blocked = projects.filter(
    (p) => p.blockers && p.blockers !== "None"
  );

  const activeWithActions = projects.filter(
    (p) => p.tier === "ACTIVE" && p.nextActions.length > 0
  );

  return (
    <div
      className="card-static card-accent-blue"
      style={{ boxShadow: "0 0 30px rgba(37, 99, 235, 0.08)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent-blue-light)" }}>
          Recommended Focus
        </h3>
      </div>

      {blocked.length > 0 && (
        <div className="mb-4 p-3 rounded-lg" style={{ background: "rgba(248, 113, 113, 0.08)", border: "1px solid rgba(248, 113, 113, 0.15)" }}>
          <div className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--status-blocked)" }}>
            Unblock First
          </div>
          {blocked.map((p) => (
            <div key={p.name} className="text-xs leading-relaxed" style={{ color: "var(--text-primary)" }}>
              <span className="font-semibold">{p.name}:</span>{" "}
              <span style={{ color: "var(--text-secondary)" }}>{p.blockers}</span>
            </div>
          ))}
        </div>
      )}

      {pending[0] && (
        <div className="mb-4 p-3 rounded-lg" style={{ background: "rgba(45, 212, 191, 0.06)", border: "1px solid rgba(45, 212, 191, 0.1)" }}>
          <div className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--accent-teal)" }}>
            Top Recommendation
          </div>
          <div className="text-xs leading-relaxed" style={{ color: "var(--text-primary)" }}>
            {pending[0].suggestion}
          </div>
          <div className="text-[10px] mt-1 font-mono-data" style={{ color: "var(--text-muted)" }}>
            Source: {pending[0].source}
          </div>
        </div>
      )}

      {activeWithActions.length > 0 && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
            Next Actions
          </div>
          <div className="space-y-1.5">
            {activeWithActions.slice(0, 3).map((p) => (
              <div key={p.name} className="flex items-start gap-2 text-xs">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: "var(--accent-blue-light)" }}
                />
                <div>
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {p.name}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}> — </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {p.nextActions[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
