import Header from "@/components/layout/Header";
import MachineStatusRow from "@/components/operations/MachineStatusRow";
import WeeklyCalendar from "@/components/operations/WeeklyCalendar";
import RunHistoryTable from "@/components/operations/RunHistoryTable";
import TaskQueuePanel from "@/components/operations/TaskQueuePanel";
import { parseOperations } from "@/lib/parsers";

export default function OperationsPage() {
  const data = parseOperations();

  const totalScheduled = data.macSchedule.length + data.winSchedule.length;
  const subtitle = data.lastGenerated
    ? `${totalScheduled} scheduled tasks across 2 machines`
    : "No data — run: bash scripts/generate-ops-status.sh";

  return (
    <div>
      <Header title="Operations" subtitle={subtitle} />
      <div className="p-8 space-y-8">
        {/* Machine Health */}
        <section>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            Machine Health
          </h2>
          <MachineStatusRow machines={data.machineHealth} />
        </section>

        {/* Weekly Calendar */}
        <section>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            Weekly Schedule
          </h2>
          <WeeklyCalendar calendar={data.calendar} continuousNote={data.continuousNote} />
        </section>

        {/* Run History */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Run History
            </h2>
            <span className="text-[10px] font-mono-data" style={{ color: "var(--text-muted)" }}>
              Last {data.runHistory.length} runs
            </span>
          </div>
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border-subtle)" }}
          >
            <RunHistoryTable entries={data.runHistory} />
          </div>
        </section>

        {/* Task Queue */}
        <section>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            Task Queue
          </h2>
          <TaskQueuePanel
            pending={data.pendingTasks}
            completed={data.completedTasks}
            nasAvailable={data.nasAvailable}
          />
        </section>

        {/* Footer */}
        {data.lastGenerated && (
          <div className="text-[10px] font-mono-data" style={{ color: "var(--text-muted)" }}>
            Data generated: {data.lastGenerated}
          </div>
        )}
      </div>
    </div>
  );
}
