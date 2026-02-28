"use client";

import { useState } from "react";
import type { Company, CompanyTier } from "@/lib/types";

interface CompanyGridProps {
  companies: Company[];
}

const TIER_COLORS: Record<CompanyTier, { bg: string; text: string; border: string }> = {
  HOT: { bg: "rgba(220, 38, 38, 0.08)", text: "#dc2626", border: "rgba(220, 38, 38, 0.2)" },
  WARM: { bg: "rgba(217, 119, 6, 0.08)", text: "#d97706", border: "rgba(217, 119, 6, 0.2)" },
  WATCH: { bg: "rgba(37, 99, 235, 0.06)", text: "#2563eb", border: "rgba(37, 99, 235, 0.15)" },
  COLD: { bg: "rgba(71, 85, 105, 0.06)", text: "#475569", border: "rgba(71, 85, 105, 0.15)" },
};

const STATUS_DOT: Record<string, string> = {
  "phone-screen": "#0d9488",
  applied: "#0284c7",
  tailoring: "#d97706",
  identified: "#2563eb",
  watching: "#64748b",
  rejected: "#dc2626",
};

function CompanyCard({ company }: { company: Company }) {
  const [expanded, setExpanded] = useState(false);
  const tier = TIER_COLORS[company.tier];
  const statusColor = STATUS_DOT[company.status] || "#64748b";

  return (
    <div
      className="rounded-xl p-4 cursor-pointer transition-all"
      onClick={() => setExpanded(!expanded)}
      style={{
        background: "var(--bg-card)",
        border: `1px solid var(--border-primary)`,
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
        <div className="mt-3 pt-3 space-y-2 text-sm" style={{ borderTop: "1px solid var(--border-primary)" }}>
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
  const statusColor = STATUS_DOT[company.status] || "#64748b";
  return (
    <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
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
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-primary)" }}>
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ background: "var(--bg-secondary)" }}>
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
