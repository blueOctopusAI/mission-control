"use client";

import { useState } from "react";
import type { Signal } from "@/lib/types";

interface SignalCardsProps {
  signals: Signal[];
}

function SignalCard({ signal }: { signal: Signal }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl p-4 cursor-pointer transition-all hover-lift"
      onClick={() => setExpanded(!expanded)}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="text-sm font-bold font-mono-data flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg"
          style={{
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(96, 165, 250, 0.1))",
            color: "var(--accent-blue-light)",
            border: "1px solid rgba(37, 99, 235, 0.2)",
          }}
        >
          {signal.number}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
            {signal.title}
          </h4>
          {expanded && (
            <div className="mt-3 space-y-2.5">
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {signal.description}
              </p>
              {signal.position && (
                <div
                  className="text-sm p-3 rounded-lg"
                  style={{
                    background: "rgba(94, 234, 212, 0.08)",
                    color: "var(--accent-teal)",
                    border: "1px solid rgba(94, 234, 212, 0.15)",
                  }}
                >
                  <span className="font-bold text-xs uppercase tracking-wider">Our position: </span>
                  {signal.position}
                </div>
              )}
            </div>
          )}
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className="flex-shrink-0 mt-1.5 transition-transform"
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path d="M2 4L6 8L10 4" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

export default function SignalCards({ signals }: SignalCardsProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
          Key Signals
        </h3>
        <span className="text-xs font-mono-data font-bold ml-auto" style={{ color: "var(--accent-blue-light)" }}>
          {signals.length}
        </span>
      </div>
      <div className="space-y-2">
        {signals.map((signal) => (
          <SignalCard key={signal.number} signal={signal} />
        ))}
      </div>
    </div>
  );
}
