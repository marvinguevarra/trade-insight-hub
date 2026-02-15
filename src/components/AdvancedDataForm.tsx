import { useState, useCallback, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
  disabled?: boolean;
}

const AdvancedDataForm = ({ file, onFileChange, tier, onTierChange, disabled = false }: AdvancedDataFormProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { tiers } = useTiers();
  const { toast } = useToast();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = useCallback(
    (f: File): boolean => {
      if (!f.name.endsWith(".csv")) {
        toast({ variant: "destructive", title: "Invalid File", description: "Please upload a CSV file (.csv)" });
        return false;
      }
      if (f.size > MAX_FILE_SIZE) {
        toast({ variant: "destructive", title: "File Too Large", description: `Max file size is 10MB. Your file is ${(f.size / (1024 * 1024)).toFixed(1)}MB.` });
        return false;
      }
      return true;
    },
    [toast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 1) {
        toast({ variant: "destructive", title: "Multiple Files", description: "Only one file allowed. Please upload one CSV at a time." });
        return;
      }
      const f = files[0];
      if (f && validateFile(f)) {
        onFileChange(f);
      }
    },
    [onFileChange, toast, validateFile]
  );

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      {file ? (
        <div className="flex items-center justify-between border border-success/30 bg-success/5 p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-success" />
            <div>
              <p className="text-sm text-foreground">{file.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button onClick={() => onFileChange(null)} className="text-muted-foreground hover:text-destructive" disabled={disabled}>
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-12 transition-colors ${
            isDragging ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"
          } ${disabled ? "pointer-events-none opacity-50" : ""}`}
          onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <Upload className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-foreground">Drag & Drop CSV File</p>
          <p className="text-[10px] text-muted-foreground">or click to browse</p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            disabled={disabled}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f && validateFile(f)) onFileChange(f);
            }}
          />
        </label>
      )}

      {/* Help text */}
      <div className="border border-border bg-muted/30 p-3 space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">When to use custom data:</p>
        <ul className="text-[10px] text-muted-foreground space-y-0.5 list-disc list-inside">
          <li>TradingView charts with custom indicators</li>
          <li>Think or Swim exports</li>
          <li>Specific timeframes with your setup</li>
        </ul>
        <p className="text-[10px] text-muted-foreground/60 pt-1">
          Supports: TradingView, Yahoo Finance, Think or Swim, and most CSV formats
        </p>
      </div>

      {/* Tier */}
      <div>
        <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
          Analysis Tier
        </label>
        <Select value={tier} onValueChange={onTierChange} disabled={disabled}>
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
