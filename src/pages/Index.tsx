import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BarChart3 } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";
import TickerBanner from "@/components/TickerBanner";
import GapsCard from "@/components/GapsCard";
import LevelsCard from "@/components/LevelsCard";
import ZonesCard from "@/components/ZonesCard";
import type { AnalysisResult } from "@/types/analysis";
import { mockResult } from "@/types/analysis";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://PLACEHOLDER_URL/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch {
      // Use mock data for development
      setResult(mockResult);
      toast({
        title: "Using demo data",
        description: "API unavailable — showing sample results.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  // Results view
  if (result) {
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
            <Button onClick={handleReset} variant="outline" size="lg">
              Analyze Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Upload view
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-xl bg-primary/10 p-3">
              <BarChart3 className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Trading Analyzer
          </h1>
          <p className="mt-2 text-muted-foreground">
            AI-Powered Chart Analysis
          </p>
        </div>

        <FileDropzone file={file} onFileSelect={setFile} />

        <Button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Index;
