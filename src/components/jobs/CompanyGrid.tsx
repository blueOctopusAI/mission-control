"use client";

import { useState } from "react";
import type { Company, CompanyTier } from "@/lib/types";

interface CompanyGridProps {
  companies: Company[];
}

const TIER_COLORS: Record<CompanyTier, { bg: string; text: string; border: string }> = {
  HOT: { bg: "rgba(248, 113, 113, 0.12)", text: "#f87171", border: "rgba(248, 113, 113, 0.3)" },
  WARM: { bg: "rgba(251, 191, 36, 0.12)", text: "#fbbf24", border: "rgba(251, 191, 36, 0.3)" },
  WATCH: { bg: "rgba(96, 165, 250, 0.10)", text: "#60a5fa", border: "rgba(96, 165, 250, 0.25)" },
  COLD: { bg: "rgba(71, 85, 105, 0.12)", text: "#64748b", border: "rgba(71, 85, 105, 0.3)" },
};

const STATUS_DOT: Record<string, string> = {
  "phone-screen": "#2dd4bf",
  applied: "#38bdf8",
  tailoring: "#fbbf24",
  identified: "#60a5fa",
  watching: "#94a3b8",
  rejected: "#f87171",
};

function CompanyCard({ company }: { company: Company }) {
  const [expanded, setExpanded] = useState(false);
  const tier = TIER_COLORS[company.tier];
  const statusColor = STATUS_DOT[company.status] || "#94a3b8";

  return (
    <div
      className="rounded-xl p-4 cursor-pointer transition-all"
      onClick={() => setExpanded(!expanded)}
      style={{
        background: "rgba(30, 41, 59, 0.6)",
        border: `1px solid rgba(51, 65, 85, 0.7)`,
        borderTop: `3px solid ${tier.text}`,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-mono-data font-semibold" style={{ color: tier.text }}>
            {company.id}
          </span>
          <h4 className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>
            {company.name}
          </h4>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: statusColor, boxShadow: `0 0 8px ${statusColor}60` }}
          />
          <span className="text-xs font-semibold" style={{ color: statusColor }}>
            {company.status}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
        <span>{company.industry}</span>
        <span style={{ color: "var(--text-muted)" }}>|</span>
        <span>{company.location}</span>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 space-y-2 text-sm" style={{ borderTop: "1px solid rgba(51, 65, 85, 0.7)" }}>
          <p style={{ color: "var(--text-primary)" }}>{company.whyFit}</p>
          {company.contact && company.contact !== "—" && (
            <div className="flex gap-2">
              <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>Contact:</span>
              <span style={{ color: "var(--text-primary)" }}>{company.contact}</span>
            </div>
          )}
          {company.resumeVariant && (
            <div className="flex gap-2">
              <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>Variant:</span>
              <span style={{ color: "var(--text-primary)" }}>{company.resumeVariant}</span>
            </div>
          )}
          {company.notes && (
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {company.notes}
            </p>
          )}
          <div className="font-mono-data text-xs" style={{ color: "var(--text-muted)" }}>
            Last touched: {company.lastTouched}
          </div>
        </div>
      )}
    </div>
  );
}

function CompactRow({ company }: { company: Company }) {
  const statusColor = STATUS_DOT[company.status] || "#94a3b8";
  return (
    <tr className="border-b" style={{ borderColor: "rgba(51, 65, 85, 0.5)" }}>
      <td className="py-2 px-3 text-xs font-mono-data font-semibold" style={{ color: "var(--text-muted)" }}>
        {company.id}
      </td>
      <td className="py-2 px-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        {company.name}
      </td>
      <td className="py-2 px-3 text-xs" style={{ color: "var(--text-secondary)" }}>
        {company.industry}
      </td>
      <td className="py-2 px-3 text-xs" style={{ color: "var(--text-secondary)" }}>
        {company.location}
      </td>
      <td className="py-2 px-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
          <span className="text-xs font-semibold" style={{ color: statusColor }}>{company.status}</span>
        </span>
      </td>
    </tr>
  );
}

export default function CompanyGrid({ companies }: CompanyGridProps) {
  const tiers: CompanyTier[] = ["HOT", "WARM", "WATCH", "COLD"];
  const byTier = new Map<CompanyTier, Company[]>();
  for (const tier of tiers) {
    byTier.set(tier, companies.filter((c) => c.tier === tier));
  }

  return (
    <div className="space-y-8">
      {tiers.map((tier) => {
        const tierCompanies = byTier.get(tier) || [];
        if (tierCompanies.length === 0) return null;
        const tierStyle = TIER_COLORS[tier];
        const useCards = tier === "HOT" || tier === "WARM";

        return (
          <div key={tier}>
            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider"
                style={{ background: tierStyle.bg, color: tierStyle.text, border: `1px solid ${tierStyle.border}` }}
              >
                {tier}
              </span>
              <span className="text-xs font-mono-data font-semibold" style={{ color: "var(--text-secondary)" }}>
                {tierCompanies.length} {tierCompanies.length === 1 ? "company" : "companies"}
              </span>
              <div className="separator flex-1" />
            </div>

            {useCards ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tierCompanies.map((c) => (
                  <CompanyCard key={c.id} company={c} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(51, 65, 85, 0.7)" }}>
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ background: "rgba(30, 41, 59, 0.8)" }}>
                      <th className="py-2 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>ID</th>
                      <th className="py-2 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Company</th>
                      <th className="py-2 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Industry</th>
                      <th className="py-2 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Location</th>
                      <th className="py-2 px-3 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tierCompanies.map((c) => (
                      <CompactRow key={c.id} company={c} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
