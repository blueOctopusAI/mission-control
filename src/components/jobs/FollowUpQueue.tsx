"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FollowUp } from "@/lib/types";

interface FollowUpQueueProps {
  followUps: FollowUp[];
}

function getUrgencyColor(daysUntil: number): { bg: string; text: string; dot: string; border: string } {
  if (daysUntil < 0) return { bg: "rgba(251, 113, 133, 0.08)", text: "#fb7185", dot: "#fb7185", border: "rgba(251, 113, 133, 0.2)" };
  if (daysUntil <= 1) return { bg: "rgba(251, 191, 36, 0.08)", text: "#fbbf24", dot: "#fbbf24", border: "rgba(251, 191, 36, 0.2)" };
  if (daysUntil <= 3) return { bg: "rgba(79, 180, 232, 0.06)", text: "#4FB4E8", dot: "#4FB4E8", border: "rgba(79, 180, 232, 0.15)" };
  return { bg: "rgba(52, 211, 153, 0.06)", text: "#34d399", dot: "#34d399", border: "rgba(52, 211, 153, 0.15)" };
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
  const router = useRouter();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);

  const sorted = [...followUps]
    .filter((fu) => !dismissed.has(fu.txId))
    .sort((a, b) => a.daysUntil - b.daysUntil);

  async function markDone(txId: string) {
    setLoading(txId);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "followup-done", txId }),
      });
      if (res.ok) {
        setDismissed((prev) => new Set(prev).add(txId));
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  }

  if (sorted.length === 0) {
    return (
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No follow-ups due</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sorted.map((fu) => {
        const urgency = getUrgencyColor(fu.daysUntil);
        const isLoading = loading === fu.txId;
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
              <button
                onClick={() => markDone(fu.txId)}
                disabled={isLoading}
                className="text-xs font-medium px-2.5 py-1 rounded-lg cursor-pointer transition-all"
                style={{
                  background: "rgba(52, 211, 153, 0.1)",
                  color: "var(--status-healthy)",
                  border: "1px solid rgba(52, 211, 153, 0.2)",
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                {isLoading ? "..." : "Done"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
