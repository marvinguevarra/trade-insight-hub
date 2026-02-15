import { useState, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FileDropzoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

const FileDropzone = ({ file, onFileSelect }: FileDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

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

  if (file) {
    return (
      <Card className="border-primary/30 bg-primary/5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFileSelect(null)}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <label
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-all ${
        isDragging
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary/50 hover:bg-secondary/50"
      }`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Upload
        className={`mb-4 h-12 w-12 ${isDragging ? "text-primary" : "text-muted-foreground"}`}
      />
      <p className="mb-1 text-lg font-medium text-foreground">
        Drop your CSV file here
      </p>
      <p className="text-sm text-muted-foreground">or click to browse</p>
      <input
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleInputChange}
      />
    </label>
  );
};

export default FileDropzone;
