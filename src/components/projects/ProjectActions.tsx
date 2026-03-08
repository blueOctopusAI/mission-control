"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TodoListProps {
  projectName: string;
  todos: string[];
  tierColor: string;
}

export function TodoList({ projectName, todos, tierColor }: TodoListProps) {
  const router = useRouter();
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<number | null>(null);

  async function toggleTodo(index: number, todoText: string) {
    setLoading(index);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-todo", project: projectName, todo: todoText }),
      });
      if (res.ok) {
        setChecked((prev) => {
          const next = new Set(prev);
          if (next.has(index)) next.delete(index);
          else next.add(index);
          return next;
        });
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <ul className="space-y-2.5">
      {todos.map((action, i) => {
        const isDone = checked.has(i);
        const isLoading = loading === i;
        return (
          <li key={i} className="flex items-start gap-2.5 text-xs">
            <button
              onClick={() => toggleTodo(i, action)}
              disabled={isLoading}
              className="w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center cursor-pointer transition-all"
              style={{
                borderColor: isDone ? `${tierColor}` : `${tierColor}60`,
                background: isDone ? tierColor : "transparent",
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              {isDone && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2">
                  <path d="M2 5l2.5 2.5L8 3" />
                </svg>
              )}
            </button>
            <span style={{
              color: isDone ? "var(--text-muted)" : "var(--text-secondary)",
              textDecoration: isDone ? "line-through" : "none",
            }}>
              {action}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

interface TouchButtonProps {
  projectName: string;
}

export function TouchButton({ projectName }: TouchButtonProps) {
  const router = useRouter();
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function markTouched() {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "touch", project: projectName }),
      });
      if (res.ok) {
        setTouched(true);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (touched) {
    return (
      <span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: "var(--status-healthy)" }}>
        Marked as touched today
      </span>
    );
  }

  return (
    <button
      onClick={markTouched}
      disabled={loading}
      className="text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-all"
      style={{
        background: "rgba(6, 182, 212, 0.1)",
        color: "var(--accent-blue-light)",
        border: "1px solid rgba(6, 182, 212, 0.2)",
        opacity: loading ? 0.5 : 1,
      }}
    >
      {loading ? "Updating..." : "Mark Touched"}
    </button>
  );
}
