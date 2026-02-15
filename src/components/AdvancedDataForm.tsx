import { useState, useCallback, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTiers } from "@/lib/tierConfig";
import { Check, DollarSign, Crown } from "lucide-react";

const tierIcons: Record<string, React.ReactNode> = {
  lite: <Check className="h-3.5 w-3.5 text-success" />,
  standard: <DollarSign className="h-3.5 w-3.5 text-primary" />,
  premium: <Crown className="h-3.5 w-3.5 text-accent" />,
};

const tierBorderColors: Record<string, string> = {
  lite: "border-l-success",
  standard: "border-l-primary",
  premium: "border-l-accent",
};

interface AdvancedDataFormProps {
  file: File | null;
  onFileChange: (f: File | null) => void;
  tier: string;
  onTierChange: (v: string) => void;
}

const AdvancedDataForm = ({ file, onFileChange, tier, onTierChange }: AdvancedDataFormProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { tiers } = useTiers();

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files;
      if (f?.[0]?.name.endsWith(".csv")) onFileChange(f[0]);
    },
    [onFileChange]
  );

  return (
    <div className="space-y-4">
      {/* Dropzone */}
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
          <button onClick={() => onFileChange(null)} className="text-muted-foreground hover:text-destructive">
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
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0])}
          />
        </label>
      )}

      {/* Tier */}
      <div>
        <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
          Analysis Tier
        </label>
        <Select value={tier} onValueChange={onTierChange}>
          <SelectTrigger className="bg-card text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {(tiers || []).map((t) => {
              const isSelected = tier === t.id;
              return (
                <SelectItem
                  key={t.id}
                  value={t.id}
                  className={`border-l-[3px] ${
                    isSelected
                      ? `${tierBorderColors[t.id] || ""} bg-secondary text-foreground`
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
  );
};

export default AdvancedDataForm;
