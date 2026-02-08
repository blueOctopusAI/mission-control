"use client";

import { useState } from "react";
import type { ContentPiece } from "@/lib/types";

interface ContentCalendarProps {
  pieces: ContentPiece[];
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function ContentCalendar({ pieces }: ContentCalendarProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Map due dates to pieces
  const duePieces = new Map<string, ContentPiece[]>();
  for (const piece of pieces) {
    if (piece.due) {
      const existing = duePieces.get(piece.due) || [];
      existing.push(piece);
      duePieces.set(piece.due, existing);
    }
  }

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="px-2 py-1 rounded text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          &lt;
        </button>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="px-2 py-1 rounded text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center text-[10px] py-1 font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            {d}
          </div>
        ))}

        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="h-16" />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayPieces = duePieces.get(dateStr) || [];
          const isToday =
            day === now.getDate() &&
            month === now.getMonth() &&
            year === now.getFullYear();

          return (
            <div
              key={day}
              className="h-16 rounded-lg p-1"
              style={{
                background: isToday
                  ? "rgba(37, 99, 235, 0.1)"
                  : "transparent",
                border: isToday
                  ? "1px solid var(--accent-blue)"
                  : "1px solid transparent",
              }}
            >
              <div
                className="text-[10px] font-mono-data"
                style={{
                  color: isToday
                    ? "var(--accent-blue-light)"
                    : "var(--text-muted)",
                }}
              >
                {day}
              </div>
              {dayPieces.map((p) => (
                <div
                  key={p.id}
                  className="text-[8px] truncate px-1 py-0.5 rounded mt-0.5"
                  style={{
                    background: "rgba(37, 99, 235, 0.2)",
                    color: "var(--accent-blue-light)",
                  }}
                  title={p.title}
                >
                  {p.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
