import Navbar from "@/components/Navbar";
import AnalysisContainer from "@/components/AnalysisContainer";

const Analyze = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          RUN ANALYSIS
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Choose quick ticker lookup or upload a TradingView CSV
        </p>
        <div className="mt-8">
          <AnalysisContainer />
        </div>
      </div>
    </div>
  );
};

export default Analyze;
