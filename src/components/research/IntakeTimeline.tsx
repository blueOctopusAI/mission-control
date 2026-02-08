"use client";

import { useState } from "react";
import type { LogEntry } from "@/lib/types";

interface IntakeTimelineProps {
  entries: LogEntry[];
}

export default function IntakeTimeline({ entries }: IntakeTimelineProps) {
  const [limit, setLimit] = useState(20);

  const visibleEntries = entries.slice(0, limit);

  return (
    <div className="card-static">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Intake Timeline
          </h3>
        </div>
        <span className="text-[10px] font-mono-data font-bold" style={{ color: "var(--text-muted)" }}>
          {entries.length} total
        </span>
      </div>

      <div className="space-y-0.5 max-h-[500px] overflow-y-auto pr-1">
        {visibleEntries.map((entry, i) => {
          const showDate =
            i === 0 || visibleEntries[i - 1].date !== entry.date;

          return (
            <div key={i}>
              {showDate && (
                <div
                  className="text-[10px] font-bold mt-3 mb-1.5 font-mono-data uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  {entry.date}
                </div>
              )}
              <div
                className="flex items-start gap-2.5 py-1.5 px-2 rounded-lg transition-colors"
                style={{ background: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(37, 99, 235, 0.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{
                    background:
                      entry.status === "processed"
                        ? "var(--status-healthy)"
                        : entry.status === "actioned"
                        ? "var(--accent-blue-light)"
                        : "var(--status-stale)",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] block truncate transition-colors"
                    style={{ color: "var(--text-primary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-blue-light)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                  >
                    {entry.title}
                  </a>
                  <span
                    className="text-[9px] font-mono-data"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {entry.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {limit < entries.length && (
        <button
          onClick={() => setLimit((l) => l + 20)}
          className="mt-3 text-[11px] font-semibold w-full py-2.5 rounded-lg transition-all"
          style={{
            background: "rgba(37, 99, 235, 0.08)",
            color: "var(--accent-blue-light)",
            border: "1px solid rgba(37, 99, 235, 0.15)",
          }}
        >
          Load more ({entries.length - limit} remaining)
        </button>
      )}
    </div>
  );
}
