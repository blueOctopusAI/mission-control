import type { QueueTask } from "@/lib/types";

interface Props {
  pending: QueueTask[];
  completed: QueueTask[];
  nasAvailable: boolean;
}

const PRIORITY_COLORS: Record<string, { bg: string; color: string }> = {
  urgent: { bg: "rgba(220, 38, 38, 0.12)", color: "#dc2626" },
  normal: { bg: "rgba(37, 99, 235, 0.12)", color: "#2563eb" },
  background: { bg: "rgba(100, 116, 139, 0.12)", color: "#64748b" },
};

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  transcribe: { bg: "rgba(124, 58, 237, 0.12)", color: "#7c3aed" },
  "generate-image": { bg: "rgba(219, 39, 119, 0.12)", color: "#db2777" },
  "run-script": { bg: "rgba(13, 148, 136, 0.12)", color: "#0d9488" },
  "ollama-analyze": { bg: "rgba(217, 119, 6, 0.12)", color: "#d97706" },
  "research-batch": { bg: "rgba(37, 99, 235, 0.12)", color: "#2563eb" },
  message: { bg: "rgba(100, 116, 139, 0.12)", color: "#64748b" },
};

function TaskCard({ task, showCompleted }: { task: QueueTask; showCompleted?: boolean }) {
  const priority = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.normal;
  const type = TYPE_COLORS[task.type] || { bg: "rgba(100, 116, 139, 0.12)", color: "#64748b" };

  return (
    <div
      className="rounded-lg p-3 mb-2"
      style={{ background: "rgba(100, 116, 139, 0.04)", border: "1px solid var(--border-subtle)" }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: type.bg, color: type.color }}
        >
          {task.type}
        </span>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: priority.bg, color: priority.color }}
        >
          {task.priority}
        </span>
        <span className="text-[10px] font-mono-data ml-auto" style={{ color: "var(--text-muted)" }}>
          {task.id}
        </span>
      </div>
      <div className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {task.prompt}
      </div>
      <div className="mt-1.5 text-[10px] font-mono-data" style={{ color: "var(--text-muted)" }}>
        {showCompleted && task.completed ? `Completed: ${task.completed}` : task.created ? `Created: ${task.created}` : ""}
      </div>
    </div>
  );
}

export default function TaskQueuePanel({ pending, completed, nasAvailable }: Props) {
  if (!nasAvailable) {
    return (
      <div
        className="rounded-xl p-5 text-center"
        style={{ background: "rgba(217, 119, 6, 0.06)", border: "1px solid rgba(217, 119, 6, 0.2)" }}
      >
        <div className="text-sm font-medium" style={{ color: "#d97706" }}>
          NAS Offline
        </div>
        <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Task queue data unavailable. Mount the NAS and refresh.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Pending
          </h3>
          {pending.length > 0 && (
            <span
              className="text-[10px] font-mono-data px-2 py-0.5 rounded-full"
              style={{ background: "rgba(37, 99, 235, 0.12)", color: "#2563eb" }}
            >
              {pending.length}
            </span>
          )}
        </div>
        {pending.length === 0 ? (
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>No pending tasks.</div>
        ) : (
          pending.map((t) => <TaskCard key={t.id} task={t} />)
        )}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Completed
          </h3>
          {completed.length > 0 && (
            <span
              className="text-[10px] font-mono-data px-2 py-0.5 rounded-full"
              style={{ background: "rgba(22, 163, 74, 0.12)", color: "#16a34a" }}
            >
              {completed.length}
            </span>
          )}
        </div>
        {completed.length === 0 ? (
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>No completed tasks yet.</div>
        ) : (
          completed.map((t) => <TaskCard key={t.id} task={t} showCompleted />)
        )}
      </div>
    </div>
  );
}
