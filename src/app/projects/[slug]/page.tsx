import Header from "@/components/layout/Header";
import BackLink from "@/components/projects/BackLink";
import { TodoList, TouchButton } from "@/components/projects/ProjectActions";
import Link from "next/link";
import fs from "fs";
import { FILES } from "@/lib/config";
import { parseProjects } from "@/lib/parsers";
import type { Project, SynergyFlow } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TIER_COLORS: Record<string, string> = {
  ACTIVE: "#2563eb",
  READY: "#0d9488",
  INCUBATING: "#7c3aed",
  SUPPORTING: "#64748b",
  DORMANT: "#94a3b8",
  PORTFOLIO: "#cbd5e1",
};

const HEALTH_THRESHOLDS = [
  { min: 80, color: "#16a34a", label: "Excellent" },
  { min: 60, color: "#2563eb", label: "Good" },
  { min: 40, color: "#d97706", label: "Needs Work" },
  { min: 20, color: "#ea580c", label: "At Risk" },
  { min: 0, color: "#dc2626", label: "Critical" },
];

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

function abbreviate(name: string, max = 14): string {
  return name.length > max ? name.slice(0, max - 1) + "\u2026" : name;
}

function getMomentum(lastTouched: string, isBlocked: boolean): { label: string; color: string; days: number } {
  if (isBlocked) return { label: "Blocked", color: "#fb7185", days: -1 };
  const d = new Date(lastTouched);
  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 1) return { label: "Active", color: "#16a34a", days };
  if (days <= 6) return { label: "Slowing", color: "#d97706", days };
  return { label: "Stale", color: "#dc2626", days };
}

function computeHealthScore(
  project: Project,
  doneCount: number,
  todoCount: number,
  attentionCount: number,
): number {
  const d = new Date(project.lastTouched);
  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));

  // Recency (40 pts)
  const recency = days <= 1 ? 40 : days <= 3 ? 35 : days <= 6 ? 25 : days <= 13 ? 15 : 5;
  // Progress (30 pts)
  const total = doneCount + todoCount;
  const progress = total > 0 ? Math.round((doneCount / total) * 30) : 15;
  // Direction (20 pts) — has a plan?
  const direction = todoCount > 0 ? 20 : doneCount > 0 ? 10 : 5;
  // Clear path (10 pts) — not blocked, no pile-up
  const clear = project.isBlocked ? 0 : Math.max(0, 10 - attentionCount * 2);

  return Math.min(100, Math.max(0, recency + progress + direction + clear));
}

function getHealthMeta(score: number): { color: string; label: string } {
  for (const t of HEALTH_THRESHOLDS) {
    if (score >= t.min) return { color: t.color, label: t.label };
  }
  return { color: "#dc2626", label: "Critical" };
}

function computeRealityChecks(
  project: Project,
  days: number,
  todoCount: number,
  doneCount: number,
  attentionCount: number,
): { message: string; severity: "error" | "warning" }[] {
  const checks: { message: string; severity: "error" | "warning" }[] = [];

  if ((project.tier === "ACTIVE" || project.tier === "READY") && days > 7) {
    checks.push({
      message: `${project.tier} tier but last activity was ${days} days ago`,
      severity: days > 14 ? "error" : "warning",
    });
  }
  if (project.isBlocked && project.tier === "ACTIVE") {
    checks.push({
      message: "Active project is blocked \u2014 needs immediate unblocking",
      severity: "error",
    });
  }
  if (todoCount === 0 && doneCount === 0 && !["DORMANT", "PORTFOLIO"].includes(project.tier)) {
    checks.push({
      message: "No defined next actions \u2014 project direction unclear",
      severity: "warning",
    });
  }
  if (attentionCount >= 3) {
    checks.push({
      message: `${attentionCount} attention items need resolution`,
      severity: "warning",
    });
  }
  return checks;
}

// ---------------------------------------------------------------------------
// Cross-project analysis
// ---------------------------------------------------------------------------

