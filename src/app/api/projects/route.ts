import { NextRequest, NextResponse } from "next/server";
import {
  updateRecommendationStatus,
  markProjectTouched,
  toggleProjectTodo,
} from "@/lib/writers/projects";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "rec-status") {
      const { number, status } = body;
      if (typeof number !== "number" || !status) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }
      updateRecommendationStatus(number, status);
      return NextResponse.json({ success: true });
    }

    if (action === "touch") {
      const { project } = body;
      if (!project) {
        return NextResponse.json({ error: "Project name required" }, { status: 400 });
      }
      markProjectTouched(project);
      return NextResponse.json({ success: true });
    }

    if (action === "toggle-todo") {
      const { project, todo } = body;
      if (!project || !todo) {
        return NextResponse.json({ error: "Project and todo required" }, { status: 400 });
      }
      toggleProjectTodo(project, todo);
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
