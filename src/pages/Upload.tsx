import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { BarChart3 } from "lucide-react";
import UploadZone from "@/components/UploadZone";

const requirements = [
  { label: "ACCEPTS", value: "TradingView CSV exports" },
  { label: "REQUIRED", value: "time, open, high, low, close" },
  { label: "OPTIONAL", value: "volume, indicators" },
  { label: "MAX SIZE", value: "10 MB" },
];

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 95));
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

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
      setTimeout(() => {
        navigate("/results", { state: { result: data } });
      }, 300);
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
      {/* Nav bar */}
      <nav className="h-10 border-b border-terminal-accent/20 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-terminal-accent" />
          <span className="text-xs font-bold tracking-widest text-terminal-text uppercase">
            TRADING ANALYZER
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-success animate-pulse-glow" />
            <span className="text-[10px] text-terminal-muted uppercase tracking-widest">
              SYSTEM ONLINE
            </span>
          </div>
          <span className="text-[10px] font-bold text-terminal-accent border border-terminal-accent/30 px-2 py-0.5 uppercase tracking-widest">
            ALPHA v0.1
          </span>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[1200px] space-y-6">
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Drop zone */}
            <UploadZone
              file={file}
              onFileSelect={setFile}
              loading={loading}
              progress={progress}
            />

            {/* Info panel */}
            <div className="border border-terminal-border p-6 flex flex-col justify-center">
              <h3 className="font-mono text-sm font-bold text-terminal-text tracking-widest uppercase mb-4">
                FILE REQUIREMENTS
              </h3>
              <ul className="space-y-3">
                {requirements.map((req) => (
                  <li key={req.label} className="font-mono text-[10px] text-terminal-muted tracking-wide">
                    <span className="text-terminal-text">{req.label}:</span>{" "}
                    {req.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className={`w-full h-12 font-mono text-sm font-bold uppercase tracking-widest transition-all ${
              !file || loading
                ? "bg-terminal-border text-terminal-muted cursor-not-allowed"
                : "bg-terminal-accent text-terminal-bg hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]"
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
      </div>
    </div>
  );
};

export default Upload;
