import Header from "@/components/layout/Header";
import { parseContentPipeline } from "@/lib/parsers";
import ContentPageClient from "./ContentPageClient";

export default function ContentPage() {
  const data = parseContentPipeline();

  return (
    <div>
      <Header
        title="Content Pipeline"
        subtitle={`${data.pieces.length} pieces across all platforms`}
      />
      <div className="p-8">
        <ContentPageClient pieces={data.pieces} />
      </div>
    </div>
  );
}
