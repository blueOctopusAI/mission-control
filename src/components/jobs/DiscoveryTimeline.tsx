import type { DiscoveryEntry } from "@/lib/types";

interface DiscoveryTimelineProps {
  entries: DiscoveryEntry[];
}

export default function DiscoveryTimeline({ entries }: DiscoveryTimelineProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        No discovery sweeps recorded yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, i) => (
        <div
          key={i}
          className="rounded-xl px-5 py-4 flex items-start gap-4"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div className="flex-shrink-0 mt-1">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--accent-blue-light)", boxShadow: "0 0 8px rgba(96,165,250,0.5)" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono-data font-semibold" style={{ color: "var(--text-secondary)" }}>
                {entry.timestamp}
              </span>
              <span
                className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase"
                style={{ background: "rgba(37, 99, 235, 0.08)", color: "#2563eb" }}
              >
                {entry.source}
              </span>
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {entry.query}
            </p>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {entry.results}
            </p>
            <div className="flex gap-4 mt-1.5 text-xs font-mono-data font-semibold" style={{ color: "var(--text-secondary)" }}>
              {entry.newTCs && <span>TCs: {entry.newTCs}</span>}
              {entry.newOPs && <span>OPs: {entry.newOPs}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
