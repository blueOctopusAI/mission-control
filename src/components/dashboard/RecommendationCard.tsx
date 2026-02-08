"use client";

import { useState } from "react";
import type { Recommendation } from "@/lib/types";

interface RecommendationCardProps {
  rec: Recommendation;
}

export default function RecommendationCard({ rec }: RecommendationCardProps) {
  const [votes, setVotes] = useState(rec.votes);
  const [voting, setVoting] = useState(false);

  async function vote(delta: number) {
    setVoting(true);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: rec.number, delta }),
      });
      if (res.ok) {
        setVotes((v) => v + delta);
      }
    } finally {
      setVoting(false);
    }
  }

  return (
    <div
      className="flex items-start gap-3 rounded-xl p-3 transition-all"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div className="flex flex-col items-center gap-0.5 pt-0.5">
        <button
          onClick={() => vote(1)}
          disabled={voting}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
          style={{ color: "var(--status-healthy)" }}
          aria-label="Upvote"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M5 1L9 7H1L5 1Z" />
          </svg>
        </button>
        <span
          className="text-xs font-mono-data font-bold"
          style={{
            color:
              votes > 0
                ? "var(--status-healthy)"
                : votes < 0
                ? "var(--status-blocked)"
                : "var(--text-muted)",
          }}
        >
          {votes > 0 ? `+${votes}` : votes}
        </span>
        <button
          onClick={() => vote(-1)}
          disabled={voting}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
          style={{ color: "var(--status-blocked)" }}
          aria-label="Downvote"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M5 9L1 3H9L5 9Z" />
          </svg>
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs leading-relaxed" style={{ color: "var(--text-primary)" }}>
          <span className="font-mono-data text-[10px] mr-2 font-bold" style={{ color: "var(--text-muted)" }}>
            #{rec.number}
          </span>
          {rec.suggestion}
        </div>
        <div className="text-[10px] mt-1 font-mono-data" style={{ color: "var(--text-muted)" }}>
          {rec.source}
        </div>
      </div>
      <span
        className="badge text-[9px] mt-0.5 flex-shrink-0"
        style={{
          background:
            rec.status === "pending"
              ? "rgba(71, 85, 105, 0.2)"
              : "rgba(52, 211, 153, 0.15)",
          color:
            rec.status === "pending"
              ? "var(--text-muted)"
              : "var(--status-healthy)",
        }}
      >
        {rec.status}
      </span>
    </div>
  );
}
