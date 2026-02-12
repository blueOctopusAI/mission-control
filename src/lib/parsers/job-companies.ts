import { readFileSync } from "fs";
import { FILES } from "@/lib/config";
import type { Company, CompanyTier } from "@/lib/types";

export function parseJobCompanies(): Company[] {
  let content: string;
  try {
    content = readFileSync(FILES.jobCompanies, "utf-8");
  } catch {
    return [];
  }

  const companies: Company[] = [];
  let currentTier: CompanyTier = "WATCH";
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect tier headers
    if (/^## HOT\s*$/.test(line)) { currentTier = "HOT"; continue; }
    if (/^## WARM\s*$/.test(line)) { currentTier = "WARM"; continue; }
    if (/^## WATCH\s*$/.test(line)) { currentTier = "WATCH"; continue; }
    if (/^## COLD\s*$/.test(line)) { currentTier = "COLD"; continue; }

    // Detect company entry: ### TC-NNN | Company Name
    const companyMatch = line.match(/^### (TC-\d+) \| (.+)$/);
    if (!companyMatch) continue;

    const company: Company = {
      id: companyMatch[1],
      name: companyMatch[2],
      industry: "",
      location: "",
      size: "",
      whyFit: "",
      contact: "",
      careerPage: "",
      source: "",
      status: "",
      resumeVariant: "",
      lastTouched: "",
      notes: "",
      tier: currentTier,
    };

    // Parse bullet fields until next company or section
    for (let j = i + 1; j < lines.length; j++) {
      const fieldLine = lines[j];
      if (fieldLine.startsWith("### ") || fieldLine.startsWith("## ") || fieldLine === "---") break;

      const fieldMatch = fieldLine.match(/^- \*\*(.+?):\*\*\s*(.*)$/);
      if (!fieldMatch) continue;

      const [, key, value] = fieldMatch;
      switch (key) {
        case "Industry": company.industry = value; break;
        case "Location": company.location = value; break;
        case "Size": company.size = value; break;
        case "Why fit": company.whyFit = value; break;
        case "Contact": company.contact = value; break;
        case "Career page": company.careerPage = value; break;
        case "Source": company.source = value; break;
        case "Status": company.status = value; break;
        case "Resume variant": company.resumeVariant = value; break;
        case "Last touched": company.lastTouched = value; break;
        case "Notes": company.notes = value; break;
      }
    }

    companies.push(company);
  }

  return companies;
}
