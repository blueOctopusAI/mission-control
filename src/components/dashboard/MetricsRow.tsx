import type { DashboardMetrics } from "@/lib/types";

interface MetricsRowProps {
  metrics: DashboardMetrics;
}

const METRIC_ITEMS: {
  key: keyof DashboardMetrics;
  label: string;
  color: string;
  gradient: string;
  icon: string;
}[] = [
  {
    key: "linksProcessed",
    label: "Links Processed",
    color: "#2563eb",
    gradient: "linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(59, 130, 246, 0.03))",
    icon: "link",
  },
  {
    key: "contentInPipeline",
    label: "Content Pipeline",
    color: "#0d9488",
    gradient: "linear-gradient(135deg, rgba(13, 148, 136, 0.08), rgba(20, 184, 166, 0.03))",
    icon: "edit",
  },
  {
    key: "activeProjects",
    label: "Active Projects",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(139, 92, 246, 0.03))",
    icon: "layers",
  },
  {
    key: "toolsEvaluated",
    label: "Tools Evaluated",
    color: "#d97706",
    gradient: "linear-gradient(135deg, rgba(217, 119, 6, 0.08), rgba(245, 158, 11, 0.03))",
    icon: "tool",
  },
  {
    key: "peopleTracked",
    label: "People Tracked",
    color: "#db2777",
    gradient: "linear-gradient(135deg, rgba(219, 39, 119, 0.08), rgba(236, 72, 153, 0.03))",
    icon: "users",
  },
  {
    key: "strategiesDocumented",
    label: "Strategy Docs",
    color: "#16a34a",
    gradient: "linear-gradient(135deg, rgba(22, 163, 74, 0.08), rgba(34, 197, 94, 0.03))",
    icon: "doc",
  },
];

function MetricIcon({ icon, color }: { icon: string; color: string }) {
  const props = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (icon) {
    case "link":
      return <svg {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
    case "edit":
      return <svg {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;
    case "layers":
      return <svg {...props}><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>;
    case "tool":
      return <svg {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>;
    case "users":
      return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "doc":
      return <svg {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /></svg>;
    default:
      return null;
  }
}

export default function MetricsRow({ metrics }: MetricsRowProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {METRIC_ITEMS.map((item) => (
        <div
          key={item.key}
          className="rounded-xl p-4 hover-lift"
          style={{
            background: item.gradient,
            border: `1px solid ${item.color}28`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `${item.color}20` }}
            >
              <MetricIcon icon={item.icon} color={item.color} />
            </div>
          </div>
          <div
            className="text-3xl font-bold font-mono-data"
            style={{ color: item.color }}
          >
            {metrics[item.key]}
          </div>
          <div className="text-xs mt-0.5 font-semibold" style={{ color: "var(--text-secondary)" }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
