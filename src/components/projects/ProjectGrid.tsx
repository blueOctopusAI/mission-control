import type { Project, Tier } from "@/lib/types";
import ProjectCard from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
}

const TIER_ORDER: Tier[] = [
  "ACTIVE",
  "READY",
  "INCUBATING",
  "SUPPORTING",
  "DORMANT",
  "PORTFOLIO",
];

const TIER_DESCRIPTIONS: Record<Tier, string> = {
  ACTIVE: "Getting regular work this week/month",
  READY: "Could start this week with minimal setup",
  INCUBATING: "Designed but not yet built",
  SUPPORTING: "Built tools that serve other projects",
  DORMANT: "Paused — could be revived",
  PORTFOLIO: "Completed — demonstrates skills",
};

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const grouped = TIER_ORDER.map((tier) => ({
    tier,
    projects: projects.filter((p) => p.tier === tier),
  })).filter((g) => g.projects.length > 0);

  return (
    <div className="space-y-8">
      {grouped.map(({ tier, projects: tierProjects }) => (
        <div key={tier}>
          <div className="flex items-center gap-3 mb-4">
            <span className={`badge badge-${tier.toLowerCase()}`}>
              {tier}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {TIER_DESCRIPTIONS[tier]}
            </span>
            <div className="separator flex-1" />
            <span
              className="text-xs font-mono-data font-bold"
              style={{ color: "var(--text-muted)" }}
            >
              {tierProjects.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tierProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
