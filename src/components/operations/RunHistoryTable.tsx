import type { RunHistoryEntry, RunStatus } from "@/lib/types";

interface Props {
  entries: RunHistoryEntry[];
}

const STATUS_BADGE: Record<RunStatus, { bg: string; color: string; label: string }> = {
  pass: { bg: "rgba(22, 163, 74, 0.12)", color: "#16a34a", label: "PASS" },
  fail: { bg: "rgba(220, 38, 38, 0.12)", color: "#dc2626", label: "FAIL" },
  skip: { bg: "rgba(217, 119, 6, 0.12)", color: "#d97706", label: "SKIP" },
  unknown: { bg: "rgba(100, 116, 139, 0.12)", color: "#64748b", label: "?" },
};

function formatDuration(dur: string): string {
  if (dur === "-" || dur === "Nones") return "-";
  const seconds = parseInt(dur);
  if (isNaN(seconds)) return dur;
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

function formatTimestamp(ts: string): string {
  if (!ts || ts === "-") return "-";
  // "2026-03-08T14:12" → "Mar 8 14:12"
  const match = ts.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return ts;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[parseInt(match[2]) - 1];
  const day = parseInt(match[3]);
  return `${month} ${day} ${match[4]}:${match[5]}`;
}

export default function RunHistoryTable({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-sm" style={{ color: "var(--text-muted)" }}>
        No run history available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <th className="text-left py-2 px-3 font-semibold" style={{ color: "var(--text-muted)" }}>Time</th>
            <th className="text-left py-2 px-3 font-semibold" style={{ color: "var(--text-muted)" }}>Task</th>
            <th className="text-left py-2 px-3 font-semibold" style={{ color: "var(--text-muted)" }}>Status</th>
            <th className="text-left py-2 px-3 font-semibold" style={{ color: "var(--text-muted)" }}>Duration</th>
            <th className="text-left py-2 px-3 font-semibold" style={{ color: "var(--text-muted)" }}>Scan</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const badge = STATUS_BADGE[entry.exitBadge];
            return (
              <tr
                key={i}
                style={{
                  borderBottom: "1px solid var(--border-subtle)",
                  background: i % 2 === 0 ? "transparent" : "rgba(100, 116, 139, 0.02)",
                }}
              >
                <td className="py-2 px-3 font-mono-data" style={{ color: "var(--text-secondary)" }}>
                  {formatTimestamp(entry.timestamp)}
                </td>
                <td className="py-2 px-3 font-medium" style={{ color: "var(--text-primary)" }}>
                  {entry.task}
                </td>
                <td className="py-2 px-3">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: badge.bg, color: badge.color }}
                  >
                    {badge.label}
                  </span>
                </td>
                <td className="py-2 px-3 font-mono-data" style={{ color: "var(--text-secondary)" }}>
                  {formatDuration(entry.duration)}
                </td>
                <td className="py-2 px-3">
                  <span
                    className="text-[10px] font-mono-data"
                    style={{ color: entry.scan === "ok" ? "var(--text-muted)" : "#d97706" }}
                  >
                    {entry.scan}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
