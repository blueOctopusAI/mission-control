import type { ResultsData } from "@/lib/types";

interface ResultsPanelProps {
  results: ResultsData;
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-primary)" }}>
      <table className="w-full text-left">
        <thead>
          <tr style={{ background: "var(--bg-secondary)" }}>
            {headers.map((h) => (
              <th key={h} className="py-2.5 px-4 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t" style={{ borderColor: "var(--border-subtle)" }}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`py-2 px-4 text-sm ${j === 0 ? "font-semibold" : ""}`}
                  style={{ color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)" }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <div className="space-y-6">
      {/* By Industry */}
      {results.byIndustry.length > 0 && (
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-secondary)" }}>
            By Industry
          </div>
          <DataTable
            headers={["Industry", "Applied", "Responses", "Interviews", "Notes"]}
            rows={results.byIndustry.map((r) => [r.industry, r.applied, r.responses, r.interviews, r.notes])}
          />
        </div>
      )}

      {/* By Variant */}
      {results.byVariant.length > 0 && (
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-secondary)" }}>
            By Resume Variant
          </div>
          <DataTable
            headers={["Variant", "Used", "Responses", "Notes"]}
            rows={results.byVariant.map((r) => [r.variant, r.used, r.responses, r.notes])}
          />
        </div>
      )}

      {/* By Channel */}
      {results.byChannel.length > 0 && (
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-secondary)" }}>
            By Channel
          </div>
          <DataTable
            headers={["Channel", "Applied", "Responses", "Notes"]}
            rows={results.byChannel.map((r) => [r.channel, r.applied, r.responses, r.notes])}
          />
        </div>
      )}

      {/* Lessons Learned */}
      {results.lessons.length > 0 && (
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-secondary)" }}>
            Lessons Learned
          </div>
          <div className="space-y-3">
            {results.lessons.map((lesson, i) => (
              <div
                key={i}
                className="rounded-xl p-4"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-xs font-mono-data font-semibold" style={{ color: "var(--accent-blue-light)" }}>
                    {lesson.date}
                  </span>
                  <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    {lesson.company}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {lesson.points.map((point, j) => {
                    const boldMatch = point.match(/^\*\*(.+?):\*\*\s*(.*)$/);
                    return (
                      <p key={j} className="text-sm leading-relaxed">
                        {boldMatch ? (
                          <>
                            <span className="font-bold" style={{ color: "var(--accent-blue-light)" }}>{boldMatch[1]}:</span>{" "}
                            <span style={{ color: "var(--text-primary)" }}>{boldMatch[2]}</span>
                          </>
                        ) : (
                          <span style={{ color: "var(--text-primary)" }}>{point}</span>
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
