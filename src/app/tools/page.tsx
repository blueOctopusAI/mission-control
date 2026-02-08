import Header from "@/components/layout/Header";
import ToolGrid from "@/components/tools/ToolGrid";
import { parseTools } from "@/lib/parsers";

export default function ToolsPage() {
  const data = parseTools();

  return (
    <div>
      <Header
        title="Tools"
        subtitle={`${data.tools.length} tools evaluated`}
      />
      <div className="p-8">
        <ToolGrid tools={data.tools} />
      </div>
    </div>
  );
}
