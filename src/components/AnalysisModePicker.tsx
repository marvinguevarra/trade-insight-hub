interface AnalysisModePickerProps {
  mode: "quick" | "advanced";
  onChange: (mode: "quick" | "advanced") => void;
}

const AnalysisModePicker = ({ mode, onChange }: AnalysisModePickerProps) => {
  return (
    <div className="inline-flex rounded-full bg-secondary p-1 gap-1">
      <button
        type="button"
        onClick={() => onChange("quick")}
        className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
          mode === "quick"
            ? "bg-card text-foreground shadow-md"
            : "bg-transparent text-muted-foreground hover:text-foreground"
        }`}
      >
        Quick Analysis
      </button>
      <button
        type="button"
        onClick={() => onChange("advanced")}
        className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
          mode === "advanced"
            ? "bg-card text-foreground shadow-md"
            : "bg-transparent text-muted-foreground hover:text-foreground"
        }`}
      >
        Advanced Data Analysis
      </button>
    </div>
  );
};

export default AnalysisModePicker;
