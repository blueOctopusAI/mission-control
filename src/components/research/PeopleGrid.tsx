import type { Person } from "@/lib/types";

interface PeopleGridProps {
  people: Person[];
}

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: "#dc2626",
  "MEDIUM-HIGH": "#d97706",
  MEDIUM: "#2563eb",
  LOW: "#475569",
};

export default function PeopleGrid({ people }: PeopleGridProps) {
  const grouped = new Map<string, Person[]>();
  for (const person of people) {
    const existing = grouped.get(person.priority) || [];
    existing.push(person);
    grouped.set(person.priority, existing);
  }

  const priorities = ["HIGH", "MEDIUM-HIGH", "MEDIUM", "LOW"];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
          People to Watch
        </h3>
        <span className="text-xs font-mono-data font-bold ml-auto" style={{ color: "var(--accent-blue-light)" }}>
          {people.length}
        </span>
      </div>
      <div className="space-y-5">
        {priorities.map((priority) => {
          const group = grouped.get(priority);
          if (!group?.length) return null;
          const color = PRIORITY_COLORS[priority] || "#475569";

          return (
            <div key={priority}>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: color, boxShadow: `0 0 6px ${color}40` }}
                />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
                  {priority}
                </span>
                <div className="separator flex-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {group.map((person) => (
                  <div
                    key={person.handle}
                    className="rounded-lg py-3 px-4 transition-all"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                      borderLeft: `2px solid ${color}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold" style={{ color: "var(--accent-blue-light)" }}>
                        {person.handle}
                      </span>
                      {person.name && (
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {person.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {person.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
