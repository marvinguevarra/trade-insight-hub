import { cn } from "@/lib/utils";

type AnalysisMode = "quick" | "advanced";

interface AnalysisModePickerProps {
  mode: AnalysisMode;
  onChange: (mode: AnalysisMode) => void;
}

const AnalysisModePicker = ({ mode, onChange }: AnalysisModePickerProps) => {
  const handleKeyDown = (e: React.KeyboardEvent, target: AnalysisMode) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      onChange(target === "quick" ? "advanced" : "quick");
    }
  };

  return (
    <div className="flex justify-center">
      <div
        role="tablist"
        aria-label="Analysis mode"
        className="inline-flex rounded-full border border-border bg-muted/50 p-1 gap-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "quick"}
          tabIndex={mode === "quick" ? 0 : -1}
          onClick={() => onChange("quick")}
          onKeyDown={(e) => handleKeyDown(e, "quick")}
          className={cn(
            "rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 whitespace-nowrap",
            mode === "quick"
              ? "bg-background text-foreground shadow-sm"
              : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          Quick Analysis
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "advanced"}
          tabIndex={mode === "advanced" ? 0 : -1}
          onClick={() => onChange("advanced")}
          onKeyDown={(e) => handleKeyDown(e, "advanced")}
          className={cn(
            "rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 whitespace-nowrap",
            mode === "advanced"
              ? "bg-background text-foreground shadow-sm"
              : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          Advanced Data Analysis
        </button>
      </div>
    </div>
  );
};

export default AnalysisModePicker;
