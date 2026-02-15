import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, X, Loader2, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";

const tierInfo: Record<string, { label: string; cost: string }> = {
  lite: { label: "Lite", cost: "$0.30–0.50" },
  standard: { label: "Standard", cost: "$2–3" },
  premium: { label: "Premium", cost: "$5–7" },
};

const Analyze = () => {
  const [file, setFile] = useState<File | null>(null);
  const [symbol, setSymbol] = useState("");
  const [tier, setTier] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files;
    if (f?.[0]?.name.endsWith(".csv")) setFile(f[0]);
  };

  const handleAnalyze = async () => {
    if (!file && !symbol) return;
    setLoading(true);
    try {
      // Placeholder — will connect API next
      await new Promise((r) => setTimeout(r, 2000));
      navigate("/results/demo", { state: { symbol: symbol || "DEMO", tier } });
    } catch {
      toast({ title: "Analysis failed", description: "Could not reach the backend.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSample = async () => {
    setSymbol("WHR");
    setFile(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      navigate("/results/demo", { state: { symbol: "WHR", tier } });
    } catch {
      toast({ title: "Error", description: "Could not load sample data.", variant: "destructive" });
    } finally {
      setLoading(false);
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

        <div className="mt-8 space-y-6">
          {/* Dropzone */}
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

          {/* Symbol + Tier */}
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
                <SelectContent>
                  <SelectItem value="lite">Lite — $0.30–0.50</SelectItem>
                  <SelectItem value="standard">Standard — $2–3</SelectItem>
                  <SelectItem value="premium">Premium — $5–7</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cost estimate */}
          {(file || symbol) && (
            <div className="flex items-center justify-between border border-border p-3 text-xs text-muted-foreground">
              <span>Estimated cost</span>
              <span className="text-foreground font-bold">{tierInfo[tier].cost}</span>
            </div>
          )}

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

          {/* Sample data */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={handleSample}
              disabled={loading}
              className="text-xs text-muted-foreground"
            >
              <Sparkles className="mr-2 h-3 w-3" />
              Try with sample data (WHR)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
