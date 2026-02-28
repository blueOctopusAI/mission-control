import type { FollowUp } from "@/lib/types";

interface FollowUpQueueProps {
  followUps: FollowUp[];
}

function getUrgencyColor(daysUntil: number): { bg: string; text: string; dot: string; border: string } {
  if (daysUntil < 0) return { bg: "rgba(220, 38, 38, 0.08)", text: "#dc2626", dot: "#dc2626", border: "rgba(220, 38, 38, 0.2)" };
  if (daysUntil <= 1) return { bg: "rgba(217, 119, 6, 0.08)", text: "#d97706", dot: "#d97706", border: "rgba(217, 119, 6, 0.2)" };
  if (daysUntil <= 3) return { bg: "rgba(37, 99, 235, 0.06)", text: "#2563eb", dot: "#2563eb", border: "rgba(37, 99, 235, 0.15)" };
  return { bg: "rgba(5, 150, 105, 0.06)", text: "#059669", dot: "#059669", border: "rgba(5, 150, 105, 0.15)" };
}

function getUrgencyLabel(daysUntil: number): string {
  if (daysUntil >= 999) return "Waiting";
  if (daysUntil < -1) return `${Math.abs(daysUntil)} days overdue`;
  if (daysUntil === -1) return "1 day overdue";
  if (daysUntil === 0) return "Due today";
  if (daysUntil === 1) return "Due tomorrow";
  if (daysUntil <= 7) return `${daysUntil} days`;
  return `~${Math.ceil(daysUntil / 7)} weeks`;
}

export default function FollowUpQueue({ followUps }: FollowUpQueueProps) {
  const sorted = [...followUps].sort((a, b) => a.daysUntil - b.daysUntil);

  if (sorted.length === 0) {
    return (
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No follow-ups due</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sorted.map((fu) => {
        const urgency = getUrgencyColor(fu.daysUntil);
        return (
          <div
            key={fu.txId}
            className="rounded-xl px-5 py-3.5 flex items-center gap-4"
            style={{
              background: urgency.bg,
              border: `1px solid ${urgency.border}`,
            }}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: urgency.dot, boxShadow: `0 0 10px ${urgency.dot}80` }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-data font-semibold" style={{ color: urgency.text }}>
                  {fu.txId}
                </span>
                <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {fu.company}
                </span>
                {fu.contact && fu.contact !== "—" && (
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    — {fu.contact}
                  </span>
                )}
              </div>
              <div className="text-sm mt-0.5" style={{ color: "var(--text-primary)" }}>
                {fu.actionDue}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs font-mono-data" style={{ color: "var(--text-secondary)" }}>
                {fu.dueDate}
              </span>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-lg"
                style={{ background: `${urgency.text}25`, color: urgency.text }}
              >
                {getUrgencyLabel(fu.daysUntil)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
