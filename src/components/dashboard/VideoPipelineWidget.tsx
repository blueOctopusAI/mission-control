import Link from "next/link";
import type { VideoPipelineData } from "@/lib/parsers/video-pipeline";

interface Props {
  data: VideoPipelineData;
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <div
      className="w-2 h-2 rounded-full flex-shrink-0"
      style={{
        background: active ? "var(--status-healthy)" : "var(--text-muted)",
        boxShadow: active ? "0 0 6px rgba(52, 211, 153, 0.5)" : "none",
      }}
    />
  );
}

function ProgressBar({ progress }: { progress: string }) {
  const pct = parseInt(progress) || 0;
  return (
    <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${Math.min(pct, 100)}%`,
          background: "linear-gradient(90deg, #2563eb, #14b8a6)",
        }}
      />
    </div>
  );
}

export default function VideoPipelineWidget({ data }: Props) {
  const hasActive = data.activeJobs.length > 0;

  return (
    <div
      className="rounded-xl p-4 hover-lift"
      style={{
        background: "linear-gradient(135deg, rgba(14, 165, 233, 0.08), rgba(20, 184, 166, 0.03))",
        border: "1px solid rgba(14, 165, 233, 0.15)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Video Pipeline
          </span>
          <StatusDot active={hasActive} />
        </div>
        <Link
          href="/pipeline"
          className="text-xs font-semibold"
          style={{ color: "#0284c7" }}
        >
          View All &rarr;
        </Link>
      </div>

      {/* Active jobs */}
      {hasActive ? (
        <div className="space-y-2.5 mb-3">
          {data.activeJobs.slice(0, 3).map((job) => (
            <div key={job.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-data truncate max-w-[200px]" style={{ color: "var(--text-secondary)" }}>
                  {job.source}
                </span>
                <span className="text-xs font-mono-data font-semibold" style={{ color: "#0284c7" }}>
                  {job.progress}
                </span>
              </div>
              <ProgressBar progress={job.progress} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          No active jobs
        </p>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-5">
        <div className="text-center">
          <div className="text-lg font-bold font-mono-data" style={{ color: "#0284c7" }}>
            {data.stats.total}
          </div>
          <div className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold font-mono-data" style={{ color: "var(--status-healthy)" }}>
            {data.stats.completed}
          </div>
          <div className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Done</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold font-mono-data" style={{ color: "#2563eb" }}>
            {data.stats.active}
          </div>
          <div className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Active</div>
        </div>
        {data.stats.failed > 0 && (
          <div className="text-center">
            <div className="text-lg font-bold font-mono-data" style={{ color: "var(--status-blocked)" }}>
              {data.stats.failed}
            </div>
            <div className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Failed</div>
          </div>
        )}
      </div>
    </div>
  );
}
