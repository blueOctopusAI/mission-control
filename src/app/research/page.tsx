import Header from "@/components/layout/Header";
import IntakeTimeline from "@/components/research/IntakeTimeline";
import SignalCards from "@/components/research/SignalCards";
import BookmarkBrowser from "@/components/research/BookmarkBrowser";
import PeopleGrid from "@/components/research/PeopleGrid";
import { parseIntakeLog, parseIntelligenceBrief, parseBookmarks, parsePeople } from "@/lib/parsers";

export default function ResearchPage() {
  const log = parseIntakeLog();
  const brief = parseIntelligenceBrief();
  const bookmarksData = parseBookmarks();
  const peopleData = parsePeople();

  return (
    <div>
      <Header
        title="Research"
        subtitle={`${log.entries.length} links processed, ${brief.signals.length} key signals`}
      />
      <div className="p-8 space-y-8">
        {/* Signals + Timeline side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SignalCards signals={brief.signals} />
          <IntakeTimeline entries={log.entries} />
        </div>

        {/* Bookmarks */}
        <BookmarkBrowser
          bookmarks={bookmarksData.bookmarks}
          categories={bookmarksData.categories}
        />

        {/* People */}
        <PeopleGrid people={peopleData.people} />
      </div>
    </div>
  );
}