function findStackPeers(
  currentProject: Project,
  allProjects: Project[],
): Map<string, { name: string; tier: string }[]> {
  if (!currentProject.stack) return new Map();
  const currentTech = currentProject.stack.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  const techMap = new Map<string, { name: string; tier: string }[]>();

  for (const p of allProjects) {
    if (p.name === currentProject.name || !p.stack) continue;
    const pTech = p.stack.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    for (const tech of currentTech) {
      if (pTech.includes(tech)) {
        if (!techMap.has(tech)) techMap.set(tech, []);
        const list = techMap.get(tech)!;
        if (!list.some((x) => x.name === p.name)) {
          list.push({ name: p.name, tier: p.tier });
        }
      }
    }
  }
  return techMap;
}

interface SynergyConnection {
  name: string;
  label: string;
  type: "upstream" | "downstream" | "peer";
}

function findSynergyConnections(
  projectName: string,
  allProjects: Project[],
  synergyFlows: SynergyFlow[],
): SynergyConnection[] {
  const connections: SynergyConnection[] = [];
  const seen = new Set<string>();

  const add = (name: string, label: string, type: SynergyConnection["type"]) => {
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      connections.push({ name, label, type });
    }
  };

  // Structured flows
  for (const flow of synergyFlows) {
    if (flow.from.toLowerCase() === projectName.toLowerCase()) {
      add(flow.to, flow.label, "downstream");
    }
    if (flow.to.toLowerCase() === projectName.toLowerCase()) {
      add(flow.from, flow.label, "upstream");
    }
  }

  // Other projects that mention this one in synergies text
  const lower = projectName.toLowerCase();
  for (const p of allProjects) {
    if (p.name === projectName || !p.synergies) continue;
    if (p.synergies.toLowerCase().includes(lower) && !seen.has(p.name.toLowerCase())) {
      add(p.name, "", "peer");
    }
  }

  return connections;
}

// ---------------------------------------------------------------------------
// Markdown helpers
// ---------------------------------------------------------------------------

function parseStrategyIndex(): Record<string, string[]> {
  const content = fs.readFileSync(FILES.projects, "utf-8");
  const map: Record<string, string[]> = {};
  const indexMatch = content.match(/## Strategy Index[\s\S]*?\n\n\|.*\n\|[-|]+\n([\s\S]*?)\n\n/);
  if (!indexMatch) return map;
  const rows = indexMatch[1].split("\n").filter((l) => l.startsWith("|"));
  for (const row of rows) {
    const cells = row.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length >= 2) {
      const project = cells[0];
      const docs = cells[1].match(/`([^`]+)`/g)?.map((d) => d.replace(/`/g, "")) || [];
      map[project] = docs;
    }
  }
  return map;
}

function parseAttentionItems(projectName: string): string[] {
  try {
    const attPath = FILES.projects.replace("portfolio/projects.md", "portfolio/attention.md");
    const content = fs.readFileSync(attPath, "utf-8");
    const items: string[] = [];
    const lines = content.split("\n");
    const lower = projectName.toLowerCase();
    for (const line of lines) {
      if (line.toLowerCase().includes(lower) && line.includes("|")) {
        items.push(line.replace(/^\|/, "").replace(/\|$/, "").trim());
      }
    }
    return items;
  } catch {
    return [];
  }
}

