import Header from "@/components/layout/Header";
import Link from "next/link";
import { parseContentPipeline } from "@/lib/parsers";
import type { ContentPiece } from "@/lib/types";

const PLATFORM_COLORS: Record<string, string> = {
  "Blue Octopus Blog": "#2563eb",
  "Blue Octopus LinkedIn": "#0077b5",
  "Blue Octopus X": "#1da1f2",
  "Blue Octopus YouTube": "#ff0000",
  "UtilitarianTechnology YouTube": "#ff4500",
  "OpenClaw Posts": "#7c3aed",
};

function PlatformBadge({ platform }: { platform: string }) {
  const color = PLATFORM_COLORS[platform] || "#64748b";
  // Short label
  const short = platform
    .replace("Blue Octopus ", "")
    .replace("UtilitarianTechnology ", "UT ")
    .replace("OpenClaw Posts", "OpenClaw");
  return (
    <span
      className="text-[9px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
      style={{ background: `${color}18`, color, border: `1px solid ${color}25` }}
    >
      {short}
    </span>
  );
}

function ContentRow({ piece }: { piece: ContentPiece }) {
  return (
    <Link
      href={`/content/${encodeURIComponent(piece.id)}`}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover-lift"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
    >
      <PlatformBadge platform={piece.platform} />
      <span className="text-sm truncate flex-1" style={{ color: "var(--text-primary)" }}>
        {piece.title}
      </span>
      {piece.priority && piece.priority.toLowerCase() === "high" && (
        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626" }}>
          HIGH
        </span>
      )}
      {piece.due && (
        <span className="text-[10px] font-mono-data flex-shrink-0" style={{ color: "var(--text-muted)" }}>
          {piece.due}
        </span>
      )}
    </Link>
  );
}

function ContentSection({ title, pieces, accent, defaultOpen = true }: { title: string; pieces: ContentPiece[]; accent: string; defaultOpen?: boolean }) {
  if (pieces.length === 0) return null;
  return (
    <details open={defaultOpen}>
      <summary className="flex items-center gap-2 mb-2 cursor-pointer select-none">
        <h3 className="text-sm font-semibold" style={{ color: accent }}>
          {title}
        </h3>
        <span className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>
          {pieces.length}
        </span>
        <div className="separator flex-1" />
      </summary>
      <div className="space-y-1.5 mb-6">
        {pieces.map((piece, i) => (
          <ContentRow key={`${piece.title}-${i}`} piece={piece} />
        ))}
      </div>
    </details>
  );
}

export default function ContentPage() {
  const data = parseContentPipeline();

  const scheduled = data.pieces.filter((p) => p.stage === "Scheduled");
  const review = data.pieces.filter((p) => p.stage === "Review");
  const outline = data.pieces.filter((p) => p.stage === "Outline");
  const draft = data.pieces.filter((p) => p.stage === "Draft");
  const research = data.pieces.filter((p) => p.stage === "Research");
  const ideas = data.pieces.filter((p) => p.stage === "Idea");
  const published = data.pieces.filter((p) => p.stage === "Published");

  // Group drafts by platform for readability
  const draftsByPlatform = new Map<string, ContentPiece[]>();
  for (const d of draft) {
    const key = d.platform;
    if (!draftsByPlatform.has(key)) draftsByPlatform.set(key, []);
    draftsByPlatform.get(key)!.push(d);
  }

  return (
    <div>
      <Header
        title="Content"
        subtitle={`${scheduled.length + review.length} ready \u00b7 ${outline.length + draft.length + research.length} in progress \u00b7 ${published.length} published`}
      />
      <div className="p-8 space-y-2">
        {/* Ready to go — these need action */}
        <ContentSection title="Ready to Publish" pieces={scheduled} accent="var(--status-healthy)" />
        <ContentSection title="In Review" pieces={review} accent="var(--status-stale)" />

        {/* Work in progress */}
        <ContentSection title="Outlines" pieces={outline} accent="var(--accent-teal)" />

        {/* Drafts — grouped by platform since there are 70+ */}
        {draft.length > 0 && (
          <details>
            <summary className="flex items-center gap-2 mb-2 cursor-pointer select-none">
              <h3 className="text-sm font-semibold" style={{ color: "var(--accent-blue-light)" }}>
                Drafts
              </h3>
              <span className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>
                {draft.length}
              </span>
              <div className="separator flex-1" />
            </summary>
            <div className="space-y-4 mb-6">
              {Array.from(draftsByPlatform.entries()).map(([platform, pieces]) => (
                <div key={platform}>
                  <div className="flex items-center gap-2 mb-1.5 ml-2">
                    <PlatformBadge platform={platform} />
                    <span className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>
                      {pieces.length}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {pieces.map((piece, i) => (
                      <ContentRow key={`${piece.title}-${i}`} piece={piece} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}

        <ContentSection title="Research" pieces={research} accent="var(--accent-purple)" defaultOpen={false} />
        <ContentSection title="Ideas" pieces={ideas} accent="var(--text-muted)" defaultOpen={false} />

        {/* Published — collapsed by default, just for reference */}
        <ContentSection title="Published" pieces={published} accent="var(--text-muted)" defaultOpen={false} />
      </div>
    </div>
  );
}
