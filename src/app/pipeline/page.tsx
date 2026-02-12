import Header from "@/components/layout/Header";
import { parseVideoPipeline } from "@/lib/parsers/video-pipeline";
import type { PipelineJob } from "@/lib/parsers/video-pipeline";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    downloading: { bg: "rgba(59, 130, 246, 0.18)", text: "#7bb5ff" },
    transcribing: { bg: "rgba(56, 189, 248, 0.18)", text: "#7dd3fc" },
    routing: { bg: "rgba(94, 234, 212, 0.18)", text: "#5eead4" },
    completed: { bg: "rgba(74, 222, 128, 0.15)", text: "#4ade80" },
    failed: { bg: "rgba(251, 113, 133, 0.15)", text: "#fb7185" },
    pending: { bg: "rgba(148, 163, 184, 0.15)", text: "#94a3b8" },
  };
  const c = colors[status] || colors.pending;
  return (
    <span
      className="px-2.5 py-1 rounded text-xs font-semibold"
      style={{ background: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

function JobRow({ job, variant }: { job: PipelineJob; variant: "active" | "completed" | "failed" }) {
  return (
    <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
      <td className="py-2.5 px-3 text-sm font-mono-data" style={{ color: "var(--text-secondary)" }}>
        {job.id}
      </td>
      <td className="py-2.5 px-3 text-sm" style={{ color: "var(--text-secondary)" }}>
        {job.type}
      </td>
      <td className="py-2.5 px-3 text-sm max-w-[300px] truncate" style={{ color: "var(--text-primary)" }}>
        {job.source}
      </td>
      <td className="py-2.5 px-3">
        <StatusBadge status={job.status} />
      </td>
      {variant === "active" && (
        <>
          <td className="py-2.5 px-3 text-sm font-mono-data" style={{ color: "#0ea5e9" }}>
            {job.progress}
          </td>
          <td className="py-2.5 px-3 text-sm" style={{ color: "var(--text-secondary)" }}>
            {job.route}
          </td>
          <td className="py-2.5 px-3 text-sm font-mono-data" style={{ color: "var(--text-muted)" }}>
            {job.started}
          </td>
        </>
      )}
      {variant === "completed" && (
        <>
          <td className="py-2.5 px-3 text-sm" style={{ color: "var(--text-secondary)" }}>
            {job.output || "—"}
          </td>
          <td className="py-2.5 px-3 text-sm font-mono-data" style={{ color: "var(--text-muted)" }}>
            {job.duration || "—"}
          </td>
          <td className="py-2.5 px-3 text-sm font-mono-data" style={{ color: "var(--text-muted)" }}>
            {job.completed || "—"}
          </td>
        </>
      )}
      {variant === "failed" && (
        <>
          <td className="py-2.5 px-3 text-sm" style={{ color: "var(--status-blocked)" }}>
            {job.error || "Unknown error"}
          </td>
          <td className="py-2.5 px-3 text-sm font-mono-data" style={{ color: "var(--text-muted)" }}>
            {job.completed || "—"}
          </td>
        </>
      )}
    </tr>
  );
}

export default function PipelinePage() {
  const data = parseVideoPipeline();

  return (
    <div>
      <Header title="Video Pipeline" subtitle="Download, transcribe, and route video content" />
      <div className="p-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Jobs", value: data.stats.total, color: "#38bdf8" },
            { label: "Completed", value: data.stats.completed, color: "#4ade80" },
            { label: "Active", value: data.stats.active, color: "#7bb5ff" },
            { label: "Failed", value: data.stats.failed, color: "#fb7185" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4"
              style={{
                background: `linear-gradient(135deg, ${stat.color}18, ${stat.color}06)`,
                border: `1px solid ${stat.color}28`,
              }}
            >
              <div className="text-3xl font-bold font-mono-data" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs mt-0.5 font-semibold" style={{ color: "var(--text-secondary)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Active Jobs */}
        {data.activeJobs.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="section-title">Active Jobs</h3>
              <div className="separator flex-1" />
            </div>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-subtle)" }}>
              <table className="w-full text-left">
                <thead>
                  <tr style={{ background: "rgba(30, 41, 59, 0.6)" }}>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>ID</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Type</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Source</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Status</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Progress</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Route</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Started</th>
                  </tr>
                </thead>
                <tbody>
                  {data.activeJobs.map((job) => (
                    <JobRow key={job.id} job={job} variant="active" />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Completed Jobs */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="section-title">Recent Completed</h3>
            <div className="separator flex-1" />
          </div>
          {data.recentCompleted.length > 0 ? (
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-subtle)" }}>
              <table className="w-full text-left">
                <thead>
                  <tr style={{ background: "rgba(30, 41, 59, 0.6)" }}>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>ID</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Type</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Source</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Status</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Output</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Duration</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentCompleted.map((job) => (
                    <JobRow key={job.id} job={job} variant="completed" />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No completed jobs yet</p>
          )}
        </div>

        {/* Failed Jobs */}
        {data.failedJobs.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="section-title">Failed Jobs</h3>
              <div className="separator flex-1" />
            </div>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-subtle)" }}>
              <table className="w-full text-left">
                <thead>
                  <tr style={{ background: "rgba(30, 41, 59, 0.6)" }}>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>ID</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Type</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Source</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Status</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Error</th>
                    <th className="py-2.5 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data.failedJobs.map((job) => (
                    <JobRow key={job.id} job={job} variant="failed" />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Last Updated */}
        {data.lastUpdated && (
          <p className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>
            Status file last updated: {data.lastUpdated}
          </p>
        )}
      </div>
    </div>
  );
}
