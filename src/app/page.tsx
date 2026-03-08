import Header from "@/components/layout/Header";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import FocusPanel from "@/components/dashboard/FocusPanel";
import RecommendationCard from "@/components/dashboard/RecommendationCard";
import { parseProjects, parseIntakeLog } from "@/lib/parsers";
import type { Alert, Project } from "@/lib/types";
import Link from "next/link";

function computeAlerts(): Alert[] {
  const projects = parseProjects();
  const alerts: Alert[] = [];

  for (const project of projects.projects) {
    if (project.tier === "PORTFOLIO" || project.tier === "DORMANT") continue;

    if (project.lastTouched) {
      const lastDate = new Date(project.lastTouched);
      const daysSince = Math.floor(
        (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSince > 7 && project.tier !== "SUPPORTING") {
        alerts.push({
          type: "stale",
          project: project.name,
          message: `Not touched in ${daysSince} days`,
          severity: daysSince > 14 ? "error" : "warning",
        });
      }
    }

    if (project.isBlocked) {
      alerts.push({
        type: "blocker",
        project: project.name,
        message: project.blockers,
        severity: "error",
      });
    }
  }

  return alerts.sort((a, b) =>
    a.severity === "error" && b.severity !== "error" ? -1 : 0
  );
}

const TIER_COLORS: Record<string, string> = {
  ACTIVE: "#2563eb",
  READY: "#0d9488",
  INCUBATING: "#7c3aed",
  SUPPORTING: "#64748b",
  DORMANT: "#94a3b8",
  PORTFOLIO: "#cbd5e1",
};

function getMomentum(project: Project): { label: string; color: string; days: number } {
  if (project.isBlocked) return { label: "Blocked", color: "var(--status-blocked)", days: -1 };
  const d = new Date(project.lastTouched);
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 1) return { label: "Active", color: "var(--status-healthy)", days };
  if (days <= 6) return { label: "Slowing", color: "var(--status-stale)", days };
  return { label: "Stale", color: "var(--status-blocked)", days };
}

function ProjectRow({ project }: { project: Project }) {
  const color = TIER_COLORS[project.tier] || "#60a5fa";
  const momentum = getMomentum(project);

  return (
    <Link
      href={`/projects/${encodeURIComponent(project.name)}`}
      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover-lift"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderLeft: `3px solid ${color}`,
      }}
    >
      {/* Momentum dot */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{
          background: momentum.color,
          boxShadow: momentum.days <= 1 ? `0 0 6px ${momentum.color}` : "none",
        }}
      />
      {/* Name */}
      <span className="text-sm font-semibold flex-shrink-0" style={{ color: "var(--text-primary)", minWidth: "140px" }}>
        {project.name}
      </span>
      {/* Tier badge */}
      <span className={`badge badge-${project.tier.toLowerCase()} text-[9px] flex-shrink-0`}>
        {project.tier}
      </span>
      {/* Next action or blocker */}
      <span className="text-xs truncate flex-1" style={{ color: project.isBlocked ? "var(--status-blocked)" : "var(--text-muted)" }}>
        {project.isBlocked
          ? `Blocked: ${project.blockers?.slice(0, 80)}`
          : project.nextActions[0]
            ? project.nextActions[0]
            : project.status?.slice(0, 80) || ""}
      </span>
      {/* Days */}
      <span className="text-xs font-mono-data flex-shrink-0" style={{ color: momentum.color }}>
        {momentum.days >= 0 ? `${momentum.days}d` : ""}
      </span>
    </Link>
  );
}

export default function DashboardPage() {
  const projectsData = parseProjects();
  const logData = parseIntakeLog();
  const alerts = computeAlerts();

  const activeProjects = projectsData.projects.filter(
    (p) => p.tier === "ACTIVE" || p.tier === "READY" || p.tier === "INCUBATING"
  );

  // Sort: blocked first, then by last touched (most recent first)
  const sortedProjects = [...activeProjects].sort((a, b) => {
    if (a.isBlocked && !b.isBlocked) return -1;
    if (!a.isBlocked && b.isBlocked) return 1;
    return new Date(b.lastTouched).getTime() - new Date(a.lastTouched).getTime();
  });

  const recentActivity = logData.entries.slice(0, 6);

  const pendingRecs = projectsData.recommendations
    .filter((rec) => rec.status === "pending" || rec.status === "idea")
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5);

  // Smart greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
  const activeCount = activeProjects.length;
  const blockedCount = activeProjects.filter((p) => p.isBlocked).length;
  const staleCount = activeProjects.filter((p) => {
    const d = new Date(p.lastTouched);
    return Math.floor((Date.now() - d.getTime()) / 86400000) > 6;
  }).length;

  // Octo's status line
  const statusLine = blockedCount > 0
    ? `${blockedCount} blocked. Let's fix that first.`
    : staleCount > 2
    ? `${staleCount} projects going cold. Pick one.`
    : alerts.length > 0
    ? `${alerts.length} thing${alerts.length > 1 ? "s" : ""} need attention.`
    : `${activeCount} projects humming. All clear.`;

  return (
    <div>
      <header className="px-8 py-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #4FB4E8, #FF914D)", boxShadow: "0 2px 8px rgba(79, 180, 232, 0.3)" }}
          >
            <span className="text-white font-bold text-xs">BO</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              {greeting}, Jason
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
              {statusLine}
            </p>
          </div>
        </div>
      </header>
      <div className="p-8 space-y-6">
        {/* Top row: Focus + Alerts side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FocusPanel
            recommendations={projectsData.recommendations}
            projects={projectsData.projects}
          />
          <AlertsPanel alerts={alerts} />
        </div>

        {/* Projects — compact list, not a card grid */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="section-title">Projects</h3>
            <span className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>
              {activeProjects.length} active
            </span>
            <div className="separator flex-1" />
          </div>
          <div className="space-y-1.5">
            {sortedProjects.map((project) => (
              <ProjectRow key={project.name} project={project} />
            ))}
          </div>
        </div>

        {/* Bottom row: Recommendations + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingRecs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="section-title">Top Recommendations</h3>
                <div className="separator flex-1" />
              </div>
              <div className="space-y-2">
                {pendingRecs.map((rec) => (
                  <RecommendationCard key={rec.number} rec={rec} />
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="section-title">Recent</h3>
              <div className="separator flex-1" />
            </div>
            <div className="space-y-1">
              {recentActivity.map((entry, i) => (
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
                    {entry.timestamp?.slice(0, 16) || entry.date}
                  </span>
                  <span className="truncate" style={{ color: "var(--text-secondary)" }}>
                    {entry.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
