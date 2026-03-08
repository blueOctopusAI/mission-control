import type { MachineHealth } from "@/lib/types";

interface Props {
  machines: MachineHealth[];
}

const STATUS_COLORS: Record<string, { dot: string; bg: string; border: string }> = {
  online: { dot: "#16a34a", bg: "rgba(22, 163, 74, 0.06)", border: "rgba(22, 163, 74, 0.2)" },
  unknown: { dot: "#d97706", bg: "rgba(217, 119, 6, 0.06)", border: "rgba(217, 119, 6, 0.2)" },
  offline: { dot: "#dc2626", bg: "rgba(220, 38, 38, 0.06)", border: "rgba(220, 38, 38, 0.2)" },
};

export default function MachineStatusRow({ machines }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {machines.map((m) => {
        const colors = STATUS_COLORS[m.status] || STATUS_COLORS.unknown;
        return (
          <div
            key={m.machine}
            className="rounded-xl p-5"
            style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: colors.dot, boxShadow: `0 0 8px ${colors.dot}60` }}
              />
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {m.machine}
              </span>
              <span
                className="text-[10px] font-mono-data px-2 py-0.5 rounded-full"
                style={{ background: `${colors.dot}18`, color: colors.dot }}
              >
                {m.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-[10px] font-medium mb-0.5" style={{ color: "var(--text-muted)" }}>
                  Last Activity
                </div>
                <div className="text-xs font-mono-data" style={{ color: "var(--text-secondary)" }}>
                  {m.lastActivity === "-" ? "No data" : m.lastActivity}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-medium mb-0.5" style={{ color: "var(--text-muted)" }}>
                  Pass / Fail
                </div>
                <div className="text-xs font-mono-data" style={{ color: "var(--text-secondary)" }}>
                  {m.passCount > 0 || m.failCount > 0 ? (
                    <>
                      <span style={{ color: "#16a34a" }}>{m.passCount}</span>
                      {" / "}
                      <span style={{ color: m.failCount > 0 ? "#dc2626" : "var(--text-muted)" }}>{m.failCount}</span>
                    </>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-medium mb-0.5" style={{ color: "var(--text-muted)" }}>
                  Notes
                </div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {m.notes || "-"}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
