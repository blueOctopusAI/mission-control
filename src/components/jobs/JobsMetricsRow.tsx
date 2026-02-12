import type { ResultsStat, Company, Opportunity, FollowUp } from "@/lib/types";

interface JobsMetricsRowProps {
  stats: ResultsStat[];
  companies: Company[];
  opportunities: Opportunity[];
  followUps: FollowUp[];
}

export default function JobsMetricsRow({ stats, companies, opportunities, followUps }: JobsMetricsRowProps) {
  const getStat = (metric: string) => {
    const s = stats.find((st) => st.metric.toLowerCase() === metric.toLowerCase());
    return s?.count || "0";
  };

  const activeOps = opportunities.filter(
    (op) => !["rejected", "ghosted", "withdrawn", "expired"].includes(op.status)
  );
  const screens = opportunities.filter(
    (op) => ["phone-screen", "technical", "final"].includes(op.status)
  );
  const overdueFollowUps = followUps.filter((f) => f.daysUntil < 0);

  const metrics = [
    { label: "Applications", value: getStat("Total applications"), color: "#0ea5e9" },
    { label: "Response Rate", value: getStat("Response rate"), color: "#2dd4bf" },
    { label: "Active Pipeline", value: String(activeOps.length), color: "#60a5fa" },
    { label: "Screens / Interviews", value: String(screens.length), color: "#a78bfa" },
    {
      label: "Follow-Ups Due",
      value: String(followUps.length),
      color: overdueFollowUps.length > 0 ? "#f87171" : "#fbbf24",
    },
    { label: "Companies Tracked", value: String(companies.length), color: "#34d399" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-xl p-4"
          style={{
            background: `linear-gradient(135deg, ${m.color}20, ${m.color}0a)`,
            border: `1px solid ${m.color}30`,
          }}
        >
          <div className="text-3xl font-bold font-mono-data" style={{ color: m.color }}>
            {m.value}
          </div>
          <div className="text-[11px] mt-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}
