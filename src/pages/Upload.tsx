import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Activity, Upload as UploadIcon, FileText, X, CheckCircle, Loader2 } from "lucide-react";

const specs = [
  "ACCEPTS: TradingView CSV exports",
  "REQUIRED: time, open, high, low, close",
  "OPTIONAL: volume, indicators",
  "MAX SIZE: 10 MB",
];

const modules = [
  {
    title: "GAP DETECTION",
    description: "Identifies price gaps between candles, classifies by type (breakaway, runaway, exhaustion), and tracks fill status.",
  },
  {
    title: "SUPPORT / RESISTANCE",
    description: "Calculates key price levels based on historical pivots, measures strength by touch count and recency.",
  },
  {
    title: "SUPPLY / DEMAND ZONES",
    description: "Maps institutional order blocks using rally-base-rally and drop-base-drop patterns with freshness tracking.",
  },
];

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 12, 95));
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0 && files[0].name.endsWith(".csv")) {
      setFile(files[0]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://trading-analyzer-production-7513.up.railway.app/analyze",
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setProgress(100);
      setTimeout(() => navigate("/results", { state: { result: data } }), 300);
    } catch {
      toast({
        title: "Analysis failed",
        description: "Could not connect to the analysis server. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-terminal-bg font-mono flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 h-10 border-b border-terminal-accent/20 bg-terminal-bg flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-terminal-accent" />
          <span className="text-xs font-bold tracking-widest text-terminal-text uppercase">
            TRADING ANALYZER
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-success animate-pulse-glow" />
            <span className="text-[10px] text-terminal-muted uppercase tracking-widest">
              ONLINE
            </span>
          </div>
          <span className="text-[10px] font-bold text-terminal-accent border border-terminal-accent/30 px-2 py-0.5 uppercase tracking-widest">
            ALPHA v0.1
          </span>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Upload */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-terminal-text tracking-widest uppercase">
                UPLOAD CHART DATA
              </h1>
              <p className="text-xs text-terminal-muted mt-1 tracking-wide">
                Import TradingView CSV for analysis
              </p>
            </div>

            {/* Drop zone */}
            {loading ? (
              <div className="border-2 border-dashed border-terminal-accent/30 p-16 flex flex-col items-center justify-center gap-6">
                <Loader2 className="h-16 w-16 text-terminal-accent animate-spin" />
                <div className="w-full">
                  <div className="h-px w-full bg-terminal-border overflow-hidden">
                    <div
                      className="h-full bg-terminal-accent transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <p className="text-[10px] text-terminal-muted tracking-widest uppercase">
                  PARSING CSV → DETECTING GAPS → MAPPING LEVELS → ANALYZING ZONES
                </p>
              </div>
            ) : file ? (
              <div className="border-2 border-dashed border-terminal-accent/30 p-16 flex flex-col items-center justify-center gap-4">
                <FileText className="h-16 w-16 text-terminal-accent" />
                <p className="text-lg text-terminal-text">{file.name}</p>
                <p className="text-sm text-terminal-muted">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <button
                  onClick={() => setFile(null)}
                  className="text-xs uppercase tracking-widest text-destructive border border-destructive px-4 py-2 hover:bg-destructive/10 transition-colors flex items-center gap-2"
                >
                  <X className="h-3 w-3" />
                  REMOVE
                </button>
              </div>
            ) : (
              <label
                className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-16 transition-all ${
                  isDragging
                    ? "border-terminal-accent/50 bg-terminal-accent/5"
                    : "border-terminal-border hover:border-terminal-accent/50 hover:bg-terminal-accent/5"
                }`}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <UploadIcon className="mb-4 h-16 w-16 text-terminal-muted" />
                <p className="mb-1 text-lg text-terminal-text tracking-widest">
                  DROP CSV FILE HERE
                </p>
                <p className="text-sm text-terminal-muted">or click to browse</p>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleInputChange}
                />
              </label>
            )}

            {/* Specs */}
            <div className="border border-terminal-border bg-[hsl(222,47%,8%)] p-4 space-y-2">
              {specs.map((spec) => (
                <p key={spec} className="text-[10px] text-terminal-muted tracking-wide">
                  • {spec}
                </p>
              ))}
            </div>

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={`w-full h-12 text-sm font-bold uppercase tracking-widest transition-all ${
                !file || loading
                  ? "bg-terminal-border text-terminal-muted cursor-not-allowed"
                  : "bg-terminal-accent text-terminal-bg hover:shadow-[0_0_24px_rgba(14,165,233,0.35)]"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-terminal-bg border-t-transparent animate-spin" />
                  ANALYZING...
                </span>
              ) : (
                "RUN ANALYSIS"
              )}
            </button>
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-terminal-text tracking-widest uppercase">
              ANALYSIS MODULES
            </h2>

            {modules.map((mod) => (
              <div
                key={mod.title}
                className="border border-terminal-border p-5 space-y-2 hover:border-terminal-accent/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-terminal-accent shrink-0" />
                  <h3 className="text-xs font-bold text-terminal-text tracking-widest uppercase">
                    {mod.title}
                  </h3>
                </div>
                <p className="text-xs text-terminal-muted leading-relaxed pl-6">
                  {mod.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
