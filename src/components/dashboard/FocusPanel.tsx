import type { Recommendation, Project } from "@/lib/types";

interface FocusPanelProps {
  recommendations: Recommendation[];
  projects: Project[];
}

export default function FocusPanel({ recommendations, projects }: FocusPanelProps) {
  const pending = recommendations
    .filter((r) => r.status === "pending")
    .sort((a, b) => b.votes - a.votes);

  const blocked = projects.filter((p) => p.isBlocked);

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
        <div className="mb-4 p-3.5 rounded-lg" style={{ background: "rgba(225, 29, 72, 0.06)", border: "1px solid rgba(225, 29, 72, 0.15)" }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--status-blocked)" }}>
            Unblock First
          </div>
          {blocked.map((p) => (
            <div key={p.name} className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
              <span className="font-semibold">{p.name}:</span>{" "}
              <span style={{ color: "var(--text-secondary)" }}>{p.blockers}</span>
            </div>
          ))}
        </div>
      )}

      {pending[0] && (
        <div className="mb-4 p-3.5 rounded-lg" style={{ background: "rgba(13, 148, 136, 0.06)", border: "1px solid rgba(13, 148, 136, 0.15)" }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--accent-teal)" }}>
            Top Recommendation
          </div>
          <div className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
            {pending[0].suggestion}
          </div>
          <div className="text-xs mt-1.5 font-mono-data" style={{ color: "var(--text-muted)" }}>
            Source: {pending[0].source}
          </div>
        </div>
      )}

      {activeWithActions.length > 0 && (
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
            Next Actions
          </div>
          <div className="space-y-2">
            {activeWithActions.slice(0, 3).map((p) => (
              <div key={p.name} className="flex items-start gap-2 text-sm">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: "var(--accent-blue-light)" }}
                />
                <div>
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {p.name}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}> — </span>
                  <span style={{ color: "var(--text-primary)" }}>
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
