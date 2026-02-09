import Header from "@/components/layout/Header";
import { parseVideoPipeline } from "@/lib/parsers/video-pipeline";
import type { PipelineJob } from "@/lib/parsers/video-pipeline";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    downloading: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa" },
    transcribing: { bg: "rgba(14, 165, 233, 0.15)", text: "#38bdf8" },
    routing: { bg: "rgba(45, 212, 191, 0.15)", text: "#2dd4bf" },
    completed: { bg: "rgba(52, 211, 153, 0.12)", text: "#34d399" },
    failed: { bg: "rgba(248, 113, 113, 0.12)", text: "#f87171" },
    pending: { bg: "rgba(148, 163, 184, 0.12)", text: "#94a3b8" },
  };
  const c = colors[status] || colors.pending;
  return (
    <span
      className="px-2 py-0.5 rounded text-[10px] font-semibold"
      style={{ background: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

function JobRow({ job, variant }: { job: PipelineJob; variant: "active" | "completed" | "failed" }) {
  return (
    <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
      <td className="py-2 px-3 text-[11px] font-mono-data" style={{ color: "var(--text-secondary)" }}>
        {job.id}
      </td>
      <td className="py-2 px-3 text-[11px]" style={{ color: "var(--text-secondary)" }}>
        {job.type}
      </td>
      <td className="py-2 px-3 text-[11px] max-w-[300px] truncate" style={{ color: "var(--text-primary)" }}>
        {job.source}
      </td>
      <td className="py-2 px-3">
        <StatusBadge status={job.status} />
      </td>
      {variant === "active" && (
        <>
          <td className="py-2 px-3 text-[11px] font-mono-data" style={{ color: "#0ea5e9" }}>
            {job.progress}
          </td>
          <td className="py-2 px-3 text-[11px]" style={{ color: "var(--text-secondary)" }}>
            {job.route}
          </td>
          <td className="py-2 px-3 text-[11px] font-mono-data" style={{ color: "var(--text-muted)" }}>
            {job.started}
          </td>
        </>
      )}
      {variant === "completed" && (
        <>
          <td className="py-2 px-3 text-[11px]" style={{ color: "var(--text-secondary)" }}>
            {job.output || "—"}
          </td>
          <td className="py-2 px-3 text-[11px] font-mono-data" style={{ color: "var(--text-muted)" }}>
            {job.duration || "—"}
          </td>
          <td className="py-2 px-3 text-[11px] font-mono-data" style={{ color: "var(--text-muted)" }}>
            {job.completed || "—"}
          </td>
        </>
      )}
      {variant === "failed" && (
        <>
          <td className="py-2 px-3 text-[11px]" style={{ color: "var(--status-blocked)" }}>
            {job.error || "Unknown error"}
          </td>
          <td className="py-2 px-3 text-[11px] font-mono-data" style={{ color: "var(--text-muted)" }}>
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
            { label: "Total Jobs", value: data.stats.total, color: "#0ea5e9" },
            { label: "Completed", value: data.stats.completed, color: "#34d399" },
            { label: "Active", value: data.stats.active, color: "#60a5fa" },
            { label: "Failed", value: data.stats.failed, color: "#f87171" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4"
              style={{
                background: `linear-gradient(135deg, ${stat.color}12, ${stat.color}04)`,
                border: `1px solid ${stat.color}15`,
              }}
            >
              <div className="text-2xl font-bold font-mono-data" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-[10px] mt-0.5 font-medium" style={{ color: "var(--text-muted)" }}>
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
                  <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>ID</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Type</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Source</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Status</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Progress</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Route</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Started</th>
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
                  <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>ID</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Type</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Source</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Status</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Output</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Duration</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Completed</th>
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
                  <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>ID</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Type</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Source</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Status</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Error</th>
                    <th className="py-2 px-3 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Time</th>
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
          <p className="text-[10px] font-mono-data" style={{ color: "var(--text-muted)" }}>
            Status file last updated: {data.lastUpdated}
          </p>
        )}
      </div>
    </div>
  );
}
