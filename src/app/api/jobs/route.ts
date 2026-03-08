import { NextRequest, NextResponse } from "next/server";
import { markFollowUpDone } from "@/lib/writers/job-tracker";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "followup-done") {
      const { txId } = body;
      if (!txId) {
        return NextResponse.json({ error: "txId required" }, { status: 400 });
      }
      markFollowUpDone(txId);
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
