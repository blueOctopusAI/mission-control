import Header from "@/components/layout/Header";
import BackLink from "@/components/projects/BackLink";
import Link from "next/link";
import { parseContentPipeline, parseIntakeLog, parseBookmarks } from "@/lib/parsers";

interface Props {
  params: Promise<{ slug: string }>;
}

const PLATFORM_COLORS: Record<string, string> = {
  "Blue Octopus Blog": "#2563eb",
  "Blue Octopus LinkedIn": "#0077b5",
  "Blue Octopus X": "#1da1f2",
  "Blue Octopus YouTube": "#ff0000",
  "UtilitarianTechnology YouTube": "#ff4500",
  "OpenClaw Posts": "#7c3aed",
};

const STAGE_COLORS: Record<string, string> = {
  Idea: "#64748b",
  Research: "#7c3aed",
  Outline: "#0d9488",
  Draft: "#2563eb",
  Review: "#d97706",
  Scheduled: "#16a34a",
  Published: "#16a34a",
};

const STAGE_ORDER = ["Idea", "Research", "Outline", "Draft", "Review", "Scheduled", "Published"];

export default async function ContentDetailPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const pipelineData = parseContentPipeline();
  const piece = pipelineData.pieces.find((p) => p.id === decodedSlug);

  if (!piece) {
    return (
      <div>
        <Header title="Content Not Found" subtitle={`No content matching "${decodedSlug}"`} />
        <div className="p-8">
          <Link href="/content" className="text-sm" style={{ color: "var(--accent-blue-light)" }}>
            Back to Content
          </Link>
        </div>
      </div>
    );
  }

  const platformColor = PLATFORM_COLORS[piece.platform] || "#64748b";
  const stageColor = STAGE_COLORS[piece.stage] || "#64748b";
  const stageIndex = STAGE_ORDER.indexOf(piece.stage);
  const progressPct = stageIndex >= 0 ? Math.round(((stageIndex + 1) / STAGE_ORDER.length) * 100) : 0;

  // Find related content on same platform
  const samePlatform = pipelineData.pieces.filter(
    (p) => p.platform === piece.platform && p.id !== piece.id && p.stage !== "Published"
  ).slice(0, 5);

  // Find content from same source
  const sameSource = piece.source
    ? pipelineData.pieces.filter(
        (p) => p.id !== piece.id && p.source && piece.source &&
          p.source.toLowerCase().includes(piece.source.split(",")[0].trim().toLowerCase().slice(0, 20))
      ).slice(0, 5)
    : [];

  // Cross-reference: find bookmarks that might be related
  let relatedBookmarks: { title: string; url: string }[] = [];
  try {
    const bookmarksData = parseBookmarks();
    const titleWords = piece.title.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
    relatedBookmarks = bookmarksData.bookmarks
      .filter((b) => titleWords.some((w) => b.title.toLowerCase().includes(w) || b.content?.toLowerCase().includes(w)))
      .slice(0, 5)
      .map((b) => ({ title: b.title, url: b.url }));
  } catch {
    // bookmarks not available
  }

  // Cross-reference: find intake log entries related to this content
  let relatedIntake: { title: string; timestamp: string; status: string }[] = [];
  try {
    const intakeData = parseIntakeLog();
    const titleWords = piece.title.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
    relatedIntake = intakeData.entries
      .filter((e) => titleWords.some((w) => e.title.toLowerCase().includes(w)))
      .slice(0, 5)
      .map((e) => ({ title: e.title, timestamp: e.timestamp, status: e.status }));
  } catch {
    // intake not available
  }

  return (
    <div>
      <Header title={piece.title} subtitle={piece.platform} />
      <div className="p-8 space-y-5">
        <BackLink />

        {/* Stage progress bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded"
                style={{ background: `${stageColor}18`, color: stageColor, border: `1px solid ${stageColor}30` }}
              >
                {piece.stage}
              </span>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded"
                style={{ background: `${platformColor}18`, color: platformColor, border: `1px solid ${platformColor}30` }}
              >
                {piece.platform.replace("Blue Octopus ", "").replace("UtilitarianTechnology ", "UT ")}
              </span>
              {piece.priority && (
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded"
                  style={{
                    background: piece.priority.toLowerCase() === "high" ? "rgba(220,38,38,0.08)" : "rgba(100,116,139,0.08)",
                    color: piece.priority.toLowerCase() === "high" ? "#dc2626" : "var(--text-muted)",
                  }}
                >
                  {piece.priority} Priority
                </span>
              )}
            </div>
            {piece.due && (
              <span className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>
                Due: {piece.due}
              </span>
            )}
          </div>
          {/* Visual pipeline */}
          <div className="flex items-center gap-1 mt-3">
            {STAGE_ORDER.map((stage, i) => {
              const isActive = stage === piece.stage;
              const isPast = i < stageIndex;
              const color = isPast || isActive ? stageColor : "rgba(255,255,255,0.08)";
              return (
                <div key={stage} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full h-1.5 rounded-full"
                    style={{ background: color, opacity: isActive ? 1 : isPast ? 0.5 : 1 }}
                  />
                  <span
                    className="text-[9px]"
                    style={{ color: isActive ? stageColor : isPast ? "var(--text-muted)" : "var(--text-muted)", fontWeight: isActive ? 700 : 400 }}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Source */}
            {piece.source && (
              <section>
                <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Source</h2>
                <div
                  className="rounded-xl p-4 text-xs leading-relaxed"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
                >
                  {piece.source}
                </div>
              </section>
            )}

            {/* Notes */}
            {piece.notes && (
              <section>
                <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Notes</h2>
                <div
                  className="rounded-xl p-4 text-xs leading-relaxed"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
                >
                  {piece.notes}
                </div>
              </section>
            )}

            {/* Related Research */}
            {relatedBookmarks.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Related Research</h2>
                <div
                  className="rounded-xl p-4"
                  style={{ background: "rgba(37, 99, 235, 0.04)", border: "1px solid rgba(37, 99, 235, 0.15)" }}
                >
                  <ul className="space-y-2">
                    {relatedBookmarks.map((b, i) => (
                      <li key={i} className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {b.title}
                        {b.url && (
                          <span className="ml-2 font-mono-data text-[10px]" style={{ color: "var(--text-muted)" }}>
                            {b.url.slice(0, 50)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Related Intake */}
            {relatedIntake.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Related Links Processed</h2>
                <div
                  className="rounded-xl p-4"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
                >
                  <ul className="space-y-1.5">
                    {relatedIntake.map((e, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{
                            background: e.status === "processed" ? "var(--status-healthy)" : e.status === "actioned" ? "var(--accent-blue-light)" : "var(--status-stale)",
                          }}
                        />
                        <span className="font-mono-data" style={{ color: "var(--text-muted)" }}>{e.timestamp?.slice(0, 10)}</span>
                        <span style={{ color: "var(--text-secondary)" }}>{e.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </div>

          {/* Right column — Context */}
          <div className="space-y-5">
            {/* Same platform */}
            {samePlatform.length > 0 && (
              <div
                className="rounded-xl p-4"
                style={{ background: `${platformColor}06`, border: `1px solid ${platformColor}15` }}
              >
                <h3 className="text-xs font-semibold mb-2" style={{ color: platformColor }}>
                  Also on {piece.platform.replace("Blue Octopus ", "")}
                </h3>
                <ul className="space-y-1.5">
                  {samePlatform.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/content/${encodeURIComponent(p.id)}`}
                        className="text-[11px] leading-relaxed hover:underline"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {p.title}
                        <span className="ml-1 text-[9px] font-mono-data" style={{ color: "var(--text-muted)" }}>
                          ({p.stage})
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Same source */}
            {sameSource.length > 0 && (
              <div
                className="rounded-xl p-4"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
              >
                <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  From Same Source
                </h3>
                <ul className="space-y-1.5">
                  {sameSource.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/content/${encodeURIComponent(p.id)}`}
                        className="text-[11px] leading-relaxed hover:underline"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {p.title}
                        <span className="ml-1 text-[9px] font-mono-data" style={{ color: "var(--text-muted)" }}>
                          ({p.stage})
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
