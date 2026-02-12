"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/jobs", label: "Jobs", icon: "briefcase" },
  { href: "/projects", label: "Projects", icon: "grid" },
  { href: "/content", label: "Content", icon: "kanban" },
  { href: "/research", label: "Research", icon: "search" },
  { href: "/tools", label: "Tools", icon: "wrench" },
  { href: "/pipeline", label: "Pipeline", icon: "video" },
];

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  const color = active ? "#60a5fa" : "#475569";
  switch (icon) {
    case "dashboard":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      );
    case "grid":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      );
    case "kanban":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="5" height="18" rx="1" />
          <rect x="10" y="3" width="5" height="12" rx="1" />
          <rect x="17" y="3" width="5" height="15" rx="1" />
        </svg>
      );
    case "search":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "wrench":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case "briefcase":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case "video":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-[240px] min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(180deg, var(--bg-sidebar) 0%, #060a14 100%)",
        borderRight: "1px solid var(--border-subtle)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #2563eb, #14b8a6)",
              boxShadow: "0 0 20px rgba(37, 99, 235, 0.3)",
            }}
          >
            <span className="text-white font-bold text-sm">BO</span>
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Mission Control
            </div>
            <div className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
              Blue Octopus Tech
            </div>
          </div>
        </div>
      </div>

      <div className="separator mx-5" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all"
              style={{
                background: active ? "rgba(37, 99, 235, 0.1)" : "transparent",
                color: active ? "var(--accent-blue-light)" : "var(--text-secondary)",
                boxShadow: active ? "inset 0 0 0 1px rgba(37, 99, 235, 0.15)" : "none",
              }}
            >
              <NavIcon icon={item.icon} active={active} />
              {item.label}
              {active && (
                <div
                  className="w-1.5 h-1.5 rounded-full ml-auto"
                  style={{ background: "var(--accent-blue-light)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full pulse-ring"
            style={{ background: "var(--status-healthy)" }}
          />
          <span className="text-[10px] font-mono-data" style={{ color: "var(--text-muted)" }}>
            localhost:3000
          </span>
        </div>
      </div>
    </aside>
  );
}
