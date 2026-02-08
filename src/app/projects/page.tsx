import Header from "@/components/layout/Header";
import ProjectGrid from "@/components/projects/ProjectGrid";
import SynergyGraph from "@/components/projects/SynergyGraph";
import { parseProjects } from "@/lib/parsers";

export default function ProjectsPage() {
  const data = parseProjects();

  const tierCounts = data.projects.reduce(
    (acc, p) => {
      acc[p.tier] = (acc[p.tier] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      <Header
        title="Projects"
        subtitle={`${data.projects.length} projects across ${Object.keys(tierCounts).length} tiers`}
      />
      <div className="p-8 space-y-8">
        <SynergyGraph projects={data.projects} flows={data.synergyFlows} />
        <ProjectGrid projects={data.projects} />
      </div>
    </div>
  );
}
