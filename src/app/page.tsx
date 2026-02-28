import Header from "@/components/layout/Header";
import MetricsRow from "@/components/dashboard/MetricsRow";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import FocusPanel from "@/components/dashboard/FocusPanel";
import RecommendationCard from "@/components/dashboard/RecommendationCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { parseProjects, parseContentPipeline, parseIntakeLog, parseTools, parsePeople, parseVideoPipeline } from "@/lib/parsers";
import type { Alert, DashboardMetrics, Project } from "@/lib/types";
import VideoPipelineWidget from "@/components/dashboard/VideoPipelineWidget";
import fs from "fs";
import { FILES } from "@/lib/config";

function computeMetrics(): DashboardMetrics {
  const log = parseIntakeLog();
  const pipeline = parseContentPipeline();
  const projects = parseProjects();
  const tools = parseTools();
  const people = parsePeople();

  const strategiesDir = FILES.strategiesDir;
  let strategiesCount = 0;
  try {
    strategiesCount = fs.readdirSync(strategiesDir).filter((f) => f.endsWith(".md")).length;
  } catch {
    // directory doesn't exist
  }

  const activeProjects = projects.projects.filter(
    (p) => p.tier === "ACTIVE"
  ).length;

  const inPipeline = pipeline.pieces.filter(
    (p) => p.stage !== "Published"
  ).length;

  return {
    linksProcessed: log.entries.filter((e) => e.status !== "pending").length,
    contentInPipeline: inPipeline,
    activeProjects,
    daysSinceLastBlogPost: 0,
    toolsEvaluated: tools.tools.length,
    peopleTracked: people.people.length,
    strategiesDocumented: strategiesCount,
    recommendations: projects.recommendations.length,
  };
}

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

function ProjectMiniCard({ project }: { project: Project }) {
  const color = TIER_COLORS[project.tier] || "#60a5fa";
  const hasBlocker = project.isBlocked;

  return (
    <div
      className="rounded-lg p-3.5 transition-all hover-lift"
      style={{
        background: `linear-gradient(135deg, ${color}18, ${color}0a)`,
        border: `1px solid ${color}30`,
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{
            background: hasBlocker ? "var(--status-blocked)" : color,
            boxShadow: hasBlocker ? "0 0 8px rgba(251, 113, 133, 0.5)" : `0 0 8px ${color}50`,
          }}
        />
        <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
          {project.name}
        </span>
        <span className={`badge badge-${project.tier.toLowerCase()} text-[9px] ml-auto flex-shrink-0`}>
          {project.tier}
        </span>
      </div>
      <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
        {project.what?.slice(0, 70)}{project.what && project.what.length > 70 ? "..." : ""}
      </p>
      {project.nextActions[0] && (
        <div className="text-xs mt-1.5 flex items-start gap-1.5">
          <span className="font-semibold" style={{ color: "var(--text-muted)" }}>Next:</span>
          <span className="truncate" style={{ color: "var(--text-primary)" }}>
            {project.nextActions[0]}
          </span>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const projectsData = parseProjects();
  const logData = parseIntakeLog();
  const metrics = computeMetrics();
  const alerts = computeAlerts();
  const pipelineData = parseVideoPipeline();

  const activeProjects = projectsData.projects.filter((p) => p.tier === "ACTIVE" || p.tier === "READY" || p.tier === "INCUBATING");

  return (
    <div>
      <Header title="Mission Control" subtitle="Blue Octopus Technology command center" />
      <div className="p-8 space-y-6">
        {/* Metrics */}
        <MetricsRow metrics={metrics} />

        {/* Project Status + Focus/Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="section-title">Active Projects</h3>
              <div className="separator flex-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeProjects.map((project) => (
                <ProjectMiniCard key={project.name} project={project} />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <FocusPanel
              recommendations={projectsData.recommendations}
              projects={projectsData.projects}
            />
            <AlertsPanel alerts={alerts} />
          </div>
        </div>

        {/* Video Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <VideoPipelineWidget data={pipelineData} />
          </div>
        </div>

        {/* Recommendations + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="section-title">Recommendations</h3>
              <div className="separator flex-1" />
            </div>
            <div className="space-y-2">
              {projectsData.recommendations
                .filter((rec) => rec.status === "pending" || rec.status === "idea")
                .map((rec) => (
                  <RecommendationCard key={rec.number} rec={rec} />
                ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="section-title">Activity Feed</h3>
              <div className="separator flex-1" />
            </div>
            <ActivityFeed entries={logData.entries} />
          </div>
        </div>
      </div>
    </div>
  );
}
