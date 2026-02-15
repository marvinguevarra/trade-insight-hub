import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check } from "lucide-react";
import { saveAnalysis } from "@/lib/analysisHistory";
import AnalysisModePicker from "@/components/AnalysisModePicker";
import QuickAnalysisForm from "@/components/QuickAnalysisForm";
import AdvancedDataForm from "@/components/AdvancedDataForm";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const loadingSteps = [
  { label: "PARSING DATA...", duration: 2000 },
  { label: "ANALYZING TECHNICAL PATTERNS...", duration: 4000 },
  { label: "FETCHING NEWS...", duration: 3000 },
  { label: "ANALYZING SEC FILINGS...", duration: 5000 },
  { label: "GENERATING SYNTHESIS...", duration: 4000 },
];

const AnalysisContainer = () => {
  const [mode, setMode] = useState<"quick" | "advanced">("quick");
  const [ticker, setTicker] = useState("");
  const [timeframe, setTimeframe] = useState("1m");
  const [tier, setTier] = useState("standard");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading || currentStep >= loadingSteps.length - 1) return;
    const timeout = setTimeout(() => {
      setCurrentStep((s) => Math.min(s + 1, loadingSteps.length - 1));
    }, loadingSteps[currentStep].duration);
    return () => clearTimeout(timeout);
  }, [loading, currentStep]);

  const progressPercent = loading
    ? Math.round(((currentStep + 1) / loadingSteps.length) * 100)
    : 0;

  const canSubmit =
    mode === "quick" ? ticker.trim().length > 0 : file !== null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setCurrentStep(0);

    try {
      const formData = new FormData();

      if (mode === "quick") {
        formData.append("mode", "ticker");
        formData.append("ticker", ticker);
        formData.append("timeframe", timeframe);
        formData.append("tier", tier);
      } else {
        formData.append("mode", "csv");
        formData.append("file", file!);
        formData.append("tier", tier);
      }

      const response = await fetch(`${API_URL}/analyze/full`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 400) throw new Error("Invalid input. Please check your data.");
        if (response.status === 422) throw new Error("Missing required fields.");
        throw new Error("Analysis failed. Please try again.");
      }

      const data = await response.json();
      const symbol = mode === "quick" ? ticker : (data.metadata?.symbol || "UNKNOWN");
      saveAnalysis({
        symbol,
        tier,
        cost: data.cost_summary?.total_cost || 0,
        verdict: data.synthesis?.verdict,
        fullResults: data,
      });
      navigate("/results/live", { state: { result: data } });
    } catch (err: any) {
      const message = err.message || "Could not reach the backend.";
      toast({ title: "Analysis failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pill toggle */}
      <div className="flex justify-center">
        <AnalysisModePicker mode={mode} onChange={setMode} />
      </div>

      {/* Loading overlay */}
      {loading && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-8 space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <span className="text-sm font-mono text-foreground">
                {loadingSteps[currentStep].label}
              </span>
            </div>
            <Progress value={progressPercent} className="h-1" />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Step {currentStep + 1} of {loadingSteps.length}</span>
              <span>~15-20s total</span>
            </div>
            <div className="space-y-1">
              {loadingSteps.map((step, i) => (
                <div key={i} className={`text-[10px] font-mono flex items-center gap-2 ${
                  i < currentStep ? "text-primary" :
                  i === currentStep ? "text-foreground" :
                  "text-muted-foreground/40"
                }`}>
                  {i < currentStep ? (
                    <Check className="h-3 w-3" />
                  ) : i === currentStep ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <span className="h-3 w-3 inline-flex items-center justify-center text-[8px]">-</span>
                  )}
                  {step.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Forms */}
      {!loading && (
        <>
          {mode === "quick" ? (
            <QuickAnalysisForm
              ticker={ticker}
              onTickerChange={setTicker}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              tier={tier}
              onTierChange={setTier}
            />
          ) : (
            <AdvancedDataForm
              file={file}
              onFileChange={setFile}
              tier={tier}
              onTierChange={setTier}
            />
          )}

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="w-full h-12 text-sm font-bold uppercase tracking-widest"
            size="lg"
          >
            Run Analysis
          </Button>
        </>
      )}
    </div>
  );
};

export default AnalysisContainer;
