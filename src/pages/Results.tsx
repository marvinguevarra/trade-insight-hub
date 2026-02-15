import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import TickerBanner from "@/components/TickerBanner";
import GapsCard from "@/components/GapsCard";
import LevelsCard from "@/components/LevelsCard";
import ZonesCard from "@/components/ZonesCard";
import type { AnalysisResult } from "@/types/analysis";
import { mockResult } from "@/types/analysis";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result: AnalysisResult = location.state?.result || mockResult;

  useEffect(() => {
    if (!location.state?.result) {
      // If no data passed, still show mock for dev
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <TickerBanner data={result} />

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <GapsCard gaps={result.gaps} />
          <LevelsCard levels={result.levels} />
          <ZonesCard zones={result.zones} />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="font-mono text-sm uppercase tracking-widest border border-terminal-border text-terminal-muted px-8 py-3 hover:border-terminal-accent hover:text-terminal-text transition-colors"
          >
            Analyze Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