function parseFullNextActions(projectContent: string): { done: string[]; todo: string[] } {
  const done: string[] = [];
  const todo: string[] = [];
  const lines = projectContent.split("\n");
  let inActions = false;
  for (const line of lines) {
    if (line.includes("**Next actions:**")) { inActions = true; continue; }
    if (inActions) {
      const doneMatch = line.match(/^\s+-\s+\[x\]\s+(.+)$/);
      const todoMatch = line.match(/^\s+-\s+\[ \]\s+(.+)$/);
      if (doneMatch) done.push(doneMatch[1]);
      else if (todoMatch) todo.push(todoMatch[1]);
      else if (line.match(/^- \*\*/) || (line.match(/^###/) && !line.includes("Next"))) break;
    }
  }
  return { done, todo };
}

function getProjectBlock(projectName: string): string {
  try {
    const content = fs.readFileSync(FILES.projects, "utf-8");
    const regex = new RegExp(`### ${projectName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\n([\\s\\S]*?)(?=\\n### |\\n---\\n|$)`);
    const match = content.match(regex);
    return match ? match[1] : "";
  } catch {
    return "";
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const projectsData = parseProjects();
  const project = projectsData.projects.find(
    (p) =>
      p.name.toLowerCase() === decodedSlug.toLowerCase() ||
      p.name.toLowerCase().replace(/\s+/g, "-") === decodedSlug.toLowerCase(),
  );

  if (!project) {
    return (
      <div>
        <Header title="Project Not Found" subtitle={`No project matching "${decodedSlug}"`} />
        <div className="p-8">
          <Link href="/projects" className="text-sm" style={{ color: "var(--accent-blue-light)" }}>
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // --- Compute all derived data ---
  const tierColor = TIER_COLORS[project.tier] || "#60a5fa";
  const momentum = getMomentum(project.lastTouched, project.isBlocked);
  const strategyMap = parseStrategyIndex();
  const strategyDocs = strategyMap[project.name] || strategyMap["Cross-cutting"] || [];
  const attentionItems = parseAttentionItems(project.name);
  const block = getProjectBlock(project.name);
  const { done, todo } = parseFullNextActions(block);
  const totalActions = done.length + todo.length;
  const progressPct = totalActions > 0 ? Math.round((done.length / totalActions) * 100) : -1;

  const healthScore = computeHealthScore(project, done.length, todo.length, attentionItems.length);
  const health = getHealthMeta(healthScore);

  const days = momentum.days >= 0 ? momentum.days : Math.floor((Date.now() - new Date(project.lastTouched).getTime()) / 86400000);
  const realityChecks = computeRealityChecks(project, days, todo.length, done.length, attentionItems.length);

  const synergyConnections = findSynergyConnections(project.name, projectsData.projects, projectsData.synergyFlows);
  const stackPeers = findStackPeers(project, projectsData.projects);

  const relatedRecs = projectsData.recommendations.filter(
    (r) => r.suggestion.toLowerCase().includes(project.name.toLowerCase()) && r.status === "pending",
  );

  // --- SVG constants for synergy network ---
  const svgW = 300, svgH = 220, cx = svgW / 2, cy = svgH / 2, radius = 75;
  const maxNodes = 8;
  const visibleConnections = synergyConnections.slice(0, maxNodes);
  const overflow = synergyConnections.length - maxNodes;

  // --- Progress ring SVG math ---
  const ringSize = 80;
  const ringR = 32;
  const ringCirc = 2 * Math.PI * ringR;
  const ringOffset = progressPct >= 0 ? ringCirc - (progressPct / 100) * ringCirc : ringCirc;

  return (
    <div>
      <Header title={project.name} subtitle={project.what} />
      <div className="p-8 space-y-5">
        <BackLink />

        {/* ============================================================ */}
        {/* HERO METRICS ROW                                             */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Health Score */}
          <div
            className="rounded-xl p-4 flex flex-col items-center justify-center"
            style={{ background: `${health.color}08`, border: `1px solid ${health.color}25` }}
          >
            <div className="text-[10px] font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Health
            </div>
            <div className="text-3xl font-bold font-mono-data" style={{ color: health.color }}>
              {healthScore}
            </div>
            <div className="text-[10px] font-semibold mt-0.5" style={{ color: health.color }}>
              {health.label}
            </div>
          </div>

          {/* Progress Ring */}
          <div
            className="rounded-xl p-4 flex flex-col items-center justify-center"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="text-[10px] font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Progress
            </div>
            {progressPct >= 0 ? (
              <>
                <svg width={ringSize} height={ringSize}>
                  <circle cx={ringSize / 2} cy={ringSize / 2} r={ringR} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                  <circle
                    cx={ringSize / 2} cy={ringSize / 2} r={ringR}
                    fill="none" stroke={tierColor} strokeWidth="6"
                    strokeDasharray={ringCirc} strokeDashoffset={ringOffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                  />
                  <text x={ringSize / 2} y={ringSize / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={tierColor}>
                    {progressPct}%
                  </text>
                </svg>
                <div className="text-[10px] font-mono-data" style={{ color: "var(--text-muted)" }}>
                  {done.length}/{totalActions} done
                </div>
              </>
            ) : (
              <div className="text-sm" style={{ color: "var(--text-muted)" }}>No actions</div>
            )}
          </div>

          {/* Momentum */}
          <div
            className="rounded-xl p-4 flex flex-col items-center justify-center"
            style={{ background: `${momentum.color}08`, border: `1px solid ${momentum.color}25` }}
          >
            <div className="text-[10px] font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Momentum
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: momentum.color, boxShadow: `0 0 8px ${momentum.color}60` }}
              />
              <span className="text-lg font-bold" style={{ color: momentum.color }}>
                {momentum.label}
              </span>
            </div>
            {momentum.days >= 0 && (
              <div className="text-[10px] font-mono-data mt-1" style={{ color: "var(--text-muted)" }}>
                {momentum.days === 0 ? "today" : `${momentum.days}d ago`}
              </div>
            )}
          </div>

          {/* Tier + Lane + GitHub */}
          <div
            className="rounded-xl p-4 flex flex-col justify-center gap-2"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="flex items-center gap-2">
              <span className={`badge badge-${project.tier.toLowerCase()} text-[9px]`}>{project.tier}</span>
              {project.lane && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md" style={{ background: "rgba(100,116,139,0.08)", color: "var(--text-secondary)" }}>
                  {project.lane}
                </span>
              )}
            </div>
            <div className="text-[10px] font-mono-data" style={{ color: "var(--text-muted)" }}>
              Touched {project.lastTouched || "never"}
            </div>
            {project.github && (
              <div className="text-[10px] font-mono-data truncate" style={{ color: "var(--accent-blue-light)" }}>
                {project.github}
              </div>
            )}
            <TouchButton projectName={project.name} />
          </div>
        </div>

        {/* ============================================================ */}
        {/* REALITY CHECKS                                               */}
        {/* ============================================================ */}
        {realityChecks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {realityChecks.map((check, i) => (
              <div
                key={i}
                className="rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-2"
                style={{
                  background: check.severity === "error" ? "rgba(220,38,38,0.06)" : "rgba(217,119,6,0.06)",
                  border: `1px solid ${check.severity === "error" ? "rgba(220,38,38,0.2)" : "rgba(217,119,6,0.2)"}`,
                  color: check.severity === "error" ? "#dc2626" : "#d97706",
                }}
              >
                <span className="text-sm">{check.severity === "error" ? "\u2716" : "\u26A0"}</span>
                {check.message}
              </div>
            ))}
          </div>
        )}

        {/* Blocker alert */}
        {project.isBlocked && (
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(220, 38, 38, 0.06)", border: "1px solid rgba(220, 38, 38, 0.2)" }}
          >
            <div className="text-sm font-semibold mb-1" style={{ color: "#dc2626" }}>Blocked</div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{project.blockers}</div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MAIN CONTENT GRID                                            */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN — Actions + Status */}
          <div className="lg:col-span-2 space-y-5">

            {/* Next Actions with progress bar */}
            {totalActions > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Next Actions
                  </h2>
                  <span className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>
                    {done.length}/{totalActions}
                  </span>
                  <div className="flex-1" />
                </div>
                {/* Progress bar */}
                <div className="rounded-full h-2 mb-3 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${tierColor}, ${tierColor}cc)` }}
                  />
                </div>
                {todo.length > 0 && (
                  <div
                    className="rounded-xl p-4"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
                  >
                    <TodoList projectName={project.name} todos={todo} tierColor={tierColor} />
                  </div>
                )}
              </section>
            )}

            {/* Status */}
            <section>
              <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Status</h2>
              <div
                className="rounded-xl p-4 text-xs leading-relaxed"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
              >
                {project.status || "No status available."}
              </div>
            </section>

            {/* Stack + Peers */}
            {project.stack && (
              <section>
                <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Stack</h2>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.stack.split(",").map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-1 rounded-md font-medium"
                      style={{ background: `${tierColor}15`, color: tierColor, border: `1px solid ${tierColor}30` }}
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
                {/* Technology clusters */}
                {stackPeers.size > 0 && (
                  <div
                    className="rounded-lg p-3"
                    style={{ background: "rgba(100,116,139,0.03)", border: "1px solid var(--border-subtle)" }}
                  >
                    <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
                      SHARED TECHNOLOGY
                    </div>
                    <div className="space-y-1.5">
                      {Array.from(stackPeers.entries()).map(([tech, projects]) => (
                        <div key={tech} className="flex items-start gap-2 text-[11px]">
                          <span className="font-medium flex-shrink-0 capitalize" style={{ color: tierColor }}>
                            {tech}
                          </span>
                          <span style={{ color: "var(--text-muted)" }}>&rarr;</span>
                          <div className="flex flex-wrap gap-1">
                            {projects.map((p) => (
                              <Link
                                key={p.name}
                                href={`/projects/${encodeURIComponent(p.name)}`}
                                className="px-1.5 py-0.5 rounded text-[10px] font-medium hover:opacity-80"
                                style={{
                                  background: `${TIER_COLORS[p.tier] || "#64748b"}12`,
                                  color: TIER_COLORS[p.tier] || "#64748b",
                                }}
                              >
                                {p.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Completed work */}
            {done.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  Completed <span className="font-normal text-xs" style={{ color: "var(--text-muted)" }}>({done.length})</span>
                </h2>
                <div
                  className="rounded-xl p-4 max-h-[250px] overflow-y-auto"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
                >
                  <ul className="space-y-1.5">
                    {done.map((action, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs">
                        <span className="flex-shrink-0 mt-0.5" style={{ color: "#16a34a" }}>&#10003;</span>
                        <span style={{ color: "var(--text-muted)" }}>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN — Ecosystem + Context */}
          <div className="space-y-5">

            {/* Synergy Network */}
            {visibleConnections.length > 0 && (
              <div
                className="rounded-xl p-4"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
              >
                <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  Ecosystem
                </h3>
                <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full">
                  {/* Connection lines */}
                  {visibleConnections.map((conn, i) => {
                    const angle = (i * 2 * Math.PI / visibleConnections.length) - Math.PI / 2;
                    const nx = cx + radius * Math.cos(angle);
                    const ny = cy + radius * Math.sin(angle);
                    const lineColor = conn.type === "upstream" ? "#0d9488" : conn.type === "downstream" ? "#2563eb" : "#94a3b8";
                    return (
                      <line
                        key={`line-${conn.name}`}
                        x1={cx} y1={cy} x2={nx} y2={ny}
                        stroke={lineColor} strokeWidth="1.5"
                        strokeDasharray={conn.type === "peer" ? "4,3" : "none"}
                        opacity={0.4}
                      />
                    );
                  })}
                  {/* Center node */}
                  <circle cx={cx} cy={cy} r={10} fill={tierColor} opacity={0.15} />
                  <circle cx={cx} cy={cy} r={7} fill={tierColor} />
                  <text x={cx} y={cy + 20} textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text-primary)">
                    {abbreviate(project.name, 18)}
                  </text>
                  {/* Satellite nodes */}
                  {visibleConnections.map((conn, i) => {
                    const angle = (i * 2 * Math.PI / visibleConnections.length) - Math.PI / 2;
                    const nx = cx + radius * Math.cos(angle);
                    const ny = cy + radius * Math.sin(angle);
                    const nodeColor = conn.type === "upstream" ? "#0d9488" : conn.type === "downstream" ? "#2563eb" : "#94a3b8";
                    const cosA = Math.cos(angle);
                    const textAnchor = cosA > 0.3 ? "start" : cosA < -0.3 ? "end" : "middle";
                    const labelX = nx + 14 * Math.cos(angle);
                    const labelY = ny + 14 * Math.sin(angle);
                    return (
                      <g key={`node-${conn.name}`}>
                        <circle cx={nx} cy={ny} r={5} fill={nodeColor} />
                        <text
                          x={labelX} y={labelY + 3}
                          textAnchor={textAnchor}
                          fontSize="9" fill="var(--text-secondary)"
                        >
                          {abbreviate(conn.name, 16)}
                        </text>
                        {conn.label && (
                          <text
                            x={(cx + nx) / 2} y={(cy + ny) / 2 - 6}
                            textAnchor="middle"
                            fontSize="7" fill="var(--text-muted)" opacity={0.7}
                          >
                            {abbreviate(conn.label, 20)}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
                {/* Legend */}
                <div className="flex gap-4 mt-1 justify-center">
                  {visibleConnections.some((c) => c.type === "upstream") && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-[2px] rounded" style={{ background: "#0d9488" }} />
                      <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>feeds in</span>
                    </div>
                  )}
                  {visibleConnections.some((c) => c.type === "downstream") && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-[2px] rounded" style={{ background: "#2563eb" }} />
                      <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>sends to</span>
                    </div>
                  )}
                  {visibleConnections.some((c) => c.type === "peer") && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-[2px] rounded" style={{ background: "#94a3b8", borderTop: "1px dashed #94a3b8" }} />
                      <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>linked</span>
                    </div>
                  )}
                </div>
                {overflow > 0 && (
                  <div className="text-center text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                    +{overflow} more connections
                  </div>
                )}
              </div>
            )}

            {/* Synergies text (if no structured connections, fall back to text) */}
            {visibleConnections.length === 0 && project.synergies && (
              <div
                className="rounded-xl p-4"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
              >
                <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  Synergies
                </h3>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {project.synergies}
                </p>
              </div>
            )}

            {/* Attention items */}
            {attentionItems.length > 0 && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(217, 119, 6, 0.06)", border: "1px solid rgba(217, 119, 6, 0.2)" }}
              >
                <h3 className="text-xs font-semibold mb-2" style={{ color: "#d97706" }}>
                  Attention <span className="font-mono-data">({attentionItems.length})</span>
                </h3>
                <ul className="space-y-1.5">
                  {attentionItems.map((item, i) => (
                    <li key={i} className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strategy docs */}
            {strategyDocs.length > 0 && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(37, 99, 235, 0.04)", border: "1px solid rgba(37, 99, 235, 0.15)" }}
              >
                <h3 className="text-xs font-semibold mb-2" style={{ color: "#2563eb" }}>
                  Strategy Docs
                </h3>
                <ul className="space-y-1">
                  {strategyDocs.map((doc) => (
                    <li key={doc} className="text-[11px] font-mono-data" style={{ color: "var(--text-secondary)" }}>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {relatedRecs.length > 0 && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(124, 58, 237, 0.04)", border: "1px solid rgba(124, 58, 237, 0.15)" }}
              >
                <h3 className="text-xs font-semibold mb-2" style={{ color: "#7c3aed" }}>
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {relatedRecs.map((rec) => (
                    <li key={rec.number} className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      <span className="font-mono-data font-bold" style={{ color: "#7c3aed" }}>#{rec.number}</span>{" "}
                      {rec.suggestion.slice(0, 120)}{rec.suggestion.length > 120 ? "..." : ""}
                      <span className="ml-1 font-mono-data" style={{ color: "var(--text-muted)" }}>
                        ({rec.votes > 0 ? "+" : ""}{rec.votes})
                      </span>
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
