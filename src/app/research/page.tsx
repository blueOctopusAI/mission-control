import Header from "@/components/layout/Header";
import SignalCards from "@/components/research/SignalCards";
import BookmarkBrowser from "@/components/research/BookmarkBrowser";
import PeopleGrid from "@/components/research/PeopleGrid";
import { parseIntakeLog, parseIntelligenceBrief, parseBookmarks, parsePeople } from "@/lib/parsers";

export default function ResearchPage() {
  const log = parseIntakeLog();
  const brief = parseIntelligenceBrief();
  const bookmarksData = parseBookmarks();
  const peopleData = parsePeople();

  const recentEntries = log.entries.slice(0, 15);
  const pendingCount = log.entries.filter((e) => e.status === "pending").length;
  const lastProcessed = log.entries.find((e) => e.status === "processed");
  const daysSinceLastResearch = lastProcessed
    ? Math.floor((Date.now() - new Date(lastProcessed.timestamp || lastProcessed.date).getTime()) / 86400000)
    : -1;

  const freshness = daysSinceLastResearch <= 1
    ? "Fresh — last link processed today"
    : daysSinceLastResearch <= 3
    ? `${daysSinceLastResearch} days since last research`
    : `Getting stale — ${daysSinceLastResearch} days since last /research`;

  return (
    <div>
      <Header
        title="Research"
        subtitle={freshness}
      />
      <div className="p-8 space-y-6">
        {/* Quick stats bar */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono-data" style={{ color: "var(--accent-blue)" }}>
              {log.entries.length}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>links processed</span>
          </div>
          <div className="separator h-6 w-px" style={{ background: "var(--border-subtle)" }} />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono-data" style={{ color: "var(--accent-purple)" }}>
              {brief.signals.length}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>signals tracked</span>
          </div>
          <div className="separator h-6 w-px" style={{ background: "var(--border-subtle)" }} />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono-data" style={{ color: "var(--accent-amber)" }}>
              {bookmarksData.bookmarks.length}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>bookmarks</span>
          </div>
          <div className="separator h-6 w-px" style={{ background: "var(--border-subtle)" }} />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono-data" style={{ color: "var(--status-healthy)" }}>
              {peopleData.people.length}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>people watched</span>
          </div>
          {pendingCount > 0 && (
            <>
              <div className="separator h-6 w-px" style={{ background: "var(--border-subtle)" }} />
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)" }}
              >
                <span className="text-sm font-bold font-mono-data" style={{ color: "var(--status-stale)" }}>
                  {pendingCount}
                </span>
                <span className="text-xs" style={{ color: "var(--status-stale)" }}>pending</span>
              </div>
            </>
          )}
        </div>

        {/* Recent activity + Signals side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent intake */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="section-title">Recent</h3>
              <div className="separator flex-1" />
            </div>
            <div className="space-y-1">
              {recentEntries.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-xs py-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      background:
                        entry.status === "processed" ? "var(--status-healthy)"
                        : entry.status === "actioned" ? "var(--accent-blue-light)"
                        : "var(--status-stale)",
                    }}
                  />
                  <span className="font-mono-data flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                    {(entry.timestamp || entry.date)?.slice(0, 10)}
                  </span>
                  <span className="truncate" style={{ color: "var(--text-secondary)" }}>
                    {entry.title}
                  </span>
                  {entry.status === "pending" && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ background: "rgba(251,191,36,0.12)", color: "var(--status-stale)" }}
                    >
                      pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Key signals */}
          <SignalCards signals={brief.signals} />
        </div>

        {/* Bookmarks — collapsible */}
        <details>
          <summary className="flex items-center gap-2 mb-3 cursor-pointer select-none">
            <h3 className="section-title">Bookmarks</h3>
            <span className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>
              {bookmarksData.bookmarks.length}
            </span>
            <div className="separator flex-1" />
          </summary>
          <BookmarkBrowser
            bookmarks={bookmarksData.bookmarks}
            categories={bookmarksData.categories}
          />
        </details>

        {/* People — collapsible */}
        <details>
          <summary className="flex items-center gap-2 mb-3 cursor-pointer select-none">
            <h3 className="section-title">People to Watch</h3>
            <span className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>
              {peopleData.people.length}
            </span>
            <div className="separator flex-1" />
          </summary>
          <PeopleGrid people={peopleData.people} />
        </details>
      </div>
    </div>
  );
}
