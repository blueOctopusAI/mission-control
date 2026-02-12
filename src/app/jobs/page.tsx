import Header from "@/components/layout/Header";
import { parseJobCompanies } from "@/lib/parsers/job-companies";
import { parseJobOpportunities } from "@/lib/parsers/job-opportunities";
import { parseJobTracker } from "@/lib/parsers/job-tracker";
import { parseJobResults } from "@/lib/parsers/job-results";
import { parseJobDiscovery } from "@/lib/parsers/job-discovery";
import JobsMetricsRow from "@/components/jobs/JobsMetricsRow";
import FollowUpQueue from "@/components/jobs/FollowUpQueue";
import OpportunityCards from "@/components/jobs/OpportunityCards";
import PipelineSummary from "@/components/jobs/PipelineSummary";
import CompanyGrid from "@/components/jobs/CompanyGrid";
import ResultsPanel from "@/components/jobs/ResultsPanel";
import DiscoveryTimeline from "@/components/jobs/DiscoveryTimeline";

export default function JobsPage() {
  const companies = parseJobCompanies();
  const opportunities = parseJobOpportunities();
  const tracker = parseJobTracker();
  const results = parseJobResults();
  const discovery = parseJobDiscovery();

  const activeOps = opportunities.filter(
    (op) => !["rejected", "ghosted", "withdrawn", "expired"].includes(op.status)
  );

  return (
    <div>
      <Header
        title="Job Search"
        subtitle={`${activeOps.length} opportunities, ${companies.length} companies tracked`}
      />
      <div className="p-8 space-y-8">
        {/* Metrics Row */}
        <JobsMetricsRow
          stats={results.stats}
          companies={companies}
          opportunities={opportunities}
          followUps={tracker.followUps}
        />

        {/* Follow-Up Queue (hero) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="section-title">Follow-Up Queue</h3>
            <div className="separator flex-1" />
          </div>
          <FollowUpQueue followUps={tracker.followUps} />
        </div>

        {/* Opportunities + Pipeline side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="section-title">Active Opportunities</h3>
              <div className="separator flex-1" />
            </div>
            <OpportunityCards opportunities={activeOps} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="section-title">Pipeline</h3>
              <div className="separator flex-1" />
            </div>
            <PipelineSummary opportunities={opportunities} />
          </div>
        </div>

        {/* Companies by Tier */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="section-title">Companies by Tier</h3>
            <div className="separator flex-1" />
          </div>
          <CompanyGrid companies={companies} />
        </div>

        {/* Results & Analytics */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="section-title">Results & Analytics</h3>
            <div className="separator flex-1" />
          </div>
          <ResultsPanel results={results} />
        </div>

        {/* Discovery Log */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="section-title">Discovery Log</h3>
            <div className="separator flex-1" />
          </div>
          <DiscoveryTimeline entries={discovery} />
        </div>
      </div>
    </div>
  );
}
