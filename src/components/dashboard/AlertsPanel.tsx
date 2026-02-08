import type { Alert } from "@/lib/types";

interface AlertsPanelProps {
  alerts: Alert[];
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <div className="card-static">
        <div className="flex items-center gap-2 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--status-healthy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Alerts
          </h3>
        </div>
        <p className="text-xs font-medium" style={{ color: "var(--status-healthy)" }}>
          All systems clear
        </p>
      </div>
    );
  }

  return (
    <div className="card-static">
      <div className="flex items-center gap-2 mb-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--status-stale)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" x2="12" y1="9" y2="13" />
          <line x1="12" x2="12.01" y1="17" y2="17" />
        </svg>
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Alerts
        </h3>
        <span
          className="text-[10px] font-bold font-mono-data ml-auto px-1.5 py-0.5 rounded"
          style={{ background: "rgba(248, 113, 113, 0.15)", color: "var(--status-blocked)" }}
        >
          {alerts.length}
        </span>
      </div>
      <div className="space-y-1.5">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 py-2 px-3 rounded-lg text-xs"
            style={{
              background:
                alert.severity === "error"
                  ? "rgba(248, 113, 113, 0.06)"
                  : "rgba(251, 191, 36, 0.06)",
              border: `1px solid ${
                alert.severity === "error"
                  ? "rgba(248, 113, 113, 0.1)"
                  : "rgba(251, 191, 36, 0.1)"
              }`,
            }}
          >
            <span
              className="text-[9px] font-bold uppercase tracking-wider mt-0.5 flex-shrink-0"
              style={{
                color:
                  alert.severity === "error"
                    ? "var(--status-blocked)"
                    : "var(--status-stale)",
              }}
            >
              {alert.type === "blocker" ? "BLOCK" : alert.type === "stale" ? "STALE" : "DUE"}
            </span>
            <div className="min-w-0">
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {alert.project}
              </span>
              <span style={{ color: "var(--text-muted)" }}> — {alert.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
