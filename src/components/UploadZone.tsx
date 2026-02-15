import { useState, useCallback, useRef } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";

interface UploadZoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  loading: boolean;
  progress: number;
}

const statusSteps = [
  "PARSING CSV",
  "DETECTING GAPS",
  "MAPPING LEVELS",
  "ANALYZING ZONES",
];

const UploadZone = ({ file, onFileSelect, loading, progress }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0 && files[0].name.endsWith(".csv")) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const currentStep = Math.min(
    Math.floor((progress / 100) * statusSteps.length),
    statusSteps.length - 1
  );

  // State 3: Uploading
  if (loading) {
    return (
      <div className="border-2 border-dashed border-terminal-border p-12 flex flex-col items-center justify-center gap-6">
        <Loader2 className="h-16 w-16 text-terminal-accent animate-spin" />
        <div className="w-full">
          <div className="h-[1px] w-full bg-terminal-border overflow-hidden">
            <div
              className="h-full bg-terminal-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <p className="font-mono text-[10px] text-terminal-muted tracking-widest uppercase">
          {statusSteps.map((step, i) => (
            <span key={step}>
              {i > 0 && " → "}
              <span className={i <= currentStep ? "text-terminal-accent" : ""}>
                {step}
              </span>
            </span>
          ))}
        </p>
      </div>
    );
  }

  // State 2: File selected
  if (file) {
    return (
      <div className="border-2 border-dashed border-terminal-accent/30 p-12 flex flex-col items-center justify-center gap-4">
        <FileText className="h-16 w-16 text-terminal-accent" />
        <p className="font-mono text-lg text-terminal-text">{file.name}</p>
        <p className="font-mono text-sm text-terminal-muted">
          {(file.size / 1024).toFixed(1)} KB
        </p>
        <button
          onClick={() => onFileSelect(null)}
          className="font-mono text-xs uppercase tracking-widest text-destructive border border-destructive px-4 py-2 hover:bg-destructive/10 transition-colors"
        >
          REMOVE
        </button>
      </div>
    );
  }

  // State 1: Empty
  return (
    <label
      className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-12 transition-all ${
        isDragging
          ? "border-terminal-accent/50 bg-terminal-accent/5"
          : "border-terminal-border hover:border-terminal-accent/50"
      }`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Upload className="mb-4 h-16 w-16 text-terminal-muted" />
      <p className="mb-1 font-mono text-lg text-terminal-text">
        DROP CSV FILE HERE
      </p>
      <p className="font-mono text-sm text-terminal-muted">or click to browse</p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleInputChange}
      />
    </label>
  );
};

export default UploadZone;
