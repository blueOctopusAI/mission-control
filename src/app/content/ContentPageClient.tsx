"use client";

import { useState } from "react";
import KanbanBoard from "@/components/content/KanbanBoard";
import ContentCalendar from "@/components/content/ContentCalendar";
import NewContentModal from "@/components/content/NewContentModal";
import type { ContentPiece } from "@/lib/types";

interface ContentPageClientProps {
  pieces: ContentPiece[];
}

const STAGE_COLORS: Record<string, string> = {
  Idea: "#475569",
  Research: "#a78bfa",
  Outline: "#2dd4bf",
  Draft: "#60a5fa",
  Review: "#fbbf24",
  Scheduled: "#34d399",
  Published: "#34d399",
};

export default function ContentPageClient({ pieces }: ContentPageClientProps) {
  const [view, setView] = useState<"kanban" | "calendar">("kanban");
  const [showModal, setShowModal] = useState(false);

  const stageCounts = pieces.reduce(
    (acc, p) => {
      acc[p.stage] = (acc[p.stage] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1.5">
          {(["kanban", "calendar"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-4 py-2 rounded-lg text-[11px] font-semibold transition-all capitalize"
              style={{
                background: view === v ? "rgba(37, 99, 235, 0.15)" : "transparent",
                color: view === v ? "var(--accent-blue-light)" : "var(--text-muted)",
                border: `1px solid ${view === v ? "rgba(37, 99, 235, 0.3)" : "var(--border-subtle)"}`,
              }}
            >
              {v}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg text-[11px] font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, var(--accent-blue), #1d4ed8)",
            color: "white",
            boxShadow: "0 0 15px rgba(37, 99, 235, 0.3)",
          }}
        >
          + New Content
        </button>
      </div>

      {/* Stage summary */}
      <div className="flex gap-3 mb-6">
        {["Idea", "Research", "Outline", "Draft", "Review", "Scheduled", "Published"].map(
          (stage) => {
            const color = STAGE_COLORS[stage] || "#475569";
            const count = stageCounts[stage] || 0;
            return (
              <div
                key={stage}
                className="text-center px-3 py-2 rounded-lg flex-1"
                style={{
                  background: count > 0 ? `${color}08` : "transparent",
                  border: `1px solid ${count > 0 ? `${color}15` : "transparent"}`,
                }}
              >
                <div
                  className="text-lg font-bold font-mono-data"
                  style={{ color: count > 0 ? color : "var(--text-muted)" }}
                >
                  {count}
                </div>
                <div className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                  {stage}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Main view */}
      {view === "kanban" ? (
        <KanbanBoard pieces={pieces} />
      ) : (
        <ContentCalendar pieces={pieces} />
      )}

      <NewContentModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onAdd={() => {
          window.location.reload();
        }}
      />
    </div>
  );
}
