"use client";

import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import ContentCard from "./ContentCard";
import type { ContentPiece, ContentStage } from "@/lib/types";

interface KanbanColumnProps {
  stage: ContentStage;
  pieces: ContentPiece[];
  count: number;
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

function DraggableCard({ piece }: { piece: ContentPiece }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: piece.id });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : 1,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <ContentCard piece={piece} />
    </div>
  );
}

export default function KanbanColumn({ stage, pieces, count }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const stageColor = STAGE_COLORS[stage] || "#475569";

  return (
    <div
      ref={setNodeRef}
      className="kanban-column flex-1 rounded-xl p-2 transition-all"
      style={{
        background: isOver ? `${stageColor}08` : "transparent",
        border: isOver ? `1px dashed ${stageColor}30` : "1px solid transparent",
      }}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: stageColor, boxShadow: `0 0 6px ${stageColor}40` }}
        />
        <span className="text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>
          {stage}
        </span>
        <span
          className="text-[10px] font-mono-data font-bold ml-auto px-1.5 py-0.5 rounded-md"
          style={{
            background: `${stageColor}12`,
            color: stageColor,
          }}
        >
          {count}
        </span>
      </div>
      <div className="space-y-0">
        {pieces.map((piece) => (
          <DraggableCard key={piece.id} piece={piece} />
        ))}
      </div>
    </div>
  );
}
