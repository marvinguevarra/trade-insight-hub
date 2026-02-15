import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, X, Loader2, AlertCircle, Check, DollarSign, Crown } from "lucide-react";
import { saveAnalysis } from "@/lib/analysisHistory";
import { TierBadge } from "@/components/StatusIndicator";
import { useTiers, getTierById } from "@/lib/tierConfig";
import Navbar from "@/components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const tierIcons: Record<string, React.ReactNode> = {
  lite: <Check className="h-3.5 w-3.5 text-green-500" />,
  standard: <DollarSign className="h-3.5 w-3.5 text-sky-400" />,
  premium: <Crown className="h-3.5 w-3.5 text-yellow-400" />,
};

const tierBorderColors: Record<string, string> = {
  lite: "border-l-green-500",
  standard: "border-l-sky-500",
  premium: "border-l-purple-500",
};

const loadingSteps = [
  { label: "PARSING CSV...", duration: 2000 },
  { label: "ANALYZING TECHNICAL PATTERNS...", duration: 4000 },
  { label: "FETCHING NEWS...", duration: 3000 },
  { label: "ANALYZING SEC FILINGS...", duration: 5000 },
  { label: "GENERATING SYNTHESIS...", duration: 4000 },
];

const Analyze = () => {
  const [file, setFile] = useState<File | null>(null);
  const [symbol, setSymbol] = useState("");
  const [tier, setTier] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tiers } = useTiers();

  useEffect(() => {
    if (!loading) return;
    if (currentStep >= loadingSteps.length - 1) return;
    const timeout = setTimeout(() => {
      setCurrentStep((s) => Math.min(s + 1, loadingSteps.length - 1));
    }, loadingSteps[currentStep].duration);
    return () => clearTimeout(timeout);
  }, [loading, currentStep]);

  const progressPercent = loading
    ? Math.round(((currentStep + 1) / loadingSteps.length) * 100)
    : 0;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files;
    if (f?.[0]?.name.endsWith(".csv")) setFile(f[0]);
  };

  const handleAnalyze = async () => {
    if (!file && !symbol) return;
    setLoading(true);
    setError(null);
    setCurrentStep(0);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("symbol", symbol || "UNKNOWN");
      formData.append("tier", tier);
      formData.append("min_gap_pct", "2.0");

      const response = await fetch(`${API_URL}/analyze/full`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 400) throw new Error("Invalid CSV format. Please check your file.");
        if (response.status === 422) throw new Error("CSV missing required columns (time, open, high, low, close).");
        throw new Error("Analysis failed. Please try again.");
      }

      const data = await response.json();
      saveAnalysis({
        symbol: data.metadata?.symbol || symbol || "UNKNOWN",
        tier,
        cost: data.cost_summary?.total_cost || 0,
        status: "complete",
        verdict: data.synthesis?.verdict,
      });
      navigate("/results/live", { state: { result: data } });
    } catch (err: any) {
      const message = err.message || "Could not reach the backend.";
      setError(message);
      saveAnalysis({ symbol: symbol || "UNKNOWN", tier, cost: 0, status: "failed" });
      toast({ title: "Analysis failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          RUN ANALYSIS
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Upload a TradingView CSV or enter a stock symbol
        </p>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-8 space-y-6">
          {/* Loading state */}
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
                      {i < currentStep ? <Check className="h-3 w-3" /> : i === currentStep ? <Loader2 className="h-3 w-3 animate-spin" /> : <span className="h-3 w-3 inline-flex items-center justify-center text-[8px]">-</span>}
                      {step.label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dropzone */}
          {!loading && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xs uppercase tracking-widest">
                  Chart Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                {file ? (
                  <div className="flex items-center justify-between border border-border p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-primary" />
                      <div>
                        <p className="text-sm text-foreground">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-12 transition-colors ${
                      isDragging ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"
                    }`}
                    onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <Upload className="mb-3 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-foreground">Upload TradingView CSV</p>
                    <p className="text-[10px] text-muted-foreground">or click to browse</p>
                    <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
                  </label>
                )}
              </CardContent>
            </Card>
          )}

          {/* Symbol + Tier */}
          {!loading && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
                  Stock Symbol
                </label>
                <Input
                  placeholder="e.g. AAPL, WHR"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="bg-card text-foreground"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
                  Analysis Tier
                </label>
                <Select value={tier} onValueChange={setTier}>
                  <SelectTrigger className="bg-card text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {tiers.map((t) => {
                      const isSelected = tier === t.id;
                      return (
                        <SelectItem
                          key={t.id}
                          value={t.id}
                          className={`border-l-[3px] ${
                            isSelected
                              ? `${tierBorderColors[t.id] || ""} text-foreground`
                              : "border-l-transparent text-muted-foreground"
                          }`}
                        >
                          <span className="inline-flex items-center gap-2">
                            {tierIcons[t.id]}
                            {t.label}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Cost estimate */}
          {!loading && (file || symbol) && (() => {
            const currentTier = getTierById(tiers, tier);
            return (
              <div className="flex items-center justify-between border border-border p-3 text-xs text-muted-foreground">
                <span>Estimated cost</span>
                <span className="text-foreground font-bold inline-flex items-center gap-2">
                  <TierBadge tier={tier} />
                  {currentTier?.price_display || currentTier?.label || tier}
                </span>
              </div>
            );
          })()}

          {/* Analyze button */}
          <Button
            onClick={handleAnalyze}
            disabled={(!file && !symbol) || loading}
            className="w-full h-12 text-sm font-bold uppercase tracking-widest"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Run Analysis"
            )}
          </Button>

        </div>
      </div>
    </div>
  );
};

export default Analyze;
