import Header from "@/components/layout/Header";
import BackLink from "@/components/projects/BackLink";
import { parseTools } from "@/lib/parsers";

interface Props {
  params: Promise<{ slug: string }>;
}

const STATUS_COLORS: Record<string, string> = {
  Documented: "#06B6D4",
  Installed: "#0d9488",
  Tested: "#34d399",
  "In Use": "#34d399",
  Rejected: "#fb7185",
  Pending: "#64748b",
};

const STATUS_ORDER = ["Pending", "Documented", "Installed", "Tested", "In Use"];

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const data = parseTools();
  const tool = data.tools.find((t) => t.slug === decodedSlug);

  if (!tool) {
    return (
      <div>
        <Header title="Tool Not Found" subtitle={`No tool matching "${decodedSlug}"`} />
        <div className="p-8">
          <BackLink />
        </div>
      </div>
    );
  }

  const statusColor = STATUS_COLORS[tool.status] || "#64748b";
  const statusIndex = STATUS_ORDER.indexOf(tool.status);
  const isRejected = tool.status === "Rejected";

  // Find related tools (same status or overlapping use cases)
  const relatedTools = data.tools
    .filter((t) => t.slug !== tool.slug)
    .map((t) => {
      let relevance = 0;
      if (t.status === tool.status) relevance += 1;
      const overlap = tool.useCases.filter((uc) =>
        t.useCases.some((tuc) => tuc.toLowerCase().includes(uc.toLowerCase().split(" ")[0]))
      );
      relevance += overlap.length;
      return { ...t, relevance };
    })
    .filter((t) => t.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);

  return (
    <div>
      <Header title={tool.name} subtitle={tool.what.slice(0, 120)} />
      <div className="p-8 space-y-5">
        <BackLink />

        {/* Status pipeline */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded"
              style={{ background: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}30` }}
            >
              {tool.status}
            </span>
            {tool.maturity && tool.maturity !== "Unknown" && (
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Maturity: {tool.maturity}
              </span>
            )}
          </div>
          {!isRejected && (
            <div className="flex items-center gap-1 mt-3">
              {STATUS_ORDER.map((stage, i) => {
                const isActive = stage === tool.status;
                const isPast = i < statusIndex;
                const color = isPast || isActive ? statusColor : "rgba(255,255,255,0.08)";
                return (
                  <div key={stage} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full h-1.5 rounded-full"
                      style={{ background: color, opacity: isActive ? 1 : isPast ? 0.5 : 1 }}
                    />
                    <span
                      className="text-[9px]"
                      style={{
                        color: isActive ? statusColor : "var(--text-muted)",
                        fontWeight: isActive ? 700 : 400,
                      }}
                    >
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          {isRejected && (
            <div
              className="rounded-lg px-3 py-2 text-xs font-medium mt-2"
              style={{ background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.2)", color: "#fb7185" }}
            >
              This tool was evaluated and rejected.
            </div>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Description */}
            <section>
              <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Overview</h2>
              <div
                className="rounded-xl p-4 text-xs leading-relaxed"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
              >
                {tool.what}
              </div>
            </section>

            {/* Use Cases */}
            {tool.useCases.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Use Cases</h2>
                <div
                  className="rounded-xl p-4"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
                >
                  <ul className="space-y-2.5">
                    {tool.useCases.map((uc, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: statusColor }}
                        />
                        <span style={{ color: "var(--text-secondary)" }}>{uc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Install */}
            {tool.installInstructions && (
              <section>
                <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Installation</h2>
                <div
                  className="rounded-xl p-4 font-mono-data text-[11px] leading-relaxed whitespace-pre-wrap"
                  style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
                >
                  {tool.installInstructions}
                </div>
              </section>
            )}

            {/* Security */}
            {tool.securityNotes && (
              <section>
                <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--status-stale)" }}>Security Notes</h2>
                <div
                  className="rounded-xl p-4 text-xs leading-relaxed"
                  style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)", color: "var(--text-secondary)" }}
                >
                  {tool.securityNotes}
                </div>
              </section>
            )}
          </div>

          {/* Right — Context */}
          <div className="space-y-5">
            {/* File reference */}
            <div
              className="rounded-xl p-4"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
            >
              <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Source</h3>
              <div className="text-[10px] font-mono-data" style={{ color: "var(--text-muted)" }}>
                {tool.filePath.split("/").pop()}
              </div>
            </div>

            {/* Related tools */}
            {relatedTools.length > 0 && (
              <div
                className="rounded-xl p-4"
                style={{ background: `${statusColor}06`, border: `1px solid ${statusColor}15` }}
              >
                <h3 className="text-xs font-semibold mb-2" style={{ color: statusColor }}>
                  Related Tools
                </h3>
                <ul className="space-y-1.5">
                  {relatedTools.map((t) => (
                    <li key={t.slug}>
                      <a
                        href={`/tools/${encodeURIComponent(t.slug)}`}
                        className="text-[11px] leading-relaxed hover:underline"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {t.name}
                        <span className="ml-1 text-[9px] font-mono-data" style={{ color: "var(--text-muted)" }}>
                          ({t.status})
                        </span>
                      </a>
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
