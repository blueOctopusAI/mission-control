"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";
import ContentCard from "./ContentCard";
import PlatformFilter from "./PlatformFilter";
import type { ContentPiece, ContentStage, Platform } from "@/lib/types";

interface KanbanBoardProps {
  pieces: ContentPiece[];
}

const STAGES: ContentStage[] = [
  "Idea",
  "Research",
  "Outline",
  "Draft",
  "Review",
  "Scheduled",
  "Published",
];

export default function KanbanBoard({ pieces: initialPieces }: KanbanBoardProps) {
  const [pieces, setPieces] = useState(initialPieces);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [platform, setPlatform] = useState<Platform | "all">("all");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const filtered = platform === "all"
    ? pieces
    : pieces.filter((p) => p.platform === platform);

  const activePiece = pieces.find((p) => p.id === activeId);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const pieceId = String(active.id);
    const newStage = String(over.id) as ContentStage;

    if (!STAGES.includes(newStage)) return;

    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece || piece.stage === newStage) return;

    // Optimistic update
    setPieces((prev) =>
      prev.map((p) => (p.id === pieceId ? { ...p, stage: newStage } : p))
    );

    // Write back to markdown
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "move",
          title: piece.title,
          stage: newStage,
        }),
      });
    } catch {
      // Revert on error
      setPieces((prev) =>
        prev.map((p) =>
          p.id === pieceId ? { ...p, stage: piece.stage } : p
        )
      );
    }
  }

  return (
    <div>
      <div className="mb-4">
        <PlatformFilter selected={platform} onChange={setPlatform} />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const columnPieces = filtered.filter((p) => p.stage === stage);
            return (
              <KanbanColumn
                key={stage}
                stage={stage}
                pieces={columnPieces}
                count={columnPieces.length}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activePiece ? <ContentCard piece={activePiece} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
