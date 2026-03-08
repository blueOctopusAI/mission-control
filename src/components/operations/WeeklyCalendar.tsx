import type { CalendarDay } from "@/lib/types";

interface Props {
  calendar: CalendarDay[];
  continuousNote: string;
}

export default function WeeklyCalendar({ calendar, continuousNote }: Props) {
  return (
    <div>
      <div className="grid grid-cols-7 gap-2">
        {calendar.map((day) => (
          <div
            key={day.day}
            className="rounded-lg p-3 min-h-[120px]"
            style={{
              background: day.isToday
                ? "rgba(37, 99, 235, 0.08)"
                : "rgba(100, 116, 139, 0.04)",
              border: day.isToday
                ? "1.5px solid rgba(37, 99, 235, 0.3)"
                : "1px solid var(--border-subtle)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span
                className="text-xs font-semibold"
                style={{ color: day.isToday ? "#2563eb" : "var(--text-secondary)" }}
              >
                {day.day}
              </span>
              {day.isToday && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#2563eb" }}
                />
              )}
            </div>
            <div className="space-y-1">
              {day.tasks.length === 0 ? (
                <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  No tasks
                </div>
              ) : (
                day.tasks.map((task, i) => {
                  const isMac = task.startsWith("\uD83D\uDDA5");
                  const isWin = task.startsWith("\uD83E\uDE9F");
                  const label = task.replace(/^[\uD83D\uDDA5\uFE0F\uD83E\uDE9F]\s*/, "");
                  return (
                    <div
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 rounded truncate"
                      style={{
                        background: isMac
                          ? "rgba(37, 99, 235, 0.1)"
                          : isWin
                          ? "rgba(124, 58, 237, 0.1)"
                          : "rgba(100, 116, 139, 0.08)",
                        color: isMac
                          ? "#2563eb"
                          : isWin
                          ? "#7c3aed"
                          : "var(--text-secondary)",
                      }}
                      title={task}
                    >
                      {label}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
      {continuousNote && (
        <div className="mt-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
          {continuousNote}
        </div>
      )}
    </div>
  );
}
