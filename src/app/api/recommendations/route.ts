import { NextRequest, NextResponse } from "next/server";
import { updateRecommendationVote } from "@/lib/writers/projects";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { number, delta } = body;

    if (typeof number !== "number" || typeof delta !== "number") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (delta !== 1 && delta !== -1) {
      return NextResponse.json({ error: "Delta must be 1 or -1" }, { status: 400 });
    }

    updateRecommendationVote(number, delta);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
