import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X } from "lucide-react";
import { saveAnalysis } from "@/lib/analysisHistory";
import AnalysisModePicker from "@/components/AnalysisModePicker";
import QuickAnalysisForm from "@/components/QuickAnalysisForm";
import AdvancedDataForm from "@/components/AdvancedDataForm";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_TIMEOUT = 30000; // 30 seconds

const loadingSteps = [
  { label: "PARSING DATA...", duration: 2000 },
  { label: "ANALYZING TECHNICAL PATTERNS...", duration: 4000 },
  { label: "FETCHING NEWS...", duration: 3000 },
  { label: "ANALYZING SEC FILINGS...", duration: 5000 },
  { label: "GENERATING SYNTHESIS...", duration: 4000 },
];

const friendlyErrors: Record<string, string> = {
  "Ticker not found": "Unable to find that ticker. Please check the symbol and try again.",
  "No data available": "This stock doesn't have enough historical data for analysis.",
  "Rate limit": "Too many requests. Please wait a moment and try again.",
  "Invalid CSV": "Unable to read CSV file. Please check the format.",
  "KeyError": "Invalid data format in the uploaded file.",
  "ParserError": "Unable to parse CSV. Please check the file format.",
};

const mapError = (msg: string): string => {
  for (const [key, friendly] of Object.entries(friendlyErrors)) {
    if (msg.includes(key)) return friendly;
  }
  return msg;
};

const AnalysisContainer = () => {
  const [mode, setMode] = useState<"quick" | "advanced">("quick");
  const [ticker, setTicker] = useState("");
  const [timeframe, setTimeframe] = useState("1m");
  const [tier, setTier] = useState("standard");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Debounce mode switching — disable toggle during loading
  const handleModeChange = useCallback((newMode: "quick" | "advanced") => {
    if (loading) return; // prevent switching during active request
    setMode(newMode);
  }, [loading]);

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

  const handleCancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setLoading(false);
    setCurrentStep(0);
    toast({ title: "Cancelled", description: "Analysis request cancelled." });
  }, [toast]);

  const handleSubmit = async () => {
    if (mode === "quick" && !ticker.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a ticker symbol" });
      return;
    }
    if (mode === "advanced" && !file) {
      toast({ variant: "destructive", title: "No File", description: "Please upload a CSV file" });
      return;
    }
    setLoading(true);
    setCurrentStep(0);

    const controller = new AbortController();
    abortRef.current = controller;

    // Timeout
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

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
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorMsg = "Analysis failed. Please try again.";
        try {
          const errData = await response.json();
          errorMsg = errData.error || errData.detail || errorMsg;
        } catch {}
        if (response.status === 400) errorMsg = mapError(errorMsg);
        if (response.status === 422) errorMsg = "Missing required fields.";
        throw new Error(errorMsg);
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
      if (err.name === "AbortError") {
        toast({ title: "Timed Out", description: "Analysis took too long. Please try again.", variant: "destructive" });
      } else {
        const message = mapError(err.message || "Could not reach the backend.");
        toast({ title: "Analysis failed", description: message, variant: "destructive" });
      }
    } finally {
      clearTimeout(timeoutId);
      abortRef.current = null;
      setLoading(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pill toggle */}
      <div className="flex justify-center">
        <AnalysisModePicker mode={mode} onChange={handleModeChange} />
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="w-full mt-2 text-xs text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3 mr-1" />
              Cancel Analysis
            </Button>
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
              disabled={loading}
            />
          ) : (
            <AdvancedDataForm
              file={file}
              onFileChange={setFile}
              tier={tier}
              onTierChange={setTier}
              disabled={loading}
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
