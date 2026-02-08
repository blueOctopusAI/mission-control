import { NextRequest, NextResponse } from "next/server";
import { updateContentStage, addContentPiece } from "@/lib/writers/content-pipeline";
import type { ContentStage } from "@/lib/types";

const VALID_STAGES: ContentStage[] = [
  "Idea", "Research", "Outline", "Draft", "Review", "Scheduled", "Published",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "move") {
      const { title, stage } = body;
      if (!title || !VALID_STAGES.includes(stage)) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }
      updateContentStage(title, stage);
      return NextResponse.json({ success: true });
    }

    if (action === "add") {
      const { platform, title, priority, source, notes } = body;
      if (!platform || !title) {
        return NextResponse.json({ error: "Title and platform required" }, { status: 400 });
      }
      addContentPiece(platform, title, priority || "Medium", source || "", notes || "");
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
